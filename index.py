from flask import Flask, request, jsonify
from flask_cors import CORS
from cassandra.cluster import Cluster  # type: ignore
import uuid

app = Flask(__name__)
CORS(app)

# Conectar ao cluster Cassandra usando o IP do seed node
cluster = Cluster(['35.232.181.96'])  # Substitua pelo IP apropriado
session = cluster.connect()

# Configurar o keyspace e a tabela
KEYSPACE = "meu_keyspace"
TABLE = "users"

# Cria o keyspace, se não existir
session.execute(f"""
    CREATE KEYSPACE IF NOT EXISTS {KEYSPACE}
    WITH replication = {{ 'class': 'SimpleStrategy', 'replication_factor': '1' }}
""")
session.set_keyspace(KEYSPACE)

# Cria a tabela, se não existir
session.execute(f"""
    CREATE TABLE IF NOT EXISTS {TABLE} (
        id UUID PRIMARY KEY,
        nome text,
        email text
    )
""")

# --- Endpoints CRUD ---

# Create: Cria um novo usuário
@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    nome = data.get('nome')
    email = data.get('email')
    user_id = uuid.uuid4()
    
    query = f"INSERT INTO {TABLE} (id, nome, email) VALUES (%s, %s, %s)"
    session.execute(query, (user_id, nome, email))
    
    return jsonify({"id": str(user_id), "nome": nome, "email": email}), 201

# Read: Retorna os dados de um usuário específico
@app.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    query = f"SELECT id, nome, email FROM {TABLE} WHERE id=%s"
    result = session.execute(query, (uuid.UUID(user_id),))
    row = result.one()
    
    if row:
        return jsonify({"id": str(row.id), "nome": row.nome, "email": row.email})
    else:
        return jsonify({"error": "Usuário não encontrado"}), 404

# Update: Atualiza as informações de um usuário
@app.route('/users/<user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    nome = data.get('nome')
    email = data.get('email')
    
    query = f"UPDATE {TABLE} SET nome=%s, email=%s WHERE id=%s"
    session.execute(query, (nome, email, uuid.UUID(user_id)))
    
    return jsonify({"id": user_id, "nome": nome, "email": email})

# Delete: Remove um usuário
@app.route('/users/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    query = f"DELETE FROM {TABLE} WHERE id=%s"
    session.execute(query, (uuid.UUID(user_id),))
    
    return jsonify({"message": "Usuário deletado com sucesso"})

@app.route('/users', methods=['GET'])
def get_all_users():
    query = f"SELECT id, nome, email FROM {TABLE}"
    resultados = session.execute(query)
    dados = []
    for row in resultados:
        dados.append({
            'id': str(row.id),
            'nome': row.nome,
            'email': row.email
        })
    return jsonify(dados)

@app.route('/cluster/nodes', methods=['GET'])
def get_cluster_nodes():
    # Obtém a lista de nós do metadata do cluster
    nodes = cluster.metadata.all_hosts()
    node_list = [
        {
            "address": host.address,
            "datacenter": host.datacenter,
            "rack": host.rack
        }
        for host in nodes
    ]
    return jsonify({
        "node_count": len(nodes),
        "nodes": node_list
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

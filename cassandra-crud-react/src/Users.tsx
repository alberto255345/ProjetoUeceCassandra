import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';

interface User {
  id: string;
  nome: string;
  email: string;
}

interface NewUser {
  nome: string;
  email: string;
}

interface ClusterNode {
  address: string;
  datacenter: string;
  rack: string;
}

interface ClusterNodesResponse {
  node_count: number;
  nodes: ClusterNode[];
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<NewUser>({ nome: '', email: '' });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [clusterInfo, setClusterInfo] = useState<ClusterNodesResponse | null>(null);
  // Ajuste a URL base conforme o endereço da sua API Flask
  const API_URL = 'http://localhost:5000';

  // Função para buscar todos os usuários
  const fetchUsers = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/users`);
      if (!response.ok) throw new Error('Erro ao buscar usuários');
      const data: User[] = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Função para buscar informações do cluster
  const fetchClusterInfo = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/cluster/nodes`);
      if (!response.ok) throw new Error('Erro ao buscar informações do cluster');
      const data: ClusterNodesResponse = await response.json();
      setClusterInfo(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchClusterInfo();
  }, []);

  // Manipula a mudança dos inputs do formulário de criação
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  // Cria um novo usuário
  const handleCreateUser = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) throw new Error('Erro ao criar usuário');
      const createdUser: User = await response.json();
      setUsers((prev) => [...prev, createdUser]);
      setNewUser({ nome: '', email: '' });
    } catch (error) {
      console.error(error);
    }
  };

  // Prepara a edição de um usuário
  const handleEditUser = (user: User): void => {
    setEditingUser(user);
  };

  // Manipula a mudança dos inputs do formulário de edição
  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (!editingUser) return;
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  // Atualiza um usuário
  const handleUpdateUser = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const response = await fetch(`${API_URL}/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: editingUser.nome, email: editingUser.email }),
      });
      if (!response.ok) throw new Error('Erro ao atualizar usuário');
      // Atualiza a lista de usuários com os novos dados
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser.id ? editingUser : user
        )
      );
      setEditingUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  // Exclui um usuário
  const handleDeleteUser = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erro ao excluir usuário');
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <h1>Informações do Cluster</h1>
      {clusterInfo ? (
        <div>
          <p>Número de nós: {clusterInfo.node_count}</p>
          <ul>
            {clusterInfo.nodes.map((node, index) => (
              <li key={index}>
                Endereço: {node.address}, Data Center: {node.datacenter}, Rack: {node.rack}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Carregando informações do cluster...</p>
      )}

      <h1>Lista de Usuários</h1>
      {users.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id} style={{ marginBottom: '10px' }}>
              <strong>{user.nome}</strong> - {user.email}
              <button onClick={() => handleEditUser(user)} style={{ marginLeft: '10px' }}>
                Editar
              </button>
              <button onClick={() => handleDeleteUser(user.id)} style={{ marginLeft: '10px' }}>
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2>Criar Novo Usuário</h2>
      <form onSubmit={handleCreateUser}>
        <div>
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={newUser.nome}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Criar</button>
      </form>

      {editingUser && (
        <div>
          <h2>Atualizar Usuário</h2>
          <form onSubmit={handleUpdateUser}>
            <div>
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                value={editingUser.nome}
                onChange={handleEditInputChange}
                required
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={editingUser.email}
                onChange={handleEditInputChange}
                required
              />
            </div>
            <button type="submit">Atualizar</button>
            <button type="button" onClick={() => setEditingUser(null)} style={{ marginLeft: '10px' }}>
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Users;

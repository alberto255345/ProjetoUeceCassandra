```markdown
# Projeto Cassandra CRUD com Flask e React

Este projeto demonstra uma aplicação full-stack que utiliza:
- **Cassandra** para armazenamento de dados distribuídos;
- **Flask** (com Python) para criar uma API CRUD que interage com o Cassandra via CQL;
- **React** (criado com Vite e TypeScript) para o front-end que consome a API.

## Visão Geral

A aplicação consiste em:
- **Back-end (API Flask):**  
  - Conecta a um cluster Cassandra.
  - Exibe endpoints para criar, ler, atualizar e excluir registros de usuários.
  - Exibe informações do cluster, como o número de nós e detalhes (endereço, data center, rack).

- **Front-end (React com Vite e TypeScript):**  
  - Lista os usuários armazenados no Cassandra.
  - Permite criar, atualizar e excluir usuários.
  - Exibe informações do cluster obtidas via API.

## Pré-requisitos

- **Python 3.10+** (recomendado) e ambiente virtual configurado.
- **Node.js** (versão 14 ou superior) e npm.
- **Apache Cassandra** configurado e rodando (pode ser em container ou cluster).
- **Flask e dependências Python:**  
  Execute:
  ```bash
  pip install -r requirements.txt
  ```
  O arquivo `requirements.txt` pode ser gerado com:
  ```bash
  pip freeze > requirements.txt
  ```

## Configuração do Back-end (API Flask)

1. **Instalação das Dependências:**
   - Ative seu ambiente virtual.
   - Instale as dependências listadas no `requirements.txt`.

2. **Configuração do Cassandra:**
   - No arquivo de configuração (por exemplo, `index.py`), ajuste o IP do seed node e demais variáveis conforme o ambiente.
   - Certifique-se de que o keyspace e a tabela sejam criados automaticamente ou já estejam configurados.

3. **Rodando a API:**
   - Execute o comando:
     ```bash
     python index.py
     ```
   - A API ficará disponível, por padrão, na porta 5000. Verifique os endpoints:
     - `GET /users` para listar usuários.
     - `POST /users` para criar um usuário.
     - `PUT /users/<user_id>` para atualizar um usuário.
     - `DELETE /users/<user_id>` para excluir um usuário.
     - `GET /cluster/nodes` para obter informações do cluster Cassandra.

4. **Observação de CORS:**
   - Se o front-end e o back-end estiverem em domínios diferentes, instale e configure o Flask-CORS:
     ```python
     from flask_cors import CORS
     app = Flask(__name__)
     CORS(app)
     ```

## Configuração do Front-end (React com Vite e TypeScript)

1. **Criação do Projeto:**
   - No terminal, crie o projeto com Vite e TypeScript:
     ```bash
     npm create vite@latest cassandra-crud-react -- --template react-ts
     cd cassandra-crud-react
     npm install
     ```

2. **Implementação:**
   - O componente `Users.tsx` (na pasta `src`) gerencia a listagem, criação, edição e exclusão de usuários, além de exibir as informações do cluster.
   - O arquivo `App.tsx` importa e utiliza o componente `Users`.

3. **Executar o Projeto:**
   - No terminal, dentro da pasta do projeto:
     ```bash
     npm run dev
     ```
   - O front-end será iniciado (normalmente em `http://localhost:5173`) e estará pronto para consumir a API.

## Uso

- **Back-end:**  
  A API Flask estará disponível em `http://localhost:5000`. Teste os endpoints via Postman, cURL ou diretamente no navegador (para os GET).

- **Front-end:**  
  A aplicação React se conectará à API configurada em `API_URL` (no componente `Users.tsx`). Garanta que a URL esteja correta conforme seu ambiente.

## Estrutura do Projeto

```
projeto-cassandra-crud/
├── backend/
│   ├── index.py           # API Flask
│   ├── requirements.txt   # Lista de dependências Python
│   └── ...                # Outros arquivos de configuração
└── frontend/
    ├── cassandra-crud-react/
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── src/
    │   │   ├── App.tsx
    │   │   ├── Users.tsx
    │   │   └── ...        # Outros componentes e assets
    │   └── ...            # Arquivos de configuração do Vite
```

## Considerações Finais

- **Segurança:**  
  Ajuste as regras de firewall do seu ambiente (GCP, por exemplo) para permitir apenas os IPs e portas necessárias.
- **Ambiente de Produção:**  
  Para produção, utilize um servidor WSGI robusto (como Gunicorn ou uWSGI) para a API Flask e configure corretamente as variáveis de ambiente.
- **Documentação:**  
  Atualize este README conforme o projeto evoluir, adicionando novas funcionalidades e configurações necessárias.

---

Este README serve como guia inicial para configuração e execução do projeto. Sinta-se à vontade para personalizá-lo conforme as necessidades do seu ambiente e workflow.
```
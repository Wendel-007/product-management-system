# Product Management System

Sistema completo de gerenciamento de produtos, clientes e pedidos com API RESTful desenvolvido em Node.js, Express e LevelDB, seguindo o padrão arquitetural MVC (Model-View-Controller).

## 📋 Características

- ✅ API RESTful completa com autenticação JWT
- ✅ Gerenciamento de produtos, clientes e pedidos
- ✅ Sistema de usuários com roles (admin/user)
- ✅ Interface web para login e testes de API
- ✅ Documentação interativa da API (OpenAPI/ReDoc)
- ✅ Banco de dados LevelDB (um arquivo por tabela)
- ✅ Arquitetura MVC
- ✅ Middlewares de segurança e CORS configurável

## 🚀 Instalação

```bash
cd api
npm install
```

## ⚙️ Configuração

1. Crie um arquivo `.env` na pasta `api/` com as seguintes variáveis:

```env
# Database Configuration (LevelDB - arquivos criados automaticamente em api/data/)

# JWT Configuration (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=your-secret-key-change-in-production

# Default Admin User (only used on first initialization)
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=admin123

# CORS Configuration
ALLOWED_ORIGIN=http://localhost:3000

# Server Configuration
PORT=3000
```

## 🔧 Configuração Inicial

Após configurar o arquivo `.env`, crie o usuário padrão:

```bash
npm run init-user
```

Isso criará um usuário administrador com as credenciais especificadas no seu arquivo `.env`.

## ▶️ Executando

```bash
npm start
```

O servidor será iniciado na porta 3000 (ou na porta especificada no `.env`).

## 📚 Documentação da API

Documentação interativa da API disponível usando ReDoc:

🌐 **Documentação**: http://localhost:3000/docs

## 🌐 Base URL

```
http://localhost:3000
```

## 🏗️ Estrutura do Projeto

```
product-management-system/
├── api/                    # Backend API
│   ├── config/            # Configurações (CORS, database, middlewares)
│   ├── controllers/       # Controladores (lógica de negócio)
│   ├── middlewares/       # Middlewares (autenticação)
│   ├── models/            # Modelos de dados
│   ├── routes/            # Rotas da API
│   ├── scripts/           # Scripts utilitários
│   ├── utils/             # Utilitários (JWT, validators)
│   ├── public/            # Arquivos estáticos (docs)
│   └── server.js          # Servidor principal
└── web/                   # Frontend Web
    ├── css/               # Estilos
    ├── js/                # JavaScript
    └── *.html             # Páginas HTML
```

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **classic-level** - Banco de dados LevelDB
- **JWT (jsonwebtoken)** - Autenticação
- **bcrypt** - Hash de senhas
- **CORS** - Configuração de CORS
- **dotenv** - Gerenciamento de variáveis de ambiente

## 📝 Scripts Disponíveis

- `npm start` - Inicia o servidor
- `npm run dev` - Inicia o servidor (alias para start)
- `npm run init-user` - Cria usuário administrador padrão

## 📄 Licença

ISC

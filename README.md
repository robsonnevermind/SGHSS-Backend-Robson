# SGHSS - Sistema de Gestão Hospitalar e de Serviços de Saúde (Back-End)

Projeto desenvolvido por **Robson Esposte** para a disciplina de Projeto Multidisciplinar - Curso de Análise e Desenvolvimento de Sistemas.

## 🎯 Objetivo

Implementar uma API REST teórica com foco em cadastro e autenticação de pacientes, conforme estudo de caso da instituição fictícia VidaPlus. O projeto aborda os conceitos de persistência de dados, segurança com criptografia e boas práticas em desenvolvimento back-end.

## 🔧 Tecnologias utilizadas

- Node.js
- Express
- SQLite
- Knex.js
- JSON Web Token (JWT)
- Bcrypt.js

## 📁 Organização do Projeto

SGHSS-Backend-Robson/
├── controllers/
├── routes/
├── database/
├── middleware/
├── index.js
├── package.json
└── README.md


## 🚀 Como rodar o projeto

1. Clone o repositório ou baixe os arquivos.
2. Instale as dependências:
   ```bash
   npm install

Inicie o servidor:

npm start

Acesse os endpoints via Postman em:

http://localhost:3000

Endpoints implementados

    POST /pacientes/signup – Cadastro de pacientes

    POST /pacientes/login – Autenticação com token JWT

    GET /pacientes – Listagem de pacientes

    DELETE /pacientes/:id – Exclusão de paciente por ID

Observações

    As senhas são armazenadas com hash usando Bcrypt.

    As operações são feitas em banco SQLite (arquivo local).

    Projeto desenvolvido no Replit e exportado para fins acadêmicos.
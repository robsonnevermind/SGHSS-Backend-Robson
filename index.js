const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(bodyParser.json());

// Configuração do banco de dados SQLite com arquivo
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Erro ao abrir o banco de dados:", err.message);
  } else {
    console.log("Banco de dados conectado: ./database.db");
    // Criar tabela se não existir
    db.run(`
      CREATE TABLE IF NOT EXISTS pacientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        cpf TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL
      )
    `);
  }
});

const SECRET_KEY = "sua_chave_secreta"; // Substitua por uma chave segura
const SALT_ROUNDS = 8;

// POST /pacientes/signup - Cadastra paciente
app.post("/pacientes/signup", async (req, res) => {
  try {
    const { nome, cpf, email, senha } = req.body;
    if (!nome || !cpf || !email || !senha) {
      return res.status(400).json({
        error: "err_message",
        message: "Todos os campos são obrigatórios",
      });
    }
    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);
    db.run(
      "INSERT INTO pacientes (nome, cpf, email, senha) VALUES (?, ?, ?, ?)",
      [nome, cpf, email, senhaHash],
      function (err) {
        if (err) {
          return res.status(400).json({
            error: "err_message",
            message: "CPF ou email já cadastrado",
          });
        }
        res.status(201).json({
          message: "Paciente cadastrado com sucesso",
          id: this.lastID,
        });
      },
    );
  } catch (error) {
    res
      .status(400)
      .json({ error: "err_message", message: "Erro ao cadastrar paciente" });
  }
});

// POST /pacientes/login - Autentica paciente e retorna token
app.post("/pacientes/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({
        error: "err_message",
        message: "Email e senha são obrigatórios",
      });
    }
    db.get(
      "SELECT * FROM pacientes WHERE email = ?",
      [email],
      async (err, row) => {
        if (err || !row) {
          return res
            .status(401)
            .json({ error: "err_message", message: "Credenciais inválidas" });
        }
        const match = await bcrypt.compare(senha, row.senha);
        if (!match) {
          return res
            .status(401)
            .json({ error: "err_message", message: "Credenciais inválidas" });
        }
        const token = jwt.sign({ id: row.id, email: row.email }, SECRET_KEY, {
          expiresIn: "1h",
        });
        res.json({ message: "Login bem-sucedido", token });
      },
    );
  } catch (error) {
    res
      .status(400)
      .json({ error: "err_message", message: "Erro ao autenticar" });
  }
});

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token)
    return res
      .status(401)
      .json({ error: "err_message", mode: "Token não fornecido" });
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err)
      return res
        .status(403)
        .json({ error: "err_message", message: "Token inválido" });
    req.user = decoded;
    next();
  });
};

// GET /pacientes - Lista todos os pacientes (sem autenticação)
app.get("/pacientes", (req, res) => {
  try {
    db.all("SELECT id, nome, cpf, email FROM pacientes", [], (err, rows) => {
      if (err) {
        return res
          .status(400)
          .json({ error: "err_message", message: "Erro ao listar pacientes" });
      }
      res.json({ message: "Lista de pacientes", data: rows });
    });
  } catch (error) {
    res.status(400).json({ error: "err_message", message: "Erro inesperado" });
  }
});

// DELETE /pacientes/:id - Exclui paciente pelo ID (sem autenticação)
app.delete("/pacientes/:id", (req, res) => {
  try {
    const id = req.params.id;
    db.run("DELETE FROM pacientes WHERE id = ?", id, (err) => {
      if (err) {
        return res
          .status(400)
          .json({ error: "err_message", message: "Erro ao excluir paciente" });
      }
      res.json({ message: "Paciente excluído com sucesso" });
    });
  } catch (error) {
    res.status(400).json({ error: "err_message", message: "Erro inesperado" });
  }
});

// Iniciar servidor
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = process.env.PORT || 3000;

// --- CONFIGURAÇÕES E MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// --- ADICIONE AQUI: ROTA DE SINAL DE VIDA ---
app.get("/", (req, res) => {
  res.send("✅ Backend do Acervo está rodando perfeitamente!");
});

// --- CONEXÃO COM O MONGODB ---
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Conectado ao MongoDB!"))
  .catch(err => console.error("❌ Erro de conexão:", err));

// ... restante do seu código (Esquemas e Rotas de Login/Items)

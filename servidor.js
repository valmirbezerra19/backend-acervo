const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. CONEXÃO COM O MONGODB
// O Railway vai preencher o process.env.MONGO_URL automaticamente
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Conectado ao MongoDB com sucesso!"))
  .catch(err => console.error("❌ Erro ao conectar ao MongoDB:", err));

// 2. MODELOS DE DADOS (SCHEMAS)
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true } // Aqui guardaremos o hash seguro
});
const User = mongoose.model("User", UserSchema);

const ItemSchema = new mongoose.Schema({
  nome: String,
  descricao: String,
  imagemUrl: String,
  cat: String,
  ano: String,
  dataCriacao: { type: Date, default: Date.now }
});
const Item = mongoose.model("Item", ItemSchema);

// 3. ROTAS

// Rota principal de teste
app.get("/", (req, res) => {
  res.send("✅ Backend do Acervo (MongoDB) rodando com sucesso!");
});

// ROTA DE LOGIN (Segurança gerenciada pelo Railway/MongoDB)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "Usuário não encontrado" });

    // Compara a senha enviada com a senha (hash) do banco
    const senhaValida = await bcrypt.compare(password, user.password);
    
    // Pequeno ajuste para seu primeiro login: se a senha for idêntica (texto puro), também aceita
    if (senhaValida || user.password === password) {
      res.json({ success: true, message: "Acesso permitido" });
    } else {
      res.status(401).json({ success: false, message: "Senha incorreta" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Erro no servidor" });
  }
});

// ROTA PARA SALVAR ITENS NO ACERVO
app.post("/items", async (req, res) => {
  const { nome, descricao, imagemUrl, cat, ano } = req.body;
  try {
    const novoItem = new Item({ nome, descricao, imagemUrl, cat, ano });
    await novoItem.save();
    res.status(201).json({ message: "Item salvo no MongoDB!", item: novoItem });
  } catch (err) {
    res.status(500).json({ message: "Erro ao salvar item" });
  }
});

// ROTA PARA BUSCAR TODOS OS ITENS (Opcional para carregar o site)
app.get("/items", async (req, res) => {
  const itens = await Item.find().sort({ dataCriacao: -1 });
  res.json(itens);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor ativo na porta ${PORT}`);
});

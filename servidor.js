const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Conexão com o MongoDB do Railway
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Conectado ao MongoDB!"))
  .catch(err => console.error("❌ Erro de conexão:", err));

// Esquema de Usuário
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});
const User = mongoose.model("User", UserSchema);

// Esquema de Itens (Fotos/Acervo)
const ItemSchema = new mongoose.Schema({
  nome: String,
  descricao: String,
  imagemUrl: String,
  cat: String,
  ano: String,
  dataCriacao: { type: Date, default: Date.now }
});
const Item = mongoose.model("Item", ItemSchema);

// ROTA DE LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false });

    // Aceita senha em texto puro (para o 1º acesso via painel) ou hash Bcrypt
    const senhaValida = (password === user.password) || await bcrypt.compare(password, user.password);
    
    if (senhaValida) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ROTA PARA SALVAR FOTOS
app.post("/items", async (req, res) => {
  try {
    const novoItem = new Item(req.body);
    await novoItem.save();
    res.status(201).json({ success: true, item: novoItem });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.listen(PORT, () => console.log(`Servidor na porta ${PORT}`));

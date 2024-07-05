import express from 'express';
import article from "./routes/article";
import customer from "./routes/customer";
import product from "./routes/product";
import sell from "./routes/sell";
import importDonnes from "./routes/import-donnes";
import importMedicament from "./routes/import-medicaments"
import  user  from "./routes/user";

const app = express();
const cors = require('cors');
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',  // Autorise l'accès depuis ce domaine
    credentials: true,  // Autorise l'envoi de cookies et d'autres informations d'identification
  }));

app.use("/articles",article)
app.use("/customers",customer)
app.use("/products",product)
app.use("/sells",sell)
app.use("/import-donnes",importDonnes)
app.use("/import-medicaments",importMedicament)
app.use("/",user)

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});


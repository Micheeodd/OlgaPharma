import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client';
import validationMiddlewares from '../middlewares/validmiddlewares'


const db = new PrismaClient();
const router = express.Router();

// Route pour l'enregistrement d'un utilisateur
router.post("/register", async function (req, res) {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).send("User already exists with this email");
    }

    // Hasher le mot de passe avant de l'enregistrer
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur dans la base de données
    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.json({ id: newUser.id });
  } catch (error) {
    console.error("Error registering user", error);
    res.status(500).send("Internal server error");
  }
});

// Route pour la connexion d'un utilisateur
router.post("/login",  async function (req, res) {
  try {
    const { email, password } = req.body;

    // Récupérer l'utilisateur depuis la base de données
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).send("Invalid email or password");
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).send("Invalid email or password");
    }

    // Générer un token JWT

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    // Envoyer le token au client
    return res.json({ token });
  } catch (error) {
    console.error("Login error", error);
    return res.status(500).send("Internal server error");
  }
});

export default router;

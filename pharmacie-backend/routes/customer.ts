import express from "express";
import "dotenv/config"; 

import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const router = express.Router()


// Creation du client 
router.post('/', async (req, res) => {
  const { nom, email, adresse } = req.body;
  try {
    const client = await db.client.create({
      data: { nom, email, adresse },
    });
    res.status(201).json(client);
  } catch (error:any) {
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Email already exists.' });
    } else {
      res.status(500).json({ error: 'An error occurred while creating the client.' });
    }
  }
});

// Accèder à la liste de tous les clients
router.get('/', async (req, res) => {
  const clients = await db.client.findMany();
  res.json(clients);
});

// Get a single client by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const client = await db.client.findUnique({
    where: { id: parseInt(id) },
  });
  if (client) {
    res.json(client);
  } else {
    res.status(404).json({ error: 'Client n\'existe pas.' });
  }
});

// Mis a jour du client à partir de l'ID 
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nom, email, adresse } = req.body;
  try {
    const client = await db.client.update({
      where: { id: parseInt(id) },
      data: { nom, email, adresse },
    });
    res.json(client);
  } catch (error:any) {
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Email already exists.' });
    } else {
      res.status(500).json({ error: 'An error occurred while updating the client.' });
    }
  }
});

// Suppression du client
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.client.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the client.' });
  }
});
export default router

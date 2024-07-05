import express from "express";
import "dotenv/config"; 

import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const router = express();

router.post('/', async (req , res) => {
    const { clientId, medicamentId, quantity, totalPrice } = req.body;
    try {
      const vente = await db.vente.create({
        data: {
          clientId,
          medicamentId,
          quantity,
          totalPrice,
        },
      });
      res.status(201).json(vente);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while creating the sale.' });
    }
  });
  
  router.get('/', async (req, res) => {
    const ventes = await db.vente.findMany();
    res.json(ventes);
  });
 
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const vente = await db.vente.findUnique({
      where: { id: parseInt(id) },
      include: { client: true, medicament: true }, 
    });
    if (vente) {
      res.json(vente);
    } else {
      res.status(404).json({ error: 'Sale not found.' });
    }
  });
  
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { clientId, medicamentId, quantity, totalPrice } = req.body;
    try {
      const vente = await db.vente.update({
        where: { id: parseInt(id) },
        data: {
          clientId,
          medicamentId,
          quantity,
          totalPrice,
        },
      });
      res.json(vente);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while updating the sale.' });
    }
  });
  
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await db.vente.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while deleting the sale.' });
    }
  });
  export default router

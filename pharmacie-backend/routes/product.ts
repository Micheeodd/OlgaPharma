import express from "express";
import "dotenv/config"; 

import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const router = express.Router()


// Create a new medicament
router.post('/', async (req, res) => {
    const { name, description, price, stock } = req.body;
    try {
      const medicament = await db.medicament.create({
        data: { name, description, price, stock },
      });
      res.status(201).json(medicament);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while creating the medicament.' });
    }
  });
  
  // Get all medicaments
  router.get('/', async (req, res) => {
    const medicaments = await db.medicament.findMany();
    res.json(medicaments);
  });
  
  // Get a single medicament by ID
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const medicament = await db.medicament.findUnique({
      where: { id: parseInt(id) },
    });
    if (medicament) {
      res.json(medicament);
    } else {
      res.status(404).json({ error: 'Medicament not found.' });
    }
  });
  
  // Update a medicament by ID
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;
    try {
      const medicament = await db.medicament.update({
        where: { id: parseInt(id) },
        data: { name, description, price, stock },
      });
      res.json(medicament);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while updating the medicament.' });
    }
  });
  
  // Delete a medicament by ID
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await db.medicament.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while deleting the medicament.' });
    }
  });
  export default router

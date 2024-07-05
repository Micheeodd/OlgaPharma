import express from "express";
import "dotenv/config"; 

import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const router = express.Router()


router.post('/', async (req, res) => {
    const { venteId, quantity, sousTotalPrice } = req.body;
    try {
      const article = await db.article.create({
        data: {
          venteId,
          quantity,
          sousTotalPrice,
        },
      });
      res.status(201).json(article);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while creating the article.' });
    }
  });
  
  // Get all articles
  router.get('/', async (req, res) => {
    const articles = await db.article.findMany();
    res.json(articles);
  });
  
  // Get articles by venteId (to get all articles for a specific sale)
  router.get('/vente/:venteId', async (req, res) => {
    const { venteId } = req.params;
    const articles = await db.article.findMany({
      where: { venteId: parseInt(venteId) },
      include: { vente: true }, // Include the related sale details
    });
    res.json(articles);
  });
  
  // Get a single article by ID
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const article = await db.article.findUnique({
      where: { id: parseInt(id) },
      include: { vente: true }, // Include the related sale details
    });
    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ error: 'Article not found.' });
    }
  });
  
  // Update an article by ID
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { venteId, quantity, sousTotalPrice } = req.body;
    try {
      const article = await db.article.update({
        where: { id: parseInt(id) },
        data: {
          venteId,
          quantity,
          sousTotalPrice,
        },
      });
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while updating the article.' });
    }
  });
  
  // Delete an article by ID
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await db.article.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while deleting the article.' });
    }

  });

  export default router

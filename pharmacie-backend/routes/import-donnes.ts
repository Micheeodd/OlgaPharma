import express from "express";
import "dotenv/config"; 
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();
const router = express.Router();

// Route pour importer les données de test
router.get('/', async (req, res) => {
  try {
    // Créer des clients d'exemple
    const client1 = await db.client.create({
      data: {
        nom: 'Roger Bentcha',
        email: 'roger.bentcha@icloud.com',
        adresse: '123 Rue de Paris, Paris, France',
      },
    });

    const client2 = await db.client.create({
      data: {
        nom: 'Michée Odudu',
        email: 'michee.odudu@gmail.com',
        adresse: '8 Rue Felix Tableau, Rezé, France',
      },
    });

    // Récupérer quelques médicaments pour les ventes
    const medicaments = await db.medicament.findMany({
      take: 2,
    });

    if (medicaments.length < 2) {
      return res.status(400).send('Pas assez de médicaments dans la base de données');
    }

    // Créer des ventes d'exemple
    const vente1 = await db.vente.create({
      data: {
        clientId: client1.id,
        medicamentId: medicaments[0].id,
        quantity: 2,
        totalPrice: medicaments[0].price * 2,
      },
    });

    const vente2 = await db.vente.create({
      data: {
        clientId: client2.id,
        medicamentId: medicaments[1].id,
        quantity: 1,
        totalPrice: medicaments[1].price,
      },
    });

    // Créer des articles d'exemple
    await db.article.create({
      data: {
        venteId: vente1.id,
        quantity: 2,
        sousTotalPrice: medicaments[0].price * 2,
      },
    });

    await db.article.create({
      data: {
        venteId: vente2.id,
        quantity: 1,
        sousTotalPrice: medicaments[1].price,
      },
    });

    res.status(200).send('Clients, ventes et articles ont été insérés dans la base de données.');
  } catch (error) {
    console.error("Error importing test data", error);
    res.status(500).send('Error importing test data');
  }
});

export default router;

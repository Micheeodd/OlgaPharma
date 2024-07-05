import express from 'express';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { any } from 'zod';

const db = new PrismaClient();
const router = express.Router();

// Route pour importer les médicaments depuis l'API FDA
router.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://api.fda.gov/drug/drugsfda.json');
    const medications = response.data.results;

    for (const med of medications) {
      const { products } = med;

      for (const product of products) {
        const { brand_name, active_ingredients, dosage_form, route, marketing_status } = product;

        const name = brand_name || 'Unknown';
        const description = `Active ingredients: ${active_ingredients.map((ingredient:any) => ingredient.name).join(', ')}. Dosage form: ${dosage_form}. Route: ${route}. Marketing status: ${marketing_status}.`;
        const price = Math.floor(Math.random() * 100) + 1; // Générer un prix aléatoire entre 1 et 100
        const stock = Math.floor(Math.random() * 1000) + 1; // Générer un stock aléatoire entre 1 et 1000

        try {
          await db.medicament.create({
            data: {
              name,
              description,
              price,
              stock,
            },
          });
        } catch (error) {
          console.error(`Error inserting medication ${name}:`, error);
        }
      }
    }

    res.status(200).send('Medications have been inserted into the database.');
  } catch (error) {
    console.error("Error fetching data from FDA API:", error);
    res.status(500).send('Error importing medications');
  }
});

export default router;

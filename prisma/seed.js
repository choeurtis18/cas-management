"prisma/seed.js"

import prisma from "../lib/prisma.js";
import { createMember } from "./seed/members.js";
import { createMonths } from "./seed/months.js";
import { createCategorie } from "./seed/categories.js";
import { createUser } from "./seed/user.js";

async function main() {
  try {
    await prisma.$connect();
    console.log("Connecté à la base de données.");

    /* Création des données */
    /*

    // Création d'un utilisateur
    await createUser();

    // Création des catégories
    await createCategorie(5);

    // Création des mois
    const mounths = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
    ];
    const annee = 2021 + Math.floor(Math.random() * 10); // Années entre 2021 et 2030

    for (const month of mounths) {
      await createMonths(month, annee);
    }

    // Création des menbres
    await createMember(15);

    // Création d'une cotisation (Dues)
    const members = await prisma.member.findMany();
    const member = await prisma.member.findFirst();

    const categories = await prisma.category.findMany();
    const category = await prisma.category.findFirst();

    const months = await prisma.month.findMany();
    const month = await prisma.month.findFirst();

    if (member && category && month) {

        members.forEach(async (member) => {
            categories.forEach(async (category) => {
                months.forEach(async (month) => {
                    await prisma.dues.create({
                        data: {
                            amount: 10,
                            isLate: false,
                            memberId: member.id,
                            categoryId: category.id,
                            monthId: month.id,
                        },
                    });
                    console.log("Cotisation créée avec succès !");
                });
            });
        });
    } else {
      console.log("Impossible de créer une cotisation : données manquantes.");
    }
  */
  
  } catch (e) {
    console.error("Erreur lors de la création des données :", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

function initDB() {
  require("./seed");
}
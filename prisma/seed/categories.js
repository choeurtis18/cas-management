"prisma/seed/categories.js"

import { faker } from "@faker-js/faker";
import prisma from "../../lib/prisma.js";

export async function createCategorie(max) {
  for (let i = 0; i < max; i++) {
    const category = await prisma.category.create({
      data: {
        name: faker.commerce.department(),
        description: faker.lorem.sentence(),
        creation_date: new Date(),
        update_date: new Date(),
      },
    });

    const members = await prisma.member.findMany();
    if (members.length === 0 || !members) {
      console.log("Pas de menbres trouvées. Ajoutez des menbres avant de créer des categories.");
      return;
    }
    const months = await prisma.month.findMany();
    if (months.length === 0 || !months) {
      console.log("Pas de mois trouvées. Ajoutez des mois avant de créer des categories.");
      return;
    }

    for (const member of members) {
      for (const month of months) {
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
      }
    }

    console.log("Catégorie créée :", category);
  }
}

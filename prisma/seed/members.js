"prisma/seed/members.js"

import { faker } from "@faker-js/faker";
import prisma from "../../lib/prisma.js";

export async function createMember(max) {
  for (let i = 0; i < max; i++) {
    const member = await prisma.member.create({
      data: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        creation_date: new Date(),
        update_date: new Date()
      },
    });

    const categories = await prisma.category.findMany();
    if (categories.length === 0 || !categories) {
      console.log("Pas de catégories trouvées. Ajoutez des catégories avant de créer des menbres.");
      return;
    }

    const months = await prisma.month.findMany();
    if (months.length === 0 || !months) {
      console.log("Pas de mois trouvés. Ajoutez des mois avant de créer des menbres.");
      return;
    }

    for (const month of months) {
      for (const category of categories) {
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

    console.log("menbre créé :", member);
  }
}

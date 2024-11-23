import prisma from "@/lib/prisma.js";

export async function createMonths(name, year) {
  try {
    const month = await prisma.month.create({
      data: {
        name: name,
        year: year,
      },
    });
    console.log("Mois créé :", month);

    const members = await prisma.member.findMany();
    if (members.length === 0 || !members) {
      console.log("Pas de menbres trouvés. Ajoutez des menbres avant de créer des mois.");
      return;
    }

    const categories = await prisma.category.findMany();
    if (categories.length === 0 || !categories) {
      console.log("Pas de catégories trouvées. Ajoutez des catégories avant de créer des mois.");
      return;
    }

    for (const member of members) {
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

  } catch (error) {
    console.error("Erreur lors de la création du mois :", error);
    throw error;
  }
}

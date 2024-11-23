import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

import prisma from "@/lib/prisma.js";

export async function  createUser() {
    const hashedPassword = bcrypt.hashSync("password.cas.code", 10); // 10 est le nombre de tours pour le hachage

    // Enregistrez l'utilisateur dans la base de données avec le mot de passe haché
    const user = await prisma.user.create({
        data: {
            username: faker.name.firstName(),
            email: faker.internet.email(),
            password: hashedPassword,
            role: "ADMIN"
        },
    });

    console.log("Utilisateur créé :", user);
    return user;
};

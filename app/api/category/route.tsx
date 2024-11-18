import { NextResponse } from 'next/server';

import prisma from '../../../lib/prisma';

export async function GET(request: Request) {
    try {
        const categories = await prisma.category.findMany({
            include: {
                dues: true,
                members: true
            }
        });

        if (categories.length === 0) {
            console.error("No categories found");
            return NextResponse.json({ message: 'No categories found' }, { status: 404 });
        }

        console.log("GET API/category: categories found:", categories);
        return new Response(JSON.stringify(categories));
    } catch (error) {
        console.error("Error in API/category:", error);
        return new Response(JSON.stringify({ error: 'Failed to fetch categories' }), { status: 500 });
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    
    try {
        if (!body.name || !body.description) {
            console.error("Missing required fields");
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        const category = await prisma.category.create({
            data: {
                name: body.name,
                description: body.description,
                creation_date: new Date(),
                update_date: new Date()
            }
        });

        console.log("POST API/category: category created:", category);

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
                        amount: 0,
                        isLate: false,
                        memberId: member.id,
                        categoryId: category.id,
                        monthId: month.id,
                    },
                });
                console.log("Cotisation créée avec succès !");
            }
        }

        return new Response(JSON.stringify(category), {
            headers: {
                "Content-Type": "application/json"
            },
            status: 201
        });
    } catch (error) {
        console.error("Error in API/category:", error);
        return new Response(JSON.stringify({ error: 'Failed to create category' }), { status: 500 });
    }
}

import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const months = await prisma.month.findMany({
            include: {
                dues: true
            }
        });

        if (months.length === 0) {
            console.error("No months found");
            return NextResponse.json({ message: 'No months found' }, { status: 404 });
        }

        console.log("GET API/month: months found:", months);
        return new Response(JSON.stringify(months));
    } catch (error) {
        console.error("Error in API/month:", error);
        return new Response(JSON.stringify({ error: 'Failed to fetch months' }), { status: 500 });
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    
    try {
        if (!body.name || !body.year) {
            console.error("Missing required fields");
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }
        
        const month = await prisma.month.create({
            data: {
                name: body.name,
                year: body.year,
            }
        });

        console.log("POST API/month: month created:", month);

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

        return new Response(JSON.stringify(month), {
            headers: {
                "Content-Type": "application/json"
            },
            status: 201
        });
    } catch (error) {
        console.error("Error in API/month:", error);
        return new Response(JSON.stringify({ error: 'Failed to create month' }), { status: 500 });
    }
}

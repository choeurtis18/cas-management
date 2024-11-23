import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const members = await prisma.member.findMany({
            include: {
                dues: true,
                categories: true
            }
        });

        if (members.length === 0) {
            console.error("No members found");
            return NextResponse.json({ message: 'No members found' }, { status: 404 });
        }

        console.log("GET API/members: members found:", members);
        return new Response(JSON.stringify(members));
    } catch (error) {
        console.error("Error in API/members:", error);
        return new Response(JSON.stringify({ error: 'Failed to fetch members' }), { status: 500 });
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    
    try {
        if (!body.firstName || !body.lastName) {
            console.error("Missing required fields");
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }
        
        const member = await prisma.member.create({
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
                creation_date: new Date(),
                update_date:  new Date()
            }
        });

        console.log("POST API/members: member created:", member);

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

        return new Response(JSON.stringify(member), {
            headers: {
                "Content-Type": "application/json"
            },
            status: 201
        });
    } catch (error) {
        console.error("Error in API/members:", error);
        return new Response(JSON.stringify({ error: 'Failed to create member' }), { status: 500 });
    }
}

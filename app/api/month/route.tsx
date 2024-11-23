import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
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
        return NextResponse.json(months);
    } catch (error) {
        console.error("Error in API/month:", error);
        return NextResponse.json({ error: 'Failed to fetch months' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    
    try {
        if (!body.name || !body.year) {
            console.error("Missing required fields");
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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

        return NextResponse.json(month, { status: 201 });
    } catch (error) {
        console.error("Error in API/month:", error);
        return NextResponse.json({ error: 'Failed to create month' }, { status: 500 });
    }
}

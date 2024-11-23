import { NextResponse, NextRequest } from 'next/server';

import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const dues = await prisma.dues.findMany({
            include: {
                member: true,
                month: true,
                category: true
            }
        });

        if (dues.length === 0) {
            console.error("No dues found");
            return NextResponse.json({ message: 'No dues found' }, { status: 404 });
        }

        console.log("GET API/due: dues found:", dues);
        return NextResponse.json(dues);
    } catch (error) {
        console.error("Error in API/due:", error);
        return NextResponse.json({ error: 'Failed to fetch dues' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    
    try {
        
        if (!body.amount || !body.isLate || !body.memberId || !body.categoryId || !body.monthId) {
            console.error("Missing required fields");
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        
        const due = await prisma.dues.create({
            data: {
                amount: body.amount,
                isLate: body.isLate,
                memberId: body.memberId,
                categoryId: body.categoryId,
                monthId: body.monthId
            }
        });

        console.log("POST API/due: due created:", due);

        return NextResponse.json(due, { status: 201 });
    } catch (error) {
        console.error("Error in API/due:", error);
        return NextResponse.json({ error: 'Failed to create due' }, { status: 500 });
    }
}

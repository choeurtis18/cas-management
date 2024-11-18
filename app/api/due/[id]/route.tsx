import { NextResponse } from 'next/server';

import prisma from '../../../../lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const due = await prisma.dues.findUnique({
            where: {
                id: parseInt(params.id)
            },
            include: {
                member: true,
                month: true,
                category: true
            }
        });

        if (!due) {
            console.error("No due found");
            return NextResponse.json({ message: 'No due found' }, { status: 404 });
        }

        console.log("GET API/due/[id]: due found:", due);
        return new Response(JSON.stringify(due));
    } catch (error) {
        console.error("Error fetching due:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        
        if (!body.amount || !body.isLate || !body.memberId || !body.categoryId || !body.monthId) {
            console.error("Missing required fields");
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        const due = await prisma.dues.update({
            where: {
                id: parseInt(params.id)
            },
            data: {
                amount: body.amount,
                isLate: body.isLate,
                memberId: body.memberId,
                categoryId: body.categoryId,
                monthId: body.monthId
            }
        });

        console.log("PATCH API/due/[id]: due updated:", due);
        return new Response(JSON.stringify(due));
    } catch (error) {
        console.error("Error updating due:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const due = await prisma.dues.delete({
            where: {
                id: parseInt(params.id)
            }
        });

        console.log("DELETE API/due/[id]: due deleted:", due);
        return new Response(JSON.stringify(due));
    } catch (error) {
        console.error("Error deleting due:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const month = await prisma.month.findUnique({
            where: {
                id: parseInt(params.id)
            },
            include: {
                dues: true
            }
        });

        if (!month) {
            console.error("No month found");
            return NextResponse.json({ message: 'No month found' }, { status: 404 });
        }

        console.log("GET API/month/[id]: month found:", month);
        return new Response(JSON.stringify(month));
    } catch (error) {
        console.error("Error fetching month:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const name = body.name;
        const year = body.year;

        const month = await prisma.month.update({
            where: {
                id: parseInt(params.id)
            },
            data: {
                name,
                year
            }
        });

        console.log("PATCH API/month/[id]: month updated:", month);
        return new Response(JSON.stringify(month));
    } catch (error) {
        console.error("Error updating month:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const month = await prisma.month.delete({
            where: {
                id: parseInt(params.id)
            }
        });

        console.log("DELETE API/month/[id]: month deleted:", month);
        return new Response(JSON.stringify(month));
    } catch (error) {
        console.error("Error deleting month:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

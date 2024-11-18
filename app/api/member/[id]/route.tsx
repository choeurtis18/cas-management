import { NextResponse } from 'next/server';

import prisma from '../../../../lib/prisma';

import { Dues } from "../../../../types"

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const member = await prisma.member.findUnique({
            where: {
                id: parseInt(params.id)
            },
            include: {
                dues: true,
                categories: true
            }
        });

        if (!member) {
            console.error("No member found");
            return NextResponse.json({ message: 'No member found' }, { status: 404 });
        }

        console.log("GET API/member/[id]: member found:", member);
        return new Response(JSON.stringify(member));
    } catch (error) {
        console.error("Error fetching member:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const firstName = body.firstName;
        const lastName = body.lastName;
        const dues = body.dues;

        const member = await prisma.member.update({
            where: {
                id: parseInt(params.id)
            },
            data: {
                firstName,
                lastName,
                update_date: new Date(),
            }
        });

        for (const due of dues) {
            await prisma.dues.update({
            where: {
                id: due.id,
            },
            data: {
                amount: due.amount
            },
            });
        }

        console.log("PATCH API/member/[id]: member updated:", member);
        return new Response(JSON.stringify(member));
    } catch (error) {
        console.error("Error updating member:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const member = await prisma.member.delete({
            where: {
                id: parseInt(params.id)
            }
        });

        console.log("DELETE API/member/[id]: member deleted:", member);
        return new Response(JSON.stringify(member));
    } catch (error) {
        console.error("Error deleting member:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

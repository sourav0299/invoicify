import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from "../../../utils/database";

export async function POST(req: NextRequest) {
    try {
        const { db } = await connectToDatabase();
        const expense = await req.json();
        const result = await db.collection('expenses').insertOne(expense);
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error('Error in POST:', error);
        return NextResponse.json(
            { error: "Error saving expense" }, 
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const { db } = await connectToDatabase();
        const expenses = await db.collection('expenses').find().toArray();
        return NextResponse.json(expenses, { status: 200 });
    } catch (error) {
        console.error('Error in GET:', error);
        return NextResponse.json(
            { error: 'Error fetching expenses' }, 
            { status: 500 }
        );
    }
}
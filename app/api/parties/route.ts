import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../utils/database";

export async function POST(req: NextRequest){
    try{
        const {db} = await connectToDatabase();
        const parties = await req.json();
        const result = await db.collection("parties").insertOne(parties);
        return NextResponse.json(result, { status: 201 });
    }catch(error){
        return NextResponse.json(
            {error: "Error saving product"},
            {status: 500}
        )
    }
}

export async function GET (){
    try{
        const {db} = await connectToDatabase();

        const parties = await db.collection("parties").find().toArray();
        return NextResponse.json(parties)
    }catch(error){
        console.error("Error in GET /api/parties", error);
        return NextResponse.json(
            {error: "Error fetching parties list"},
            {status: 500}
        );
    }
}
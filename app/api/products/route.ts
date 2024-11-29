import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../utils/database';

export async function POST(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const product = await req.json();
    const result = await db.collection('products').insertOne(product);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error saving product' }, { status: 500 });
  }
}

export async function GET() {
  try {
    console.log('Attempting to connect to database...');
    const { db } = await connectToDatabase();
    console.log('Connected to database successfully');
    
    console.log('Fetching products from database...');
    const products = await db.collection('products').find().toArray();
    console.log(`Fetched ${products.length} products`);
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
  }
}
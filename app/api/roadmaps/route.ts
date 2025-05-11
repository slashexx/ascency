import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import { Roadmap } from '@/app/models/Roadmap';

export async function GET(req: Request) {
  await connectDB();
  const roadmaps = await Roadmap.find({}).sort({ createdAt: -1 });
  return NextResponse.json({ roadmaps });
}

export async function POST(req: Request) {
  await connectDB();
  const { name, content } = await req.json();
  if (!name || !content) {
    return NextResponse.json({ message: 'Missing name or content' }, { status: 400 });
  }
  const roadmap = await Roadmap.create({
    userId: 'demo', // placeholder since no auth
    name,
    content,
  });
  return NextResponse.json({ roadmap }, { status: 201 });
} 
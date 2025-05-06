import { NextResponse } from 'next/server';
import { getTdcData } from '@/lib/db';

export async function GET() {
  const data = await getTdcData();
  return NextResponse.json(data);
}

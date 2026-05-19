import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Parlay {
  combined_signal: number;
  [key: string]: any;
}

const DATA_PATH = path.join(process.cwd(), 'public', 'edgeboard_final_product.json');

export async function GET() {
  try {
    const fileContents = fs.readFileSync(DATA_PATH, 'utf8');
    const data = JSON.parse(fileContents);
    const parlays: Parlay[] = data.parlays || [];
    const sortedParlays = parlays.sort((a: Parlay, b: Parlay) => b.combined_signal - a.combined_signal);
    return NextResponse.json({
      success: true,
      total: sortedParlays.length,
      parlays: sortedParlays,
      last_updated: data.timestamp
    });
  } catch (error) {
    console.error('Error reading parlay data:', error);
    return NextResponse.json({
      success: false,
      error: 'Parlay data not found.',
      parlays: []
    });
  }
}

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Read from the `public` folder
const DATA_PATH = path.join(process.cwd(), 'public', 'edgeboard_final_product.json');

export async function GET() {
  try {
    const fileContents = fs.readFileSync(DATA_PATH, 'utf8');
    const data = JSON.parse(fileContents);
    // Sort by combined_signal descending (highest first)
    const sortedParlays = (data.parlays || []).sort((a, b) => b.combined_signal - a.combined_signal);
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
      error: 'Parlay data not found. Make sure edgeboard_final_product.json exists in the public folder.',
      parlays: []
    });
  }
}
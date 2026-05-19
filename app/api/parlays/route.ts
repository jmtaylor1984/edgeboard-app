import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'public', 'edgeboard_full_edge.json');

export async function GET() {
  try {
    const fileContents = fs.readFileSync(DATA_PATH, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json({
      success: true,
      playerProps: data.player_props,
      teamEdges: data.team_edges,
      parlays: data.parlays,
      lastUpdated: data.timestamp
    });
  } catch (error) {
    console.error('Error reading edge data:', error);
    return NextResponse.json({ success: false, error: 'Run edgeboard_full_edge_model.py first' });
  }
}
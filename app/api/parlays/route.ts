import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'public', 'edgeboard_full_edge.json');

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { subscribed: true }
  });

  if (!user?.subscribed) {
    return NextResponse.json({ error: 'Subscription required' }, { status: 403 });
  }

  const fileContents = fs.readFileSync(DATA_PATH, 'utf8');
  const data = JSON.parse(fileContents);
  return NextResponse.json({
    success: true,
    playerProps: data.player_props,
    teamEdges: data.team_edges,
    parlays: data.parlays,
    lastUpdated: data.timestamp
  });
}

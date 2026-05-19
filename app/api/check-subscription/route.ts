import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ subscribed: false });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { subscribed: true }
  });
  return NextResponse.json({ subscribed: user?.subscribed || false });
}

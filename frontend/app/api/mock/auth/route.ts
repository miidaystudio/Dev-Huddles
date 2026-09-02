import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization');
  return NextResponse.json({
    status: token ? 'AUTHENTICATED' : 'ANONYMOUS',
    user: {
      id: 'usr_devhuddle_99',
      username: 'Lead-Engineer',
      role: 'Staff Engineer',
      avatarColor: '#10b981',
      sessionExpiry: new Date(Date.now() + 3600 * 1000).toISOString(),
    },
    permissions: ['read:ticket', 'write:ide', 'exec:sandbox', 'api:inspector'],
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({
    token: `jwt_devhuddle_${Math.random().toString(36).substring(2)}`,
    expiresIn: 3600,
    tokenType: 'Bearer',
    claims: body,
  });
}

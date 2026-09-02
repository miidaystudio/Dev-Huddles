import { NextRequest, NextResponse } from 'next/server';

// Simulated in-memory transaction store for race condition detection
const processedTransactions = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const idempotencyKey = req.headers.get('x-idempotency-key') || body.idempotencyKey;
    const latency = parseInt(req.nextUrl.searchParams.get('latency') || '350', 10);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, latency));

    const { cartId, amount, currency = 'USD', paymentMethod } = body;

    if (!cartId || !amount) {
      return NextResponse.json(
        {
          error: 'BAD_REQUEST',
          message: 'Missing required parameters: cartId and amount are required.',
          statusCode: 400,
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Check for race condition / double charge if idempotency key is missing or reused
    if (!idempotencyKey) {
      // High chance of race condition when no idempotency key provided
      if (processedTransactions.has(cartId)) {
        return NextResponse.json(
          {
            error: 'DUPLICATE_CHARGE_DETECTED',
            message: 'RACE CONDITION BUG TRIGGERED: Cart has already been charged without an idempotency lock!',
            statusCode: 409,
            details: {
              cartId,
              conflictType: 'UNHANDLED_CONCURRENCY',
              severity: 'CRITICAL',
              advice: 'Client must submit a unique x-idempotency-key or disable the button during submit execution.',
            },
            timestamp: new Date().toISOString(),
          },
          { status: 409 }
        );
      }
      processedTransactions.add(cartId);
    } else if (processedTransactions.has(idempotencyKey)) {
      return NextResponse.json(
        {
          error: 'IDEMPOTENT_REPLAY',
          message: 'Idempotency key already processed. Returning original transaction result.',
          statusCode: 200,
          transactionId: `tx_${Math.random().toString(36).substring(2, 10)}`,
          status: 'SUCCEEDED',
          replayed: true,
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    } else {
      processedTransactions.add(idempotencyKey);
    }

    // Success response
    const txId = `tx_devhuddle_${Math.random().toString(36).substring(2, 9)}`;
    return NextResponse.json(
      {
        status: 'SUCCESS',
        statusCode: 200,
        transaction: {
          id: txId,
          cartId,
          amount,
          currency,
          paymentMethod: paymentMethod || 'credit_card',
          settledAt: new Date().toISOString(),
          processingLatencyMs: latency,
        },
        receiptUrl: `https://devhuddle.internal/receipts/${txId}`,
        auditLog: {
          idempotencyEnforced: Boolean(idempotencyKey),
          lockAcquired: true,
          clusterRegion: 'us-east-1',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: 'INTERNAL_SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Invalid JSON payload',
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/mock/checkout',
    status: 'HEALTHY',
    supportedMethods: ['POST'],
    activeLocks: processedTransactions.size,
    version: 'v1.4.2-prod',
  });
}

// app/api/fcs-metrics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { runQuery } from '@/lib/neo4j';

export async function GET(request: NextRequest) {
  try {
    // Get token address from query params
    const searchParams = request.nextUrl.searchParams;
    let tokenAddress = searchParams.get('address');

    // Use default token address if none provided
    if (!tokenAddress) {
      tokenAddress = '0x0578d8a44db98b23bf096a382e016e29a5ce0ffe';
    }

    // Execute the simplified query for just the average score
    const query = `
      MATCH (w:Wallet)-[hold:HELD]->(token:Token {address: $tokenAddress})
      MATCH (w)-[:ACCOUNT]-(wc:Warpcast:Account)
      WITH avg(toFloat(wc.fcCredScore)) as avg_score
      RETURN {avg_score: avg_score}
    `;

    const result = await runQuery(query, { tokenAddress });

    if (!result || !result.length) {
      return NextResponse.json(
        { error: 'No data found for the specified token' },
        { status: 404 }
      );
    }

    // Return data directly
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error fetching token FCS metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch token FCS metrics' },
      { status: 500 }
    );
  }
}
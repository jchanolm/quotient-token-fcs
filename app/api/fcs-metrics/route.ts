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

    // Execute the exact query provided
    const query = `
      MATCH (w:Wallet)-[hold:HELD]->(token:Token {address: $tokenAddress}) 
      MATCH (w)-[:ACCOUNT]-(wc:Warpcast:Account)
      WITH avg(toFloat(wc.fcCredScore)) as avg_score 
      MATCH (w:Wallet)-[hold:HELD]->(token:Token {address: $tokenAddress}) 
      MATCH (w)-[:ACCOUNT]-(wc:Warpcast:Account)
      WITH apoc.agg.percentiles(toFloat(wc.fcCredScore), [.5, .75, .9, .95, .99]) as score_distribution, avg_score 
      RETURN {avg_score: avg_score, score_distribution: score_distribution} as data
    `;
    console.log(query)

    const result = await runQuery(query, { tokenAddress });
    console.log(result)

    if (!result) {
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
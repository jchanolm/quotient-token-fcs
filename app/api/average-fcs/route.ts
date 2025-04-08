import { NextRequest, NextResponse } from 'next/server';
import { runQuery } from '@/lib/neo4j';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tokenAddress = searchParams.get('address');

    if (!tokenAddress) {
      return NextResponse.json(
        { error: 'Token address is required' },
        { status: 400 }
      );
    }

    const query = `
      MATCH (w:Wallet)-[hold:HELD]->(token:Token {address: $tokenAddress}) 
      MATCH (w)-[:ACCOUNT]-(wc:Warpcast:Account)
      WITH avg(toFloat(wc.fcCredScore)) as avg_score 
      MATCH (w:Wallet)-[hold:HELD]->(token:Token {address: $tokenAddress}) 
      MATCH (w)-[:ACCOUNT]-(wc:Warpcast:Account)
      WITH apoc.agg.percentiles(toFloat(wc.fcCredScore), [.5, .75, .9, .95, .99]) as score_distribution, avg_score 
      RETURN {avg_score: avg_score, score_distribution: score_distribution} as data
    `;

    const result = await runQuery(query, { tokenAddress });

    if (!result) {
      return NextResponse.json(
        { error: 'No data found for the specified token' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error fetching average FCS:', error);
    return NextResponse.json(
      { error: 'Failed to fetch average FCS' },
      { status: 500 }
    );
  }
} 
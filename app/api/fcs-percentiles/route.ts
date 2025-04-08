import { NextRequest, NextResponse } from 'next/server';
import { runQuery } from '@/lib/neo4j';

interface QueryResult {
  [key: string]: unknown;
  result: {
    percentiles: number[];
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tokenAddress = searchParams.get('address') || '0x0578d8a44db98b23bf096a382e016e29a5ce0ffe'; // Default token if none provided

    const query = `
      MATCH (w:Wallet)-[hold:HELD]->(token:Token {address: $tokenAddress}) 
      MATCH (w)-[:ACCOUNT]-(wc:Warpcast:Account)
      WITH wc.fid as fid, toFloat(wc.fcCredScore) as fcCredScore
      WITH apoc.agg.percentiles(fcCredScore, [0.25, 0.5, 0.75, 0.9, 0.95]) as percentiles
      RETURN {percentiles: percentiles} as result
    `;

    const result = await runQuery<QueryResult>(query, { tokenAddress });
    
    if (!result || !result.result || !result.result.percentiles || !Array.isArray(result.result.percentiles)) {
      throw new Error('Unexpected data format from database');
    }
    
    const percentiles = result.result.percentiles;
    
    // Transform into the format needed for the histogram
    const formattedPercentiles = [
      { percentile: 25, count: percentiles[0] },
      { percentile: 50, count: percentiles[1] },
      { percentile: 75, count: percentiles[2] },
      { percentile: 90, count: percentiles[3] },
      { percentile: 95, count: percentiles[4] }
    ];
    
    // Return the formatted data
    return NextResponse.json(formattedPercentiles);
    
  } catch (error) {
    console.error('Error fetching FCS percentiles:', error);
    return NextResponse.json(
      [],
      { status: 500 }
    );
  }
}
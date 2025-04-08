import { NextRequest, NextResponse } from 'next/server';
import { runQuery } from '@/lib/neo4j';

interface QueryResult {
  [key: string]: unknown;
  avg_score: number;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tokenAddress = searchParams.get('address') || '0x0578d8a44db98b23bf096a382e016e29a5ce0ffe'; // Default token if none provided

    const query = `
      MATCH (w:Wallet)-[hold:HELD]->(token:Token {address: $tokenAddress}) 
      MATCH (w)-[:ACCOUNT]-(wc:Warpcast:Account)
      WITH wc.fid as fid, toFloat(wc.fcCredScore) as score
      WITH fid, avg(score) as fid_avg_score
      WITH avg(fid_avg_score) as avg_score
      RETURN avg_score
    `;

    const result = await runQuery<QueryResult>(query, { tokenAddress });
    
    return NextResponse.json({ avg_score: result?.avg_score || 0 });
    
  } catch (error) {
    console.error('Error fetching average FCS:', error);
    return NextResponse.json(
      { error: 'Failed to fetch average FCS', avg_score: 0 },
      { status: 500 }
    );
  }
}
// app/api/weighted-holders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { runQuery } from '@/lib/neo4j';

interface TokenData {
  token: string;
  name: string;
  symbol: string;
  weighted_holders: number;
  holders_total: number;
}

interface QueryResult {
  token_data: TokenData;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tokenAddress1 = searchParams.get('address1') || '0x06f71fb90f84b35302d132322a3c90e4477333b0'; // Default token 1
    const tokenAddress2 = searchParams.get('address2') || '0x20dd04c17afd5c9a8b3f2cdacaa8ee7907385bef'; // Default token 2
    
    // Get token addresses to query (filter out empty strings)
    const tokenAddresses = [tokenAddress1, tokenAddress2].filter(Boolean);
    
    if (tokenAddresses.length === 0) {
      return NextResponse.json(
        { error: 'At least one token address must be provided' },
        { status: 400 }
      );
    }

    // Create the Cypher query
    const query = `
      // Get the specific tokens we want to analyze
      MATCH (token:Token)
      WHERE token.address IN $tokenAddresses
      
      // For each token, find all wallet holders
      MATCH (wallet:Wallet)-[:HOLDS]->(token)
      
      // Find all Warpcast accounts connected to these wallets (directly or through a path)
      WITH token, wallet
      OPTIONAL MATCH path = (wallet)-[:ACCOUNT*1..5]-(wc:Warpcast)
      
      // Group wallets by token and connected Warpcast account (if any)
      WITH token, wc, collect(DISTINCT wallet) AS wallet_group
      
      // Calculate weight for each group
      WITH token, 
           CASE WHEN wc IS NULL THEN size(wallet_group) // Each unconnected wallet counts as 1
                ELSE 1 + coalesce(wc.fcCredScore, 0) // Connected wallets count as 1 + fcCredScore for the group
           END AS group_weight
      
      // Sum all weights for each token
      WITH token, sum(group_weight) AS weighted_holders
      
      // Return data for each token
      RETURN {
          token: token.address, 
          name: token.name,
          symbol: token.symbol,
          weighted_holders: tofloat(weighted_holders),
          holders_total: tofloat(token.holderCount)
      } AS token_data
    `;

    const result = await runQuery<QueryResult[]>(query, { tokenAddresses });
    
    // Format the response
    const formattedResult = result.map(item => item.token_data);
    
    return NextResponse.json(formattedResult);
    
  } catch (error) {
    console.error('Error fetching weighted holders data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weighted holders data' },
      { status: 500 }
    );
  }
}
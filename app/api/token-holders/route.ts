import { NextRequest, NextResponse } from 'next/server';
import { runQuery } from '@/lib/neo4j';

interface QueryResult {
  [key: string]: unknown;
  holders: {
    username: string;
    fid: number;
    token_balance: number;
    total_balance: number;
    fcCredScore: number;
    profileUrl: string;
    pfpUrl: string;
    bio: string;
    rewards_earned: number;
    miniapps_created: number;
    miniapp_created: string[];
    linked_accounts: {
      platform: string;
      username: string;
    }[];
    wallet_addresses: string[];
  }[];
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tokenAddress = searchParams.get('address') || '0x0578d8a44db98b23bf096a382e016e29a5ce0ffe'; // Default token if none provided

    const query = `
      MATCH (wallet:Wallet)-[r:HELD]->(token:Token {address: $tokenAddress})
      MATCH (wallet)-[:ACCOUNT]-(wc:Warpcast:Account)-[:ACCOUNT]-(allWallets:Wallet)
      OPTIONAL MATCH (wc)-[:ACCOUNT]-(account:Account)
      OPTIONAL MATCH ()-[rewards:REWARDS]->(allWallets)
      OPTIONAL MATCH (wc)-[:CREATED]->(m:Miniapp)
      WHERE NOT account:Wallet
      WITH 
        wc.username as username, 
        toFloat(sum(allWallets.balance)) as eth_usdc_held_usd,  
        toFloat(sum(r.balance)) as token_balance, 
        wc.fid as fid,
        toFloat(wc.fcCredScore) as fcCredScore, 
        "https://warpcast.com/" + wc.username as profileUrl, 
        wc.pfpUrl as pfpUrl, 
        wc.bio as bio, 
        toFloat(sum(toFloat(rewards.value))) as rewards_earned, 
        toFloat(count(m)) as miniapps_created, 
        collect(distinct(m.url)) as miniapp_created, 
        collect(distinct({platform: account.platform, username: account.username})) as linked_accounts, 
        collect(distinct(allWallets.address)) as wallet_addresses 
      ORDER BY token_balance DESC
      LIMIT 100
      RETURN collect({
        username: username,
        fid: fid,
        token_balance: token_balance,
        total_balance: eth_usdc_held_usd,
        fcCredScore: fcCredScore,
        profileUrl: profileUrl,
        pfpUrl: pfpUrl,
        bio: bio,
        rewards_earned: rewards_earned,
        miniapps_created: miniapps_created,
        miniapp_created: miniapp_created,
        linked_accounts: linked_accounts,
        wallet_addresses: wallet_addresses
      }) as holders
    `;

    const result = await runQuery<QueryResult>(query, { 
      tokenAddress
    });
    
    if (!result || !result.holders || !Array.isArray(result.holders)) {
      throw new Error('Unexpected data format from database');
    }
    return NextResponse.json(result.holders);
    
  } catch (error) {
    console.error('Error fetching token holders:', error);
    return NextResponse.json(
      [],
      { status: 500 }
    );
  }
}
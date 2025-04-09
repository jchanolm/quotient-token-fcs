'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Farcaster purple color
const FARCASTER_PURPLE = 'rgba(147, 51, 234, 0.9)';

interface LinkedAccount {
  platform: string;
  username: string;
}

interface TokenHolder {
  username: string;
  fid: string;
  token_balance: number;
  total_balance: number;
  fcCredScore: number;
  profileUrl: string;
  pfpUrl: string;
  bio: string;
  rewards_earned: number;
  miniapps_created: number;
  miniapp_created: string[];
  linked_accounts: LinkedAccount[];
  wallet_addresses: string[];
}

export default function TokenHoldersTable() {
  const [holders, setHolders] = useState<TokenHolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [visibleHolders, setVisibleHolders] = useState<number>(100);

  useEffect(() => {
    const fetchHolders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Add timestamp to prevent caching
        const response = await fetch(`/api/token-holders?t=${Date.now()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch token holders');
        }
        
        const data = await response.json();
        setHolders(data || []);
      } catch (err) {
        console.error('Error fetching token holders:', err);
        setError('Failed to load token holders data');
      } finally {
        setLoading(false);
      }
    };

    fetchHolders();
  }, []);

  const toggleExpandRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handleLoadMore = () => {
    if (visibleHolders >= holders.length) {
      setShowSubscribeModal(true);
      return;
    }
    
    setVisibleHolders(Math.min(visibleHolders + 100, holders.length));
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    } else {
      return num.toFixed(2);
    }
  };

  const shortenAddress = (address: string) => {
    return address.slice(0, 6) + '...' + address.slice(-4);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-6">Top Token Holders</h2>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse flex items-center py-3">
              <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Top Token Holders</h2>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded text-red-600 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium">Top Token Holders</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Showing {Math.min(visibleHolders, holders.length)} of {holders.length} holders
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                <span style={{ color: FARCASTER_PURPLE }}>FCS Score</span>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                Token Balance
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                Total Balance (USD)
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {holders.slice(0, visibleHolders).map((holder, index) => (
              <>
                <tr key={holder.fid} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {holder.pfpUrl ? (
                          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                            <img 
                              src={holder.pfpUrl} 
                              alt={holder.username} 
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placekitten.com/40/40';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                            <span className="text-purple-600 dark:text-purple-300 font-medium">
                              {holder.username.slice(0, 1).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {holder.username}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {`FID: ${holder.fid}`}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="font-medium" style={{ color: FARCASTER_PURPLE }}>
                      {holder.fcCredScore}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatNumber(holder.token_balance)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                    ${formatNumber(holder.total_balance)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => toggleExpandRow(index)}
                      style={{ color: FARCASTER_PURPLE }}
                      className="hover:opacity-80 transition-opacity focus:outline-none px-3 py-1 rounded-full border border-purple-200 dark:border-purple-900"
                    >
                      {expandedRow === index ? 'Hide' : 'Details'}
                    </button>
                  </td>
                </tr>
                {expandedRow === index && (
                  <tr className="bg-gray-50 dark:bg-gray-900/20">
                    <td colSpan={5} className="px-6 py-4">
                      <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        <p className="italic">{holder.bio || 'No bio available'}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Wallet Addresses</h4>
                          <div className="space-y-1">
                            {holder.wallet_addresses.map((address, i) => (
                              <div key={i} className="inline-block bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 text-xs mr-2 mb-2">
                                {shortenAddress(address)}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Stats</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Rewards Earned:</span>
                              <span className="font-medium">${formatNumber(holder.rewards_earned)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Miniapps Created:</span>
                              <span className="font-medium">{holder.miniapps_created}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">FCS Score:</span>
                              <span className="font-medium" style={{ color: FARCASTER_PURPLE }}>{holder.fcCredScore}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {holder.miniapp_created.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Miniapps</h4>
                          <div className="space-x-2">
                            {holder.miniapp_created.map((url, i) => (
                              <a
                                key={i}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 rounded-full px-3 py-1 text-xs mr-2 mb-2 hover:bg-purple-200 dark:hover:bg-purple-900/60 transition-colors"
                              >
                                {new URL(url).hostname}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {holder.linked_accounts.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Linked Accounts</h4>
                          <div className="space-x-2">
                            {holder.linked_accounts.map((account, i) => (
                              <div key={i} className="inline-block border-b border-gray-400 dark:border-gray-500 text-gray-600 dark:text-gray-300 px-2 py-1 text-xs mr-2 mb-2">
                                {account.platform}: {account.username}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/20 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLoadMore}
          className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md shadow-sm transition-colors"
          style={{ backgroundColor: FARCASTER_PURPLE }}
        >
          {visibleHolders >= holders.length ? 'Load More (Pro)' : `Show Next ${Math.min(100, holders.length - visibleHolders)} Holders`}
        </button>
      </div>
      
      {/* Subscribe Modal */}
      {showSubscribeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowSubscribeModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618-3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">Upgrade to Quotient Pro</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Access unlimited token holders data and additional analytics by upgrading to Quotient Pro.
              </p>
              
              <div className="mt-6 space-y-4">
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 text-left">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Unlimited holder data access
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Advanced analytics dashboard
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Custom reports and exports
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Priority support
                  </li>
                </ul>
                
                <a 
                  href="https://quotient.co/pricing" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  style={{ backgroundColor: FARCASTER_PURPLE }}
                >
                  Upgrade Now
                </a>
                <button
                  type="button"
                  onClick={() => setShowSubscribeModal(false)}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
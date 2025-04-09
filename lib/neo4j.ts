// lib/neo4j.ts
import neo4j from 'neo4j-driver';
import neo4j_types from 'neo4j-driver';

// Configure Neo4j connection
const NEO4J_URI = process.env.NEO4J_URI;
const NEO4J_USER = process.env.NEO4J_USER;
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;

if (!NEO4J_URI || !NEO4J_USER || !NEO4J_PASSWORD) {
  throw new Error('Missing required Neo4j environment variables');
}

// Create Neo4j driver instance
const driver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD),
  {
    maxConnectionLifetime: 3 * 60 * 60 * 1000, // 3 hours
    maxConnectionPoolSize: 50,
    connectionAcquisitionTimeout: 2 * 60 * 1000, // 2 minutes
  }
);

// Test the connection
const verifyConnectivity = async () => {
  try {
    await driver.verifyConnectivity();
    console.log('Neo4j connection established successfully');
    return true;
  } catch (error) {
    console.error('Neo4j connection failed:', error);
    return false;
  }
};

// Helper function to prepare params for Neo4j
const prepareParams = (params: Record<string, string | number | boolean>) => {
  const preparedParams: Record<string, any> = {};
  
  // Process each parameter
  for (const key in params) {
    const value = params[key];
    
    // Convert 'limit' parameters to integer
    if (key === 'limit' && typeof value === 'number') {
      preparedParams[key] = neo4j.int(Math.floor(value));
    } else {
      preparedParams[key] = value;
    }
  }
  
  return preparedParams;
};

// Function to run a Cypher query
export const runQuery = async <T extends { [key: string]: unknown }>(
  query: string,
  params: Record<string, string | number | boolean> = {}
): Promise<T> => {
  const session = driver.session();
  
  try {
    // Prepare parameters for Neo4j
    const preparedParams = prepareParams(params);
    
    const result = await session.run(query, preparedParams);
    return result.records.map(record => {
      const keys = record.keys;
      const values = keys.map(key => record.get(key));
      return keys.reduce((obj, key, index) => {
        obj[key] = values[index];
        return obj;
      }, {} as T);
    })[0];
  } catch (error) {
    console.error('Query execution failed:', error);
    throw error;
  } finally {
    await session.close();
  }
};

// Initialize check (optional, can be called when the app starts)
export const initializeNeo4j = async () => {
  return await verifyConnectivity();
};

// Helper function to close the driver when the app shuts down
export const closeDriver = async () => {
  if (driver) {
    await driver.close();
    console.log('Neo4j connection closed');
  }
};
// VeriDoc AI Frontend Configuration
// For production deployments, configure values through Vite env vars.

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "/api";
export const FALLBACK_RPC_URL =
  import.meta.env.VITE_RPC_URL || "https://polygon-amoy.drpc.org";

// 31337 = localhost hardhat, 80002 = Polygon Amoy, 11155111 = Sepolia
const CONTRACT_ADDRESSES = {
  31337: import.meta.env.VITE_CONTRACT_ADDRESS_31337 || "0x809D4Cd773858b6ecc8C3EeED162b51889CEFc16",
  80002: import.meta.env.VITE_CONTRACT_ADDRESS_80002 || "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Mock/Local for now
  11155111: import.meta.env.VITE_CONTRACT_ADDRESS_SEPOLIA || "0x809D4Cd773858b6ecc8C3EeED162b51889CEFc16",
};

export const getContractAddressForChain = (chainId) => {
  const key = Number(chainId);
  return CONTRACT_ADDRESSES[key] || "";
};

export const VERIDOC_ABI = [
  { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
  { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "OwnableInvalidOwner", "type": "error" },
  { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "OwnableUnauthorizedAccount", "type": "error" },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "string", "name": "docHash", "type": "string" },
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "DocumentStored",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "string", "name": "docHash", "type": "string" },
      { "indexed": true, "internalType": "address", "name": "verifier", "type": "address" }
    ],
    "name": "DocumentVerified",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "verifier", "type": "address" }], "name": "VerifierAdded", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "verifier", "type": "address" }], "name": "VerifierRemoved", "type": "event" },
  { "inputs": [{ "internalType": "address", "name": "_verifier", "type": "address" }], "name": "addVerifier", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "authorizedVerifiers", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  {
    "inputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "name": "documents",
    "outputs": [
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "bool", "name": "isVerified", "type": "bool" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_docHash", "type": "string" }],
    "name": "getDoc",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" },
      { "internalType": "bool", "name": "", "type": "bool" },
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "_verifier", "type": "address" }], "name": "removeVerifier", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "string", "name": "_docHash", "type": "string" }], "name": "storeDocHash", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "string", "name": "_docHash", "type": "string" }], "name": "verifyDoc", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
];

export const retryWithBackoff = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    const isRateLimit = String(error?.message || '').toLowerCase().includes('rate limit') || 
                        String(error?.reason || '').toLowerCase().includes('rate limit') ||
                        error?.code === 'SERVER_ERROR';
    
    if (isRateLimit) {
      console.warn(`Rate limited. Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(r => setTimeout(r, delay));
      return retryWithBackoff(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

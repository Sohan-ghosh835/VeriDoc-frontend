export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000'

export const VERIDOC_ABI = [
  {
    "inputs": [{ "internalType": "string", "name": "ipfsHash", "type": "string" }],
    "name": "storeDocHash",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "ipfsHash", "type": "string" }],
    "name": "verifyDoc",
    "outputs": [
      { "internalType": "bool", "name": "exists", "type": "bool" },
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

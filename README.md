# VeriDoc Frontend

## Deployment-ready configuration

Create a `.env` file in this folder (you can copy from `.env.example`) and set:

- `VITE_BACKEND_URL` - backend API base URL (example: `https://api.yourdomain.com/api`)
- `VITE_RPC_URL` - fallback public RPC for read-only lookups when wallet is disconnected
- `VITE_CONTRACT_ADDRESS_31337` - local hardhat contract address
- `VITE_CONTRACT_ADDRESS_80002` - Polygon Amoy contract address

The app now chooses contract address by wallet/network chain id, so it works across local and deployed environments.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

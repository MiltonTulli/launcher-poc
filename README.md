# Tally Launch POC

A frontend interface for creating token launches using TallyLaunchFactory on Uniswap V4.

## Features

- Connect wallet via WalletConnect/AppKit
- Configure all launch parameters
- Deploy launches to TallyLaunchFactory
- View transaction confirmation and launch details

## Tech Stack

- **Next.js 15** - React framework
- **shadcn/ui** - UI components
- **Tailwind CSS** - Styling
- **wagmi** - React hooks for Ethereum
- **Reown AppKit** - Wallet connection

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd tally-launcher-poc

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your WalletConnect Project ID to .env.local
# Get one at https://cloud.reown.com
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Configuration

### Contract Addresses

Update the contract addresses in `src/config/contracts.ts`:

```typescript
export const TALLY_LAUNCH_FACTORY_ADDRESSES: Record<number, Address> = {
  1: "0x...",      // Mainnet
  11155111: "0x...", // Sepolia
  8453: "0x...",    // Base
  84532: "0x...",   // Base Sepolia
};
```

### Supported Networks

- Ethereum Mainnet
- Sepolia Testnet
- Base
- Base Sepolia

## Launch Parameters

| Parameter | Description | Constraints |
|-----------|-------------|-------------|
| `token` | Token address to launch | Valid ERC-20 address |
| `paymentToken` | Payment token (WETH, USDC, etc.) | Valid ERC-20 address |
| `operator` | Launch operator address | Valid address |
| `tokenAmount` | Amount of tokens to launch | > 0 |
| `auctionDuration` | Auction duration | 1 hour - 30 days |
| `pricingSteps` | Number of pricing steps | 1 - 1000 |
| `reservePrice` | Minimum token price | > 0 |
| `liquidityAllocation` | % to liquidity pool | 0 - 100% |
| `treasuryAllocation` | % to treasury | 0 - 100% |
| `poolFeeTier` | Uniswap V4 fee tier | 100, 500, 3000, 10000 |
| `lockupDuration` | LP position lockup | 0 - 730 days |
| `distributionDelay` | Delay before distribution | 0 - 30 days |
| `treasury` | Treasury address | Valid address |
| `positionBeneficiary` | LP position recipient | Valid address |

## License

MIT

# Sui dApp Workshop

A comprehensive collection of modern, minimal dark theme Next.js 15 dApps built with Sui dApp Kit, featuring 5 different blockchain applications.

## Features

### 🎨 **Modern Dark Theme** - Built with Sui's official color palette
### 🔗 **Wallet Integration** - Connect with any Sui wallet using dApp Kit
### 📱 **Responsive Design** - Optimized for desktop and mobile devices
### 🎯 **TypeScript** - Full type safety throughout the application

## dApps Included

### 1. 🖼️ **NFT Minting dApp**
- Create and mint NFTs with custom metadata
- Real-time NFT preview before minting
- View and explore owned NFTs with detailed information
- Execute NFT minting transactions with the TxButton component

### 2. 🗳️ **Voting dApp**
- Decentralized voting with multiple options
- Real-time voting results and statistics
- One vote per user per proposal
- Live updated voting results fetched from blockchain

### 3. 📖 **Guestbook dApp**
- Leave messages on-chain (max 100 characters)
- View all messages in real-time guestbook feed
- Permanent message storage on Sui blockchain
- Connected wallet authentication

### 4. 🚰 **Token Faucet dApp**
- Claim 10 SUI tokens for testing
- Prevent multiple claims from same wallet
- Display remaining faucet balance
- One-time claim per wallet address

### 5. 💰 **Tip Jar dApp**
- Send tips to contract owner
- Optional message with tip
- Display total tips received
- Recent tips history

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **Blockchain**: Sui dApp Kit & Sui SDK
- **State Management**: TanStack React Query
- **Language**: TypeScript

## Color Palette

Following Sui's official media kit:

- **Deep Ocean** `#030F1C` - Background
- **Ocean** `#011829` - Surfaces
- **Sea** `#4DA2FF` - Accent
- **Aqua** `#C0E6FF` - Soft text
- **Cloud** `#FFFFFF` - Primary text

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn or npm
- Sui CLI (for local development)
- Move compiler (included with Sui CLI)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd assignment-sui-workshop
```

2. Install dependencies:

```bash
yarn install
```

3. Create environment file:

```bash
echo "NEXT_PUBLIC_SUI_NETWORK=testnet" > .env.local
```

4. Deploy the Move modules (required for dApp functionality):

```bash
# NFT Minting Module
cd move/nft_mint
sui move build
sui client publish --gas-budget 10000000

# Voting Module
cd ../voting
sui move build
sui client publish --gas-budget 10000000

# Guestbook Module
cd ../guestbook
sui move build
sui client publish --gas-budget 10000000

# Faucet Module
cd ../faucet
sui move build
sui client publish --gas-budget 10000000

# Tip Jar Module
cd ../tipjar
sui move build
sui client publish --gas-budget 10000000
```

### Deployed Contract Addresses

The following contracts have been deployed to Sui testnet:

- **NFT Minting Module**: `0x47ef68ddf317e93617667b1858c2e2dfaaf1fbbcb069bad299caacd8c8cb8417`
- **Voting Module**: `0xa1818ad3bd428551eb1b6330dabe007270065630b2694cc26982afab0bb1cb07`
- **Guestbook Module**: `0xcb381d2853694ec22e2fdc33c172d9bca36897e9ddd20784608b1af6f7a1df45`
- **Faucet Module**: `0xfcc18222140ac7eb4988223d7064153e90393f1117b338865bbaa111a3eef265`
- **Tip Jar Module**: `0x5e67a89ce855640722974ce148dab73935348447e7c9de67e0dd4483dbdb6855`

### Troubleshooting

If you encounter wallet extension conflicts (chrome-extension errors), try:
1. Disable other wallet extensions temporarily
2. Refresh the page
3. Use a different browser
4. Clear browser cache and cookies

5. Start the development server:

```bash
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

**Note**: After deployment, update the module addresses in the respective page files with your deployed module addresses. See `DEPLOYMENT.md` for detailed instructions.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Home page with wallet connection and dApp navigation
│   ├── providers.tsx           # Sui dApp Kit providers setup
│   ├── objects/
│   │   ├── page.tsx            # Objects list page
│   │   └── [id]/page.tsx       # Object detail page
│   ├── tx/page.tsx             # Transactions page (placeholder)
│   ├── mint/page.tsx           # NFT minting page with form and preview
│   ├── voting/page.tsx         # Voting dApp with proposals and results
│   ├── guestbook/page.tsx      # Guestbook dApp for leaving messages
│   ├── faucet/page.tsx         # Token faucet for claiming SUI
│   ├── tipjar/page.tsx         # Tip jar for sending tips
│   └── settings/page.tsx       # Network settings page
├── components/
│   └── TxButton.tsx            # Reusable transaction button
└── globals.css                 # Global styles with Sui palette

move/
├── nft_mint/                   # NFT minting module
├── voting/                     # Voting module
├── guestbook/                  # Guestbook module
├── faucet/                     # Token faucet module
└── tipjar/                     # Tip jar module
```

## Pages & Features

### Home (`/`)

- Wallet connection with ConnectButton
- Display connected account address
- NFT gallery showing owned NFTs
- Quick access to mint new NFTs
- Navigation to other pages

### Objects (`/objects`)

- List all owned objects and NFTs
- Click to view detailed object information
- Shows object type, version, and display data
- Filter and search functionality

### Object Detail (`/objects/[id]`)

- Detailed view of individual objects
- Shows object fields, owner, version
- Raw object data display
- Object content and display information

### Transactions (`/tx`)

- Placeholder page with implementation guidance
- Code examples for fetching recent transactions
- Transaction filtering and display patterns

### Mint (`/mint`)

- Mint NFTs with custom name, image URL, and description
- Real-time NFT preview before minting
- Form validation and error handling
- Integration with Move NFT minting module

### Voting (`/voting`)

- Decentralized voting with multiple options
- Real-time voting results and statistics
- One vote per user per proposal
- Live updated voting results fetched from blockchain

### Guestbook (`/guestbook`)

- Leave messages on-chain (max 100 characters)
- View all messages in real-time guestbook feed
- Permanent message storage on Sui blockchain
- Connected wallet authentication

### Faucet (`/faucet`)

- Claim 10 SUI tokens for testing
- Prevent multiple claims from same wallet
- Display remaining faucet balance
- One-time claim per wallet address

### Tip Jar (`/tipjar`)

- Send tips to contract owner
- Optional message with tip
- Display total tips received
- Recent tips history

### Settings (`/settings`)

- Network switcher (localnet/testnet/mainnet)
- Network information and configuration
- Environment variable documentation
- Links to Sui explorers

## Network Configuration

### Testnet (Default)

- Use CLI faucet: `sui client faucet`
- Explorer: [Sui Explorer Testnet](https://suiexplorer.com/txblock?network=testnet)
- Network URL: `https://fullnode.testnet.sui.io`

### Mainnet

- No faucet available - use real SUI
- Explorer: [Sui Explorer Mainnet](https://suiexplorer.com/txblock?network=mainnet)
- Network URL: `https://fullnode.mainnet.sui.io`

### Localnet

- Requires local Sui node: `sui start`
- Network URL: `http://127.0.0.1:9000`
- Use for local development and testing

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUI_NETWORK=testnet
```

Available options: `localnet`, `testnet`, `mainnet`

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

## Key Components

### TxButton

A reusable component for executing transactions:

```tsx
<TxButton onExecute={createTransaction}>Execute Transaction</TxButton>
```

### Providers Setup

The app uses the following providers:

- `QueryClientProvider` - TanStack React Query
- `SuiClientProvider` - Sui client with network configuration
- `WalletProvider` - Wallet connection management

## Development Notes

- The app uses Next.js 15 with App Router
- All pages are client-side rendered for wallet interaction
- Tailwind CSS 4 is used for styling
- TypeScript provides full type safety
- The dApp Kit handles all Sui interactions
- Move module provides NFT minting functionality
- NFTs are stored on-chain with metadata (name, image URL, description)

## Troubleshooting

### Wallet Connection Issues

- Ensure you have a Sui wallet installed (Sui Wallet, Suiet, etc.)
- Check that you're on the correct network
- Try refreshing the page

### Transaction Failures

- Ensure you have sufficient gas for transactions
- Check network connectivity
- Verify transaction parameters

### Build Issues

- Clear node_modules and reinstall: `rm -rf node_modules && yarn install`
- Check TypeScript errors: `yarn lint`
- Ensure all dependencies are properly installed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

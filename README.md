# SwipePad - Celo DApp

A decentralized application for supporting regenerative projects with micro-donations through simple swipes on the Celo blockchain.

## Features

- **Multi-Wallet Support**: Connect using email, social media (Google, Discord, Telegram, Farcaster, X, Apple, GitHub, Twitch, TikTok, LINE), passkey, guest mode, or Web3 wallets (MetaMask, Coinbase Wallet, Rainbow, Rabby, Zerion)
- **Swipe-to-Donate**: Intuitive Tinder-style interface for discovering and supporting projects
- **Multiple Stablecoins**: Support for cUSD, cEUR, cGBP, cAUD, cCHF, cCAD, cKES, cREAL, cZAR, cCOL, and cJPY
- **Project Categories**: Regeneration, Climate, Education, Wildlife, Health, Community, Technology, Arts & Culture
- **Gamification**: Earn badges, track streaks, and build your donation profile
- **Trending Projects**: Discover popular projects and community funds
- **Project Registration**: Submit your own regenerative project for review

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Blockchain**: Celo Network
- **Wallet Integration**: Thirdweb SDK
- **Styling**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Thirdweb Client ID (get one at [thirdweb.com](https://thirdweb.com))

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/ReFi-Starter/celo-posh-8.git
cd celo-posh-8
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

3. Update the Thirdweb Client ID in `components/thirdweb-connect.tsx`:
\`\`\`typescript
const client = createThirdwebClient({
  clientId: "YOUR_CLIENT_ID_HERE", // Replace with your actual Client ID
})
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Configuration

### Thirdweb Setup

1. Go to [thirdweb.com](https://thirdweb.com) and create an account
2. Create a new project in the dashboard
3. Copy your Client ID
4. Replace the `clientId` in `components/thirdweb-connect.tsx`

### Supported Wallets

The app supports the following authentication methods:
- **Email & Phone**: Passwordless authentication
- **Social**: Google, Discord, Telegram, Farcaster, X (Twitter), Apple, GitHub, Twitch, TikTok, LINE
- **Passkey**: Biometric authentication
- **Guest**: Try the app without connecting
- **Web3 Wallets**: MetaMask, Coinbase Wallet, Rainbow, Rabby, Zerion

### Network Configuration

The app is configured to use the **Celo Network** by default. The network configuration is set in `components/thirdweb-connect.tsx`:

\`\`\`typescript
chains={[celo]} // Forces connection to Celo Network
\`\`\`

## Project Structure

\`\`\`
├── app/
│   ├── layout.tsx          # Root layout with ThirdwebProvider
│   ├── page.tsx            # Main app component
│   └── globals.css         # Global styles
├── components/
│   ├── thirdweb-connect.tsx    # Thirdweb wallet connection component
│   ├── wallet-connect.tsx      # Wallet connection screen
│   ├── project-card.tsx        # Swipeable project card
│   ├── amount-selector.tsx     # Donation amount selector
│   ├── cart.tsx                # Shopping cart for donations
│   ├── success-screen.tsx      # Success confirmation
│   └── ...                     # Other UI components
├── lib/
│   └── data.ts             # Project and category data
└── public/
    └── images/             # Project images and assets
\`\`\`

## Usage

### For Donors

1. **Connect Wallet**: Click "Connect Wallet" and choose your preferred authentication method
2. **Select Amount**: Choose your donation amount and preferred stablecoin
3. **Swipe Projects**: Swipe right to donate, left to skip
4. **Confirm Donations**: After reaching your swipe threshold, confirm your donations
5. **Track Progress**: View your badges, streaks, and donation history

### For Project Owners

1. Click the "+" button in the top right corner
2. Fill out the project registration form
3. Submit for review
4. Once approved, your project will appear in the app

## Customization

### Adding New Projects

Edit `lib/data.ts` to add new projects:

\`\`\`typescript
{
  id: "new-project",
  name: "Your Project Name",
  category: "Regeneration",
  description: "Project description",
  image: "/images/your-project.png",
  raised: 0,
  goal: 10000,
  backers: 0,
  location: "Location",
  impact: "Impact description",
  verified: true
}
\`\`\`

### Styling

The app uses Tailwind CSS with custom design tokens. Modify `app/globals.css` to customize colors and styles.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add your Thirdweb Client ID as an environment variable (optional, can be hardcoded)
4. Deploy

### Environment Variables (Optional)

If you prefer to use environment variables instead of hardcoding:

\`\`\`env
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id_here
\`\`\`

Then update `components/thirdweb-connect.tsx`:

\`\`\`typescript
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
})
\`\`\`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues and questions:
- GitHub Issues: [https://github.com/ReFi-Starter/celo-posh-8/issues](https://github.com/ReFi-Starter/celo-posh-8/issues)
- Thirdweb Docs: [https://portal.thirdweb.com](https://portal.thirdweb.com)
- Celo Docs: [https://docs.celo.org](https://docs.celo.org)

## Acknowledgments

- Built with [Thirdweb](https://thirdweb.com)
- Powered by [Celo](https://celo.org)
- UI components from [shadcn/ui](https://ui.shadcn.com)

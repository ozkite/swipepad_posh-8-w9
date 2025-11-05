# SwipePad: Complete Architecture Documentation

## Overview

SwipePad is a decentralized application (DApp) designed for supporting regenerative and climate-focused projects through micro-donations. Users interact with project profiles in a Tinder-like swipe interface. Donations are made using stablecoins on the Celo blockchain.

### Core Mission
Make donating to impactful causes simple, engaging, and accessible, particularly targeting the global south and users via social media access.

---

## Core Functionality & UI

### Primary Features

#### 1. Swipe-to-Donate Interface
- **Tinder-like swipe mechanism** for browsing projects
- **Swipe right** to add project to donation cart
- **Swipe left** to skip project
- Touch-optimized for mobile-first experience

#### 2. Donation Cart System
- Add multiple projects to cart
- Set donation amounts (e.g., 0.01 cUSD per swipe)
- Select from multiple stablecoins (cUSD, cEUR, cKES, etc.)
- Batch donations for gas efficiency

#### 3. Confirmation Threshold
- User-configurable thresholds (5, 10, 20, 30 swipes)
- Batched transactions triggered when threshold reached
- Reduces gas costs and improves UX

#### 4. Project Categories
- **Regeneration** - Environmental restoration projects
- **Climate** - Climate action initiatives
- **Education** - Educational programs
- **Health** - Healthcare initiatives
- **Community** - Community development
- **Builders** - Individual Web3 developers

#### 5. Gamification Features
- **Badges** - Achievement system for donors
- **Donation streaks** - Encourage consistent giving
- **Leaderboards** - Community engagement

#### 6. Additional Features
- **Trending Projects** - Popular/featured projects
- **Project Registration** - Submit projects for review
- **User Profiles** - Donation history and stats
- **Social Sharing** - Share projects on social media

---

## Technical Implementation

### Technology Stack

#### Frontend Framework
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **React 18** with Server Components

#### Styling
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** components for consistent UI
- Custom animations for swipe interactions

#### Blockchain Integration
- **Celo Network** - Layer 1 blockchain
- **Thirdweb SDK v5** - Wallet and transaction management
- **Mento Stablecoins** - cUSD, cEUR, cKES, etc.

#### Wallet Solutions
**In-App Wallets** (Social Login):
- Google
- Discord
- X (Twitter)
- Email
- Guest mode
- Passkey

**External Web3 Wallets**:
- MetaMask
- Coinbase Wallet
- Rainbow
- Rabby
- Zerion

#### Gas Sponsorship
- **EIP-7702** implementation
- Sponsored transactions for in-app wallets
- Reduces friction for new users
- Improves onboarding experience

---

## Data Architecture

### Project Data Structure

\`\`\`typescript
interface Project {
  id: string                       // Unique identifier
  name: string                     // Project/Builder name
  description: string              // Project description
  category: string                 // "Builders" | "Projects"
  imageUrl: string                 // Profile/project image
  website?: string                 // Project website
  twitter?: string                 // Twitter/X profile
  discord?: string                 // Discord server
  linkedin?: string                // LinkedIn profile
  farcaster?: string              // Farcaster profile
  github?: string                 // GitHub profile
  fundingGoal?: number            // Target funding amount
  fundingCurrent?: number         // Current funding raised
  likes?: number                  // Like count
  comments?: number               // Comment count
  walletAddress?: string          // Recipient wallet
  isBookmarked?: boolean          // User bookmark status
  userHasLiked?: boolean          // User like status
  userHasCommented?: boolean      // User comment status
  reportCount?: number            // Report count
  boostAmount?: number            // Boost amount
}
\`\`\`

### Data Storage

#### JSON Files
- **Location**: `/data/profiles/`
- **Files**:
  - `celo_builders.json` - Builder profiles
  - `karmagap.json` - Project profiles

#### API Routes
- **Purpose**: Secure data access, prevent direct public file access
- **Endpoints**:
  - `/api/projects` - Fetch project data
  - `/api/builders` - Fetch builder data
  - `/api/random-profile` - Get random profile

### Builder Profile Schema

\`\`\`json
{
  "Name": "string",
  "Description": "string",
  "Profile Image URL": "string",
  "Points": "string",              // Optional: Ranking points
  "Rank": "string",                // Optional: Position rank
  "Farcaster": "string",
  "LinkedIn": "string",
  "GitHub": "string",
  "wallet_address": "string"
}
\`\`\`

---

## Key Components

### Core Components

#### 1. WalletConnect (`components/wallet/WalletConnect.tsx`)
- Thirdweb `ConnectButton` integration
- Configures wallet options (in-app + external)
- Handles authentication state
- Gas sponsorship configuration

#### 2. ProjectCard (`components/project-card.tsx`)
- Displays project/builder information
- Swipe gesture handling
- Social links integration
- Like, comment, share, report actions
- Boost functionality
- Responsive design (swipe/category modes)

#### 3. CategorySection (`components/category-section.tsx`)
- Horizontal scrollable project grid
- Category-based filtering
- Donation and boost actions
- Project count display

#### 4. CategoryMenu (`components/category-menu.tsx`)
- Category navigation buttons
- Active category highlighting
- "Projects" and "Builders" tabs

#### 5. AmountSelector
- Donation amount configuration
- Stablecoin selection
- Threshold settings

#### 6. BoostModal (`components/boost-modal.tsx`)
- Boost amount input
- Transaction confirmation
- Success/error handling

#### 7. ShareModal (`components/share-modal.tsx`)
- Social media sharing
- Copy link functionality
- Share to Twitter, Farcaster, etc.

#### 8. ReportModal (`components/report-modal.tsx`)
- Report reasons selection
- Custom reason input
- Submission handling

---

## API Routes

### 1. Donation Execution (`app/api/donate/route.ts`)
**Purpose**: Execute blockchain transactions

**Features**:
- Prepares transaction data
- Integrates with Thirdweb SDK
- Handles batch donations
- Error handling and logging

**Flow**:
1. Receive donation request
2. Validate user wallet
3. Prepare transaction parameters
4. Execute via Thirdweb
5. Return transaction hash

### 2. Projects API (`app/api/projects/route.ts`)
**Purpose**: Serve project data securely

**Features**:
- Fetches from JSON files
- Filters by category
- Returns formatted data
- Error handling

### 3. Builders API (`app/api/builders/route.ts`)
**Purpose**: Serve builder profiles

**Features**:
- Fetches builder data
- Transforms to Project interface
- Returns formatted profiles

### 4. Random Profile (`app/api/random-profile/route.ts`)
**Purpose**: Get random project for discovery

**Features**:
- Filters by category
- Random selection
- Returns single profile

---

## Integrations

### 1. Thirdweb SDK
**Purpose**: Wallet connection and transaction execution

**Features**:
- Multi-wallet support
- In-app wallet creation
- Gas sponsorship (EIP-7702)
- Transaction management
- Smart contract interactions

**Configuration** (`app/client.ts`):
\`\`\`typescript
import { createThirdwebClient } from "thirdweb"

export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!
})
\`\`\`

### 2. Self Protocol
**Purpose**: Decentralized identity verification (KYC)

**Features**:
- QR code generation
- Mobile app verification
- Attribute verification (humanity, age, nationality)
- Privacy-preserving KYC

**Components**:
- `src/components/self/` - Frontend modals
- `app/api/self-verify/route.ts` - Backend verification

**Flow**:
1. User requests verification
2. QR code generated
3. User scans with Self app
4. Attributes verified
5. Verification status returned

### 3. Celo Network
**Purpose**: Blockchain infrastructure

**Features**:
- Fast transaction finality
- Low gas fees
- Mobile-first design
- Stablecoin ecosystem

**Stablecoins**:
- **cUSD** - US Dollar stablecoin
- **cEUR** - Euro stablecoin
- **cKES** - Kenyan Shilling stablecoin
- **cREAL** - Brazilian Real stablecoin

### 4. Vercel
**Purpose**: Deployment and hosting

**Features**:
- Automatic deployments
- Edge functions
- Environment variables
- Analytics

---

## Key Repositories

### 1. `ozkite/swipepad_posh-8-w9`
**Primary repository** containing:
- Main Next.js application
- All components and UI
- Thirdweb integration
- Self Protocol integration
- API routes
- Donation execution logic
- Data management

### 2. `ReFi-Starter/swipe-pad`
**Earlier/related repository**:
- Original starter template
- Alternative branch/iteration
- Reference implementation

---

## Data Flow

### 1. Project Data Flow
\`\`\`
JSON Files (data/profiles/)
    ↓
API Routes (app/api/)
    ↓
Data Layer (lib/data.ts)
    ↓
Components (app/page.tsx)
    ↓
UI (ProjectCard, CategorySection)
\`\`\`

### 2. Donation Flow
\`\`\`
User Swipe/Like
    ↓
Add to Cart
    ↓
Reach Threshold
    ↓
API Route (app/api/donate/route.ts)
    ↓
Thirdweb SDK
    ↓
Celo Blockchain
    ↓
Transaction Confirmation
\`\`\`

### 3. Authentication Flow
\`\`\`
User Clicks Connect
    ↓
WalletConnect Component
    ↓
Thirdweb ConnectButton
    ↓
Wallet Selection (In-App/External)
    ↓
Authentication
    ↓
Gas Sponsorship (if In-App)
    ↓
Connected State
\`\`\`

---

## File Structure

\`\`\`
swipepad/
├── app/
│   ├── api/
│   │   ├── donate/route.ts          # Donation execution
│   │   ├── projects/route.ts        # Projects API
│   │   ├── builders/route.ts        # Builders API
│   │   ├── random-profile/route.ts  # Random profile
│   │   └── self-verify/route.ts     # Self Protocol verification
│   ├── client.ts                    # Thirdweb client config
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Main page (swipe interface)
├── components/
│   ├── wallet/
│   │   └── WalletConnect.tsx        # Wallet connection
│   ├── self/                        # Self Protocol components
│   ├── project-card.tsx             # Project card component
│   ├── category-section.tsx         # Category section
│   ├── category-menu.tsx            # Category menu
│   ├── amount-selector.tsx          # Donation amount selector
│   ├── boost-modal.tsx              # Boost modal
│   ├── share-modal.tsx              # Share modal
│   └── report-modal.tsx             # Report modal
├── data/
│   └── profiles/
│       ├── celo_builders.json       # Builder profiles
│       └── karmagap.json            # Project profiles
├── lib/
│   ├── data.ts                      # Data utilities
│   ├── c2-builders-data.json        # Additional builder data
│   └── celo-talent-profiles.json    # Talent profiles
├── docs/                            # Documentation
└── public/                          # Static assets
\`\`\`

---

## Current Status & Development Goals

### Completed Features
✅ Swipe interface with touch gestures
✅ Wallet connection (in-app + external)
✅ Gas sponsorship for in-app wallets
✅ Project and builder profiles
✅ Category filtering
✅ Social links integration
✅ Boost functionality
✅ Share and report features
✅ Self Protocol KYC integration
✅ API routes for secure data access
✅ Batch donation system

### In Progress
🔄 Real blockchain transaction execution
🔄 Donation cart optimization
🔄 Gamification features (badges, streaks)
🔄 User profile dashboard
🔄 Project registration flow

### Future Roadmap
📋 Enhanced analytics dashboard
📋 Multi-language support
📋 Advanced filtering and search
📋 Project verification system
📋 Community governance
📋 Mobile app (React Native)
📋 Integration with more blockchains

---

## Development Context

### Hackathon Origin
- Developed during **Celo "PoSH" (Proof of Shipping)** hackathon
- Focus on real, on-chain donations
- Building for Global South accessibility
- Web3 onboarding optimization

### Target Audience
- **Primary**: Global South users
- **Access**: Social media-first approach
- **Experience**: Web3 newcomers
- **Goal**: Frictionless donation experience

### Key Differentiators
1. **Mobile-first design** - Optimized for smartphones
2. **Social login** - No seed phrases required
3. **Gas sponsorship** - Free transactions for new users
4. **Micro-donations** - Start with $0.01
5. **Gamification** - Engaging donation experience
6. **Batch transactions** - Cost-efficient giving

---

## Best Practices

### For Developers

#### Adding New Builders
1. Add profile to `/data/profiles/celo_builders.json`
2. Include all required fields (Name, Description, wallet_address)
3. Validate image URLs
4. Test API endpoint response

#### Adding New Projects
1. Add profile to `/data/profiles/karmagap.json`
2. Follow Project interface schema
3. Set appropriate category
4. Verify wallet address

#### Modifying Components
1. Read existing component first
2. Maintain TypeScript types
3. Test swipe gestures on mobile
4. Verify responsive design
5. Check accessibility

#### API Development
1. Use Next.js API routes
2. Implement error handling
3. Validate input data
4. Return consistent response format
5. Log important events

### For Designers

#### UI Guidelines
- **Colors**: Follow Celo brand (yellow #FFD600)
- **Typography**: Clear, readable fonts
- **Spacing**: Consistent padding/margins
- **Touch targets**: Minimum 44x44px
- **Animations**: Smooth, performant

#### Mobile Optimization
- Touch-friendly buttons
- Swipe gesture feedback
- Loading states
- Error messages
- Success confirmations

---

## Environment Variables

### Required Variables
\`\`\`env
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id
\`\`\`

### Optional Variables
\`\`\`env
# Self Protocol
NEXT_PUBLIC_SELF_APP_ID=your_self_app_id

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
\`\`\`

---

## Troubleshooting

### Common Issues

#### Wallet Connection Fails
- Check Thirdweb client ID
- Verify network configuration
- Clear browser cache
- Try different wallet

#### Images Not Loading
- Verify image URLs in JSON
- Check CORS settings
- Use placeholder fallback
- Optimize image sizes

#### Transactions Failing
- Check wallet balance
- Verify gas sponsorship
- Confirm network connection
- Review transaction parameters

#### Data Not Displaying
- Check API route responses
- Verify JSON file format
- Review data transformation
- Check console errors

---

## Contributing

### Development Setup
1. Clone repository
2. Install dependencies: `npm install`
3. Set environment variables
4. Run development server: `npm run dev`
5. Open http://localhost:3000

### Code Standards
- TypeScript for all new code
- ESLint configuration
- Prettier formatting
- Component documentation
- Unit tests for utilities

### Pull Request Process
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Update documentation
5. Submit PR with description

---

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Thirdweb Docs](https://portal.thirdweb.com)
- [Celo Docs](https://docs.celo.org)
- [Self Protocol Docs](https://docs.selfprotocol.com)

### Community
- [Celo Discord](https://discord.gg/celo)
- [Thirdweb Discord](https://discord.gg/thirdweb)
- [GitHub Discussions](https://github.com/ozkite/swipepad_posh-8-w9/discussions)

---

## License

[Add license information]

---

## Contact

For questions or support:
- GitHub Issues: [Repository Issues](https://github.com/ozkite/swipepad_posh-8-w9/issues)
- Email: [Add contact email]
- Discord: [Add Discord server]

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Status**: Active Development

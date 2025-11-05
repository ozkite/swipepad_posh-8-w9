# SwipePad Builders Section

## Overview

The Builders section of SwipePad showcases individual Web3 developers, engineers, and creators building on the Celo blockchain. This section allows users to discover and support talented builders through micro-donations.

---

## Purpose

### Goals
1. **Highlight Individual Talent** - Showcase Web3 builders and developers
2. **Enable Direct Support** - Allow users to donate directly to builders
3. **Build Community** - Connect builders with supporters
4. **Encourage Innovation** - Fund individual projects and experiments

### Target Audience
- Web3 developers
- Blockchain engineers
- Open-source contributors
- Independent creators
- Technical innovators

---

## Data Structure

### Builder Profile Schema

\`\`\`json
{
  "Name": "string",                  // Builder's name or ENS
  "Description": "string",           // Bio or description
  "Profile Image URL": "string",     // Profile picture URL
  "Points": "string",                // Optional: Ranking points
  "Rank": "string",                  // Optional: Position rank (e.g., "#1")
  "Farcaster": "string",            // Farcaster profile URL
  "LinkedIn": "string",             // LinkedIn profile URL
  "GitHub": "string",               // GitHub profile URL
  "wallet_address": "string"        // Celo wallet address
}
\`\`\`

### Example Builder Profile

\`\`\`json
{
  "Name": "JulioMCruz.base.eth",
  "Description": "🚀 OnChain Engineer | Developing decentralized solutions that empower communities 🌐 Passionate about onchain innovation and open-source collaboration.",
  "Profile Image URL": "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/3cef26d3-9f0a-4c12-160a-47082c268d00/original",
  "Farcaster": "https://farcaster.xyz/juliomcruz",
  "LinkedIn": "https://www.linkedin.com/in/juliomcruz",
  "GitHub": "https://github.com/JulioMCruz",
  "wallet_address": "0xc2564e41b7f5cb66d2d99466450cfebce9e8228f"
}
\`\`\`

---

## File Locations

### Data Files
- **Primary**: `/data/profiles/celo_builders.json`
- **Additional**: `/lib/c2-builders-data.json`
- **Talent Profiles**: `/lib/celo-talent-profiles.json`

### Components
- **Data Processing**: `/lib/data.ts`
- **Display**: `/components/project-card.tsx`
- **Category View**: `/components/category-section.tsx`
- **Navigation**: `/components/category-menu.tsx`

### API Routes
- **Builders API**: `/app/api/builders/route.ts` (if implemented)
- **Random Profile**: `/app/api/random-profile/route.ts`

---

## Data Transformation

### From JSON to Project Interface

The builder data is transformed from the JSON schema to the unified `Project` interface:

\`\`\`typescript
// Input: Builder JSON
{
  "Name": "Builder Name",
  "Description": "Builder bio",
  "Profile Image URL": "https://...",
  "GitHub": "https://github.com/...",
  "wallet_address": "0x..."
}

// Output: Project Interface
{
  id: "celo-builder-1",
  name: "Builder Name",
  description: "Builder bio",
  category: "Builders",
  imageUrl: "https://...",
  github: "https://github.com/...",
  walletAddress: "0x...",
  fundingGoal: 50000,        // Generated
  fundingCurrent: 25000,     // Generated
  likes: 150,                // Generated
  comments: 25               // Generated
}
\`\`\`

### Transformation Logic (`lib/data.ts`)

\`\`\`typescript
const celoBuilderProjects: Project[] = celoBuilders
  .filter((builder: any) => {
    // Filter out invalid entries
    const hasValidName = builder.Name && 
                        builder.Name.trim().length > 0 && 
                        builder.Name !== "N/A"
    return hasValidName
  })
  .map((builder: any, index: number) => ({
    id: `celo-builder-${index + 1}`,
    name: builder.Name,
    description: builder.Description || `Building on Celo blockchain - ${builder.Name}`,
    category: "Builders",
    imageUrl: builder["Profile Image URL"] && builder["Profile Image URL"] !== "N/A"
      ? builder["Profile Image URL"]
      : `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(builder.Name)}`,
    linkedin: builder.LinkedIn && builder.LinkedIn !== "N/A" ? builder.LinkedIn : undefined,
    farcaster: builder.Farcaster && builder.Farcaster !== "N/A" ? builder.Farcaster : undefined,
    github: builder.GitHub && builder.GitHub !== "N/A" ? builder.GitHub : undefined,
    fundingGoal: Math.floor(Math.random() * 100000) + 10000,
    fundingCurrent: Math.floor(Math.random() * 50000) + 5000,
    likes: Math.floor(Math.random() * 500) + 10,
    comments: Math.floor(Math.random() * 100) + 1,
    walletAddress: builder.wallet_address,
    isBookmarked: false,
    userHasLiked: false,
    userHasCommented: false,
    reportCount: 0,
    boostAmount: 0,
  }))
\`\`\`

---

## UI Components

### 1. Builder Card Display

The `ProjectCard` component displays builder information with:

**Visual Elements**:
- Profile image
- Builder name
- Description/bio
- Category badge ("Builders")
- Social links (GitHub, LinkedIn, Farcaster)

**Interactive Elements**:
- Like button (heart icon)
- Comment button
- Share button
- Report button
- Boost button
- Swipe gestures (in swipe mode)
- Like/Skip buttons (in swipe mode)

**Social Links**:
- GitHub - Direct link to repositories
- LinkedIn - Professional profile
- Farcaster - Decentralized social profile
- Website - Personal/project website
- Twitter/X - Social media presence
- Discord - Community server

### 2. Category Section

Displays builders in a horizontal scrollable grid:

\`\`\`tsx
<CategorySection
  category="Builders"
  projects={builderProjects}
  onDonate={handleDonate}
  onBoost={handleBoost}
/>
\`\`\`

**Features**:
- Horizontal scroll
- Project count display
- Donation actions
- Boost functionality

### 3. Category Menu

Navigation between Projects and Builders:

\`\`\`tsx
<CategoryMenu
  categories={["Projects", "Builders"]}
  activeCategory={activeCategory}
  onCategoryChange={setActiveCategory}
/>
\`\`\`

---

## User Interactions

### Swipe Mode

**Swipe Right (Like)**:
1. Builder added to donation cart
2. Visual feedback (green "LIKE" overlay)
3. Card animates off screen
4. Next builder displayed

**Swipe Left (Skip)**:
1. Builder skipped
2. Visual feedback (red "SKIP" overlay)
3. Card animates off screen
4. Next builder displayed

### Category Mode

**Like Button**:
1. User clicks "Like" button
2. Builder added to cart
3. Visual confirmation
4. Can continue browsing

**Boost Button**:
1. Opens boost modal
2. User selects boost amount
3. Transaction prepared
4. Boost applied to builder

### Social Interactions

**Like (Heart)**:
- Toggle like status
- Update like count
- Visual feedback (filled heart)

**Comment**:
- Open comment modal
- Add comment
- Update comment count

**Share**:
- Open share modal
- Copy link
- Share to social media

**Report**:
- Open report modal
- Select reason
- Submit report

---

## Adding New Builders

### Step-by-Step Guide

#### 1. Prepare Builder Data

Create a JSON object with required fields:

\`\`\`json
{
  "Name": "Builder Name or ENS",
  "Description": "Compelling bio highlighting skills and projects",
  "Profile Image URL": "https://your-image-url.com/image.jpg",
  "Farcaster": "https://farcaster.xyz/username",
  "LinkedIn": "https://www.linkedin.com/in/username",
  "GitHub": "https://github.com/username",
  "wallet_address": "0x..."
}
\`\`\`

#### 2. Add to JSON File

Open `/data/profiles/celo_builders.json` and add the new builder:

\`\`\`json
[
  {
    "Name": "Existing Builder",
    ...
  },
  {
    "Name": "New Builder",
    "Description": "New builder description",
    ...
  }
]
\`\`\`

#### 3. Validate Data

**Required Fields**:
- ✅ Name (non-empty, not "N/A")
- ✅ wallet_address (valid Celo address)

**Optional Fields**:
- Description (recommended)
- Profile Image URL (recommended)
- Social links (GitHub, LinkedIn, Farcaster)

#### 4. Test Display

1. Restart development server
2. Navigate to Builders category
3. Verify builder appears
4. Check all links work
5. Test donation flow

---

## Best Practices

### Data Quality

**Profile Images**:
- Use high-quality images (minimum 300x300px)
- Prefer square aspect ratio
- Use HTTPS URLs
- Test image loading
- Provide fallback placeholder

**Descriptions**:
- Keep concise (2-3 sentences)
- Highlight key skills
- Mention notable projects
- Use emojis sparingly
- Avoid excessive links

**Wallet Addresses**:
- Verify address is correct
- Use Celo mainnet addresses
- Test with small donation first
- Double-check before publishing

### Social Links

**GitHub**:
- Link to main profile, not specific repo
- Ensure profile is public
- Keep repositories updated

**LinkedIn**:
- Use public profile URL
- Keep profile current
- Professional presentation

**Farcaster**:
- Active account preferred
- Engage with community
- Share project updates

### Ranking System

**Points** (Optional):
- Based on contributions
- Community engagement
- Project impact
- Donation volume

**Rank** (Optional):
- Position in leaderboard
- Updated periodically
- Displayed as badge

---

## API Integration

### Fetching Builder Data

\`\`\`typescript
// Get all builders
const builders = projects.filter(p => p.category === "Builders")

// Get random builder
const randomBuilder = getRandomProfile("Builders")

// Get specific builder
const builder = projects.find(p => p.id === "celo-builder-1")
\`\`\`

### API Endpoint (Future)

\`\`\`typescript
// GET /api/builders
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = searchParams.get('limit')
  const offset = searchParams.get('offset')
  
  const builders = projects.filter(p => p.category === "Builders")
  
  return NextResponse.json({
    builders: builders.slice(offset, offset + limit),
    total: builders.length
  })
}
\`\`\`

---

## Donation Flow

### 1. Builder Selection
- User swipes right or clicks "Like"
- Builder added to cart
- Cart count updated

### 2. Cart Management
- View all selected builders
- Set donation amounts
- Choose stablecoin
- Set confirmation threshold

### 3. Transaction Execution
- Reach threshold (e.g., 10 swipes)
- Batch transaction prepared
- User confirms in wallet
- Transaction executed on Celo
- Confirmation displayed

### 4. Post-Donation
- Update donation stats
- Show success message
- Offer to share
- Continue browsing

---

## Analytics & Metrics

### Builder Metrics

**Engagement**:
- Total likes
- Comment count
- Share count
- Profile views

**Donations**:
- Total amount raised
- Number of donors
- Average donation
- Donation frequency

**Social**:
- GitHub stars
- Farcaster followers
- LinkedIn connections

### Platform Metrics

**Builders Section**:
- Total builders
- Active builders
- New builders (monthly)
- Top builders (by donations)

**User Behavior**:
- Swipe rate (builders)
- Like rate (builders)
- Donation rate (builders)
- Average time per builder

---

## Future Enhancements

### Planned Features

**Builder Profiles**:
- [ ] Detailed builder pages
- [ ] Project portfolios
- [ ] Skills and expertise tags
- [ ] Contribution history
- [ ] Testimonials

**Verification**:
- [ ] GitHub verification
- [ ] LinkedIn verification
- [ ] Self Protocol KYC
- [ ] Builder badges

**Discovery**:
- [ ] Search functionality
- [ ] Filter by skills
- [ ] Sort by metrics
- [ ] Recommended builders

**Engagement**:
- [ ] Builder updates/posts
- [ ] Direct messaging
- [ ] Collaboration requests
- [ ] Milestone tracking

**Gamification**:
- [ ] Builder leaderboard
- [ ] Achievement badges
- [ ] Donation streaks
- [ ] Community challenges

---

## Troubleshooting

### Common Issues

**Builder Not Appearing**:
- Check JSON syntax
- Verify Name field is not empty
- Ensure wallet_address is present
- Restart development server

**Image Not Loading**:
- Verify image URL is accessible
- Check CORS settings
- Use HTTPS URLs
- Test with placeholder

**Social Links Not Working**:
- Verify URL format
- Check for "N/A" values
- Test links manually
- Ensure HTTPS protocol

**Donations Not Working**:
- Verify wallet address format
- Check Celo network connection
- Confirm gas sponsorship
- Review transaction logs

---

## Resources

### Documentation
- [Celo Builders Program](https://celo.org/builders)
- [Thirdweb Wallet Docs](https://portal.thirdweb.com/wallet)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

### Community
- [Celo Discord - Builders Channel](https://discord.gg/celo)
- [GitHub Discussions](https://github.com/ozkite/swipepad_posh-8-w9/discussions)

### Tools
- [Celo Explorer](https://explorer.celo.org)
- [Celo Wallet](https://celowallet.app)
- [Thirdweb Dashboard](https://thirdweb.com/dashboard)

---

**Last Updated**: January 2025
**Maintained By**: SwipePad Team
**Status**: Active Development

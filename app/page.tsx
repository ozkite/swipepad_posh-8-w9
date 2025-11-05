"use client"

import { useState, useEffect } from "react"
import { ToggleMenu } from "@/components/toggle-menu"
import { CategoryMenu } from "@/components/category-menu"
import { ProjectCard } from "@/components/project-card"
import { CategorySection } from "@/components/category-section"
import { Cart } from "@/components/cart"
import { SuccessScreen } from "@/components/success-screen"
import { AmountSelector, type DonationAmount, type StableCoin, type ConfirmSwipes } from "@/components/amount-selector"
import { projects, categories, getRandomProfiles } from "@/lib/data"
import { UserProfile } from "@/components/user-profile"
import { TrendingSection } from "@/components/trending-section"
import { CommunityFunds } from "@/components/community-funds"
import { WeeklyDrop } from "@/components/weekly-drop"
import { BadgeNotification } from "@/components/badge-notification"
import { ProfileQuickView } from "@/components/profile-quick-view"
import { StarryBackground } from "@/components/starry-background"
import { MobileMockup } from "@/components/mobile-mockup"
import { useMobile } from "@/hooks/use-mobile"
import { ProjectRegistrationForm } from "@/components/project-registration-form"
import { EditProfile } from "@/components/edit-profile"
import { ConnectButton, darkTheme, useActiveAccount, useConnect } from "thirdweb/react"
import { client, defaultChain } from "@/lib/thirdweb"
import { inAppWallet, createWallet } from "thirdweb/wallets"
import { executeBatchTransactions, type TransactionItem } from "@/lib/transactions"
import { toast } from "sonner"

const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "discord",
        "telegram",
        "farcaster",
        "email",
        "x",
        "passkey",
        "phone",
        "github",
        "tiktok",
        "line",
        "facebook",
        "apple",
        "guest",
      ],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
]

export default function Home() {
  const account = useActiveAccount()
  const { connect } = useConnect()

  const [viewMode, setViewMode] = useState<"swipe" | "list" | "profile" | "trending">("swipe")
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || "Regeneration")
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [cart, setCart] = useState<Array<{ project: any; amount: number; currency: StableCoin; message?: string }>>([])
  const [showCart, setShowCart] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [donationAmount, setDonationAmount] = useState<DonationAmount | null>(null)
  const [donationCurrency, setDonationCurrency] = useState<StableCoin>("USDT")
  const [confirmSwipes, setConfirmSwipes] = useState<ConfirmSwipes>(20)
  const [showBadgeNotification, setShowBadgeNotification] = useState(false)
  const [currentBadge, setCurrentBadge] = useState("")
  const [swipeCount, setSwipeCount] = useState(0)
  const [showProfileQuickView, setShowProfileQuickView] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [filteredProjects, setFilteredProjects] = useState<typeof projects>([])
  const [isProcessingTransaction, setIsProcessingTransaction] = useState(false)

  const [userStats, setUserStats] = useState({
    totalDonations: 0,
    categoriesSupported: new Set<string>(),
    streak: 0,
    lastDonation: null as Date | null,
  })
  const [userProfile, setUserProfile] = useState({
    name: "MiniPay User",
    image: "/images/lena-profile.jpg",
    farcaster: "",
    lens: "",
    zora: "",
    twitter: "",
    nounsHeld: 2,
    lilNounsHeld: 5,
    totalSwipes: 47,
    projectsReported: 3,
    totalDonated: 125.75,
    hasSeenWelcome: false,
  })
  const [userBalance, setUserBalance] = useState({
    cUSD: 125.75,
    USDT: 0,
    USDC: 0,
  })
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [shownBadges, setShownBadges] = useState<Set<string>>(new Set())

  const recentDonations = cart.slice(0, 5).map((item, index) => ({
    project: item.project,
    amount: item.amount,
    currency: item.currency,
    date: new Date(Date.now() - index * 86400000),
  }))

  const savedProjects = projects.slice(0, 3)

  useEffect(() => {
    const randomized = getRandomProfiles(selectedCategory)
    setFilteredProjects(randomized)
    setCurrentProjectIndex(0)
  }, [selectedCategory])

  useEffect(() => {
    let isMounted = true

    const checkStreak = () => {
      if (!isMounted) return 0
      if (userStats.lastDonation) {
        const lastDonationDate = new Date(userStats.lastDonation)
        const today = new Date()
        const diffTime = Math.abs(today.getTime() - lastDonationDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        if (diffDays <= 1) {
          return userStats.streak
        } else {
          return 0
        }
      }
      return 0
    }

    const checkBadges = () => {
      if (!isMounted) return

      if (userStats.totalDonations === 1 && !shownBadges.has("First Swipe")) {
        setCurrentBadge("First Swipe")
        setShowBadgeNotification(true)
        setShownBadges((prev) => new Set([...prev, "First Swipe"]))
      } else if (checkStreak() === 5 && !shownBadges.has("5-Day Streak")) {
        setCurrentBadge("5-Day Streak")
        setShowBadgeNotification(true)
        setShownBadges((prev) => new Set([...prev, "5-Day Streak"]))
      } else if (userStats.categoriesSupported.size >= 3 && !shownBadges.has("Category Champion")) {
        setCurrentBadge("Category Champion")
        setShowBadgeNotification(true)
        setShownBadges((prev) => new Set([...prev, "Category Champion"]))
      }
    }

    checkBadges()

    return () => {
      isMounted = false
    }
  }, [userStats, shownBadges])

  useEffect(() => {
    if (!account) {
      setUserProfile((prev) => ({ ...prev, hasSeenWelcome: false }))
    }
  }, [account])

  const handleSwipeRight = () => {
    if (donationAmount === null) return

    const project = filteredProjects[currentProjectIndex]

    setUserStats((prev) => {
      const categoriesSupported = new Set(prev.categoriesSupported)
      categoriesSupported.add(project.category)

      return {
        totalDonations: prev.totalDonations + 1,
        categoriesSupported,
        streak: prev.lastDonation ? prev.streak + 1 : 1,
        lastDonation: new Date(),
      }
    })

    setUserProfile((prev) => ({
      ...prev,
      totalSwipes: prev.totalSwipes + 1,
      totalDonated: prev.totalDonated + Number.parseFloat(donationAmount.split(" ")[0]),
    }))

    const newCart = [
      ...cart,
      { project, amount: Number.parseFloat(donationAmount.split(" ")[0]), currency: donationCurrency },
    ]
    setCart(newCart)

    const newSwipeCount = swipeCount + 1
    setSwipeCount(newSwipeCount)

    if (newSwipeCount >= confirmSwipes) {
      handleConfirmSwipes(newCart)
      setSwipeCount(0)
    }

    if (currentProjectIndex < filteredProjects.length - 1) {
      setCurrentProjectIndex(currentProjectIndex + 1)
    } else {
      setCurrentProjectIndex(0)
    }
  }

  const handleSwipeLeft = () => {
    setUserProfile((prev) => ({
      ...prev,
      totalSwipes: prev.totalSwipes + 1,
    }))

    if (currentProjectIndex < filteredProjects.length - 1) {
      setCurrentProjectIndex(currentProjectIndex + 1)
    } else {
      setCurrentProjectIndex(0)
    }
  }

  const handleAmountSelect = (amount: DonationAmount, currency: StableCoin, swipes: ConfirmSwipes) => {
    setDonationAmount(amount)
    setDonationCurrency(currency)
    setConfirmSwipes(swipes)
    setSwipeCount(0)
  }

  const handleConfirmSwipes = async (cartItems: typeof cart) => {
    if (!account) {
      toast.error("Please connect your wallet to complete transactions")
      return
    }

    if (cartItems.length === 0) {
      return
    }

    setIsProcessingTransaction(true)

    try {
      const transactions: TransactionItem[] = cartItems.map((item) => ({
        recipientAddress: item.project.wallet_address,
        amount: item.amount,
        currency: item.currency,
        projectName: item.project.name,
      }))

      console.log("[v0] Processing batch transactions:", transactions)

      const results = await executeBatchTransactions(account, transactions)

      const successCount = results.filter((r) => r.success).length
      const failCount = results.filter((r) => !r.success).length

      if (successCount > 0) {
        toast.success(`Successfully sent ${successCount} donation${successCount > 1 ? "s" : ""}!`)
        setShowSuccess(true)
        setCart([])
      }

      if (failCount > 0) {
        toast.error(`${failCount} transaction${failCount > 1 ? "s" : ""} failed. Please try again.`)
      }
    } catch (error) {
      console.error("[v0] Transaction error:", error)
      toast.error("Transaction failed. Please try again.")
    } finally {
      setIsProcessingTransaction(false)
    }
  }

  const handleCheckout = async () => {
    setShowCart(false)

    await handleConfirmSwipes(cart)

    const uniqueCategories = new Set<string>()
    cart.forEach((item) => uniqueCategories.add(item.project.category))

    setUserStats((prev) => ({
      totalDonations: prev.totalDonations + cart.length,
      categoriesSupported: new Set([...prev.categoriesSupported, ...uniqueCategories]),
      streak: prev.lastDonation ? prev.streak + 1 : 1,
      lastDonation: new Date(),
    }))
  }

  const handleCategoryProjectDonate = (project: any, amount = 5) => {
    setUserStats((prev) => {
      const categoriesSupported = new Set(prev.categoriesSupported)
      categoriesSupported.add(project.category)

      return {
        totalDonations: prev.totalDonations + 1,
        categoriesSupported,
        streak: prev.lastDonation ? prev.streak + 1 : 1,
        lastDonation: new Date(),
      }
    })

    setCart([...cart, { project, amount, currency: "USDT" }])
    setShowSuccess(true)
  }

  const handleProjectBoost = (project: any, amount: number) => {
    console.log(`Boosting ${project.name} with $${amount}`)
    alert(`Successfully boosted ${project.name} with $${amount}!`)
  }

  const handleRegisterProject = () => {
    setShowRegistrationForm(true)
  }

  const handleRegistrationSubmit = (formData: any) => {
    console.log("Project registration submitted:", formData)
    alert("Thank you! Your project registration has been submitted for review.")
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
  }

  const handleProfileSave = (profileData: any) => {
    setUserProfile((prev) => ({
      ...prev,
      ...profileData,
    }))
  }

  const projectsByCategory = categories.reduce(
    (acc, category) => {
      const categoryProjects = projects.filter((project) => project.category === category)
      if (categoryProjects.length > 0) {
        acc[category] = categoryProjects
      }
      return acc
    },
    {} as Record<string, typeof projects>,
  )

  const AppContent = () => (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {!account || !userProfile.hasSeenWelcome ? (
        <div className="flex flex-col items-center justify-center h-full px-6 relative">
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
            <button className="flex items-center justify-center w-12 h-12 rounded-full">
              <img
                src={userProfile.image || "/placeholder.svg"}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover"
              />
            </button>
            <div className="flex gap-3">
              <button className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700">
                <TrendingIcon />
              </button>
              <button className="flex items-center justify-center w-12 h-12 rounded-full bg-[#677FEB]">
                <CartIcon />
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center max-w-sm mx-auto text-center">
            <h1 className="text-5xl font-bold mb-8 text-white" style={{ fontFamily: "Pixelify Sans, monospace" }}>
              SwipePad
            </h1>
            <h2 className="text-2xl font-bold mb-4 text-white">Welcome to SwipePad!</h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Support regenerative projects with micro-donations through simple swipes on the Celo blockchain.
            </p>

            <div className="w-full mb-4">
              <ConnectButton
                client={client}
                chain={defaultChain}
                connectModal={{ size: "compact" }}
                theme={darkTheme({
                  colors: {
                    accentText: "hsl(51, 100%, 45%)",
                    accentButtonBg: "hsl(51, 100%, 45%)",
                    accentButtonText: "hsl(0, 0%, 0%)",
                    borderColor: "hsl(221, 39%, 11%)",
                    primaryButtonBg: "hsl(51, 100%, 45%)",
                    primaryButtonText: "hsl(0, 0%, 0%)",
                  },
                })}
                wallets={wallets}
                connectButton={{
                  label: "Enter MiniApp",
                  style: {
                    backgroundColor: "hsl(51, 100%, 45%)",
                    color: "hsl(0, 0%, 0%)",
                    fontWeight: "bold",
                    borderRadius: "0.75rem",
                    padding: "1rem 1.5rem",
                    fontSize: "1.125rem",
                    width: "100%",
                  },
                }}
                onConnect={(wallet) => {
                  console.log("[v0] Wallet connected:", wallet.getAccount()?.address)
                  setUserProfile((prev) => ({ ...prev, hasSeenWelcome: true }))
                  toast.success("Wallet connected successfully!")
                }}
              />
            </div>

            <p className="text-xs text-gray-400 mt-6 leading-relaxed">
              By connecting, you agree to our Terms of Service and Privacy Policy. Your funds remain secure in your
              wallet at all times.
            </p>
          </div>

          <button
            onClick={handleRegisterProject}
            className="absolute bottom-6 right-6 flex items-center justify-center w-14 h-14 rounded-full bg-[#677FEB] text-white hover:bg-[#5A6FD3] transition-colors shadow-lg"
            title="Register Project"
          >
            <RegisterIcon />
          </button>
        </div>
      ) : (
        <>
          <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
            <div className="flex flex-col items-center py-2">
              <div className="flex items-center justify-between w-full mb-2 px-6">
                <button
                  className="flex items-center justify-center w-12 h-12 rounded-full relative"
                  onClick={() => setShowEditProfile(true)}
                >
                  <img
                    src={userProfile.image || "/placeholder.svg"}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </button>

                <h1
                  className="text-lg font-bold text-center text-white"
                  style={{ fontFamily: "Pixelify Sans, monospace" }}
                >
                  SwipePad
                </h1>

                <button
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-[#677FEB] text-white hover:bg-[#5A6FD3] transition-colors"
                  onClick={handleRegisterProject}
                  title="Register Project"
                >
                  <RegisterIcon />
                </button>
              </div>

              {donationAmount && (
                <div className="bg-transparent rounded-full px-4 py-0.5 mb-2 flex items-center">
                  <span className="text-[#FFD600] font-bold text-sm mr-1">{userBalance[donationCurrency]}</span>
                  <span className="text-gray-400 text-xs mr-1">{donationCurrency}</span>
                  <button className="text-gray-400 hover:text-white">
                    <ChevronDownIcon />
                  </button>
                </div>
              )}

              <div className="flex justify-between w-full px-6 space-x-2">
                <button
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700"
                  onClick={() => setViewMode("trending")}
                >
                  <TrendingIcon />
                </button>
                <button
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-[#677FEB] relative"
                  onClick={() => setShowCart(true)}
                >
                  <CartIcon />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#FFD600] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {viewMode === "profile" ? (
              <UserProfile stats={userStats} onBack={() => setViewMode("swipe")} />
            ) : viewMode === "trending" ? (
              <div className="px-6 py-6">
                <TrendingSection onDonate={handleCategoryProjectDonate} />
                <CommunityFunds onDonate={handleCategoryProjectDonate} />
                <WeeklyDrop onDonate={handleCategoryProjectDonate} />
                <button
                  onClick={() => setViewMode("swipe")}
                  className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors mt-6"
                >
                  Back to Swipe
                </button>
              </div>
            ) : (
              <div className="py-6">
                <ToggleMenu
                  viewMode={viewMode === "swipe" ? "swipe" : "list"}
                  setViewMode={(mode) => setViewMode(mode)}
                />

                {viewMode === "swipe" ? (
                  <>
                    {donationAmount === null ? (
                      <AmountSelector onSelect={handleAmountSelect} />
                    ) : (
                      <>
                        <CategoryMenu
                          selectedCategory={selectedCategory}
                          setSelectedCategory={setSelectedCategory}
                          setCurrentProjectIndex={() => setCurrentProjectIndex(0)}
                        />

                        <div className="mb-2 px-6">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-sm text-gray-300">Donating: </span>
                              <span className="font-bold text-[#FFD600]">
                                {donationAmount} {donationCurrency}
                              </span>
                            </div>
                            <button
                              onClick={() => setDonationAmount(null)}
                              className="text-sm text-gray-300 hover:text-white underline"
                            >
                              Change
                            </button>
                          </div>
                          <div className="mt-2 bg-gray-800 rounded-lg p-1.5">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Swipes until confirmation:</span>
                              <span>{confirmSwipes - swipeCount} more</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-[#FFD600] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(swipeCount / confirmSwipes) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="px-6 pb-4">
                          {filteredProjects.length > 0 && (
                            <ProjectCard
                              project={filteredProjects[currentProjectIndex]}
                              onSwipeLeft={handleSwipeLeft}
                              onSwipeRight={handleSwipeRight}
                              viewMode="swipe"
                              donationAmount={donationAmount}
                              donationCurrency={donationCurrency}
                              onBoost={(amount) => handleProjectBoost(filteredProjects[currentProjectIndex], amount)}
                            />
                          )}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="mt-6">
                    {Object.entries(projectsByCategory).map(([category, categoryProjects]) => (
                      <CategorySection
                        key={category}
                        category={category}
                        projects={categoryProjects}
                        onDonate={handleCategoryProjectDonate}
                        onBoost={handleProjectBoost}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {isProcessingTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD600] mx-auto mb-4"></div>
            <p className="text-white font-bold">Processing transactions...</p>
            <p className="text-gray-400 text-sm mt-2">Please confirm in your wallet</p>
          </div>
        </div>
      )}

      {showCart && <Cart items={cart} onClose={() => setShowCart(false)} onCheckout={handleCheckout} />}

      {showSuccess && (
        <SuccessScreen
          onClose={handleSuccessClose}
          categories={[...new Set(cart.map((item) => item.project.category))]}
        />
      )}

      {showBadgeNotification && (
        <BadgeNotification badge={currentBadge} onClose={() => setShowBadgeNotification(false)} />
      )}

      <ProfileQuickView
        isOpen={showProfileQuickView}
        onClose={() => setShowProfileQuickView(false)}
        userStats={userStats}
        recentDonations={recentDonations}
        savedProjects={savedProjects}
      />

      <EditProfile
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onSave={handleProfileSave}
        currentProfile={userProfile}
      />

      <ProjectRegistrationForm
        isOpen={showRegistrationForm}
        onClose={() => setShowRegistrationForm(false)}
        onSubmit={handleRegistrationSubmit}
      />
    </div>
  )

  return (
    <main className="flex min-h-screen flex-col items-center text-white relative overflow-hidden">
      <StarryBackground />

      {useMobile() ? (
        <div className="relative z-10 w-full h-screen">
          <AppContent />
        </div>
      ) : (
        <MobileMockup>
          <AppContent />
        </MobileMockup>
      )}
    </main>
  )
}

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}

function TrendingIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}

function RegisterIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

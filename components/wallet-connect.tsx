"use client"
import { useEffect, useState } from "react"
import { useActiveAccount } from "thirdweb/react"
import { client, wallets, customTheme, celoMainnet } from "@/components/wallet/WalletConnect"
import { ConnectButton } from "thirdweb/react"
import { ProjectRegistrationForm } from "@/components/project-registration-form"

interface WalletConnectProps {
  onConnect: () => void
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
  const account = useActiveAccount()
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [showDemoModal, setShowDemoModal] = useState(false)

  useEffect(() => {
    if (account) {
      console.log("[v0] Wallet connected:", account.address)
      // Don't auto-call onConnect - let the user click the button
    }
  }, [account])

  const handleConnect = () => {
    if (account) {
      onConnect()
    }
  }

  const handleDemoConnect = () => {
    setShowDemoModal(true)
  }

  const handleDemoConfirm = () => {
    setShowDemoModal(false)
    onConnect()
  }

  const handleRegistrationSubmit = (formData: any) => {
    console.log("Project registration submitted:", formData)
    alert("Thank you! Your project registration has been submitted for review.")
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center py-12 px-6 h-full">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between w-full mb-8 px-2">
          <button className="flex items-center justify-center w-12 h-12 rounded-full relative">
            <img src="/images/lena-profile.jpg" alt="Profile" className="w-12 h-12 rounded-full object-cover" />
          </button>

          <div className="flex-1"></div>

          <div className="flex space-x-2">
            <button className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700">
              <TrendingIcon />
            </button>
            <button className="flex items-center justify-center w-12 h-12 rounded-full bg-[#677FEB]">
              <CartIcon />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="mb-8 flex justify-center w-full">
            <h1 className="text-4xl font-bold text-center" style={{ fontFamily: "Pixelify Sans, monospace" }}>
              SwipePad
            </h1>
          </div>

          <h2 className="text-2xl font-bold mb-2 text-center">Welcome to SwipePad!</h2>
          <p className="text-gray-300 text-center mb-8 max-w-sm">
            Support regenerative projects with micro-donations through simple swipes on the Celo blockchain.
          </p>

          <div className="w-full flex justify-center px-6">
            <div className="w-full max-w-sm">
              {account ? (
                <button
                  onClick={handleConnect}
                  className="w-full bg-[#FFD600] hover:bg-[#E6C200] text-black font-bold py-4 px-6 rounded-xl transition-colors"
                >
                  Enter MiniApp
                </button>
              ) : (
                <div className="w-full">
                  <ConnectButton
                    client={client}
                    wallets={wallets}
                    chain={celoMainnet}
                    connectButton={{
                      label: "Enter MiniApp",
                      className:
                        "!w-full !bg-[#FFD600] hover:!bg-[#E6C200] !text-black !font-bold !py-4 !px-6 !rounded-xl !transition-colors",
                    }}
                    connectModal={{
                      size: "compact",
                      title: "Sign in to SwipePad",
                      showThirdwebBranding: false,
                    }}
                    theme={customTheme}
                    onConnect={handleConnect}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              By connecting, you agree to our Terms of Service and Privacy Policy. Your funds remain secure in your
              wallet at all times.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowRegistrationForm(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#677FEB] hover:bg-[#5A6FD3] text-white rounded-full shadow-lg transition-all hover:scale-110 flex items-center justify-center z-50"
          title="Register Your Project"
        >
          <PlusIcon />
        </button>
      </div>

      {showDemoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f2e] rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">Demo Mode</h3>
            <p className="text-gray-300 mb-6">
              This is a demo version. No real wallet connection or social login is required. Click continue to explore
              the app.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDemoModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDemoConfirm}
                className="flex-1 bg-[#FFD600] hover:bg-[#E6C200] text-black font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <ProjectRegistrationForm
        isOpen={showRegistrationForm}
        onClose={() => setShowRegistrationForm(false)}
        onSubmit={handleRegistrationSubmit}
      />
    </>
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

function PlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}

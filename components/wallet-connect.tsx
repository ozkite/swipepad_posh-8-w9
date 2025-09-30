"use client"

import { ThirdwebConnect } from "./thirdweb-connect"

interface WalletConnectProps {
  onConnect: () => void
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
  return (
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
      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full">
        <div className="mb-6 flex flex-col items-center w-full">
          <h1 className="text-4xl font-bold text-center mb-4" style={{ fontFamily: "Pixelify Sans, monospace" }}>
            SwipePad
          </h1>
          <h2 className="text-2xl font-bold mb-3 text-center">Welcome to SwipePad!</h2>
          <p className="text-gray-300 text-center mb-6 max-w-sm text-sm">
            Support regenerative projects with micro-donations through simple swipes on the Celo blockchain.
          </p>
        </div>

        <div className="w-full max-w-sm">
          <ThirdwebConnect />
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            By connecting, you agree to our Terms of Service and Privacy Policy. Your funds remain secure in your wallet
            at all times.
          </p>
        </div>
      </div>
    </div>
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

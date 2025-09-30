"use client"

import { useState } from "react"

export type DonationAmount = "10 cents" | "50 cents" | "1 fiat"
export type StableCoin =
  | "cUSD"
  | "cEUR"
  | "cGBP"
  | "cAUD"
  | "cCHF"
  | "cCAD"
  | "cKES"
  | "cREAL"
  | "cZAR"
  | "cCOL"
  | "cJPY"
export type ConfirmSwipes = 5 | 10 | 20

interface AmountSelectorProps {
  onSelect: (amount: DonationAmount, currency: StableCoin, swipes: ConfirmSwipes) => void
}

export function AmountSelector({ onSelect }: AmountSelectorProps) {
  const [selectedAmount, setSelectedAmount] = useState<DonationAmount>("10 cents")
  const [selectedCurrency, setSelectedCurrency] = useState<StableCoin>("cUSD")
  const [selectedSwipes, setSelectedSwipes] = useState<ConfirmSwipes>(5)

  const amounts: DonationAmount[] = ["10 cents", "50 cents", "1 fiat"]
  const currencies: StableCoin[] = ["cUSD", "cEUR", "cGBP", "cAUD", "cCHF", "cCAD", "cKES", "cREAL", "cZAR"]
  const swipeOptions: ConfirmSwipes[] = [5, 10, 20]

  const handleConfirm = () => {
    onSelect(selectedAmount, selectedCurrency, selectedSwipes)
  }

  return (
    <div className="px-6">
      <h2 className="text-xl font-bold mb-6 text-white">Select Donation Amount</h2>

      {/* Amount Selection */}
      <div className="mb-6">
        <h3 className="text-base font-medium mb-3 text-gray-300">Amount per swipe:</h3>
        <div className="grid grid-cols-3 gap-3">
          {amounts.map((amount) => (
            <button
              key={amount}
              onClick={() => setSelectedAmount(amount)}
              className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                selectedAmount === amount ? "bg-[#FFD600] text-black" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {amount}
            </button>
          ))}
        </div>
      </div>

      {/* Stablecoin Selection */}
      <div className="mb-6">
        <h3 className="text-base font-medium mb-3 text-gray-300">Stablecoin:</h3>
        <div className="grid grid-cols-3 gap-3">
          {currencies.map((currency) => (
            <button
              key={currency}
              onClick={() => setSelectedCurrency(currency)}
              className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                selectedCurrency === currency
                  ? "bg-[#FFD600] text-black"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {currency}
            </button>
          ))}
        </div>
      </div>

      {/* Confirm Swipes Selection */}
      <div className="mb-8">
        <h3 className="text-base font-medium mb-3 text-gray-300">Confirm swipes:</h3>
        <div className="grid grid-cols-3 gap-3">
          {swipeOptions.map((swipes) => (
            <button
              key={swipes}
              onClick={() => setSelectedSwipes(swipes)}
              className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                selectedSwipes === swipes ? "bg-[#FFD600] text-black" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {swipes}
            </button>
          ))}
        </div>
      </div>

      {/* Start Swiping Button */}
      <button
        onClick={handleConfirm}
        className="w-full py-4 bg-[#FFD600] hover:bg-[#E6C200] text-black font-bold rounded-lg transition-colors"
      >
        Start Swiping
      </button>
    </div>
  )
}

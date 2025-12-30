"use client"

import { useState } from "react"
import { X, CheckCircle, User } from "lucide-react"

interface EditProfileProps {
  isOpen: boolean
  onClose: () => void
  onSave: (profileData: any) => void
  currentProfile: {
    name: string
    image: string
    farcaster?: string
    twitter?: string
    zora?: string
    discord?: string
    lens?: string
    ens?: string
    poaps: number
    lilNounsHeld: number
    nounsHeld: number
    paragraphs: number
    totalSwipes: number
    projectsReported: number
    totalDonated: number
  }
}

export function EditProfile({ isOpen, onClose, onSave, currentProfile }: EditProfileProps) {
  const [formData, setFormData] = useState({
    name: currentProfile.name || "MiniPay User",
    image: currentProfile.image || "",
    bio: "",
    farcaster: currentProfile.farcaster || "",
    twitter: currentProfile.twitter || "",
    zora: currentProfile.zora || "",
    discord: currentProfile.discord || "",
    lens: currentProfile.lens || "",
    ens: currentProfile.ens || "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1F2732] rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-[#1F2732] p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Edit Profile</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center border-4 border-gray-600">
              <User className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-sm text-gray-400 mt-2">Profile picture from connected wallet</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Display Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-3 text-white focus:border-[#FFD600] focus:outline-none"
              placeholder="Enter your display name"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-3 text-white focus:border-[#FFD600] focus:outline-none"
              placeholder="Tell us about yourself"
              rows={3}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Social Profiles</h3>

            {/* Farcaster */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 flex items-center">
                <span className="w-4 h-4 bg-purple-500 rounded mr-2"></span>
                Farcaster
              </label>
              <input
                type="text"
                value={formData.farcaster}
                onChange={(e) => handleInputChange("farcaster", e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-3 text-white focus:border-[#FFD600] focus:outline-none"
                placeholder="@username"
              />
            </div>

            {/* Twitter */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 flex items-center">
                <span className="w-4 h-4 bg-black border border-gray-600 rounded mr-2"></span>
                Twitter
              </label>
              <input
                type="text"
                value={formData.twitter}
                onChange={(e) => handleInputChange("twitter", e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-3 text-white focus:border-[#FFD600] focus:outline-none"
                placeholder="@username"
              />
            </div>

            {/* Zora */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 flex items-center">
                <span className="w-4 h-4 bg-blue-500 rounded mr-2"></span>
                Zora
              </label>
              <input
                type="text"
                value={formData.zora}
                onChange={(e) => handleInputChange("zora", e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-3 text-white focus:border-[#FFD600] focus:outline-none"
                placeholder="username"
              />
            </div>

            {/* Discord */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 flex items-center">
                <span className="w-4 h-4 bg-indigo-500 rounded mr-2"></span>
                Discord
              </label>
              <input
                type="text"
                value={formData.discord}
                onChange={(e) => handleInputChange("discord", e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-3 text-white focus:border-[#FFD600] focus:outline-none"
                placeholder="username"
              />
            </div>

            {/* Lens / Hey */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded mr-2"></span>
                Lens / Hey
              </label>
              <input
                type="text"
                value={formData.lens}
                onChange={(e) => handleInputChange("lens", e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-3 text-white focus:border-[#FFD600] focus:outline-none"
                placeholder="username"
              />
            </div>

            {/* ENS */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 flex items-center">
                <span className="w-4 h-4 bg-sky-400 rounded mr-2"></span>
                ENS
              </label>
              <input
                type="text"
                value={formData.ens}
                onChange={(e) => handleInputChange("ens", e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-3 text-white focus:border-[#FFD600] focus:outline-none"
                placeholder="username.eth"
              />
            </div>
          </div>

          {/* Self ID Check */}
          <div>
            <h3 className="text-lg font-medium mb-4">Self ID Check</h3>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <div>
                    <p className="font-medium">Verify your identity</p>
                    <p className="text-sm text-gray-400">Gain 100 points to your profile</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-[#FFD600] hover:bg-[#E6C200] text-black text-sm font-medium rounded-lg transition-colors">
                  Verify
                </button>
              </div>
            </div>
          </div>

          {/* Your Stats */}
          <div>
            <h3 className="text-lg font-medium mb-4">Your Stats</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-800 p-3 rounded-lg text-center">
                <p className="text-xl font-bold text-[#FFD600]">0</p>
                <p className="text-xs text-gray-400">Total Swipes</p>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg text-center">
                <p className="text-xl font-bold text-[#FFD600]">0</p>
                <p className="text-xs text-gray-400">Reports Made</p>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg text-center">
                <p className="text-xl font-bold text-[#FFD600]">$0.00</p>
                <p className="text-xs text-gray-400">Total Donated</p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-[#FFD600] hover:bg-[#E6C200] text-black font-medium rounded-lg transition-colors"
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

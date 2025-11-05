kkimport { useState } from 'react';
import { useActiveAccount } from "thirdweb/react";
import { executeDonation } from './donate';

export function useDonation() {
  const account = useActiveAccount();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<any>(null);

  const donate = async (recipientAddress: string, amount: string) => {
    if (!account) {
      throw new Error("Wallet not connected");
    }

    setIsProcessing(true);
    
    try {
      const result = await executeDonation(account, recipientAddress, amount);
      setLastTransaction(result);
      return result;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    donate,
    isProcessing,
    lastTransaction,
    isConnected: !!account,
  };
}
```

**Save** (Ctrl+X, Y, Enter)

---

### **Tell V0 This:**
```
I want real donations on each swipe using Thirdweb.

My Thirdweb Client ID: 65f78d52b532e7f96a5864016ed74183

Import and use the useDonation hook:
import { useDonation } from '@/lib/donations/useDonation';

In the swipe component:
const { donate, isProcessing } = useDonation();

When user swipes right:
1. Show confirmation: "Donate [amount] cUSD to [project]?"
2. On confirm, call: await donate(project.wallet, donationAmount)
3. Show loading state while isProcessing
4. On success, show "Donation sent! 🎉"
5. Add to cart/history with transaction hash

Handle errors gracefully with try-catch
Show transaction hash as link to Celo explorer

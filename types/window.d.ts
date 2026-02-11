// Extends the Window.ethereum and Window.solana types declared in
// features/wallet/components/WalletConnectionButton.tsx with additional
// methods needed by the donation flow.
//
// The base declarations (ethereum?.request, solana?.connect, isMetaMask, isPhantom)
// are already provided by WalletConnectionButton.tsx's declare global block.
// This file adds the extra members we need without conflicting.

export {}

declare global {
  interface PhantomSolanaProvider {
    connect: () => Promise<{ publicKey: { toString: () => string } }>
    isPhantom?: boolean
    disconnect?: () => Promise<void>
    signAndSendTransaction?: (transaction: unknown) => Promise<{ signature: string }>
    publicKey?: { toString: () => string } | null
  }

  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<string[]>
      isMetaMask?: boolean
      on?: (event: string, handler: (...args: unknown[]) => void) => void
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void
    }
    solana?: PhantomSolanaProvider
    phantom?: {
      solana?: PhantomSolanaProvider
    }
  }
}

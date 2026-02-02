'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Wallet, Lightning } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { WalletProvider, WalletRequest } from '@/lib/backend-types'
import { useCreateWallet } from '../hooks/useWallets'
import Image from 'next/image'

interface WalletConnectionButtonProps {
  provider: WalletProvider
  onSuccess?: () => void
  onError?: (error: Error) => void
  disabled?: boolean
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<string[]>
      isMetaMask?: boolean
    }
    solana?: {
      connect: () => Promise<{ publicKey: { toString: () => string } }>
      isPhantom?: boolean
    }
  }
}

export function WalletConnectionButton({
  provider,
  onSuccess,
  onError,
  disabled = false,
}: WalletConnectionButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const createWallet = useCreateWallet()

  const getProviderConfig = (p: WalletProvider) => {
    switch (p) {
      case 'metamask':
        return {
          label: 'MetaMask',
          icon: '/icons/metamask.png',
          color: 'bg-[#F6851B]/10 hover:bg-[#F6851B]/20 text-[#F6851B]',
          borderColor: 'border-[#F6851B]/30',
        }
      case 'phantom':
        return {
          label: 'Phantom',
          icon: '/icons/phantom.png',
          color: 'bg-[#AB9FF2]/10 hover:bg-[#AB9FF2]/20 text-[#AB9FF2]',
          borderColor: 'border-[#AB9FF2]/30',
        }
    }
  }

  const connectMetaMask = async (): Promise<string> => {
    if (!window.ethereum?.isMetaMask) {
      throw new Error('MetaMask is not installed. Please install MetaMask extension.')
    }

    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found. Please connect your MetaMask wallet.')
    }

    return accounts[0]
  }

  const connectPhantom = async (): Promise<string> => {
    if (!window.solana?.isPhantom) {
      throw new Error('Phantom is not installed. Please install Phantom extension.')
    }

    const response = await window.solana.connect()
    return response.publicKey.toString()
  }

  const handleConnect = useCallback(async () => {
    setIsConnecting(true)

    try {
      let walletAddress: string

      if (provider === 'metamask') {
        walletAddress = await connectMetaMask()
      } else if (provider === 'phantom') {
        walletAddress = await connectPhantom()
      } else {
        throw new Error(`Unsupported wallet provider: ${provider}`)
      }

      // Create wallet in backend
      const request: WalletRequest = {
        wallet_provider: provider,
        hash: walletAddress,
      }

      await createWallet.mutateAsync(request)
      onSuccess?.()
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to connect wallet')
      console.error('Wallet connection error:', err)
      onError?.(err)
    } finally {
      setIsConnecting(false)
    }
  }, [provider, createWallet, onSuccess, onError])

  const config = getProviderConfig(provider)
  const isPending = isConnecting || createWallet.isPending

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: disabled || isPending ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isPending ? 1 : 0.98 }}
    >
      <Button
        onClick={handleConnect}
        disabled={disabled || isPending}
        variant="outline"
        className={`
          w-full flex items-center justify-center gap-3 py-6 px-4
          border-2 ${config.borderColor}
          ${config.color}
          transition-all duration-200
        `}
      >
        {isPending ? (
          <>
            <Lightning size={20} weight="duotone" className="animate-pulse" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <Image
              src={config.icon}
              alt={config.label}
              width={24}
              height={24}
              className="flex-shrink-0"
            />
            <span className="font-medium">Connect {config.label}</span>
          </>
        )}
      </Button>
    </motion.div>
  )
}

interface WalletConnectionPanelProps {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function WalletConnectionPanel({ onSuccess, onError }: WalletConnectionPanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Wallet size={24} weight="duotone" className="text-cyber-mint-600" />
        <h3 className="text-lg font-semibold text-electric-slate-900">Connect Wallet</h3>
      </div>

      <p className="text-sm text-electric-slate-600 mb-4">
        Connect your crypto wallet to receive donations. We support MetaMask (Ethereum) and Phantom (Solana).
      </p>

      <div className="grid gap-3">
        <WalletConnectionButton
          provider="metamask"
          onSuccess={onSuccess}
          onError={onError}
        />
        <WalletConnectionButton
          provider="phantom"
          onSuccess={onSuccess}
          onError={onError}
        />
      </div>
    </div>
  )
}

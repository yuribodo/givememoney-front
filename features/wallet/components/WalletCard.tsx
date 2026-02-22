'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, Trash, Copy, Check } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { BackendWallet } from '@/lib/backend-types'
import { useDeleteWallet } from '../hooks/useWallets'
import Image from 'next/image'

interface WalletCardProps {
  wallet: BackendWallet
  onDisconnect?: () => void
}

export function WalletCard({ wallet, onDisconnect }: WalletCardProps) {
  const [copied, setCopied] = useState(false)
  const deleteWallet = useDeleteWallet()

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'metamask':
        return '/icons/ethereum.png'
      case 'phantom':
        return '/icons/solana.png'
      default:
        return null
    }
  }

  const getProviderLabel = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'metamask':
        return 'MetaMask'
      case 'phantom':
        return 'Phantom'
      default:
        return provider
    }
  }

  const truncateHash = (hash: string) => {
    if (hash.length <= 12) return hash
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(wallet.wallet_address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDisconnect = async () => {
    if (confirm('Are you sure you want to disconnect this wallet?')) {
      try {
        await deleteWallet.mutateAsync(wallet.id)
        onDisconnect?.()
      } catch (error) {
        console.error('Failed to disconnect wallet:', error)
      }
    }
  }

  const providerIcon = getProviderIcon(wallet.wallet_provider)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center justify-between p-4 bg-white border border-electric-slate-200 rounded-lg hover:border-electric-slate-300 transition-colors"
    >
      <div className="flex items-center gap-3">
        {/* Provider Icon */}
        <div className="w-10 h-10 rounded-full bg-electric-slate-50 flex items-center justify-center">
          {providerIcon ? (
            <Image
              src={providerIcon}
              alt={wallet.wallet_provider}
              width={24}
              height={24}
            />
          ) : (
            <Wallet size={24} className="text-electric-slate-600" weight="duotone" />
          )}
        </div>

        {/* Wallet Info */}
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-electric-slate-900">
              {getProviderLabel(wallet.wallet_provider)}
            </span>
            <span className="px-2 py-0.5 text-xs bg-cyber-mint-100 text-cyber-mint-700 rounded-full">
              Connected
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <code className="text-sm text-electric-slate-600 font-mono">
              {truncateHash(wallet.wallet_address)}
            </code>
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-electric-slate-100 rounded transition-colors"
              title="Copy address"
            >
              {copied ? (
                <Check size={14} className="text-cyber-mint-600" />
              ) : (
                <Copy size={14} className="text-electric-slate-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDisconnect}
        disabled={deleteWallet.isPending}
        className="text-electric-slate-500 hover:text-error-rose hover:bg-error-rose/10"
      >
        <Trash size={18} weight="duotone" />
      </Button>
    </motion.div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useWalletConnector } from './WalletConnector'
import { useSubmitDonation } from '../hooks/useDonation'
import { useCryptoPrice } from '../hooks/useCryptoPrice'
import { PublicWallet } from '../services/donation'
import { formatCurrency, formatCrypto } from '@/lib/format'

type DonationState = 'form' | 'connecting' | 'confirming' | 'success' | 'error'

const PRESET_AMOUNTS = [1, 5, 10, 25]

interface DonationFormProps {
  wallet: PublicWallet
}

export function DonationForm({ wallet }: DonationFormProps) {
  const [usdAmount, setUsdAmount] = useState('')
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [state, setState] = useState<DonationState>('form')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [donationError, setDonationError] = useState<string | null>(null)

  const {
    connect,
    sendTransaction,
    connectedAddress,
    isConnecting,
    isConfirming,
    error: walletError,
  } = useWalletConnector({
    walletProvider: wallet.wallet_provider,
    destinationAddress: wallet.wallet_address,
  })

  const submitDonation = useSubmitDonation()
  const { data: prices, isLoading: pricesLoading } = useCryptoPrice()

  const currencyLabel = wallet.wallet_provider === 'metamask' ? 'ETH' : 'SOL'
  const walletLabel = wallet.wallet_provider === 'metamask' ? 'MetaMask' : 'Phantom'
  const explorerUrl = wallet.wallet_provider === 'metamask'
    ? `https://etherscan.io/tx/${txHash}`
    : `https://solscan.io/tx/${txHash}`

  const cryptoPrice = useMemo(() => {
    if (!prices) return null
    return wallet.wallet_provider === 'metamask'
      ? prices.ethereum.usd
      : prices.solana.usd
  }, [prices, wallet.wallet_provider])

  const cryptoAmount = useMemo(() => {
    const usd = parseFloat(usdAmount)
    if (!usd || !cryptoPrice) return null
    return usd / cryptoPrice
  }, [usdAmount, cryptoPrice])

  const handlePresetClick = (usd: number) => {
    setUsdAmount(usd.toString())
    setSelectedPreset(usd)
    setDonationError(null)
  }

  const handleUsdChange = (value: string) => {
    setUsdAmount(value)
    setSelectedPreset(null)
    setDonationError(null)
  }

  const handleConnect = async () => {
    setState('connecting')
    try {
      const address = await connect()
      if (address) {
        setState('form')
      } else {
        setState('error')
      }
    } catch {
      setState('error')
    }
  }

  const handleSend = async () => {
    if (!cryptoAmount || cryptoAmount <= 0) {
      setDonationError('Please enter a valid amount')
      return
    }

    setState('confirming')
    setDonationError(null)

    let result
    try {
      result = await sendTransaction(cryptoAmount)
    } catch {
      setState('error')
      return
    }
    if (!result) {
      setState('error')
      return
    }

    setTxHash(result.txHash)

    try {
      await submitDonation.mutateAsync({
        walletId: wallet.id,
        data: {
          amount: cryptoAmount,
          message: message || undefined,
          tx_hash: result.txHash,
          address_from: result.fromAddress,
        },
      })
      setState('success')
    } catch {
      // On-chain tx succeeded but backend recording failed
      setState('success')
      setDonationError('Transaction sent on-chain, but we could not record it. Please contact support with your tx hash.')
    }
  }

  if (state === 'success' && txHash) {
    return (
      <Card className="border border-electric-slate-200">
        <CardContent className="p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-cyber-mint-50 border border-cyber-mint-200 flex items-center justify-center mx-auto">
            <span className="text-cyber-mint-600 text-xl">&#10003;</span>
          </div>
          <h2 className="text-2xl font-bold text-electric-slate-900">Donation Sent!</h2>
          <p className="text-electric-slate-600">
            You sent {formatCurrency(parseFloat(usdAmount))} ({cryptoAmount ? formatCrypto(cryptoAmount, currencyLabel as 'ETH' | 'SOL') : ''})
          </p>
          {donationError && (
            <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
              {donationError}
            </p>
          )}
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm text-cyber-mint-600 hover:underline break-all"
          >
            View transaction: {txHash}
          </a>
          <Button
            variant="outline"
            onClick={() => {
              setState('form')
              setUsdAmount('')
              setSelectedPreset(null)
              setMessage('')
              setTxHash(null)
              setDonationError(null)
            }}
          >
            Send another donation
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-electric-slate-200">
      <CardHeader>
        <CardTitle>Send a Donation</CardTitle>
        <CardDescription>
          Send {currencyLabel} via {walletLabel}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {!connectedAddress ? (
          <Button
            className="w-full cursor-pointer"
            size="lg"
            onClick={handleConnect}
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : `Connect ${walletLabel}`}
          </Button>
        ) : (
          <>
            <p className="text-sm text-electric-slate-600">
              Connected: <span className="font-mono text-xs">{connectedAddress}</span>
            </p>

            {/* Preset amount buttons */}
            <div>
              <p className="text-xs font-medium text-electric-slate-400 mb-2">Quick amounts</p>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_AMOUNTS.map((usd) => {
                  const isSelected = selectedPreset === usd
                  const presetCrypto = cryptoPrice ? usd / cryptoPrice : null
                  return (
                    <button
                      key={usd}
                      type="button"
                      onClick={() => handlePresetClick(usd)}
                      disabled={pricesLoading}
                      className={`py-2.5 rounded-lg text-center transition-all cursor-pointer border ${
                        isSelected
                          ? 'border-cyber-mint-500 bg-cyber-mint-50 text-cyber-mint-700'
                          : 'border-electric-slate-200 bg-white text-electric-slate-700 hover:border-electric-slate-300'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <span className="text-sm font-semibold">${usd}</span>
                      {presetCrypto && (
                        <span className="block text-[10px] text-electric-slate-400 mt-0.5">
                          {presetCrypto.toFixed(4)} {currencyLabel}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* USD input with crypto conversion */}
            <div className="space-y-1.5">
              <Label htmlFor="amount">Amount (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-electric-slate-400 text-sm">$</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={usdAmount}
                  onChange={(e) => handleUsdChange(e.target.value)}
                  className="pl-7"
                />
              </div>
              {cryptoAmount && cryptoPrice ? (
                <p className="text-xs text-electric-slate-500">
                  ≈ {formatCrypto(cryptoAmount, currencyLabel as 'ETH' | 'SOL')}
                  <span className="text-electric-slate-300 ml-1.5">
                    (1 {currencyLabel} = {formatCurrency(cryptoPrice)})
                  </span>
                </p>
              ) : pricesLoading ? (
                <p className="text-xs text-electric-slate-400">Loading prices...</p>
              ) : !prices ? (
                <p className="text-xs text-amber-500">Unable to fetch prices. Enter crypto amount directly.</p>
              ) : null}
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <Label htmlFor="message">Message (optional)</Label>
              <textarea
                id="message"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-none"
                placeholder="Your message to the streamer..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={200}
              />
            </div>

            {/* Send button */}
            <Button
              className="w-full cursor-pointer"
              size="lg"
              onClick={handleSend}
              disabled={isConfirming || !usdAmount || !cryptoAmount}
            >
              {isConfirming
                ? 'Confirming transaction...'
                : cryptoAmount
                  ? `Send ${formatCurrency(parseFloat(usdAmount))} (≈${cryptoAmount.toFixed(4)} ${currencyLabel})`
                  : `Send ${currencyLabel}`}
            </Button>
          </>
        )}

        {(walletError || donationError) && (
          <p className="text-sm text-destructive">
            {walletError || donationError}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

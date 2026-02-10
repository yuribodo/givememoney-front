'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useWalletConnector } from './WalletConnector'
import { useSubmitDonation } from '../hooks/useDonation'
import { PublicWallet } from '../services/donation'

type DonationState = 'form' | 'connecting' | 'confirming' | 'success' | 'error'

interface DonationFormProps {
  wallet: PublicWallet
}

export function DonationForm({ wallet }: DonationFormProps) {
  const [amount, setAmount] = useState('')
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

  const currencyLabel = wallet.wallet_provider === 'metamask' ? 'ETH' : 'SOL'
  const explorerUrl = wallet.wallet_provider === 'metamask'
    ? `https://etherscan.io/tx/${txHash}`
    : `https://solscan.io/tx/${txHash}`

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
    const parsedAmount = parseFloat(amount)
    if (!parsedAmount || parsedAmount <= 0) {
      setDonationError('Please enter a valid amount')
      return
    }

    setState('confirming')
    setDonationError(null)

    let result
    try {
      result = await sendTransaction(parsedAmount)
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
          amount: parsedAmount,
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
      <Card>
        <CardContent className="p-8 text-center space-y-4">
          <div className="text-4xl">&#10003;</div>
          <h2 className="text-2xl font-bold text-electric-slate-900">Donation Sent!</h2>
          <p className="text-electric-slate-600">
            Your donation of {amount} {currencyLabel} was sent successfully.
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
              setAmount('')
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
    <Card>
      <CardHeader>
        <CardTitle>Send a Donation</CardTitle>
        <CardDescription>
          Send {currencyLabel} via {wallet.wallet_provider === 'metamask' ? 'MetaMask' : 'Phantom'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!connectedAddress ? (
          <Button
            className="w-full"
            size="lg"
            onClick={handleConnect}
            disabled={isConnecting}
          >
            {isConnecting
              ? 'Connecting...'
              : `Connect ${wallet.wallet_provider === 'metamask' ? 'MetaMask' : 'Phantom'}`}
          </Button>
        ) : (
          <>
            <p className="text-sm text-electric-slate-600">
              Connected: <span className="font-mono text-xs">{connectedAddress}</span>
            </p>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount ({currencyLabel})</Label>
              <Input
                id="amount"
                type="number"
                step="0.0001"
                min="0"
                placeholder={`0.01 ${currencyLabel}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
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

            <Button
              className="w-full"
              size="lg"
              onClick={handleSend}
              disabled={isConfirming || !amount}
            >
              {isConfirming ? 'Confirming transaction...' : `Send ${amount || '0'} ${currencyLabel}`}
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

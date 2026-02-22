'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useWalletConnector } from './WalletConnector'
import { useSubmitDonation } from '../hooks/useDonation'
import { useCryptoPrice } from '../hooks/useCryptoPrice'
import { PublicWallet } from '../services/donation'
import { formatCurrency, formatCrypto } from '@/lib/format'

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5 mb-6">
      {Array.from({ length: total }, (_, i) => i + 1).map((s) => {
        const isActive = s === current
        const isComplete = s < current
        return (
          <div key={s} className="flex items-center gap-1.5">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border transition-all ${
                isActive
                  ? 'bg-[#00A896] border-[#00A896] text-white'
                  : isComplete
                  ? 'bg-[#00A896]/10 border-[#00A896] text-[#00A896]'
                  : 'bg-white border-[#D0D5D0] text-[#8A938A]'
              }`}
            >
              {isComplete ? (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : s}
            </div>
            {s < total && (
              <div className={`h-px w-5 ${isComplete ? 'bg-[#00A896]' : 'bg-[#D0D5D0]'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function NetworkBadge({ provider }: { provider: 'metamask' | 'phantom' }) {
  const isEth = provider === 'metamask'
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#D0D5D0] bg-[#F5F7F5] text-xs font-medium text-[#1A1D1A]">
      <span className={`w-1.5 h-1.5 rounded-full ${isEth ? 'bg-[#627EEA]' : 'bg-[#9945FF]'}`} />
      {isEth ? 'Ethereum' : 'Solana'}
    </span>
  )
}

function AddressChip({ address }: { address: string }) {
  const [copied, setCopied] = useState(false)
  const truncated = `${address.slice(0, 6)}...${address.slice(-4)}`

  const copy = () => {
    navigator.clipboard.writeText(address).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="inline-flex items-center gap-1.5 bg-[#F5F7F5] border border-[#D0D5D0] rounded-md px-2 py-1">
      <span className="font-mono text-xs text-[#1A1D1A]">{truncated}</span>
      <button
        type="button"
        onClick={copy}
        className="text-[#8A938A] hover:text-[#1A1D1A] transition-colors shrink-0"
        title="Copy address"
        aria-label="Copy address"
      >
        {copied ? (
          <svg className="w-3.5 h-3.5 text-[#00A896]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
        )}
      </button>
    </div>
  )
}

function ReviewRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3 border-b border-[#F0F2F0] last:border-0">
      <span className="text-sm text-[#5C665C] shrink-0">{label}</span>
      <div className="text-right">{children}</div>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

// ─── Explorer URL ─────────────────────────────────────────────────────────────

const ETH_NETWORK = process.env.NEXT_PUBLIC_ETH_NETWORK ?? 'mainnet'

function getExplorerUrl(provider: 'metamask' | 'phantom', txHash: string): string {
  if (provider === 'metamask') {
    return ETH_NETWORK === 'sepolia'
      ? `https://sepolia.etherscan.io/tx/${txHash}`
      : `https://etherscan.io/tx/${txHash}`
  }
  return `https://solscan.io/tx/${txHash}`
}

// ─── Main Component ───────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4
type Status = 'idle' | 'connecting' | 'confirming' | 'success' | 'error'

const PRESET_AMOUNTS = [1, 5, 10, 25]

interface DonationFormProps {
  wallet: PublicWallet
}

export function DonationForm({ wallet }: DonationFormProps) {
  const [step, setStep] = useState<Step>(1)
  const [status, setStatus] = useState<Status>('idle')
  const [usdAmount, setUsdAmount] = useState('')
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [showMessage, setShowMessage] = useState(false)
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
  const { data: prices, isLoading: pricesLoading, dataUpdatedAt } = useCryptoPrice()

  const isEth = wallet.wallet_provider === 'metamask'
  const currencyLabel = isEth ? 'ETH' : 'SOL'
  const walletLabel = isEth ? 'MetaMask' : 'Phantom'

  const cryptoPrice = useMemo(() => {
    if (!prices) return null
    return isEth ? prices.ethereum.usd : prices.solana.usd
  }, [prices, isEth])

  const cryptoAmount = useMemo(() => {
    const usd = parseFloat(usdAmount)
    if (!usd || !cryptoPrice) return null
    return usd / cryptoPrice
  }, [usdAmount, cryptoPrice])

  const priceAgeSeconds = dataUpdatedAt
    ? Math.round((Date.now() - dataUpdatedAt) / 1000)
    : null

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleConnect = async () => {
    setStatus('connecting')
    setDonationError(null)
    try {
      const address = await connect()
      if (address) {
        setStep(2)
        setStatus('idle')
      } else {
        setStatus('idle')
        setDonationError('Could not connect wallet. Please try again.')
      }
    } catch {
      setStatus('idle')
      setDonationError('Could not connect wallet. Please try again.')
    }
  }

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

  const handleToReview = () => {
    if (!cryptoAmount || cryptoAmount <= 0) {
      setDonationError('Please enter a valid amount.')
      return
    }
    setDonationError(null)
    setStep(3)
  }

  const handleSend = async () => {
    if (!cryptoAmount || cryptoAmount <= 0) return
    setStatus('confirming')
    setDonationError(null)

    let result
    try {
      result = await sendTransaction(cryptoAmount)
    } catch {
      setStatus('error')
      setDonationError('Transaction rejected or failed. Please try again.')
      setStep(4)
      return
    }

    if (!result) {
      setStatus('error')
      setDonationError('Transaction failed. Please try again.')
      setStep(4)
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
          currency: currencyLabel,
        },
      })
    } catch {
      // On-chain tx succeeded — proceed to success even if backend recording fails
    }

    setStatus('success')
    setStep(4)
  }

  const handleReset = () => {
    setStep(connectedAddress ? 2 : 1)
    setStatus('idle')
    setUsdAmount('')
    setSelectedPreset(null)
    setMessage('')
    setShowMessage(false)
    setTxHash(null)
    setDonationError(null)
  }

  // ─── Shared button styles ───────────────────────────────────────────────────

  const primaryBtn =
    'w-full h-14 rounded-xl bg-[#00A896] text-white font-semibold text-base flex items-center justify-center gap-2 border-0 hover:bg-[#00897B] active:bg-[#007A6E] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'
  const secondaryBtn =
    'w-full h-12 rounded-xl border border-[#D0D5D0] text-[#1A1D1A] font-medium text-sm flex items-center justify-center hover:bg-[#F5F7F5] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @keyframes gmm-scale-in {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .gmm-scale-in { animation: gmm-scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
      `}</style>

      <Card className="border border-[#D0D5D0]">
        <CardContent className="p-6">
          <StepIndicator current={step} total={4} />

          {/* ── Step 1: Connect ─────────────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="text-center space-y-2">
                <NetworkBadge provider={wallet.wallet_provider} />
                <h2 className="text-lg font-semibold text-[#1A1D1A] mt-2">Connect your wallet</h2>
                <p className="text-sm text-[#5C665C]">
                  You&apos;ll sign a transaction to send {currencyLabel}
                </p>
              </div>

              <div className="bg-[#F5F7F5] border border-[#D0D5D0] rounded-xl p-4 space-y-1.5">
                <p className="text-xs text-[#8A938A]">Sending to</p>
                <p className="text-sm font-medium text-[#1A1D1A]">{wallet.streamer_name ?? 'Streamer'}</p>
                <AddressChip address={wallet.wallet_address} />
              </div>

              {connectedAddress ? (
                <div className="space-y-3">
                  <div className="bg-[#F5F7F5] border border-[#D0D5D0] rounded-xl p-4 space-y-1.5">
                    <p className="text-xs text-[#8A938A]">Your wallet</p>
                    <AddressChip address={connectedAddress} />
                  </div>
                  <button type="button" onClick={() => setStep(2)} className={primaryBtn}>
                    Continue →
                  </button>
                  <button
                    type="button"
                    onClick={handleConnect}
                    disabled={status === 'connecting' || isConnecting}
                    className={secondaryBtn}
                  >
                    {status === 'connecting' || isConnecting ? (
                      <><Spinner /> Connecting...</>
                    ) : (
                      'Use a different wallet'
                    )}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleConnect}
                  disabled={status === 'connecting' || isConnecting}
                  className={primaryBtn}
                >
                  {status === 'connecting' || isConnecting ? (
                    <><Spinner /> Connecting...</>
                  ) : (
                    `Connect ${walletLabel}`
                  )}
                </button>
              )}

              {(walletError || donationError) && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center">
                  {walletError || donationError}
                </p>
              )}
            </div>
          )}

          {/* ── Step 2: Amount ──────────────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-[#1A1D1A]">Choose amount</h2>
                  {wallet.streamer_name && (
                    <p className="text-xs text-[#5C665C] mt-0.5">
                      Donating to {wallet.streamer_name}
                    </p>
                  )}
                </div>
                <NetworkBadge provider={wallet.wallet_provider} />
              </div>

              {connectedAddress && (
                <div className="flex items-center justify-between text-xs text-[#5C665C] bg-[#F5F7F5] border border-[#D0D5D0] rounded-xl px-4 py-2.5">
                  <span>From</span>
                  <div className="flex items-center gap-2">
                    <AddressChip address={connectedAddress} />
                    <button
                      type="button"
                      onClick={() => { setStep(1); setStatus('idle') }}
                      className="text-[#8A938A] hover:text-[#1A1D1A] underline transition-colors text-xs"
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}

              {/* Preset chips */}
              <div>
                <p className="text-xs font-medium text-[#8A938A] mb-2">Quick amounts</p>
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
                        className={`min-h-12 py-2.5 rounded-xl text-center transition-all cursor-pointer border ${
                          isSelected
                            ? 'border-[#00A896] bg-[#00A896]/5 text-[#00A896]'
                            : 'border-[#D0D5D0] bg-white text-[#1A1D1A] hover:border-[#8A938A]'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <span className="text-sm font-semibold block">${usd}</span>
                        {presetCrypto && (
                          <span className="text-[10px] text-[#8A938A] mt-0.5 block">
                            {presetCrypto.toFixed(4)}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* USD input */}
              <div className="space-y-1.5">
                <Label htmlFor="amount" className="text-sm font-medium text-[#1A1D1A]">
                  Amount (USD)
                </Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A938A] text-sm">$</span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={usdAmount}
                    onChange={(e) => handleUsdChange(e.target.value)}
                    className="pl-7 h-12"
                  />
                </div>
                {cryptoAmount && cryptoPrice ? (
                  <p className="text-xs text-[#5C665C]">
                    ≈ {formatCrypto(cryptoAmount, currencyLabel as 'ETH' | 'SOL')}
                    <span className="text-[#8A938A] ml-1.5">
                      · 1 {currencyLabel} = {formatCurrency(cryptoPrice)}
                      {priceAgeSeconds !== null && ` · updated ${priceAgeSeconds}s ago`}
                    </span>
                  </p>
                ) : pricesLoading ? (
                  <p className="text-xs text-[#8A938A]">Fetching live price...</p>
                ) : !prices ? (
                  <p className="text-xs text-amber-600">Unable to fetch price</p>
                ) : null}
              </div>

              {/* Optional message */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowMessage(!showMessage)}
                  className="text-xs text-[#5C665C] hover:text-[#1A1D1A] transition-colors underline cursor-pointer"
                >
                  {showMessage ? 'Remove message' : 'Add a message (optional)'}
                </button>
                {showMessage && (
                  <textarea
                    className="mt-2 w-full rounded-xl border border-[#D0D5D0] bg-white px-3 py-2.5 text-sm min-h-[72px] resize-none focus:outline-none focus:ring-1 focus:ring-[#00A896] focus:border-[#00A896] transition-colors"
                    placeholder="Your message to the streamer..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={200}
                  />
                )}
              </div>

              {donationError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  {donationError}
                </p>
              )}

              <button type="button" onClick={handleToReview} className={primaryBtn}>
                Review donation →
              </button>
            </div>
          )}

          {/* ── Step 3: Review ──────────────────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-[#1A1D1A]">Review & confirm</h2>
                <p className="text-xs text-[#5C665C] mt-0.5">Check the details before signing</p>
              </div>

              <div className="rounded-xl border border-[#D0D5D0] overflow-hidden">
                <ReviewRow label="From">
                  {connectedAddress ? (
                    <AddressChip address={connectedAddress} />
                  ) : (
                    <span className="text-sm text-[#8A938A]">—</span>
                  )}
                </ReviewRow>
                <ReviewRow label="To">
                  <div className="space-y-1 flex flex-col items-end">
                    {wallet.streamer_name && (
                      <p className="text-sm font-medium text-[#1A1D1A]">{wallet.streamer_name}</p>
                    )}
                    <AddressChip address={wallet.wallet_address} />
                  </div>
                </ReviewRow>
                <ReviewRow label="Amount">
                  <div>
                    <p className="text-xl font-bold text-[#1A1D1A]">
                      {cryptoAmount ? formatCrypto(cryptoAmount, currencyLabel as 'ETH' | 'SOL') : '—'}
                    </p>
                    <p className="text-xs text-[#5C665C]">
                      ≈ {formatCurrency(parseFloat(usdAmount))}
                    </p>
                  </div>
                </ReviewRow>
                <ReviewRow label="Network">
                  <NetworkBadge provider={wallet.wallet_provider} />
                </ReviewRow>
                {message && (
                  <ReviewRow label="Message">
                    <p className="text-sm text-[#1A1D1A] max-w-[200px] text-right break-words">
                      {message}
                    </p>
                  </ReviewRow>
                )}
              </div>

              {(walletError || donationError) && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  {walletError || donationError}
                </p>
              )}

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={status === 'confirming' || isConfirming}
                  className={primaryBtn}
                >
                  {status === 'confirming' || isConfirming ? (
                    <><Spinner /> Waiting for wallet...</>
                  ) : (
                    'Confirm & Send'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => { setStep(2); setDonationError(null) }}
                  disabled={status === 'confirming' || isConfirming}
                  className={secondaryBtn}
                >
                  ← Edit amount
                </button>
              </div>
            </div>
          )}

          {/* ── Step 4: Done ────────────────────────────────────────────── */}
          {step === 4 && (
            <div className="space-y-5 text-center">
              {status === 'success' ? (
                <>
                  <div className="gmm-scale-in w-16 h-16 rounded-full bg-[#00A896]/10 border border-[#00A896]/20 flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-[#00A896]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-[#1A1D1A]">Donation sent!</h2>
                    {wallet.streamer_name && (
                      <p className="text-sm text-[#5C665C] mt-1">to {wallet.streamer_name}</p>
                    )}
                  </div>

                  <div className="bg-[#F5F7F5] border border-[#D0D5D0] rounded-xl p-4">
                    <p className="text-2xl font-bold text-[#1A1D1A]">
                      {cryptoAmount ? formatCrypto(cryptoAmount, currencyLabel as 'ETH' | 'SOL') : ''}
                    </p>
                    <p className="text-sm text-[#5C665C]">≈ {formatCurrency(parseFloat(usdAmount))}</p>
                  </div>

                  {txHash && (
                    <a
                      href={getExplorerUrl(wallet.wallet_provider, txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#00A896] hover:underline font-mono"
                    >
                      {txHash.slice(0, 10)}...{txHash.slice(-8)}
                      <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}

                  <button type="button" onClick={handleReset} className={secondaryBtn}>
                    Donate again
                  </button>
                </>
              ) : (
                <>
                  <div className="gmm-scale-in w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-[#1A1D1A]">Transaction failed</h2>
                    <p className="text-sm text-[#5C665C] mt-1">
                      {donationError ?? walletError ?? 'Something went wrong. Please try again.'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => { setStep(3); setStatus('idle'); setDonationError(null) }}
                      className={primaryBtn}
                    >
                      Try again
                    </button>
                    <button type="button" onClick={handleReset} className={secondaryBtn}>
                      Start over
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}

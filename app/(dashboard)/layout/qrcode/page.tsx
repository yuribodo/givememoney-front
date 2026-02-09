'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { QRCodePreview } from '@/features/layout/components/QRCodePreview'
import { QRCodeCustomizer } from '@/features/layout/components/QRCodeCustomizer'
import { QRCodeConfig } from '@/features/layout/types'
import { useQRSettings, useSaveQRSettings } from '@/features/layout/hooks/useQRSettings'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useWallets, useCreateWallet, useDeleteWallet } from '@/features/wallet/hooks/useWallets'
import { QRCodeCanvas } from 'qrcode.react'
import { Copy, CheckCircle, ArrowSquareOut, Lightning, ArrowsClockwise, Trash } from '@phosphor-icons/react'
import { WalletProvider, WalletRequest } from '@/lib/backend-types'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const defaultConfig: QRCodeConfig = {
  pixelColor: '#000000',
  backgroundColor: '#ffffff',
  borderColor: '#00a896',
  logoUrl: null,
  logoSize: 20,
  logoShape: 'circle',
  topText: 'Doe Agora!',
  bottomText: '@seucanal',
  textColor: '#1f2235',
  textSize: 'medium',
  frameStyle: 'rounded',
  qrSize: 300,
  pixelPattern: 'square',
}

type ConnectionMode = 'choose' | 'manual'

export default function QRCodeEditorPage() {
  const [config, setConfig] = useState<QRCodeConfig>(defaultConfig)
  const [copied, setCopied] = useState(false)
  const { data: savedConfig } = useQRSettings()
  const saveQRSettings = useSaveQRSettings()
  const hiddenCanvasRef = useRef<HTMLDivElement>(null)

  // Wallet connection state
  const [mode, setMode] = useState<ConnectionMode>('choose')
  const [manualAddress, setManualAddress] = useState('')
  const [manualProvider, setManualProvider] = useState<WalletProvider>('metamask')
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectError, setConnectError] = useState<string | null>(null)
  const createWallet = useCreateWallet()
  const deleteWallet = useDeleteWallet()
  const [isChangingWallet, setIsChangingWallet] = useState(false)

  const { user } = useAuth()
  const { data: wallets } = useWallets(user?.id)

  const firstWallet = wallets?.[0]
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
  const donationUrl = firstWallet
    ? `${baseUrl}/donate/${firstWallet.id}`
    : ''

  useEffect(() => {
    if (savedConfig) {
      setConfig(savedConfig)
    }
  }, [savedConfig])

  const handleConfigChange = (newConfig: Partial<QRCodeConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }))
  }

  const handleSave = () => {
    saveQRSettings.mutate(config)
  }

  const handleDownload = useCallback(() => {
    const canvas = hiddenCanvasRef.current?.querySelector('canvas')
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = 'qrcode-givememoney.png'
    link.href = url
    link.click()
  }, [])

  const handleCopyLink = async () => {
    if (!donationUrl) return
    try {
      await navigator.clipboard.writeText(donationUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Auto-connect via browser extension
  const handleAutoConnect = async (provider: WalletProvider) => {
    setIsConnecting(true)
    setConnectError(null)
    try {
      let address: string
      if (provider === 'metamask') {
        if (!window.ethereum?.isMetaMask) throw new Error('MetaMask nao esta instalado')
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        if (!accounts?.length) throw new Error('Nenhuma conta encontrada')
        address = accounts[0]
      } else {
        const phantom = window.phantom?.solana ?? (window.solana?.isPhantom ? window.solana : null)
        if (!phantom?.isPhantom) throw new Error('Phantom nao esta instalado')
        const resp = await phantom.connect()
        address = resp.publicKey.toString()
      }
      await createWallet.mutateAsync({ wallet_provider: provider, wallet_address: address })
    } catch (err) {
      setConnectError(err instanceof Error ? err.message : 'Falha ao conectar')
    } finally {
      setIsConnecting(false)
    }
  }

  // Manual address submission
  const handleManualSubmit = async () => {
    if (!manualAddress.trim()) return
    setIsConnecting(true)
    setConnectError(null)
    try {
      const request: WalletRequest = {
        wallet_provider: manualProvider,
        wallet_address: manualAddress.trim(),
      }
      await createWallet.mutateAsync(request)
      setManualAddress('')
      setMode('choose')
    } catch (err) {
      setConnectError(err instanceof Error ? err.message : 'Falha ao salvar wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 py-6"
    >
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-lg font-semibold text-electric-slate-900 tracking-tight">
          QR Code
        </h1>
        <p className="text-[13px] text-electric-slate-400 mt-0.5">
          Personalize o QR Code para receber doacoes
        </p>
      </div>

      {/* Wallet connection or donation link */}
      {donationUrl && !isChangingWallet ? (
        <div className="mb-5 space-y-2">
          {/* Donation link */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-electric-slate-100 bg-electric-slate-50/80">
            <span className="text-[11px] font-mono text-electric-slate-600 truncate flex-1">
              {donationUrl}
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              disabled={copied}
              className="flex items-center gap-1 text-[11px] font-medium flex-shrink-0 cursor-pointer transition-colors text-electric-slate-500 hover:text-electric-slate-700"
            >
              {copied ? (
                <><CheckCircle size={12} weight="fill" className="text-cyber-mint-500" /> Copiado</>
              ) : (
                <><Copy size={12} weight="bold" /> Copiar</>
              )}
            </button>
            <a
              href={donationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] font-medium flex-shrink-0 cursor-pointer text-cyber-mint-600 hover:text-cyber-mint-700"
            >
              <ArrowSquareOut size={12} weight="bold" /> Testar
            </a>
          </div>

          {/* Current wallet info + change button */}
          {firstWallet && (
            <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-electric-slate-100 bg-white">
              <div className="flex items-center gap-2">
                <Image
                  src={firstWallet.wallet_provider === 'metamask' ? '/icons/ethereum.png' : '/icons/solana.png'}
                  alt={firstWallet.wallet_provider}
                  width={16}
                  height={16}
                />
                <span className="text-[11px] text-electric-slate-500">
                  {firstWallet.wallet_provider === 'metamask' ? 'Ethereum' : 'Solana'}
                </span>
                <span className="text-[11px] font-mono text-electric-slate-400">
                  {firstWallet.wallet_address.slice(0, 6)}...{firstWallet.wallet_address.slice(-4)}
                </span>
              </div>
              <button
                type="button"
                onClick={async () => {
                  if (confirm('Deseja trocar a wallet? A wallet atual sera removida.')) {
                    try {
                      await deleteWallet.mutateAsync(firstWallet.id)
                      setIsChangingWallet(false)
                    } catch {
                      setConnectError('Falha ao remover wallet')
                    }
                  }
                }}
                disabled={deleteWallet.isPending}
                className="flex items-center gap-1 text-[11px] font-medium text-electric-slate-400 hover:text-error-rose cursor-pointer transition-colors disabled:opacity-50"
              >
                <ArrowsClockwise size={12} weight="bold" />
                {deleteWallet.isPending ? 'Removendo...' : 'Trocar wallet'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-5 rounded-xl border border-electric-slate-100 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-electric-slate-50 bg-electric-slate-50/40">
            <p className="text-[13px] font-medium text-electric-slate-800">
              Conecte sua wallet para receber doacoes
            </p>
            <p className="text-[11px] text-electric-slate-400 mt-0.5">
              Use a extensao do navegador ou cole seu endereco manualmente
            </p>
          </div>

          <div className="p-4 space-y-3">
            <AnimatePresence mode="wait">
              {mode === 'choose' ? (
                <motion.div
                  key="choose"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-3"
                >
                  {/* Auto-connect buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleAutoConnect('metamask')}
                      disabled={isConnecting}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-electric-slate-100 bg-white hover:bg-electric-slate-50 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Image src="/icons/ethereum.png" alt="Ethereum" width={20} height={20} />
                      <div className="text-left">
                        <p className="text-[12px] font-medium text-electric-slate-800">MetaMask</p>
                        <p className="text-[10px] text-electric-slate-400">Ethereum</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAutoConnect('phantom')}
                      disabled={isConnecting}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-electric-slate-100 bg-white hover:bg-electric-slate-50 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Image src="/icons/solana.png" alt="Solana" width={20} height={20} />
                      <div className="text-left">
                        <p className="text-[12px] font-medium text-electric-slate-800">Phantom</p>
                        <p className="text-[10px] text-electric-slate-400">Solana</p>
                      </div>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-electric-slate-100" />
                    <span className="text-[10px] font-medium text-electric-slate-300 uppercase tracking-wider">ou</span>
                    <div className="flex-1 h-px bg-electric-slate-100" />
                  </div>

                  {/* Manual entry trigger */}
                  <button
                    type="button"
                    onClick={() => setMode('manual')}
                    className="w-full text-center py-2 text-[12px] font-medium text-electric-slate-500 hover:text-electric-slate-700 cursor-pointer transition-colors"
                  >
                    Colar endereco manualmente
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="manual"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-3"
                >
                  {/* Network selector */}
                  <div>
                    <p className="text-[11px] font-medium text-electric-slate-400 mb-2">Rede</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {([
                        { value: 'metamask' as const, label: 'Ethereum', icon: '/icons/ethereum.png' },
                        { value: 'phantom' as const, label: 'Solana', icon: '/icons/solana.png' },
                      ]).map((net) => (
                        <button
                          key={net.value}
                          type="button"
                          onClick={() => setManualProvider(net.value)}
                          className={`flex items-center justify-center gap-2 py-2 rounded-lg text-[12px] font-medium transition-all cursor-pointer ${
                            manualProvider === net.value
                              ? 'bg-electric-slate-900 text-white'
                              : 'bg-electric-slate-50 text-electric-slate-600 hover:bg-electric-slate-100'
                          }`}
                        >
                          <Image src={net.icon} alt={net.label} width={16} height={16} />
                          {net.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Address input */}
                  <div>
                    <p className="text-[11px] font-medium text-electric-slate-400 mb-1.5">
                      Endereco da wallet
                    </p>
                    <Input
                      value={manualAddress}
                      onChange={(e) => setManualAddress(e.target.value)}
                      placeholder={manualProvider === 'metamask' ? '0x...' : 'Endereco Solana...'}
                      className="font-mono text-[12px] h-9"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={handleManualSubmit}
                      disabled={!manualAddress.trim() || isConnecting}
                      size="sm"
                      className="flex-1 cursor-pointer text-[12px]"
                    >
                      {isConnecting ? (
                        <><Lightning size={14} className="animate-pulse mr-1" /> Salvando...</>
                      ) : (
                        'Salvar wallet'
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setMode('choose'); setConnectError(null) }}
                      className="cursor-pointer text-[12px]"
                    >
                      Voltar
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading indicator for auto-connect */}
            {isConnecting && mode === 'choose' && (
              <div className="flex items-center gap-2 text-[11px] text-electric-slate-500">
                <Lightning size={12} className="animate-pulse" />
                <span>Conectando...</span>
              </div>
            )}

            {/* Error message */}
            {connectError && (
              <p className="text-[11px] text-error-rose">{connectError}</p>
            )}
          </div>
        </div>
      )}

      {/* Split layout — settings left, preview right */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Settings */}
        <div className="w-full lg:w-[380px] lg:flex-shrink-0 order-2 lg:order-1">
          <div className="border border-electric-slate-100 rounded-xl bg-white p-4">
            <QRCodeCustomizer
              config={config}
              onChange={handleConfigChange}
              onSave={handleSave}
              isSaving={saveQRSettings.isPending}
              onDownload={handleDownload}
            />
          </div>
        </div>

        {/* Preview — sticky */}
        <div className="flex-1 min-w-0 order-1 lg:order-2 lg:sticky lg:top-20 lg:self-start">
          <QRCodePreview config={config} donationUrl={donationUrl || undefined} />
        </div>
      </div>

      {/* Hidden canvas for download */}
      <div ref={hiddenCanvasRef} style={{ position: 'absolute', left: '-9999px' }}>
        <QRCodeCanvas
          value={donationUrl || 'https://givememoney.fun'}
          size={config.qrSize}
          bgColor={config.backgroundColor}
          fgColor={config.pixelColor}
          level="H"
          includeMargin
        />
      </div>
    </motion.main>
  )
}

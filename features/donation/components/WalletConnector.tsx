'use client'

import { useState, useCallback } from 'react'
import { BrowserProvider, parseEther } from 'ethers'
import { Connection, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js'
import { WalletProvider } from '@/lib/backend-types'

interface WalletConnectorResult {
  txHash: string
  fromAddress: string
}

interface UseWalletConnectorProps {
  walletProvider: WalletProvider
  destinationAddress: string
}

export function useWalletConnector({ walletProvider, destinationAddress }: UseWalletConnectorProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const connectMetaMask = useCallback(async (): Promise<string> => {
    if (!window.ethereum?.isMetaMask) {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.')
    }
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[]
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found. Please unlock MetaMask.')
    }
    return accounts[0]
  }, [])

  const connectPhantom = useCallback(async (): Promise<string> => {
    if (!window.solana?.isPhantom) {
      throw new Error('Phantom is not installed. Please install Phantom to continue.')
    }
    const response = await window.solana.connect()
    return response.publicKey.toString()
  }, [])

  const connect = useCallback(async () => {
    setError(null)
    setIsConnecting(true)
    try {
      const address = walletProvider === 'metamask'
        ? await connectMetaMask()
        : await connectPhantom()
      setConnectedAddress(address)
      return address
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to connect wallet'
      setError(msg)
      return null
    } finally {
      setIsConnecting(false)
    }
  }, [walletProvider, connectMetaMask, connectPhantom])

  const sendTransaction = useCallback(async (amount: number): Promise<WalletConnectorResult | null> => {
    setError(null)
    setIsConfirming(true)
    try {
      if (walletProvider === 'metamask') {
        if (!window.ethereum) throw new Error('MetaMask not available')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const provider = new BrowserProvider(window.ethereum as any)
        const signer = await provider.getSigner()
        const fromAddress = await signer.getAddress()
        const tx = await signer.sendTransaction({
          to: destinationAddress,
          value: parseEther(amount.toString()),
        })
        await tx.wait()
        return { txHash: tx.hash, fromAddress }
      } else {
        if (!window.solana) throw new Error('Phantom not available')
        const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed')
        const fromPubkey = new PublicKey(connectedAddress!)
        const toPubkey = new PublicKey(destinationAddress)
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey,
            toPubkey,
            lamports: Math.round(amount * LAMPORTS_PER_SOL),
          })
        )
        transaction.feePayer = fromPubkey
        const { blockhash } = await connection.getLatestBlockhash()
        transaction.recentBlockhash = blockhash
        if (!window.solana.signAndSendTransaction) throw new Error('Phantom signAndSendTransaction not available')
        const result = await window.solana.signAndSendTransaction(transaction)
        return { txHash: result.signature, fromAddress: connectedAddress! }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Transaction failed'
      setError(msg)
      return null
    } finally {
      setIsConfirming(false)
    }
  }, [walletProvider, destinationAddress, connectedAddress])

  return {
    connect,
    sendTransaction,
    connectedAddress,
    isConnecting,
    isConfirming,
    error,
    clearError: () => setError(null),
  }
}

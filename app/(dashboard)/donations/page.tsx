'use client'

import { useAuth } from '@/features/auth'
import { useTransactions } from '@/features/transactions'
import { formatCurrency, getTimeAgo } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { CurrencyCircleDollar } from '@phosphor-icons/react'

function truncateAddress(address: string): string {
  if (address.length <= 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function getCurrencyFromAddress(address: string): string {
  if (address.startsWith('0x') && address.length === 42) return 'ETH'
  if (address.length >= 32 && address.length <= 44 && !address.startsWith('0x')) return 'SOL'
  return 'CRYPTO'
}

const statusConfig = {
  confirmed: { label: 'Confirmada', className: 'bg-success-emerald/10 text-success-emerald border-success-emerald/20' },
  pending: { label: 'Pendente', className: 'bg-warning-amber/10 text-warning-amber border-warning-amber/20' },
  failed: { label: 'Falhou', className: 'bg-error-rose/10 text-error-rose border-error-rose/20' },
} as const

export default function DonationsPage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const { data: transactions, isLoading: isTransactionsLoading, error } = useTransactions(user?.id)

  const sorted = transactions
    ? [...transactions].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    : []

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-cyber-mint-600" />
          <p className="text-electric-slate-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-error-rose font-medium">Falha ao carregar doações</p>
        <p className="text-electric-slate-600 text-sm">{(error as Error).message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-cyber-mint-600 text-white rounded-lg hover:bg-cyber-mint-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <motion.main
      className="p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <CurrencyCircleDollar size={28} weight="duotone" className="text-electric-slate-900" />
        <h1 className="text-xl font-bold text-electric-slate-900">Doações</h1>
        {sorted.length > 0 && (
          <Badge variant="outline" className="border-electric-slate-200 text-electric-slate-600 text-xs">
            {sorted.length} {sorted.length === 1 ? 'doação' : 'doações'}
          </Badge>
        )}
      </div>

      {/* Table */}
      {isTransactionsLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 animate-spin text-cyber-mint-600" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-16 border border-electric-slate-200 rounded-lg bg-white">
          <CurrencyCircleDollar size={48} weight="duotone" className="text-electric-slate-300 mx-auto mb-4" />
          <p className="text-electric-slate-600 font-medium">Nenhuma doação ainda</p>
          <p className="text-electric-slate-400 text-sm mt-1">
            Suas doações aparecerão aqui quando recebidas
          </p>
        </div>
      ) : (
        <div className="border border-electric-slate-200 rounded-lg bg-white overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-electric-slate-200 hover:bg-transparent">
                <TableHead className="text-electric-slate-600 font-semibold text-xs uppercase tracking-wider">Remetente</TableHead>
                <TableHead className="text-electric-slate-600 font-semibold text-xs uppercase tracking-wider">Valor</TableHead>
                <TableHead className="text-electric-slate-600 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">Mensagem</TableHead>
                <TableHead className="text-electric-slate-600 font-semibold text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-electric-slate-600 font-semibold text-xs uppercase tracking-wider text-right">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((tx) => {
                const currency = getCurrencyFromAddress(tx.addressFrom)
                const status = statusConfig[tx.status] ?? statusConfig.pending

                return (
                  <TableRow key={tx.id} className="border-electric-slate-100">
                    <TableCell className="font-mono text-sm text-electric-slate-900">
                      {truncateAddress(tx.addressFrom)}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-electric-slate-900">{formatCurrency(tx.amount)}</span>
                      <span className="text-electric-slate-400 text-xs ml-1.5 uppercase">{currency}</span>
                    </TableCell>
                    <TableCell className="text-electric-slate-600 text-sm max-w-[200px] truncate hidden md:table-cell">
                      {tx.message || <span className="text-electric-slate-300 italic">—</span>}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${status.className}`}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-electric-slate-500 text-sm text-right whitespace-nowrap">
                      {getTimeAgo(tx.createdAt)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </motion.main>
  )
}

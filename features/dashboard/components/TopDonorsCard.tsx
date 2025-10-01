'use client'

import { Users, Trophy, Medal, Award } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/mock-data'
import { DashboardCard } from './DashboardCard'
import { motion } from 'framer-motion'
import { AnimatedCounter } from '@/components/ui/animated-counter'

interface TopDonor {
  username: string
  amount: number
  rank: number
}

interface TopDonorsCardProps {
  donors: TopDonor[]
}

export function TopDonorsCard({ donors }: TopDonorsCardProps) {
  const iconVariants = {
    hidden: { scale: 0, rotate: -180, opacity: 0 },
    show: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 12,
      },
    },
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <motion.div variants={iconVariants} initial="hidden" animate="show">
            <Trophy size={16} className="text-yellow-500" />
          </motion.div>
        )
      case 2:
        return (
          <motion.div variants={iconVariants} initial="hidden" animate="show">
            <Medal size={16} className="text-gray-400" />
          </motion.div>
        )
      case 3:
        return (
          <motion.div variants={iconVariants} initial="hidden" animate="show">
            <Award size={16} className="text-orange-500" />
          </motion.div>
        )
      default:
        return (
          <motion.div
            className="w-4 h-4 rounded-full bg-muted flex items-center justify-center"
            variants={iconVariants}
            initial="hidden"
            animate="show"
          >
            <span className="text-xs font-medium text-muted-foreground">{rank}</span>
          </motion.div>
        )
    }
  }

  const headerVariants = {
    hidden: { opacity: 0, x: -20 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  }

  const rowVariants = {
    hidden: { opacity: 0, x: -30, y: 10 },
    show: (i: number) => ({
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        delay: 0.2 + i * 0.15,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  }

  return (
    <div className="h-full">
      <DashboardCard title="Top Donors" icon={Users} className="h-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
        {donors.length === 0 ? (
          <div className="text-center py-12 px-6">
            <Users size={32} className="text-muted-foreground mx-auto mb-2" />
            <div className="text-sm text-muted-foreground">
              No donations yet
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Your top donors will appear here
            </div>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader className="bg-muted/30">
                <motion.tr
                  className="hover:bg-transparent border-b border-border/50"
                  variants={headerVariants}
                  initial="hidden"
                  animate="show"
                >
                  <TableHead className="w-16 text-center text-xs font-semibold text-muted-foreground">#</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground">Name</TableHead>
                  <TableHead className="text-right text-xs font-semibold text-muted-foreground pr-6">Amount</TableHead>
                </motion.tr>
              </TableHeader>
              <TableBody>
                {donors.slice(0, 5).map((donor, index) => (
                  <motion.tr
                    key={donor.rank}
                    className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors"
                    custom={index}
                    variants={rowVariants}
                    initial="hidden"
                    animate="show"
                  >
                    <TableCell className="py-5 w-16 text-center">
                      <div className="flex items-center justify-center">
                        {getRankIcon(donor.rank)}
                      </div>
                    </TableCell>
                    <TableCell className="py-5 font-medium text-foreground">
                      {donor.username}
                    </TableCell>
                    <TableCell className="py-5 text-right font-semibold money-display text-foreground pr-6">
                      <AnimatedCounter
                        value={donor.amount}
                        formatter={(v) => formatCurrency(v)}
                        className="inline-block"
                      />
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>

            {donors.length > 5 && (
              <motion.div
                className="p-4 bg-muted/20 border-t border-border/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <button className="w-full text-sm text-cyber-mint-600 hover:text-cyber-mint-700 font-medium transition-colors">
                  View all donors →
                </button>
              </motion.div>
            )}
          </>
        )}
        </motion.div>
      </DashboardCard>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2, DollarSign } from 'lucide-react'

interface Props {
  affiliateId: string
  pendingAmount: number
}

export function ApprovePayoutButton({ affiliateId, pendingAmount }: Props) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleApprove() {
    if (pendingAmount <= 0) return
    const confirmed = confirm(`Approve payout of $${pendingAmount.toFixed(2)}? Mark as paid out manually after sending funds.`)
    if (!confirmed) return

    setLoading(true)
    try {
      const res = await fetch('/api/admin/affiliates/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ affiliate_id: affiliateId }),
      })
      if (!res.ok) throw new Error('Failed')
      setDone(true)
      toast.success('Payout marked as approved!')
    } catch {
      toast.error('Failed to approve payout')
    } finally {
      setLoading(false)
    }
  }

  if (pendingAmount <= 0) {
    return <span className="text-[var(--color-slate)] text-xs">No pending</span>
  }

  if (done) {
    return <span className="text-green-400 text-xs font-medium">Approved</span>
  }

  return (
    <button onClick={handleApprove} disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 text-[var(--color-gold)] text-xs font-medium hover:bg-[var(--color-gold)]/20 disabled:opacity-50 transition-all">
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <DollarSign className="w-3 h-3" />}
      Approve
    </button>
  )
}

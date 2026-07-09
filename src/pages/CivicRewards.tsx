import React, { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { GlassPanel } from "@/components/ui/GlassPanel"
import { Headline, BodyText, Label } from "@/components/atoms/Typography"
import { Button } from "@/components/atoms/Button"
import { cn } from "@/utils/utils"
import { useNotifications } from "@/contexts/NotificationContext"

const REWARDS_DATA = [
  { id: "transit-daily", title: "Daily Transit Pass", icon: "directions_bus", cost: 100, desc: "Free bus & metro rides for one full day across all Neo-Metropolis routes.", color: "text-blue-400 bg-blue-500/10" },
  { id: "parking-2hr", title: "2-Hour Parking Voucher", icon: "local_parking", cost: 75, desc: "Complimentary street-side parking at any municipal parking meter.", color: "text-green-400 bg-green-500/10" },
  { id: "library-month", title: "Library Premium Access", icon: "local_library", cost: 150, desc: "One month of premium digital library access including audiobooks.", color: "text-purple-400 bg-purple-500/10" },
  { id: "pool-pass", title: "Community Pool Pass", icon: "pool", cost: 200, desc: "Single entry to any municipal community pool or recreation center.", color: "text-cyan-400 bg-cyan-500/10" },
  { id: "cafe-voucher", title: "City Hall Café Voucher", icon: "coffee", cost: 50, desc: "One free beverage at any municipal office cafeteria.", color: "text-amber-400 bg-amber-500/10" },
  { id: "workshop", title: "Civic Workshop Seat", icon: "school", cost: 250, desc: "Reserve a seat at the next city planning workshop or town hall.", color: "text-pink-400 bg-pink-500/10" },
]

const HOW_TO_EARN = [
  { icon: "bug_report", action: "Report an Issue", points: "+25 pts", desc: "File a verified civic report" },
  { icon: "check_circle", action: "Issue Resolved", points: "+50 pts", desc: "Your reported issue gets resolved" },
  { icon: "feedback", action: "Community Feedback", points: "+10 pts", desc: "Leave feedback on city services" },
  { icon: "volunteer_activism", action: "Volunteer Event", points: "+100 pts", desc: "Participate in a city clean-up" },
]

export function CivicRewards() {
  const navigate = useNavigate()
  const { addNotification } = useNotifications()
  
  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem("civiclens_rewards_points")
    return saved ? parseInt(saved, 10) : 350
  })
  
  const [redeemingId, setRedeemingId] = useState<string | null>(null)
  const [lastVoucher, setLastVoucher] = useState<string | null>(null)

  const savePoints = useCallback((newPoints: number) => {
    setPoints(newPoints)
    localStorage.setItem("civiclens_rewards_points", String(newPoints))
  }, [])

  const handleRedeem = (reward: typeof REWARDS_DATA[0]) => {
    if (points < reward.cost) {
      addNotification({
        title: "Insufficient Points",
        message: `You need ${reward.cost} points but only have ${points}. Keep reporting issues to earn more!`,
        type: "warning",
        group: "system"
      })
      return
    }
    setRedeemingId(reward.id)
  }

  const confirmRedeem = (reward: typeof REWARDS_DATA[0]) => {
    const newPoints = points - reward.cost
    savePoints(newPoints)

    const voucherCode = `UP-VOUCH-${Math.floor(100000 + Math.random() * 900000)}`
    setLastVoucher(voucherCode)
    setRedeemingId(null)

    addNotification({
      title: "Reward Redeemed!",
      message: `${reward.title} voucher claimed. Code: ${voucherCode}`,
      type: "success",
      group: "message"
    })
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 relative z-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <Headline level={1}>Civic Rewards Programme</Headline>
        <BodyText className="text-on-surface-variant max-w-lg mx-auto">
          Earn points for contributing to your city. Redeem them for real civic benefits.
        </BodyText>
      </div>

      {/* Points Balance Card */}
      <GlassPanel className="p-8 rounded-3xl border border-primary/20 shadow-[0_0_40px_rgba(192,193,255,0.1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-5">
          <span className="material-symbols-outlined text-[200px] text-primary">stars</span>
        </div>
        <div className="flex items-center justify-between relative z-10 flex-wrap gap-6">
          <div>
            <Label className="text-on-surface-variant block mb-2">Your Points Balance</Label>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-headline-md font-extrabold text-primary">{points}</span>
              <span className="text-on-surface-variant font-label-sm text-sm">PTS</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-2">
              {points >= 250 ? "🎉 You have enough for premium rewards!" : `Earn ${250 - points} more points to unlock premium rewards.`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 ai-orb rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl">emoji_events</span>
            </div>
          </div>
        </div>
      </GlassPanel>

      {/* Voucher Flash Banner */}
      <AnimatePresence>
        {lastVoucher && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-green-400 text-2xl">celebration</span>
              <div>
                <p className="text-sm font-bold text-green-400">Voucher Claimed!</p>
                <p className="text-xs text-on-surface-variant">Your voucher code: <strong className="font-label-sm text-foreground">{lastVoucher}</strong></p>
              </div>
            </div>
            <button onClick={() => setLastVoucher(null)} className="text-on-surface-variant hover:text-foreground">
              <span className="material-symbols-outlined">close</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* How to Earn */}
      <div>
        <Headline level={3} className="mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">trending_up</span>
          How to Earn Points
        </Headline>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {HOW_TO_EARN.map((item, idx) => (
            <GlassPanel key={idx} hover className="p-5 rounded-2xl text-center space-y-2">
              <span className="material-symbols-outlined text-primary text-2xl">{item.icon}</span>
              <p className="font-bold text-sm text-foreground">{item.action}</p>
              <p className="text-primary font-bold text-lg font-label-sm">{item.points}</p>
              <p className="text-[10px] text-on-surface-variant">{item.desc}</p>
            </GlassPanel>
          ))}
        </div>
      </div>

      {/* Rewards Catalog */}
      <div>
        <Headline level={3} className="mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary">redeem</span>
          Redeem Rewards
        </Headline>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REWARDS_DATA.map(reward => (
            <GlassPanel key={reward.id} hover className="p-6 rounded-2xl space-y-4 relative overflow-hidden group">
              <div className="flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", reward.color)}>
                  <span className="material-symbols-outlined text-2xl">{reward.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-foreground">{reward.title}</h4>
                  <p className="text-primary font-bold font-label-sm">{reward.cost} PTS</p>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">{reward.desc}</p>
              <Button
                className={cn(
                  "w-full font-bold transition-all",
                  points >= reward.cost
                    ? "bg-primary/20 text-primary hover:bg-primary/30 border border-primary/20"
                    : "bg-foreground/5 text-on-surface-variant cursor-not-allowed border border-foreground/10"
                )}
                onClick={() => handleRedeem(reward)}
                disabled={points < reward.cost}
              >
                {points >= reward.cost ? "Redeem" : `Need ${reward.cost - points} more pts`}
              </Button>
            </GlassPanel>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {redeemingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setRedeemingId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md"
            >
              {(() => {
                const reward = REWARDS_DATA.find(r => r.id === redeemingId)!
                return (
                  <GlassPanel className="p-8 rounded-3xl border border-primary/30 shadow-2xl bg-surface-container/90 text-center space-y-4">
                    <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mx-auto", reward.color)}>
                      <span className="material-symbols-outlined text-3xl">{reward.icon}</span>
                    </div>
                    <Headline level={3}>Confirm Redemption</Headline>
                    <BodyText className="text-on-surface-variant">
                      Redeem <strong className="text-primary">{reward.cost} points</strong> for <strong className="text-foreground">{reward.title}</strong>?
                    </BodyText>
                    <p className="text-xs text-on-surface-variant">
                      Your remaining balance will be <strong>{points - reward.cost} pts</strong>.
                    </p>
                    <div className="flex gap-3 pt-2">
                      <Button variant="outline" className="flex-1" onClick={() => setRedeemingId(null)}>Cancel</Button>
                      <Button className="flex-1 bg-gradient-to-r from-primary to-secondary text-on-primary font-bold" onClick={() => confirmRedeem(reward)}>
                        Confirm
                      </Button>
                    </div>
                  </GlassPanel>
                )
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

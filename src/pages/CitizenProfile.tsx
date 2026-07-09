import React from "react"
import { motion } from "framer-motion"
import { GlassPanel } from "@/components/ui/GlassPanel"
import { Headline, BodyText, Label } from "@/components/atoms/Typography"
import { Button } from "@/components/atoms/Button"
import { cn } from "@/utils/utils"
import { useAuth } from "@/contexts/AuthContext"

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function CitizenProfile() {
  const { user } = useAuth();
  
  return (
    <div className="max-w-4xl mx-auto space-y-8 pt-8 pb-32">
      
      {/* Profile Header */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center gap-6"
      >
        <div className="relative">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-primary/30 p-1">
            <div className="w-full h-full rounded-full overflow-hidden">
              <img 
                className="w-full h-full object-cover" 
                src={user?.avatar || "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80"} 
                alt={user?.name || "Profile"}
              />
            </div>
          </div>
          <div className="absolute bottom-1 right-1 bg-primary text-on-primary-container p-1 rounded-full border-2 border-surface shadow-lg">
            <span className="material-symbols-outlined text-[16px] block" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          </div>
        </div>
        
        <div className="text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <Headline level={2}>{user?.name || "Profile"}</Headline>
            <span className="px-3 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm border border-primary/20 w-fit mx-auto md:mx-0">Verified {user?.role ? user.role.charAt(0) + user.role.slice(1).toLowerCase() : "User"}</span>
          </div>
          <BodyText className="text-on-surface-variant mt-1">Smart City {user?.role === 'CITIZEN' ? 'Resident • Level 12 Contributor' : 'Staff Member'}</BodyText>
        </div>
      </motion.section>

      {/* Impact Summary Bento Grid */}
      {user?.role === 'CITIZEN' && (
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
        <motion.div variants={itemVariants}>
          <GlassPanel className="p-6 rounded-xl flex flex-col items-center justify-center text-center hover:bg-foreground/5 transition-colors relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(192,193,255,0.15)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="material-symbols-outlined text-primary mb-2">task_alt</span>
            <Headline level={1} className="text-primary font-bold">12</Headline>
            <Label className="text-on-surface-variant uppercase tracking-widest mt-1 block">Issues Resolved</Label>
          </GlassPanel>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <GlassPanel className="p-6 rounded-xl flex flex-col items-center justify-center text-center hover:bg-foreground/5 transition-colors relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,176,205,0.15)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="material-symbols-outlined text-tertiary mb-2">eco</span>
            <Headline level={1} className="text-tertiary font-bold">45kg</Headline>
            <Label className="text-on-surface-variant uppercase tracking-widest mt-1 block">CO2 Saved</Label>
          </GlassPanel>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <GlassPanel className="p-6 rounded-xl flex flex-col items-center justify-center text-center hover:bg-foreground/5 transition-colors relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(221,183,255,0.15)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="material-symbols-outlined text-secondary mb-2">trending_up</span>
            <Headline level={1} className="text-secondary font-bold">Top 5%</Headline>
            <Label className="text-on-surface-variant uppercase tracking-widest mt-1 block">Contributor</Label>
          </GlassPanel>
        </motion.div>
        </motion.section>
      )}

      {/* Quick Actions Chips */}
      {user?.role === 'CITIZEN' && (
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
        <Headline level={3} className="mb-4">Quick Actions</Headline>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <Button variant="glass" className="rounded-full text-primary border-primary/20 hover:bg-primary/20">
            <span className="material-symbols-outlined text-[20px] mr-2">assignment_late</span>
            My Complaints
          </Button>
          <Button variant="glass" className="rounded-full">
            <span className="material-symbols-outlined text-[20px] mr-2">bookmarks</span>
            Saved Services
          </Button>
          <Button variant="glass" className="rounded-full">
            <span className="material-symbols-outlined text-[20px] mr-2">history</span>
            Activity Timeline
          </Button>
          <Button variant="glass" className="rounded-full">
            <span className="material-symbols-outlined text-[20px] mr-2">payments</span>
            Tax Invoices
          </Button>
        </div>
        </motion.section>
      )}

      {/* Main Content Area: Split View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Recent AI Conversations */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <Headline level={3} className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">smart_toy</span>
            AI Assistant
          </Headline>
          <div className="space-y-3">
            {[
              { title: "Waste Collection", time: "2h ago", text: `"Your bin collection for Sector 4 is rescheduled to Thursday due to the local marathon event. I've updated your calendar..."` },
              { title: "Parking Permit", time: "Yesterday", text: `"Permit #XJ-903 has been successfully renewed. You are now authorized for Zone B parking until Dec 2025."` },
              { title: "Traffic Alert", time: "3 days ago", text: `"Construction on 5th Ave is clearing up. Your typical commute should be 10 minutes faster today."` }
            ].map((conv, idx) => (
              <GlassPanel key={idx} className="p-4 rounded-xl hover:translate-x-1 transition-transform cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <Label className="text-primary font-bold normal-case tracking-normal">{conv.title}</Label>
                  <span className="text-[10px] text-on-surface-variant">{conv.time}</span>
                </div>
                <BodyText variant="sm" className="text-on-surface-variant line-clamp-2">{conv.text}</BodyText>
              </GlassPanel>
            ))}
          </div>
        </motion.section>

        {/* Impact Timeline */}
        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <Headline level={3} className="flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary">analytics</span>
            Municipal Timeline
          </Headline>
          <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-foreground/10">
            
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/20"></div>
              <Headline level={4} className="text-sm font-semibold">Parking Permit Renewed</Headline>
              <BodyText variant="sm" className="text-on-surface-variant mt-1">Automatic renewal completed by AI Assistant. Transaction ID: #PARK-882.</BodyText>
              <Label className="text-[10px] text-on-surface-variant block mt-1">TODAY, 09:12 AM</Label>
            </div>
            
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-surface-container-highest ring-4 ring-white/5"></div>
              <Headline level={4} className="text-sm font-semibold">Pothole Report Fixed</Headline>
              <BodyText variant="sm" className="text-on-surface-variant mt-1">Infrastructure team resolved the report for Maple Street. Thank you for your contribution!</BodyText>
              <Label className="text-[10px] text-on-surface-variant block mt-1">OCT 24, 2023</Label>
            </div>

            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-surface-container-highest ring-4 ring-white/5"></div>
              <Headline level={4} className="text-sm font-semibold">Community Voting Participation</Headline>
              <BodyText variant="sm" className="text-on-surface-variant mt-1">You voted on the "Green Corridor Initiative". Results will be published soon.</BodyText>
              <Label className="text-[10px] text-on-surface-variant block mt-1">OCT 20, 2023</Label>
            </div>
            
          </div>
        </motion.section>
      </div>
    </div>
  )
}

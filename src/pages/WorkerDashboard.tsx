import React from "react"
import { motion } from "framer-motion"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { api } from "@/services/api"
import { GlassPanel } from "@/components/ui/GlassPanel"
import { Headline, BodyText, Label } from "@/components/atoms/Typography"
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

export function WorkerDashboard() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  const handleStatusChange = async (jobId: number, newStatus: string) => {
    try {
      await api.updateComplaintStatus(jobId, newStatus)
      queryClient.invalidateQueries({ queryKey: ['complaints'] })
    } catch (e) {
      console.error("Failed to update job status:", e)
    }
  }
  
  // Query backend data
  const { data: rawWorkers = [] } = useQuery({
    queryKey: ['workers'],
    queryFn: api.getWorkers
  })
  
  const { data: rawComplaints = [], isLoading } = useQuery({
    queryKey: ['complaints'],
    queryFn: api.getComplaints
  })
  
  const activeWorker = React.useMemo(() => {
    // If logged in via AuthContext, try to match to a worker profile, else fallback to first
    const matched = rawWorkers.find((w: any) => w.name === user?.name)
    return matched || rawWorkers[0] || { 
      id: 1, 
      name: "Rahul Verma", 
      status: "Busy", 
      department: { name: "Transit" } 
    }
  }, [rawWorkers, user])
  
  // Filter complaints assigned to this worker
  const workerJobs = React.useMemo(() => {
    return rawComplaints.filter((c: any) => c.worker_id === activeWorker.id)
  }, [rawComplaints, activeWorker])

  const completedJobs = workerJobs.filter((j: any) => j.status === "Resolved" || j.status === "Closed").length;
  const activeJobs = workerJobs.length - completedJobs;

  return (
    <div className="w-full h-full p-4 md:p-8 space-y-6">
      
      {/* Mobile Top Header (hidden on landscape/desktop) */}
      <div className="md:hidden flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/30 bg-primary/10 flex items-center justify-center text-primary font-bold">
            {activeWorker.name[0]}
          </div>
          <div>
            <Headline level={4} className="text-[18px] text-primary leading-tight">Field Central</Headline>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              <Label className="text-[10px] text-on-surface-variant uppercase tracking-wider block">
                {activeWorker.department?.name || "General"} • {activeWorker.status}
              </Label>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="material-symbols-outlined text-primary text-xl">signal_wifi_off</span>
          <Label className="text-[8px] text-primary/70 block">OFFLINE</Label>
        </div>
      </div>

      {/* Landscape Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
        
        {/* Left Column: Agenda & Route (Spans 5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-6 h-full">
          {/* Desktop Header */}
          <div className="hidden md:flex justify-between items-end">
            <div>
              <Headline level={1} className="text-3xl text-primary font-bold">{activeWorker.name}</Headline>
              <BodyText className="text-on-surface-variant flex items-center gap-2 mt-1">
                <span className="material-symbols-outlined text-sm">badge</span>
                {activeWorker.department?.name || "General"} Division
              </BodyText>
            </div>
            <div className="flex items-center gap-2 bg-foreground/5 px-3 py-1.5 rounded-full border border-foreground/10">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface">{activeWorker.status}</span>
            </div>
          </div>

          <motion.section 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl p-6 relative overflow-hidden bg-surface-container/60 border border-foreground/10 flex-shrink-0"
          >
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-primary/10 blur-3xl rounded-full"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <Headline level={2} className="mb-1 text-2xl">Today's Agenda</Headline>
                  <BodyText className="text-on-surface-variant opacity-80">
                    {new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                  </BodyText>
                </div>
                <div className="bg-surface-container-highest px-3 py-1 rounded-full border border-foreground/5">
                  <Label className="text-primary">v2.4 AI Active</Label>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-foreground/5 rounded-2xl p-4 border border-foreground/5">
                  <Label className="text-on-surface-variant mb-1 block">Total Tasks</Label>
                  <Headline level={1} className="text-3xl">0{workerJobs.length}</Headline>
                </div>
                <div className="bg-foreground/5 rounded-2xl p-4 border border-foreground/5">
                  <Label className="text-on-surface-variant mb-1 block">Remaining</Label>
                  <Headline level={1} className="text-3xl text-tertiary">
                    {activeJobs} Active
                  </Headline>
                </div>
              </div>
              
              <button className="w-full h-14 bg-gradient-to-r from-primary-container to-secondary-container rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>route</span>
                <span className="font-headline-md text-[18px] font-bold text-on-primary">Start Optimized Route</span>
              </button>
            </div>
          </motion.section>

          {/* Map Preview Placeholder */}
          <GlassPanel className="flex-1 rounded-3xl overflow-hidden relative border border-foreground/10 min-h-[200px]">
            <div className="absolute inset-0 bg-surface-variant/30 flex flex-col items-center justify-center text-on-surface-variant/50 z-10">
              <span className="material-symbols-outlined text-4xl mb-2">map</span>
              <span className="text-sm font-bold uppercase tracking-widest">Live Routing</span>
            </div>
            {/* Fake map lines */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, var(--up-primary-container) 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
          </GlassPanel>

          {/* Performance Stats */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-4 flex-shrink-0"
          >
            <GlassPanel className="p-4 rounded-2xl bg-surface-container/40">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-tertiary text-lg">bolt</span>
                <Label className="text-on-surface-variant">Efficiency</Label>
              </div>
              <Headline level={1} className="text-2xl">94%</Headline>
              <div className="w-full bg-foreground/10 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-tertiary h-full" style={{ width: "94%" }}></div>
              </div>
            </GlassPanel>

            <GlassPanel className="p-4 rounded-2xl bg-surface-container/40">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-lg">verified</span>
                <Label className="text-on-surface-variant">Completion</Label>
              </div>
              <Headline level={1} className="text-2xl">{completedJobs}/{workerJobs.length}</Headline>
              <div className="w-full bg-foreground/10 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-primary h-full" style={{ width: `${workerJobs.length > 0 ? (completedJobs/workerJobs.length)*100 : 0}%` }}></div>
              </div>
            </GlassPanel>
          </motion.section>
        </div>

        {/* Right Column: Task List (Spans 7 cols) */}
        <div className="md:col-span-7 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4 px-2">
            <Headline level={3} className="text-[20px] flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">assignment</span>
              Assigned Jobs
            </Headline>
            <div className="flex items-center gap-2 bg-foreground/5 rounded-full px-1 py-1">
              <button className="px-3 py-1 bg-surface rounded-full text-xs font-bold shadow-sm">All</button>
              <button className="px-3 py-1 text-on-surface-variant text-xs font-bold hover:text-on-surface">Active</button>
              <button className="px-3 py-1 text-on-surface-variant text-xs font-bold hover:text-on-surface">Resolved</button>
            </div>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4"
          >
            {isLoading ? (
              <p className="text-sm text-on-surface-variant p-4">Loading jobs...</p>
            ) : workerJobs.length === 0 ? (
              <GlassPanel className="p-12 text-center text-on-surface-variant mt-10">
                <span className="material-symbols-outlined text-5xl mb-4 text-primary opacity-50">task_alt</span>
                <p className="font-semibold text-lg text-foreground mb-2">All clear!</p>
                <p className="text-sm">No active jobs assigned to {activeWorker.name} right now.</p>
              </GlassPanel>
            ) : (
              workerJobs.map((job: any) => {
                const isCritical = job.priority === "Critical" || job.priority === "High"
                const isResolved = job.status === "Resolved" || job.status === "Closed"
                const borderClass = isResolved ? "border-l-foreground/20 opacity-70" : isCritical ? "border-l-error" : "border-l-secondary-container"
                const chipClass = isCritical ? "bg-error-container text-on-error-container" : "bg-secondary-container/20 text-secondary"
                
                return (
                  <motion.div key={job.id} variants={itemVariants}>
                    <GlassPanel hover className={cn("p-5 space-y-4 border-l-[6px] bg-surface-container/40 transition-all", borderClass)}>
                      <div className="flex justify-between items-start">
                        <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest", isResolved ? "bg-foreground/10 text-foreground" : chipClass)}>
                          {job.priority} Priority
                        </span>
                        <div className="flex items-center gap-2">
                          <Label className="text-[10px] text-on-surface-variant uppercase font-bold mr-1">Status:</Label>
                          <select 
                            value={job.status}
                            onChange={(e) => handleStatusChange(job.id, e.target.value)}
                            className={cn(
                              "bg-foreground/5 border border-foreground/10 rounded-lg focus:ring-0 text-xs font-bold p-1 outline-none cursor-pointer",
                              isResolved ? "text-on-surface-variant" : "text-primary"
                            )}
                          >
                            <option value="Pending" className="bg-surface text-on-surface">Pending</option>
                            <option value="In Progress" className="bg-surface text-on-surface">In Progress</option>
                            <option value="Resolved" className="bg-surface text-on-surface">Resolved</option>
                            <option value="Closed" className="bg-surface text-on-surface">Closed</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <Headline level={4} className="text-[20px] leading-tight mb-2">{job.summary}</Headline>
                        <div className="flex flex-wrap items-center gap-4 text-on-surface-variant">
                          <div className="flex items-center gap-1 bg-foreground/5 px-2 py-1 rounded-md">
                            <span className="material-symbols-outlined text-[14px]">category</span>
                            <Label className="text-[11px]">{job.category}</Label>
                          </div>
                          <div className="flex items-center gap-1 bg-foreground/5 px-2 py-1 rounded-md">
                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                            <Label className="text-[11px]">Est: {job.estimated_resolution_time}</Label>
                          </div>
                          <div className="flex items-center gap-1 bg-foreground/5 px-2 py-1 rounded-md">
                            <span className="material-symbols-outlined text-[14px]">location_on</span>
                            <Label className="text-[11px]">Sector 4</Label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-end gap-3 pt-4 mt-2 border-t border-foreground/5">
                        <button 
                          className="px-4 py-2 text-primary hover:bg-primary/10 rounded-xl font-bold font-label-sm text-xs transition-colors flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-base">directions</span>
                          Navigate
                        </button>
                        <button 
                          onClick={() => navigate(`/reports/${job.id}`)}
                          className="px-4 py-2 bg-foreground/10 text-foreground hover:bg-foreground/20 rounded-xl font-bold font-label-sm text-xs transition-colors flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-base">visibility</span>
                          Details
                        </button>
                      </div>
                    </GlassPanel>
                  </motion.div>
                )
              })
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

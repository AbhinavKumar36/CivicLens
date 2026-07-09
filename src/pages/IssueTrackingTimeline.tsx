import React from "react"
import { motion } from "framer-motion"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { GlassPanel } from "@/components/ui/GlassPanel"
import { Headline, BodyText, Label } from "@/components/atoms/Typography"
import { Button } from "@/components/atoms/Button"
import { api } from "@/services/api"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"

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

export function IssueTrackingTimeline() {
  const { id } = useParams()
  
  // Fetch complaint from database
  const { data: report, isLoading } = useQuery({
    queryKey: ['complaint', id],
    queryFn: () => api.getComplaint(Number(id)),
    enabled: !!id && !isNaN(Number(id)),
    retry: false
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <LoadingSpinner />
      </div>
    )
  }

  // Use the loaded report or fallback to mock details
  const isFallback = !report
  const data = report || {
    id: id || "9928",
    category: "Infrastructure",
    priority: "Critical",
    severity: "Severe",
    summary: "Water Main Rupture - 5th Ave & Madison intersection reported with significant surface flooding.",
    estimated_resolution_time: "6 Hours",
    status: "In Progress",
    department: "Water & Power",
    created_at: new Date().toISOString()
  }

  // Determine progress bar percentage
  const getProgressWidth = (status: string) => {
    switch (status) {
      case "Pending": return "15%"
      case "AI Verified": return "35%"
      case "Dispatched": return "55%"
      case "In Progress": return "75%"
      case "Resolved":
      case "Closed": return "100%"
      default: return "75%"
    }
  }

  // Determine status of each step: "completed" | "active" | "pending"
  const getStepStatus = (stepName: string, currentStatus: string) => {
    const statuses = ["Pending", "AI Verified", "Dispatched", "In Progress", "Resolved", "Closed"]
    const stepIndices: Record<string, number> = {
      "Reported": 0,
      "AI Verified": 1,
      "Dispatched": 2,
      "In Progress": 3,
      "Resolved": 4
    }
    
    const currentIdx = statuses.indexOf(currentStatus)
    const stepIdx = stepIndices[stepName]
    
    // Treat Closed as Resolved for timeline mapping
    const effectiveCurrentIdx = currentStatus === "Closed" ? 4 : currentIdx
    
    if (effectiveCurrentIdx >= stepIdx) {
      return "completed"
    } else if (effectiveCurrentIdx === stepIdx - 1) {
      return "active"
    } else {
      return "pending"
    }
  }

  const renderStep = (name: string, icon: string, label: string) => {
    const stepState = getStepStatus(name, data.status)
    if (stepState === "completed") {
      return (
        <div className="flex flex-col items-center gap-3 group" key={name}>
          <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-[0_0_15px_rgba(192,193,255,0.4)]">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
          </div>
          <span className="text-sm font-semibold text-primary">{label}</span>
        </div>
      )
    } else if (stepState === "active") {
      return (
        <div className="flex flex-col items-center gap-3 group" key={name}>
          <div className="w-10 h-10 rounded-full bg-primary text-on-primary border-4 border-background flex items-center justify-center scale-110">
            <span className="material-symbols-outlined text-xl animate-spin" style={{ animationDuration: '4s' }}>{icon === "check" ? "settings" : icon}</span>
          </div>
          <span className="text-sm font-bold text-on-surface">{label}</span>
        </div>
      )
    } else {
      return (
        <div className="flex flex-col items-center gap-3 group opacity-40" key={name}>
          <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">{icon}</span>
          </div>
          <span className="text-sm font-semibold">{label}</span>
        </div>
      )
    }
  }

  // Format creation time
  const formattedTime = new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const formattedDate = new Date(data.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="max-w-7xl mx-auto py-10 space-y-12">
      
      {/* Header Card */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <GlassPanel className="bg-surface-container-low rounded-3xl p-8 flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'wght' 700" }}>engineering</span>
          </div>
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                data.priority === "Critical" ? "bg-error-container text-on-error-container" :
                data.priority === "High" ? "bg-orange-500/20 text-orange-500" :
                "bg-primary/20 text-primary"
              }`}>
                {data.priority} Priority
              </span>
              {isFallback && (
                <span className="bg-foreground/10 text-on-surface-variant px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
                  Specimen Mode
                </span>
              )}
              <Label className="text-on-surface-variant">INCIDENT LOGGED {formattedDate} {formattedTime}</Label>
            </div>
            <Headline level={1} className="text-display-lg mb-1">#UP-{data.id}</Headline>
            <BodyText variant="lg" className="max-w-xl text-on-surface-variant">{data.summary}</BodyText>
          </div>
          <div className="flex flex-col items-end gap-3 z-10">
            <div className="flex items-center gap-3 bg-primary/20 border border-primary/30 px-6 py-3 rounded-2xl animate-pulse">
              <span className="w-3 h-3 bg-primary rounded-full shadow-[0_0_12px_rgba(192,193,255,1)]"></span>
              <span className="font-bold text-primary text-xl uppercase tracking-tight">Status: {data.status}</span>
            </div>
            <p className="text-sm text-on-surface-variant">Estimated Resolution: {data.estimated_resolution_time}</p>
          </div>
        </GlassPanel>
      </motion.section>

      {/* Progress Visualizer */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-12"
      >
        <div className="relative px-4">
          <div className="h-1 w-full bg-surface-container-highest rounded-full absolute top-1/2 -translate-y-1/2 z-0"></div>
          <div 
            className="h-1 bg-gradient-to-r from-primary to-primary rounded-full absolute top-1/2 -translate-y-1/2 z-0 transition-all duration-1000" 
            style={{ width: getProgressWidth(data.status) }}
          ></div>
          <div className="relative z-10 flex justify-between">
            {renderStep("Reported", "check", "Reported")}
            {renderStep("AI Verified", "auto_awesome", "AI Verified")}
            {renderStep("Dispatched", "local_shipping", "Dispatched")}
            {renderStep("In Progress", "settings", "In Progress")}
            {renderStep("Resolved", "done_all", "Resolved")}
          </div>
        </div>
      </motion.section>

      {/* Grid Layout for Timeline and Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Timeline */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="lg:col-span-7 space-y-10"
        >
          <Headline level={3} className="px-2">Activity Timeline</Headline>
          <div className="relative ml-6 pl-10 border-l border-foreground/10 space-y-12">
            
            {/* Conditional Timeline Item 4: On-Site / In Progress */}
            {(data.status === "In Progress" || data.status === "Resolved" || data.status === "Closed") && (
              <motion.div variants={itemVariants} className="relative">
                <div className="absolute -left-[54px] top-0 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-[0_0_10px_rgba(192,193,255,0.3)]">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                </div>
                <div className="flex justify-between items-start mb-2">
                  <Headline level={4} className="font-bold">Worker On-Site</Headline>
                  <Label>09:12 AM</Label>
                </div>
                <GlassPanel className="bg-surface-container-high/40 p-4 rounded-2xl border-l-4 border-l-primary">
                  <BodyText className="text-on-surface-variant">
                    Technician arrived. Assessing damage and clearing area for emergency shut-off / repair works.
                  </BodyText>
                </GlassPanel>
              </motion.div>
            )}

            {/* Conditional Timeline Item 3: Worker Assigned / Dispatched */}
            {(data.status === "Dispatched" || data.status === "In Progress" || data.status === "Resolved" || data.status === "Closed") && (
              <motion.div variants={itemVariants} className="relative">
                <div className="absolute -left-[54px] top-0 w-8 h-8 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">person</span>
                </div>
                <div className="flex justify-between items-start mb-2">
                  <Headline level={4} className="font-bold">Technician Assigned</Headline>
                  <Label>08:58 AM</Label>
                </div>
                <div className="flex items-center gap-4 bg-foreground/5 p-4 rounded-2xl">
                  <img 
                    className="w-12 h-12 rounded-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7PqQe7ihizTopDNPQI56qybs-jA5p563CTEQ4TUcp1m2Z-M9ZiXwHehNz51UcEOYodrLQLuPzOKcqHuMhoKaRkT40YezKTUt7O4WUJBlbCqE_2dLquc5UOz1Up-yMidJhu_SmBPFhAteTgAwZd4BW7pUtMP9NcKBwXYj7OCcoan5MtxEyMt6Kft2tBu9v9bc9EZhuCM1YRTpQrLYIDugf29DkBJa0w-wFKYcLkPbOOnTdlzoJ1L_nTXD8I92xKtwV9sVcgi_hE-cT"
                    alt="Technician"
                  />
                  <div>
                    <p className="font-bold">{data.assigned_worker?.name || "Marcus J."}</p>
                    <Label>Senior Technician • {data.department || "Water Division"}</Label>
                  </div>
                  <button className="ml-auto text-primary p-2 hover:bg-primary/10 rounded-full transition-colors">
                    <span className="material-symbols-outlined">forum</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Timeline Item 2: Verification */}
            <motion.div variants={itemVariants} className="relative">
              <div className="absolute -left-[54px] top-0 w-8 h-8 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">verified_user</span>
              </div>
              <div className="flex justify-between items-start mb-2">
                <Headline level={4} className="font-bold">Verification Complete</Headline>
                <Label>08:45 AM</Label>
              </div>
              <div className="bg-surface-container/60 p-4 rounded-2xl border border-foreground/5 flex gap-4">
                <span className="material-symbols-outlined text-primary">check_circle</span>
                <BodyText variant="sm" className="text-on-surface-variant">
                  Duplicate check: 0 matches. AI confidence score: 98.4%. Incident assigned to **{data.department || "Public Works"}** department.
                </BodyText>
              </div>
            </motion.div>

            {/* Timeline Item 1: Reported */}
            <motion.div variants={itemVariants} className="relative">
              <div className="absolute -left-[54px] top-0 w-8 h-8 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">report_problem</span>
              </div>
              <div className="flex justify-between items-start mb-2">
                <Headline level={4} className="font-bold">Issue Detected</Headline>
                <Label>08:42 AM</Label>
              </div>
              <div className="bg-secondary/10 p-5 rounded-2xl border border-secondary/20 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <span className="material-symbols-outlined text-6xl">auto_awesome</span>
                </div>
                <div className="flex items-center gap-2 mb-2 text-secondary">
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  <span className="text-xs font-bold uppercase tracking-wider">CivicLens AI Analysis</span>
                </div>
                <p className="text-sm italic text-secondary/90 leading-relaxed">
                  "{data.summary}"
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side: Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="lg:col-span-5 space-y-6"
        >
          {/* Media Gallery */}
          <motion.div variants={itemVariants}>
            <GlassPanel className="bg-surface-container rounded-3xl p-6">
              <Headline level={4} className="mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">imagesmode</span>
                Media & Evidence
              </Headline>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative group cursor-pointer overflow-hidden rounded-xl h-40">
                  <img 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBK0rTXPhirqQrjYHLcKEDSwo3p9-WrAETo7NSxY4ywawqolS3JhhqwSo7k6_I-5tv4AUkndSl-te1V3WFCLWn5pD0nHHbzEx-CSwvjyErJ7zgC1FF25amFW_aUgUm2Kt6QFAWpcXUcR8w2d90CRP8z2e2ts9ByjP1NbTzuA3kIB5zjpW_x5bKMcMzvvk2fIj8NW3Hwtp3z9rfMtPKRdlpxq1nYUlIskosfX1H8R4o1HhdRyLbudQRIBmpHbkIPhCwbhysnP7m9oCSP"
                    alt="Evidence"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white">zoom_in</span>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-[10px] font-bold uppercase">Original Issue</div>
                </div>
                <div className="border-2 border-dashed border-foreground/10 rounded-xl h-40 flex flex-col items-center justify-center text-on-surface-variant/40 bg-foreground/5">
                  <span className="material-symbols-outlined text-3xl mb-2">pending</span>
                  <p className="text-xs font-semibold">Resolution Photo</p>
                  <p className="text-[10px] mt-1 uppercase tracking-widest">
                    {data.status === "Resolved" || data.status === "Closed" ? "Review Pending" : "Pending Finish"}
                  </p>
                </div>
              </div>
            </GlassPanel>
          </motion.div>

          {/* Location & ETA */}
          <motion.div variants={itemVariants}>
            <GlassPanel className="bg-surface-container rounded-3xl overflow-hidden p-0 border-0">
              <div className="h-48 relative">
                <div 
                  className="w-full h-full grayscale-[0.8] opacity-60 bg-surface-container-high bg-cover bg-center" 
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAwHumgIh2EZBPXJbPXWroTbtObyQhm8imJaTAYdL2A_rR1icn0JUnJzuHKDJYtYz3CrhttHVqhErAcoz-sNuntiaQJAAr-p24DU0S5J0bJhqHhc584jPZiEYKx41HHLpKy98AVnEhm6lwhSIg7N-P_FzxqZUh1TIcOQatQnh70OvksQ5Y72Poxhn_fKRuUspWR7GsPMht9gQo2F1m61rKIUtrW_tzXAdNP9dWNpLUHYfysULDsx0Aq3ZbY6Q8cZQ2ulGw2s6stxVEp')" }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-8 h-8 bg-primary rounded-full animate-ping absolute -inset-0 opacity-40"></div>
                    <div className="w-8 h-8 bg-primary rounded-full border-4 border-background shadow-lg relative flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border border-foreground/10 border-t-0 rounded-b-3xl">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <Label className="block mb-1">Location</Label>
                    <p className="font-bold text-lg">Sector 4 / City Grid</p>
                  </div>
                  <div className="text-right">
                    <Label className="block mb-1">Estimated Resolution</Label>
                    <p className="font-bold text-lg text-primary">{data.estimated_resolution_time}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full justify-center">
                  <span className="material-symbols-outlined text-sm mr-2">directions</span>
                  Open in Fleet Map
                </Button>
              </div>
            </GlassPanel>
          </motion.div>

          {/* Resolution Actions */}
          <motion.div variants={itemVariants}>
            <GlassPanel className="bg-surface-container-highest/60 rounded-3xl p-6">
              <Headline level={4} className="mb-4">Final Actions</Headline>
              <div className="space-y-4">
                <button 
                  className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all ${
                    data.status === "Resolved" || data.status === "Closed"
                      ? "bg-primary text-on-primary hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
                      : "bg-outline-variant text-on-surface/40 cursor-not-allowed grayscale"
                  }`} 
                  disabled={data.status !== "Resolved" && data.status !== "Closed"}
                >
                  <span className="material-symbols-outlined">how_to_reg</span>
                  Citizen Verification
                </button>
                <div className="pt-4 border-t border-foreground/5 text-center">
                  <p className="text-sm text-on-surface-variant mb-3">Rate current response quality</p>
                  <div className="flex justify-center gap-2">
                    <span className="material-symbols-outlined text-primary cursor-pointer">star</span>
                    <span className="material-symbols-outlined text-primary cursor-pointer">star</span>
                    <span className="material-symbols-outlined text-primary cursor-pointer">star</span>
                    <span className="material-symbols-outlined text-primary cursor-pointer">star</span>
                    <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors">star</span>
                  </div>
                </div>
              </div>
            </GlassPanel>
          </motion.div>

        </motion.div>
      </div>
    </div>
  )
}

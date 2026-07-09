import React from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { GlassPanel } from "@/components/ui/GlassPanel"
import { Headline, BodyText, Label } from "@/components/atoms/Typography"
import { Button } from "@/components/atoms/Button"
import { StatusChip } from "@/components/atoms/StatusChip"
import { KpiCard, ActionCard } from "@/components/molecules/Cards"
import { InsightWidget } from "@/components/organisms/Widgets"
import { MOCK_USER, MOCK_METRICS, MOCK_RECOMMENDATIONS } from "@/utils/mock-data"
import { api } from "@/services/api"
import { useNotifications } from "@/contexts/NotificationContext"

export function Dashboard() {
  const navigate = useNavigate()
  const { addNotification } = useNotifications()
  
  const { data: rawReports, isLoading } = useQuery({
    queryKey: ['complaints'],
    queryFn: api.getComplaints
  })
  
  const reports = (rawReports || []).slice(0, 3).map((r: any) => ({
    id: r.id,
    title: r.summary,
    status: r.status,
    progress: r.status === "Resolved" ? 100 : r.status === "In Progress" ? 50 : 15,
    expected_resolution: r.estimated_resolution_time,
    events: [{ type: r.status }],
    image_url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400"
  }))

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <Label className="text-on-surface-variant md:hidden mb-1 block">Welcome back,</Label>
          <Headline level={1} className="mb-2">Good evening, {MOCK_USER.name.split(' ')[0]}.</Headline>
          <BodyText variant="lg" className="max-w-2xl">The city is breathing steady tonight. Your neighborhood is operating at peak efficiency with no major disruptions reported.</BodyText>
        </div>
        
        {/* City Health Bento */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
          {MOCK_METRICS.slice(0, 3).map((metric) => (
            <KpiCard 
              key={metric.id} 
              title={metric.label} 
              value={metric.value} 
              icon={metric.icon}
              colorTheme={metric.id === 1 ? 'primary' : metric.id === 2 ? 'tertiary' : 'secondary'}
              className="min-w-[90px] md:min-w-[100px] items-center text-center p-3 md:p-4"
            />
          ))}
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Quick Actions */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <Headline level={3} className="md:hidden px-1">Quick Actions</Headline>
          <div className="grid grid-cols-2 gap-4">
            <ActionCard 
              title="Pay Bills"
              description="Settle utility, parking, or tax balances instantly." 
              icon="payments" 
              colorTheme="secondary" 
              onClick={() => {
                addNotification({
                  title: "Payment Processing",
                  message: "Connecting to secure payment gateway...",
                  type: "info",
                  group: "system"
                })
                setTimeout(() => navigate("/services"), 800)
              }}
            />
            <ActionCard 
              title="Find Services" 
              description="Locate health centers, libraries, and city offices." 
              icon="search_check" 
              colorTheme="tertiary" 
              onClick={() => navigate("/services")}
            />
          </div>

          {/* Active Reports Widget */}
          <GlassPanel className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Headline level={2} className="text-[20px] md:text-headline-md">Active Reports</Headline>
              <Button variant="ghost" className="font-body-md">View History</Button>
            </div>
            
            <div className="space-y-4 md:block flex gap-4 overflow-x-auto hide-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
              {isLoading ? <p className="p-4 text-on-surface-variant">Loading live reports...</p> : reports.length === 0 ? <p className="p-4 text-on-surface-variant">No active reports. All clear!</p> : reports.map((report: any) => (
                <div key={report.id} className="min-w-[240px] md:min-w-0 bg-foreground/5 border border-foreground/5 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 hover:bg-foreground/10 transition-colors cursor-pointer">
                  <div className="hidden md:block w-2 h-12 rounded-full" style={{ backgroundColor: report.progress > 50 ? 'var(--primary)' : 'var(--secondary)' }}></div>
                  <div className="md:hidden w-16 h-16 rounded-xl bg-surface-container overflow-hidden shrink-0">
                    <img className="w-full h-full object-cover" src={report.image_url} alt={report.title} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <Headline level={4} className="md:text-base text-[14px] leading-tight">{report.title}</Headline>
                      <StatusChip 
                        status={report.status} 
                        variant={report.progress > 50 ? 'primary' : 'secondary'} 
                        className="hidden md:inline-flex"
                      />
                    </div>
                    <p className="md:hidden font-label-sm text-[10px] text-on-surface-variant mb-2">{report.status}</p>
                    <div className="w-full bg-surface-variant md:bg-foreground/10 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${report.progress}%`, backgroundColor: report.progress > 50 ? 'var(--primary)' : 'var(--secondary)', boxShadow: report.progress > 50 ? '0 0 8px var(--primary)' : 'none' }}></div>
                    </div>
                    <div className="hidden md:flex justify-between mt-2 text-label-sm text-on-surface-variant">
                      <span>{report.events[report.events.length - 1].type} Complete</span>
                      <span>Expected Repair: {report.expected_resolution}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Side Cards */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          <InsightWidget 
            title={MOCK_RECOMMENDATIONS[0].title}
            insight={MOCK_RECOMMENDATIONS[0].description}
            actionLabel={MOCK_RECOMMENDATIONS[0].action}
          />

          {/* City Highlights */}
          <GlassPanel className="p-6">
            <Headline level={2} className="mb-4 hidden md:block">City Highlights</Headline>
            <div className="flex items-center gap-2 mb-4 md:hidden">
              <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <Headline level={3} className="text-[20px]">For You</Headline>
            </div>
            
            <div className="space-y-6">
              <div className="group cursor-pointer hidden md:block">
                <div className="w-full h-32 rounded-xl bg-surface-container-high mb-3 overflow-hidden">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzfDX1KOkb0sl6YdQNU5Aba8WaPpYOc0bRIirVhGRNByIsDTz72EedzLqNo4U2WQzLy11BS8JoRJzjNZNEOIDMK6AMYE5ptocbxxNb7eopN8p13HMmKfvLztKkqrrTTdSCX6cYc8sSQKABsS_x5pqRd7n7LI5VuDVA2eQn20-7iE30oWHMcDBHSE2QuDdhL9pz_6RE0imFAcfvEF2X8pVTFKKW_B3dcCasiFAASDxItUltT2VKTKNxfIAHji4zk5qTv0rHmuD8_P4C" alt="Park" />
                </div>
                <Label className="text-tertiary mb-1 block">Infrastructure</Label>
                <Headline level={4} className="mb-1 leading-tight">New AI-Integrated Green Zone Proposed for Central District</Headline>
                <BodyText className="line-clamp-2">The 12-acre smart park will feature autonomous irrigation and bioluminescent lighting...</BodyText>
              </div>

              {MOCK_RECOMMENDATIONS.slice(1).map((rec) => (
                <div key={rec.id} className={`flex gap-4 items-center p-3 hover:bg-foreground/5 rounded-xl transition-colors cursor-pointer md:bg-transparent bg-surface/40 md:border-none border-l-4 border-${rec.color}`}>
                  <div className={`w-12 h-12 flex-shrink-0 bg-${rec.color}-container/10 rounded-full md:rounded-lg flex items-center justify-center text-${rec.color}`}>
                    <span className="material-symbols-outlined">{rec.icon}</span>
                  </div>
                  <div className="flex-1">
                    <Headline level={4} className="leading-tight text-[14px] md:text-[16px]">{rec.title}</Headline>
                    <Label className="text-on-surface-variant mt-0.5 normal-case tracking-normal">{rec.description}</Label>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant md:hidden">chevron_right</span>
                </div>
              ))}
            </div>
          </GlassPanel>

        </div>
      </div>
    </div>
  )
}

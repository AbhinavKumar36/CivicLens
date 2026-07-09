import React, { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/services/api"
import { motion, AnimatePresence } from "framer-motion"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { GlassPanel } from "@/components/ui/GlassPanel"
import { Headline, BodyText, Label } from "@/components/atoms/Typography"
import { Button } from "@/components/atoms/Button"
import { cn } from "@/utils/utils"

// Constants
const USER_LOCATION: [number, number] = [19.0760, 72.8777] // Mumbai

// Custom SVG Icons
const createIcon = (colorObj: {bg: string, border: string, text: string}, iconName: string, isUser = false) => {
  return L.divIcon({
    className: "custom-leaflet-icon",
    html: `
      <div class="relative group transition-all ${isUser ? 'animate-bounce' : ''}">
        <div class="absolute -inset-2 ${colorObj.bg} rounded-full blur-md opacity-50 group-hover:opacity-80 transition-opacity ${isUser ? 'animate-pulse' : ''}"></div>
        <div class="relative w-10 h-10 bg-surface-container-high rounded-full border-2 ${colorObj.border} flex items-center justify-center ${colorObj.text} shadow-lg">
          <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">${iconName}</span>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

// Helper to generate a random position near SF Downtown for complaints missing coordinates
const getRandomPos = (): [number, number] => {
  const lat = 19.0760 + (Math.random() - 0.5) * 0.05
  const lng = 72.8777 + (Math.random() - 0.5) * 0.05
  return [lat, lng]
}

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase()
  if (cat.includes("infrastructure")) return { type: "construction", colorObj: { bg: "bg-primary", border: "border-primary", text: "text-primary" } }
  if (cat.includes("sanitation")) return { type: "delete", colorObj: { bg: "bg-secondary", border: "border-secondary", text: "text-secondary" } }
  if (cat.includes("traffic")) return { type: "directions_car", colorObj: { bg: "bg-tertiary", border: "border-tertiary", text: "text-tertiary" } }
  if (cat.includes("water")) return { type: "water_drop", colorObj: { bg: "bg-blue-500", border: "border-blue-500", text: "text-blue-500" } }
  if (cat.includes("power")) return { type: "bolt", colorObj: { bg: "bg-amber-500", border: "border-amber-500", text: "text-amber-500" } }
  if (cat.includes("environmental")) return { type: "eco", colorObj: { bg: "bg-green-500", border: "border-green-500", text: "text-green-500" } }
  if (cat.includes("safety") || cat.includes("public safety")) return { type: "local_police", colorObj: { bg: "bg-error", border: "border-error", text: "text-error" } }
  if (cat.includes("noise")) return { type: "volume_up", colorObj: { bg: "bg-orange-500", border: "border-orange-500", text: "text-orange-500" } }
  
  return { type: "report", colorObj: { bg: "bg-primary", border: "border-primary", text: "text-primary" } }
}

// Component to handle map camera movements
function MapController({ center, zoom, trigger }: { center: [number, number], zoom: number, trigger: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, trigger, map]);
  return null;
}

export function MapDashboard() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeSeverity, setActiveSeverity] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIncident, setSelectedIncident] = useState<number | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(USER_LOCATION);
  const [mapZoom, setMapZoom] = useState(14);
  const [locateTrigger, setLocateTrigger] = useState(0);

  const { data: complaints = [] } = useQuery({
    queryKey: ['complaints'],
    queryFn: api.getComplaints
  });

  const INCIDENTS = useMemo(() => {
    return complaints.map((c: any) => {
      const { type, colorObj } = getCategoryIcon(c.category)
      const pos: [number, number] = c.latitude && c.longitude
        ? [c.latitude, c.longitude]
        : getRandomPos()
        
      return {
        id: c.id,
        pos,
        category: c.category,
        type,
        colorObj,
        title: c.summary,
        dept: c.department,
        severity: c.severity,
        time: new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    })
  }, [complaints])

  // Filter Logic
  const filteredIncidents = useMemo(() => {
    return INCIDENTS.filter((inc: any) => {
      const matchCat = activeFilter === "All" || inc.category === activeFilter;
      const matchSev = activeSeverity === "ALL" || inc.severity.toUpperCase() === activeSeverity.toUpperCase();
      const matchSearch = inc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inc.dept.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSev && matchSearch;
    });
  }, [activeFilter, activeSeverity, searchQuery, INCIDENTS]);

  const selectedIncidentData = useMemo(() => INCIDENTS.find((i: any) => i.id === selectedIncident), [selectedIncident, INCIDENTS]);

  const handleLocateMe = () => {
    setMapCenter(USER_LOCATION);
    setMapZoom(15);
    setSelectedIncident(null);
    setLocateTrigger(Date.now());
  };

  return (
    <div className="relative h-[calc(100vh-72px)] w-full overflow-hidden bg-[#060e20]">
      
      {/* Map Container */}
      <div className="absolute inset-0 z-0">
        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          zoomControl={false}
          className="w-full h-full bg-[#060e20]"
        >
          <MapController center={mapCenter} zoom={mapZoom} trigger={locateTrigger} />
          
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {/* User Marker */}
          <Marker 
            position={USER_LOCATION} 
            icon={createIcon({bg: "bg-white", border: "border-white", text: "text-background"}, "my_location", true)}
          >
            <Popup className="custom-popup">
              <div className="bg-surface-container p-2 rounded-lg text-on-surface">
                <p className="font-bold">Current Location</p>
                <p className="text-xs text-on-surface-variant">Command Vehicle Alpha</p>
              </div>
            </Popup>
          </Marker>

          {/* Incident Markers */}
          {filteredIncidents.map((inc) => (
            <Marker 
              key={inc.id} 
              position={inc.pos} 
              icon={createIcon(inc.colorObj, inc.type)}
              eventHandlers={{
                click: () => {
                  setSelectedIncident(inc.id);
                  setMapCenter(inc.pos);
                  setMapZoom(16);
                  setLocateTrigger(Date.now());
                }
              }}
            />
          ))}

          {/* Route Preview (Drone Path) */}
          {selectedIncidentData && (
            <Polyline 
              positions={[USER_LOCATION, selectedIncidentData.pos]} 
              color="#c0c1ff" // primary color
              weight={3}
              dashArray="10, 15"
              opacity={0.6}
              lineCap="round"
            />
          )}

        </MapContainer>
        <div className="absolute inset-0 bg-primary/5 pointer-events-none mix-blend-overlay"></div>
      </div>

      {/* Floating UI: Top Search */}
      <div className="absolute top-4 left-0 right-0 z-20 flex justify-center px-4 pointer-events-none">
        <GlassPanel className="max-w-2xl w-full flex items-center gap-4 px-6 py-3 rounded-full pointer-events-auto shadow-xl">
          <span className="material-symbols-outlined text-primary">search</span>
          <input 
            className="bg-transparent border-none focus:ring-0 w-full text-on-surface placeholder:text-on-surface-variant font-body-md outline-none" 
            placeholder="Search infrastructure or complaints..." 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-on-surface-variant hover:text-foreground">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </GlassPanel>
      </div>

      {/* Floating UI: Filter Panel (Desktop) */}
      <div className="absolute top-24 right-4 md:right-8 z-20 w-72 md:w-80 pointer-events-auto hidden md:block">
        <GlassPanel className="rounded-3xl p-6 shadow-2xl space-y-6 bg-surface-container-low/90 backdrop-blur-xl border border-foreground/10">
          <Headline level={4} className="text-base mb-4">Map Filters</Headline>
          
          <div className="space-y-3 mb-6">
            <Label className="text-[11px] uppercase tracking-wider text-on-surface-variant block">Category</Label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: "Infrastructure", icon: "construction" },
                { label: "Sanitation", icon: "delete" },
                { label: "Traffic", icon: "directions_car" },
                { label: "Public Safety", icon: "policy" },
                { label: "Noise", icon: "volume_up" }
              ].map((cat) => (
                <button 
                  key={cat.label}
                  onClick={() => setActiveFilter(cat.label)}
                  className="flex items-center justify-between px-3 py-2 bg-foreground/5 rounded-xl border border-foreground/5 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[20px]">{cat.icon}</span>
                    <span className="text-sm">{cat.label}</span>
                  </div>
                  <div className={cn(
                    "w-4 h-4 rounded border flex items-center justify-center",
                    activeFilter === cat.label || activeFilter === "All" ? "border-primary bg-primary" : "border-foreground/20"
                  )}>
                    {(activeFilter === cat.label || activeFilter === "All") && <span className="material-symbols-outlined text-[12px] text-on-primary">check</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <Label className="text-[11px] uppercase tracking-wider text-on-surface-variant block">Severity</Label>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveSeverity(activeSeverity === "CRITICAL" ? "ALL" : "CRITICAL")}
                className={cn("flex-1 text-[10px] font-bold py-1.5 rounded-lg transition-colors border", activeSeverity === "CRITICAL" ? "bg-error text-on-error border-error" : "bg-error/10 text-error border-error/30 hover:bg-error/20")}
              >CRITICAL</button>
              <button 
                onClick={() => setActiveSeverity(activeSeverity === "HIGH" ? "ALL" : "HIGH")}
                className={cn("flex-1 text-[10px] font-bold py-1.5 rounded-lg transition-colors border", activeSeverity === "HIGH" ? "bg-orange-500 text-white border-orange-500" : "bg-orange-500/10 text-orange-500 border-orange-500/30 hover:bg-orange-500/20")}
              >HIGH</button>
              <button 
                onClick={() => setActiveSeverity(activeSeverity === "LOW" ? "ALL" : "LOW")}
                className={cn("flex-1 text-[10px] font-bold py-1.5 rounded-lg transition-colors border", activeSeverity === "LOW" ? "bg-foreground/20 text-foreground border-foreground/30" : "bg-foreground/5 text-on-surface-variant border-foreground/10 hover:bg-foreground/10")}
              >LOW</button>
            </div>
          </div>

          <div className="pt-4 border-t border-foreground/10 flex justify-between">
            <button onClick={() => {setActiveFilter("All"); setActiveSeverity("ALL"); setSearchQuery("")}} className="text-primary text-sm font-semibold hover:underline">Reset</button>
            <Label className="text-on-surface-variant text-xs">{filteredIncidents.length} Results</Label>
          </div>
        </GlassPanel>
        
        {/* Nearby Issues Preview */}
        {!selectedIncidentData && (
          <GlassPanel className="mt-4 rounded-2xl p-4 border border-foreground/10 bg-surface-container-low/90">
             <Label className="text-[11px] uppercase tracking-wider text-on-surface-variant block mb-3">Nearby Issues</Label>
             <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar pr-2">
               {filteredIncidents.slice(0,3).map(inc => (
                 <div key={inc.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => {
                   setSelectedIncident(inc.id);
                   setMapCenter(inc.pos);
                   setMapZoom(16);
                   setLocateTrigger(Date.now());
                 }}>
                   <div className={cn("w-2 h-2 rounded-full", inc.severity === "CRITICAL" ? "bg-error" : inc.severity === "HIGH" ? "bg-orange-500" : "bg-primary")}></div>
                   <div className="flex-1">
                     <p className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors truncate">{inc.title}</p>
                     <p className="text-[10px] text-on-surface-variant truncate">{inc.dept}</p>
                   </div>
                   <span className="material-symbols-outlined text-[14px] text-on-surface-variant group-hover:translate-x-1 transition-transform">arrow_forward</span>
                 </div>
               ))}
             </div>
          </GlassPanel>
        )}
      </div>

      {/* Issue Popup Card (Absolute positioned over map) */}
      <AnimatePresence>
        {selectedIncidentData && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-1/3 left-4 md:left-[10%] z-30 w-72 md:w-80 pointer-events-auto"
          >
            <GlassPanel className={cn("rounded-2xl p-6 shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-t-4 bg-surface-container/90 backdrop-blur-2xl", 
              selectedIncidentData.severity === "CRITICAL" ? "border-t-error" : 
              selectedIncidentData.severity === "HIGH" ? "border-t-orange-500" : 
              "border-t-primary"
            )}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-bold tracking-widest uppercase", 
                    selectedIncidentData.severity === "CRITICAL" ? "bg-error/20 text-error" : 
                    selectedIncidentData.severity === "HIGH" ? "bg-orange-500/20 text-orange-500" : 
                    "bg-primary/20 text-primary"
                  )}>
                    {selectedIncidentData.severity} PRIORITY
                  </span>
                  <Headline level={5} className="mt-2 leading-tight">{selectedIncidentData.title}</Headline>
                </div>
                <button onClick={() => setSelectedIncident(null)} className="text-on-surface-variant hover:text-foreground bg-foreground/5 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <div className="flex items-center gap-3 text-sm text-on-surface-variant mb-5 bg-black/20 p-2 rounded-lg">
                <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
                <span className="font-mono text-xs">Lat: {selectedIncidentData.pos[0].toFixed(4)}<br/>Lng: {selectedIncidentData.pos[1].toFixed(4)}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-foreground/5 p-3 rounded-xl border border-foreground/5">
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider mb-1">Department</p>
                  <p className="text-sm font-semibold">{selectedIncidentData.dept}</p>
                </div>
                <div className="bg-foreground/5 p-3 rounded-xl border border-foreground/5">
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider mb-1">Reported At</p>
                  <p className="text-sm font-semibold">{selectedIncidentData.time}</p>
                </div>
              </div>
              
              <div className="bg-primary/10 border border-primary/20 p-3 rounded-xl flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary">route</span>
                <p className="text-xs text-primary font-medium">Route calculated via dispatch node.</p>
              </div>

              <Button className="w-full bg-gradient-to-r from-primary to-secondary text-on-primary font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Dispatch Unit
              </Button>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating UI: Bottom Controls */}
      <div className="absolute bottom-8 right-4 md:right-8 z-30 flex flex-col items-end gap-4 pointer-events-none">
        
        <button 
          onClick={handleLocateMe}
          className="pointer-events-auto w-12 h-12 rounded-full bg-surface-container-highest border border-foreground/10 flex items-center justify-center text-on-surface hover:bg-foreground/10 transition-colors shadow-xl"
          title="Locate Me"
        >
          <span className="material-symbols-outlined text-primary">my_location</span>
        </button>

        <button 
          onClick={() => navigate("/report")}
          className="pointer-events-auto h-14 px-6 rounded-full bg-gradient-to-r from-primary to-secondary text-on-primary font-bold flex items-center gap-3 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">add_location_alt</span>
          <span className="hidden sm:inline">Quick Report</span>
        </button>
      </div>

    </div>
  )
}

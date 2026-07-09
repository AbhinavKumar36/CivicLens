export const MOCK_USER = {
  id: 1,
  name: "Priya Sharma",
  role: "citizen",
  avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
  tier: "Standard Tier"
};

export const MOCK_REPORTS = [
  {
    id: 1,
    report_id: "UP-9928",
    title: "Pothole Alert: Oak Street",
    status: "In Progress",
    category: "Infrastructure",
    location_lat: 40.7128,
    location_lng: -74.0060,
    address: "Oak Street & 5th Ave",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAloaeI3z92hJ8-vQBLTMYW7TLAm42SkT0qmWKYOnwqBc1mdKa3ISM2f1WezSpuwi49dm3hPkO4RFYSmFIuSj5GE7T9l7gaDIGLOnmqlphGXf73nF0EJmDUHDqoQAAjN8sXlnRqF_TozfXDq6c1RSDYL-s501fYYRhLXLCBDkTDvwRmWBTlqPJRujo8nuhxBB2KKjTNmpyHO2pUBbedk-VRQiPruHpmSkpbN1wKawdRJbi-34qZ_n6j2hkQ52jkq98jRxDqDnbTNR3M",
    expected_resolution: "4h",
    progress: 65,
    created_at: new Date().toISOString(),
    events: [
      { id: 1, type: "Reported", description: "Issue submitted by Citizen", time: "2026-07-04T09:00:00Z" },
      { id: 2, type: "AI Verified", description: "AI detected a pothole matching previous reports", time: "2026-07-04T09:05:00Z" },
      { id: 3, type: "Dispatched", description: "Public Works team dispatched", time: "2026-07-04T10:15:00Z" }
    ]
  },
  {
    id: 2,
    report_id: "UP-9929",
    title: "Public Park Lighting Repair",
    status: "Dispatched",
    category: "Lighting",
    location_lat: 40.7138,
    location_lng: -74.0070,
    address: "Central Park West",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4O_-ad7phRnv0XmZS2vxBkWP6XIGD7L-up4nqO4-3sQqSSntffhSq1W7adhX7604Z2wRAovJAOp_FtzOXOWNcHRLEGi9BlaH4s6Jz2apqnxvdnc0p8CygRYK0SP-uOqJ1D8F6c-AQBAwIKZhA-JctDzDJmEb_jgQ0T1CUUilo0Y7cPhvgaVo8Fq1-1bi93YEX4bqGVts4vlB3W_t3cGn7IUYcbsKSs1WOhb-I7Bn0-XBbdDAf2Z-selD_D-kAA5wbcOCFVRTl8F-p",
    expected_resolution: "Tomorrow",
    progress: 30,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    events: [
      { id: 1, type: "Reported", description: "Issue submitted by Citizen", time: "2026-07-03T18:00:00Z" }
    ]
  }
];

export const MOCK_METRICS = [
  { id: 1, type: "weather", value: "72°F", label: "Weather", icon: "cloud" },
  { id: 2, type: "aqi", value: "42", label: "AQI", icon: "air" },
  { id: 3, type: "transit", value: "98%", label: "Transit", icon: "directions_transit" },
  { id: 4, type: "traffic", value: "Light", label: "Traffic", icon: "traffic" }
];

export const MOCK_RECOMMENDATIONS = [
  { id: 1, title: "Parking Permit Expiring", type: "alert", icon: "auto_awesome", color: "primary", description: "Your District 4 permit expires in 3 days. Renew now to avoid auto-citations.", action: "Renew Instantly" },
  { id: 2, title: "Community Jazz Night", type: "event", icon: "event", color: "primary", description: "Starts in 2 hours • Central Plaza" },
  { id: 3, title: "Service Reminder", type: "reminder", icon: "water_drop", color: "secondary", description: "Water maintenance tomorrow, 9AM" }
];

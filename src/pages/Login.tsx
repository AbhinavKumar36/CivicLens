import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Headline, BodyText } from "@/components/atoms/Typography";
import { useAuth, type User } from "@/contexts/AuthContext";

const PREDEFINED_USERS: User[] = [
  { id: 1, name: "Priya Sharma", email: "priya@example.com", role: "CITIZEN", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80" },
  { id: 2, name: "Ananya Gupta", email: "operator@civiclens.gov", role: "OPERATOR", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80" },
  { id: 3, name: "Rahul Verma", email: "rahul.worker@civiclens.gov", role: "WORKER", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (user: User) => {
    login(user);
    
    // Redirect based on role or intended destination
    const from = (location.state as any)?.from?.pathname;
    
    if (from && from !== '/') {
      navigate(from, { replace: true });
    } else {
      switch (user.role) {
        case 'CITIZEN': navigate("/dashboard", { replace: true }); break;
        case 'OPERATOR': navigate("/admin", { replace: true }); break;
        case 'WORKER': navigate("/worker", { replace: true }); break;
        default: navigate("/dashboard", { replace: true });
      }
    }
  };

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'CITIZEN': return "text-primary bg-primary/10 border-primary/20 hover:border-primary/50 hover:bg-primary/20";
      case 'OPERATOR': return "text-secondary bg-secondary/10 border-secondary/20 hover:border-secondary/50 hover:bg-secondary/20";
      case 'WORKER': return "text-tertiary bg-tertiary/10 border-tertiary/20 hover:border-tertiary/50 hover:bg-tertiary/20";
      default: return "";
    }
  };

  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'CITIZEN': return "person";
      case 'OPERATOR': return "admin_panel_settings";
      case 'WORKER': return "engineering";
      default: return "person";
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-secondary/15 blur-[150px] rounded-full pointer-events-none"></div>

      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show"
        className="max-w-4xl w-full z-10 space-y-12"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl overflow-hidden mx-auto shadow-[0_0_30px_rgba(192,193,255,0.2)]">
            <img src="/logo.jpeg" alt="CivicLens Logo" className="w-full h-full object-cover" />
          </div>
          <Headline level={1} className="text-foreground">Select Your Role</Headline>
          <BodyText className="text-on-surface-variant max-w-lg mx-auto">
            Welcome to the CivicLens AI Operating System. Choose a profile to enter the unified civic workspace.
          </BodyText>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PREDEFINED_USERS.map((user) => (
            <motion.div key={user.id} variants={itemVariants}>
              <GlassPanel 
                hover 
                onClick={() => handleLogin(user)}
                className={`p-8 text-center cursor-pointer transition-all duration-300 transform hover:-translate-y-2 border-2 ${getRoleColor(user.role).split('hover:')[0]} hover:shadow-2xl`}
              >
                <div className="w-24 h-24 rounded-full mx-auto mb-6 overflow-hidden border-4 border-background shadow-lg relative">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  <div className={`absolute bottom-0 right-0 w-8 h-8 rounded-full border-2 border-background flex items-center justify-center ${getRoleColor(user.role).split(' ')[1]} ${getRoleColor(user.role).split(' ')[0]}`}>
                    <span className="material-symbols-outlined text-[16px]">{getRoleIcon(user.role)}</span>
                  </div>
                </div>
                <Headline level={3} className="text-foreground mb-1">{user.name}</Headline>
                <p className={`text-xs font-bold uppercase tracking-widest ${getRoleColor(user.role).split(' ')[0]}`}>
                  {user.role} PORTAL
                </p>
                <BodyText className="text-xs text-on-surface-variant mt-4 opacity-80">
                  {user.role === 'CITIZEN' && "Report issues, pay utilities, and claim civic rewards."}
                  {user.role === 'OPERATOR' && "Dispatch units, monitor emergencies, and view analytics."}
                  {user.role === 'WORKER' && "Receive tasks, log progress, and resolve city infrastructure issues."}
                </BodyText>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button 
            onClick={() => navigate("/")}
            className="text-on-surface-variant hover:text-foreground text-sm flex items-center justify-center gap-2 mx-auto transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Landing Page
          </button>
        </div>
      </motion.div>
    </div>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Tabs from "@radix-ui/react-tabs";
import { Music2, BarChart2, FlaskConical } from "lucide-react";
import { PersonSection } from "./components/PersonSection";
import { CompareSection } from "./components/CompareSection";
import { AnalysisSection } from "./components/AnalysisSection";
import { JP, AR } from "./data/spotify";

const TABS = [
  { id: "jp",       label: "Juan Pablo",  icon: <Music2 size={14} />,       color: JP.color  },
  { id: "ar",       label: "Aranza",      icon: <Music2 size={14} />,       color: AR.color  },
  { id: "compare",  label: "Comparativa", icon: <BarChart2 size={14} />,    color: "#ffffff" },
  { id: "analysis-jp", label: "Analisis JP",   icon: <FlaskConical size={14} />, color: JP.color  },
  { id: "analysis-ar", label: "Analisis AR",   icon: <FlaskConical size={14} />, color: AR.color  },
];

function SpotifyLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" style={{ color: "#1DB954" }}>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  );
}

function TabContent({ id, activeTab, children }) {
  return (
    <Tabs.Content value={id} forceMount className={activeTab !== id ? "hidden" : ""}>
      <AnimatePresence mode="wait">
        {activeTab === id && (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </Tabs.Content>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("jp");

  const activeColor = TABS.find(t => t.id === activeTab)?.color ?? "#ffffff";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-[0.06] transition-all duration-1000"
          style={{ background: activeColor }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-[0.03] transition-all duration-1000"
          style={{ background: activeColor }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <SpotifyLogo />
              <div>
                <div className="text-[13px] font-bold text-white leading-none">Spotify Analytics</div>
                <div className="text-[10px] text-white/30 tracking-widest uppercase mt-0.5">JP & Aranza</div>
              </div>
            </div>
            <div className="text-[11px] text-white/20 hidden sm:block">Datos 2015 – 2026</div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          {/* Tab list */}
          <Tabs.List className="flex flex-wrap gap-2 mb-10 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.06] w-fit mx-auto">
            {TABS.map((tab) => (
              <Tabs.Trigger
                key={tab.id}
                value={tab.id}
                className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 outline-none cursor-pointer text-white/40 hover:text-white/70 data-[state=active]:text-white"
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: `${tab.color}15`, border: `1px solid ${tab.color}30` }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center">{tab.icon}</span>
                <span className="relative z-10">{tab.label}</span>
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <TabContent id="jp"          activeTab={activeTab}><PersonSection person={JP} /></TabContent>
          <TabContent id="ar"          activeTab={activeTab}><PersonSection person={AR} /></TabContent>
          <TabContent id="compare"     activeTab={activeTab}><CompareSection /></TabContent>
          <TabContent id="analysis-jp" activeTab={activeTab}><AnalysisSection person={JP} /></TabContent>
          <TabContent id="analysis-ar" activeTab={activeTab}><AnalysisSection person={AR} /></TabContent>
        </Tabs.Root>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="text-[11px] text-white/15">
            Datos extraidos de Spotify Extended History · 2015–2026
          </div>
          <div className="flex items-center gap-2">
            <SpotifyLogo />
            <span className="text-[11px] text-white/15">Analytics Dashboard</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

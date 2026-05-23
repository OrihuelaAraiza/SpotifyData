import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Tabs from "@radix-ui/react-tabs";
import { Music2, BarChart2, FlaskConical, User } from "lucide-react";
import { PersonSection } from "./components/PersonSection";
import { CompareSection } from "./components/CompareSection";
import { AnalysisSection } from "./components/AnalysisSection";
import { JP, AR } from "./data/spotify";

const PERSON_TABS = [
  { id: "jp",      label: "Juan Pablo",  color: JP.color  },
  { id: "ar",      label: "Aranza",      color: AR.color  },
  { id: "compare", label: "Comparativa", color: "#ffffff" },
];

const SUB_TABS = [
  { id: "profile",  label: "Perfil",   icon: <User size={12} />        },
  { id: "analysis", label: "Analisis", icon: <FlaskConical size={12} /> },
];

function SpotifyLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" style={{ color: "#1DB954" }}>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  );
}

export default function App() {
  const [activePerson, setActivePerson] = useState("jp");
  const [subTabs, setSubTabs] = useState({ jp: "profile", ar: "profile" });

  const activeColor = activePerson === "jp" ? JP.color : activePerson === "ar" ? AR.color : "#ffffff";
  const activePerson_data = activePerson === "jp" ? JP : AR;
  const activeSubTab = subTabs[activePerson] ?? "profile";

  function setSubTab(tab) {
    setSubTabs(prev => ({ ...prev, [activePerson]: tab }));
  }

  function renderContent() {
    if (activePerson === "compare") return <CompareSection />;
    if (activeSubTab === "analysis") return <AnalysisSection person={activePerson_data} />;
    return <PersonSection person={activePerson_data} />;
  }

  const contentKey = `${activePerson}-${activeSubTab}`;

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

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Level 1: person selector ── */}
        <div className="flex justify-center mb-3">
          <div className="flex gap-2 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            {PERSON_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActivePerson(tab.id)}
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-medium transition-colors duration-150 outline-none cursor-pointer"
                style={{ color: activePerson === tab.id ? "#fff" : "rgba(255,255,255,0.35)" }}
              >
                {activePerson === tab.id && (
                  <motion.div
                    layoutId="person-indicator"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: `${tab.color}18`, border: `1px solid ${tab.color}35` }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex items-center">
                  <Music2 size={13} className="mr-1.5 opacity-70" />
                </span>
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Level 2: sub-tabs (only for JP / AR) ── */}
        <AnimatePresence>
          {activePerson !== "compare" && (
            <motion.div
              key="subtabs"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="flex justify-center mb-10 overflow-hidden"
            >
              <div className="flex gap-1 p-0.5 rounded-xl bg-white/[0.02] border border-white/[0.04] mt-2">
                {SUB_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSubTab(tab.id)}
                    className="relative flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[12px] font-medium transition-colors duration-150 outline-none cursor-pointer"
                    style={{ color: activeSubTab === tab.id ? "#fff" : "rgba(255,255,255,0.30)" }}
                  >
                    {activeSubTab === tab.id && (
                      <motion.div
                        layoutId="sub-indicator"
                        className="absolute inset-0 rounded-lg"
                        style={{ background: `${activeColor}20`, border: `1px solid ${activeColor}30` }}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center opacity-70">{tab.icon}</span>
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {activePerson === "compare" && <div className="mb-10" />}

        {/* ── Content ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={contentKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

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

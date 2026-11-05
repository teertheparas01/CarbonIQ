'use client';

import { motion, useReducedMotion } from "motion/react";
import { Card, CardContent, CardHeader } from "../components/ui";
import { GlassButton } from "../lib/animations";
import {
  Sliders,
  Shield,
  Database,
  Bell,
  Palette,
  Moon,
  Save,
  Loader,
  CheckCircle,
  Mail,
  Sun,
  Download,
  Upload,
} from "lucide-react";

import { useState } from "react";

export function SystemSettings() {
  const reduce = useReducedMotion();
  const [activeTab, setActiveTab] = useState<
    "general" | "appearance" | "notifications" | "security" | "data"
  >("general");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs: Array<{ id: "general" | "appearance" | "notifications" | "security" | "data"; label: string; icon: typeof Sliders }> = [
    { id: "general", label: "General", icon: Sliders },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "data", label: "Data & Privacy", icon: Database },
  ];

  return (
    <motion.div
      className="space-y-8 max-w-5xl mx-auto pb-16"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Page Header */}
      <motion.header
        className="page-header"
        initial={reduce ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl glass glass--highlighted">
            <Sliders className="w-6 h-6 text-brand-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-950 tracking-tight">System Settings</h1>
            <p className="text-sm text-brand-600">
              Configure your CarbonIQ experience, preferences, and system behavior.
            </p>
          </div>
        </div>
      </motion.header>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <motion.aside
          className="lg:col-span-1"
          initial={reduce ? false : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card glass className="glass--highlighted h-fit sticky top-24">
            <CardHeader>
              <h3 className="text-sm font-semibold text-brand-950">Settings</h3>
            </CardHeader>
            <CardContent className="pt-0 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                    activeTab === tab.id
                      ? "bg-brand-700/10 text-brand-700 glass glass--strong"
                      : "text-brand-600 hover:bg-brand-50 hover:text-brand-900"
                  }`}
                >
                  <tab.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Save Bar */}
          <Card glass className="glass--strong mt-4 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-brand-500">Changes pending</span>
                {saved && <span className="text-xs font-semibold text-emerald-600">Saved</span>}
              </div>
              <GlassButton
                variant="primary"
                size="sm"
                onClick={handleSave}
                loading={isSaving}
                className="w-full sm:w-auto"
              >
                {isSaving ? <Loader className="w-4 h-4 animate-spin" /> : <>Save<Save className="w-4 h-4 ml-1" /></>}
              </GlassButton>
            </div>
          </Card>
        </motion.aside>

        {/* Content Panels */}
        <motion.div
          className="lg:col-span-3 space-y-6"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {activeTab === "general" && (
            <Card glass>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-brand-100/80 text-brand-700">
                      <Sliders className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-brand-950">General</h2>
                      <p className="text-xs text-brand-500">Core system preferences and defaults</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-brand-950 uppercase tracking-wider">Application</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="p-4 rounded-xl glass glass--highlighted space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-brand-950">Default Landing Page</p>
                          <p className="text-xs text-brand-500">Page shown on app load</p>
                        </div>
                        <select className="px-3 py-2 rounded-lg border border-brand-200/70 bg-white/80 text-sm text-brand-950 focus:outline-none focus:ring-2 focus:ring-brand-500/20">
                          <option>Dashboard</option>
                          <option>Electricity</option>
                          <option>Forecast</option>
                        </select>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl glass glass--highlighted space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-brand-950">Default Forecast Month</p>
                          <p className="text-xs text-brand-500">Month used when creating new forecasts</p>
                        </div>
                        <select className="px-3 py-2 rounded-lg border border-brand-200/70 bg-white/80 text-sm text-brand-950 focus:outline-none focus:ring-2 focus:ring-brand-500/20">
                          <option>Current Month</option>
                          <option>Next Month</option>
                          <option value="1">January</option>
                          <option value="2">February</option>
                          <option value="3">March</option>
                          <option value="4">April</option>
                          <option value="5">May</option>
                          <option value="6">June</option>
                          <option value="7">July</option>
                          <option value="8">August</option>
                          <option value="9">September</option>
                          <option value="10">October</option>
                          <option value="11">November</option>
                          <option value="12">December</option>
                        </select>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl glass glass--highlighted space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-brand-950">Auto-save Forecasts</p>
                          <p className="text-xs text-brand-500">Automatically save predictions to history</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-brand-200 peer-focus:ring-2 peer-focus:ring-brand-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-brand-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-brand-100/50 space-y-4">
                  <h3 className="text-sm font-semibold text-brand-950 uppercase tracking-wider">Units & Format</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="p-4 rounded-xl glass glass--highlighted space-y-3">
                      <p className="text-sm font-medium text-brand-950">Energy Units</p>
                      <select className="px-3 py-2 rounded-lg border border-brand-200/70 bg-white/80 text-sm text-brand-950 focus:outline-none focus:ring-2 focus:ring-brand-500/20">
                        <option>kWh (Kilowatt-hours)</option>
                        <option>MWh (Megawatt-hours)</option>
                        <option>GJ (Gigajoules)</option>
                      </select>
                    </div>
                    <div className="p-4 rounded-xl glass glass--highlighted space-y-3">
                      <p className="text-sm font-medium text-brand-950">CO₂ Units</p>
                      <select className="px-3 py-2 rounded-lg border border-brand-200/70 bg-white/80 text-sm text-brand-950 focus:outline-none focus:ring-2 focus:ring-brand-500/20">
                        <option>kg CO₂</option>
                        <option>t CO₂ (Tonnes)</option>
                        <option>lb CO₂</option>
                      </select>
                    </div>
                    <div className="p-4 rounded-xl glass glass--highlighted space-y-3">
                      <p className="text-sm font-medium text-brand-950">Date Format</p>
                      <select className="px-3 py-2 rounded-lg border border-brand-200/70 bg-white/80 text-sm text-brand-950 focus:outline-none focus:ring-2 focus:ring-brand-500/20">
                        <option>DD/MM/YYYY</option>
                        <option>MM/DD/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                    <div className="p-4 rounded-xl glass glass--highlighted space-y-3">
                      <p className="text-sm font-medium text-brand-950">Number Format</p>
                      <select className="px-3 py-2 rounded-lg border border-brand-200/70 bg-white/80 text-sm text-brand-950 focus:outline-none focus:ring-2 focus:ring-brand-500/20">
                        <option>1,234.56 (US)</option>
                        <option>1.234,56 (EU)</option>
                        <option>1 234,56 (Space)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "appearance" && (
            <Card glass>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-100/80 text-amber-700">
                      <Palette className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-brand-950">Appearance</h2>
                      <p className="text-xs text-brand-600">Theme, colors, and visual preferences</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-brand-950 uppercase tracking-wider">Theme</h3>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <button className="p-4 rounded-xl glass glass--highlighted flex items-center gap-3 border-2 border-brand-300/50">
                      <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center">
                        <Moon className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-brand-950">Dark</p>
                        <p className="text-xs text-brand-500">Dark theme</p>
                      </div>
                    </button>
                    <button className="p-4 rounded-xl glass glass--highlighted flex items-center gap-3 border-2 border-brand-300/50">
                      <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center">
                        <Sun className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-brand-950">System</p>
                        <p className="text-xs text-brand-500">Follow system</p>
                      </div>
                    </button>
                    <button className="p-4 rounded-xl glass glass--highlighted flex items-center gap-3 border-2 border-brand-300/50">
                      <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center">
                        <Moon className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-brand-950">Light</p>
                        <p className="text-xs text-brand-500">Light theme</p>
                      </div>
                    </button>
                  </div>

                  <div className="pt-6 border-t border-brand-100/50 space-y-4">
                    <h3 className="text-sm font-semibold text-brand-950 uppercase tracking-wider">Accent Color</h3>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { color: "bg-brand-600", name: "Brand" },
                        { color: "bg-emerald-500", name: "Emerald" },
                        { color: "bg-blue-500", name: "Blue" },
                        { color: "bg-amber-500", name: "Amber" },
                        { color: "bg-rose-500", name: "Rose" },
                        { color: "bg-violet-500", name: "Violet" },
                      ].map((c) => (
                        <button
                          key={c.name}
                          className={`w-10 h-10 rounded-lg ${c.color} border-2 border-transparent hover:border-white/50 transition-all`}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card glass>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-100/80 text-amber-700">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-brand-950">Notifications</h2>
                      <p className="text-xs text-brand-600">Manage alerts and notification preferences</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-brand-950 uppercase tracking-wider">Email Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 rounded-xl glass glass--highlighted">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-100/80 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-brand-950">Forecast Ready</p>
                          <p className="text-xs text-brand-500">Email when forecast is ready</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-brand-200 peer-focus:ring-2 peer-focus:ring-brand-500/20 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-brand-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                      </label>
                    </label>
                    <label className="flex items-center justify-between p-4 rounded-xl glass glass--highlighted">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100/80 flex items-center justify-center">
                          <Bell className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-brand-950">Forecast Complete</p>
                          <p className="text-xs text-brand-500">Push notification when ready</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-brand-200 peer-focus:ring-2 peer-focus:ring-brand-500/20 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-brand-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                      </label>
                    </label>
                  </div>

                  <div className="pt-6 border-t border-brand-100/50 space-y-4">
                    <h3 className="text-sm font-semibold text-brand-950 uppercase tracking-wider">In-App Notifications</h3>
                    <label className="flex items-center justify-between p-4 rounded-xl glass glass--highlighted">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100/80 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-brand-950">Forecast Complete</p>
                          <p className="text-xs text-brand-500">Show in-app banner when ready</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-brand-200 peer-focus:ring-2 peer-focus:ring-brand-500/20 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-brand-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                      </label>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card glass>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-rose-100/80 text-rose-700">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-brand-950">Security & Privacy</h2>
                      <p className="text-xs text-brand-600">Access control and data protection</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-brand-950 uppercase tracking-wider">Data Privacy</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 rounded-xl glass glass--highlighted">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-rose-100/80 flex items-center justify-center">
                          <Shield className="w-5 h-5 text-rose-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-brand-950">Data Encryption</p>
                          <p className="text-xs text-brand-500">Encrypt stored forecast data</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-brand-200 peer-focus:ring-2 peer-focus:ring-brand-500/20 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-brand-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                      </label>
                    </label>
                    <label className="flex items-center justify-between p-4 rounded-xl glass glass--highlighted">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-100/80 flex items-center justify-center">
                          <Database className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-brand-950">Local Storage Only</p>
                          <p className="text-xs text-brand-500">Keep all data in browser only</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-brand-200 peer-focus:ring-2 peer-focus:ring-brand-500/20 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-brand-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                      </label>
                    </label>
                  </div>

                  <div className="pt-6 border-t border-brand-100/50 space-y-4">
                    <h3 className="text-sm font-semibold text-brand-950 uppercase tracking-wider">Session</h3>
                    <div className="p-4 rounded-xl glass glass--highlighted space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-brand-950">Auto-logout</p>
                          <p className="text-xs text-brand-500">Minutes of inactivity before logout</p>
                        </div>
                        <select className="px-3 py-2 rounded-lg border border-brand-200/70 bg-white/80 text-sm text-brand-950 focus:outline-none focus:ring-2 focus:ring-brand-500/20 w-auto">
                          <option>30 minutes</option>
                          <option>1 hour</option>
                          <option>4 hours</option>
                          <option>Never</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "data" && (
            <Card glass>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-100/80 text-blue-700">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-brand-950">Data & Privacy</h2>
                      <p className="text-xs text-brand-600">Manage your data, exports, and deletion</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-brand-950 uppercase tracking-wider">Data Management</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <button className="p-4 rounded-xl glass glass--highlighted flex items-center gap-3 text-left border border-brand-200/70 hover:border-brand-300/50 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-blue-100/80 flex items-center justify-center">
                        <Download className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-brand-950">Export Data</p>
                        <p className="text-xs text-brand-500">Download all forecasts as CSV</p>
                      </div>
                    </button>
                    <button className="p-4 rounded-xl glass glass--highlighted flex items-center gap-3 text-left border border-brand-200/70 hover:border-brand-300/50 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100/80 flex items-center justify-center">
                        <Upload className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-brand-950">Import Data</p>
                        <p className="text-xs text-brand-500">Upload forecast history CSV</p>
                      </div>
                    </button>
                  </div>

                  <div className="pt-6 border-t border-brand-100/50 space-y-4">
                    <h3 className="text-sm font-semibold text-brand-950 uppercase tracking-wider">Danger Zone</h3>
                    <div className="p-4 rounded-xl glass glass--highlighted border border-rose-200/50 bg-rose-50/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-rose-800">Clear All Forecast History</p>
                          <p className="text-xs text-rose-600">Permanently delete all saved predictions. Cannot be undone.</p>
                        </div>
                        <button className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-100/80 rounded-lg hover:bg-rose-200/80 transition-colors">
                          Clear History
                        </button>
                      </div>
                      <div className="p-4 rounded-xl glass glass--highlighted border border-rose-200/50 bg-rose-50/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-rose-800">Delete Account & All Data</p>
                            <p className="text-xs text-rose-600">Permanently remove your account and all associated data. Irreversible.</p>
                          </div>
                          <button className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-100/80 rounded-lg hover:bg-rose-200/80 transition-colors">
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
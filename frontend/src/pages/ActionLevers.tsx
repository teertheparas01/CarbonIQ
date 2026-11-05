'use client';

import { motion, useReducedMotion } from "motion/react";
import { Card, CardContent, CardHeader } from "../components/ui";
import { Badge } from "../components/ui";
import { GlassButton } from "../lib/animations";
import {
  Zap,
  Leaf,
  Home,
  Car,
  Factory,
  TreePine,
  Sun,
  Wind,
  Battery,
  Shield,
  TrendingUp,
  Target,
  Zap as ZapIcon,
  Settings,
  Calculator,
  Lightbulb,
  Leaf as LeafIcon,
  Droplets,
  Flame,
  Car as CarIcon,
  Building2,
  Tree,
  Sun as SunIcon2,
  Wind as WindIcon2,
  Battery as BatteryIcon2,
  Shield as ShieldIcon2,
  Search,
} from "lucide-react";

import { useState } from "react";

const levers = [
  {
    id: "heat-pump",
    title: "Heat Pump Installation",
    category: "Heating & Cooling",
    icon: Sun,
    color: "bg-amber-500",
    description: "Replace gas/oil boiler with an air-source or ground-source heat pump for efficient heating and cooling.",
    impact: { co2: "2,500 kg/yr", cost: "₹8–15L", savings: "₹40–60k/yr" },
    difficulty: "High",
    tags: ["Heating", "Cooling", "High Impact"],
  },
  {
    id: "solar-pv",
    title: "Rooftop Solar PV",
    category: "Electricity Generation",
    icon: Sun,
    color: "bg-amber-500",
    description: "Install rooftop solar panels to generate clean electricity and reduce grid dependence.",
    impact: { co2: "1,800 kg/yr", cost: "₹3–5L", savings: "₹25–40k/yr" },
    difficulty: "Medium",
    tags: ["Electricity", "Generation", "High ROI"],
  },
  {
    id: "ev-charging",
    title: "EV + Home Charging",
    category: "Transport",
    icon: Car,
    color: "bg-blue-500",
    description: "Switch to an electric vehicle and install home charging to eliminate petrol/diesel emissions.",
    impact: { co2: "2,200 kg/yr", cost: "₹12–25L", savings: "₹60–90k/yr" },
    difficulty: "Medium",
    tags: ["Transport", "EV", "High Savings"],
  },
  {
    id: "induction-cooking",
    title: "Induction Cooking",
    category: "Kitchen",
    icon: Flame,
    color: "bg-rose-500",
    description: "Replace gas/LPG stove with induction cooktop for efficient, clean cooking.",
    impact: { co2: "400 kg/yr", cost: "₹15–30k", savings: "₹8–12k/yr" },
    difficulty: "Low",
    tags: ["Cooking", "Indoor Air", "Easy Win"],
  },
  {
    id: "led-lighting",
    title: "Full LED Retrofit",
    category: "Lighting",
    icon: Lightbulb,
    color: "bg-amber-500",
    description: "Replace all CFL/incandescent bulbs with high-efficiency LEDs throughout the home.",
    impact: { co2: "300 kg/yr", cost: "₹10–20k", savings: "₹8–15k/yr" },
    difficulty: "Low",
    tags: ["Lighting", "Quick Win", "Low Cost"],
  },
  {
    id: "smart-thermostat",
    title: "Smart Thermostat",
    category: "Heating & Cooling",
    icon: Settings,
    color: "bg-violet-500",
    description: "Install a learning thermostat to optimize heating/cooling schedules and reduce waste.",
    impact: { co2: "500 kg/yr", cost: "₹10–15k", savings: "₹10–20k/yr" },
    difficulty: "Low",
    tags: ["HVAC", "Automation", "Quick Win"],
  },
  {
    id: "heat-pump-water-heater",
    title: "Heat Pump Water Heater",
    category: "Water Heating",
    icon: Droplets,
    color: "bg-cyan-500",
    description: "Replace electric/resistance water heater with heat pump unit for 3x efficiency.",
    impact: { co2: "1,200 kg/yr", cost: "₹50–80k", savings: "₹15–25k/yr" },
    difficulty: "Medium",
    tags: ["Water Heating", "High Efficiency"],
  },
  {
    id: "solar-water-heater",
    title: "Solar Water Heater",
    category: "Water Heating",
    icon: Sun,
    color: "bg-amber-600",
    description: "Install solar thermal collectors for hot water, reducing electric/gas water heating.",
    impact: { co2: "800 kg/yr", cost: "₹40–60k", savings: "₹10–18k/yr" },
    difficulty: "Medium",
    tags: ["Water Heating", "Solar Thermal"],
  },
  {
    id: "rainwater-harvesting",
    title: "Rainwater Harvesting",
    category: "Water Conservation",
    icon: Droplets,
    color: "bg-blue-500",
    description: "Install rainwater harvesting for non-potable uses (gardening, flushing, washing).",
    impact: { co2: "200 kg/yr", cost: "₹30–50k", savings: "₹5–10k/yr" },
    difficulty: "Medium",
    tags: ["Water", "Conservation"],
  },
  {
    id: "home-battery",
    title: "Home Battery Storage",
    category: "Energy Storage",
    icon: Battery,
    color: "bg-green-500",
    description: "Add battery storage to store solar excess and provide backup during outages.",
    impact: { co2: "500 kg/yr", cost: "₹4–8L", savings: "₹15–30k/yr" },
    difficulty: "High",
    tags: ["Storage", "Solar", "Resilience"],
  },
  {
    id: "ev-smart-charging",
    title: "Smart EV Charging",
    category: "Transport",
    icon: Zap,
    color: "bg-yellow-500",
    description: "Schedule EV charging during off-peak/solar hours to minimize grid carbon intensity.",
    impact: { co2: "300 kg/yr", cost: "₹15–25k", savings: "₹8–15k/yr" },
    difficulty: "Low",
    tags: ["EV", "Smart Charging", "Optimization"],
  },
  {
    id: "insulation-upgrade",
    title: "Insulation & Air Sealing",
    category: "Building Envelope",
    icon: Shield,
    color: "bg-gray-600",
    description: "Improve insulation (walls, attic, floors) and seal air leaks to reduce heating/cooling load.",
    impact: { co2: "1,500 kg/yr", cost: "₹1–3L", savings: "₹20–40k/yr" },
    difficulty: "High",
    tags: ["Insulation", "Building Envelope", "High Impact"],
  },
];

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Low":
      return "bg-emerald-100/80 text-emerald-800 border-emerald-200/50";
    case "Medium":
      return "bg-amber-100/80 text-amber-800 border-amber-200/50";
    case "High":
      return "bg-rose-100/80 text-rose-800 border-rose-200/50";
    default:
      return "bg-brand-100/80 text-brand-800 border-brand-200/50";
  }
}

export function ActionLevers() {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [search, setSearch] = useState("");

  const filteredLevers = levers.filter((lever) => {
    const matchesSearch =
      lever.title.toLowerCase().includes(search.toLowerCase()) ||
      lever.category.toLowerCase().includes(search.toLowerCase()) ||
      lever.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || lever.difficulty.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div
      className="space-y-8 max-w-5xl mx-auto pb-16"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Page Header */}
      <motion.header
        className="page-header"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass glass--highlighted text-sm font-medium text-brand-700 mb-4">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Action Levers</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-950 tracking-tight mb-2">
              Decarbonization Action Levers
            </h1>
            <p className="text-lg text-brand-600 max-w-2xl leading-relaxed">
              Evidence-based actions to reduce your household carbon footprint. Prioritized by impact, cost, and feasibility.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
              <input
                type="text"
                placeholder="Search levers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-10 py-2 pl-10 rounded-xl glass glass--highlighted text-sm text-brand-950 placeholder:text-brand-400 w-64 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div className="flex gap-2">
              {["all", "high", "medium", "low"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    filter === f
                      ? "bg-brand-700 text-white shadow-sm"
                      : "text-brand-600 hover:bg-brand-50 hover:text-brand-950"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)} Impact
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Stats Bar */}
      <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="p-4 rounded-xl glass glass--highlighted text-center">
          <p className="text-2xl sm:text-3xl font-extrabold text-brand-950">{levers.length}</p>
          <p className="text-xs text-brand-500 uppercase tracking-wider">Total Levers</p>
        </div>
        <div className="p-4 rounded-xl glass glass--highlighted text-center">
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
            {levers.reduce((sum, l) => sum + parseFloat(l.impact.co2.replace(",", "")), 0).toFixed(0)}
          </p>
          <p className="text-xs text-brand-500 uppercase tracking-wider">kg CO₂/yr Potential</p>
        </div>
        <div className="p-4 rounded-xl glass glass--highlighted text-center">
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">
            {levers.reduce((sum, l) => sum + parseInt(l.impact.savings.replace(/[^0-9]/g, "")), 0).toLocaleString()}
          </p>
          <p className="text-xs text-brand-500 uppercase tracking-wider">₹/yr Potential Savings</p>
        </div>
        <div className="p-4 rounded-xl glass glass--highlighted text-center">
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">
            {levers.reduce((sum, l) => sum + parseInt(l.impact.cost.replace(/[^0-9]/g, "")), 0).toLocaleString()}
          </p>
          <p className="text-xs text-brand-500 uppercase tracking-wider">₹ Investment Range</p>
        </div>
      </motion.div>

      {/* Levers Grid */}
      <motion.div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        initial={false}
        animate={{ opacity: 1 }}
      >
        {filteredLevers.map((lever, index) => (
          <motion.article
            key={lever.id}
            className="group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Card glass className="glass--highlighted flex flex-col h-full overflow-hidden group">
              {/* Card Header with Icon */}
              <div className="p-5 pb-3">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: lever.color }}>
                    <lever.icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getDifficultyColor(lever.difficulty)}`}>
                      {lever.difficulty}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">{lever.category}</p>
                  <h3 className="text-lg font-bold text-brand-950 group-hover:text-brand-700 transition-colors">{lever.title}</h3>
                  <p className="text-sm text-brand-600 leading-relaxed line-clamp-2">{lever.description}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="px-5 pb-3 flex flex-wrap gap-1.5">
                {lever.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-100/80 text-brand-700 border border-brand-200/50">
                    {tag}
                  </span>
                ))}
                {lever.tags.length > 3 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-100/80 text-brand-500 border border-brand-200/50">
                    +{lever.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Impact Metrics */}
              <div className="px-5 pb-4 border-t border-brand-100/50">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl glass glass--highlighted text-center">
                    <p className="text-2xl font-extrabold text-emerald-600">{lever.impact.co2}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">CO₂ Reduction</p>
                  </div>
                  <div className="p-3 rounded-xl glass glass--highlighted text-center">
                    <p className="text-2xl font-extrabold text-amber-600">{lever.impact.savings}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">Annual Savings</p>
                  </div>
                  <div className="p-3 rounded-xl glass glass--highlighted text-center">
                    <p className="text-2xl font-extrabold text-amber-600">{lever.impact.cost}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">Investment</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-3">
                <GlassButton
                  variant="primary"
                  className="w-full justify-center gap-2"
                  onClick={() => {}}
                >
                  <Zap className="w-4 h-4" />
                  <span className="font-semibold">Add to Plan</span>
                </GlassButton>
              </div>
            </Card>
          </motion.article>
        ))}
      </motion.div>

      {filteredLevers.length === 0 && (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mx-auto mb-4 p-3 rounded-xl glass glass--highlighted w-fit">
            <Search className="w-8 h-8 text-brand-400" />
          </div>
          <h3 className="text-lg font-semibold text-brand-950 mb-2">No levers found</h3>
          <p className="text-brand-500">Try adjusting your filters or search terms.</p>
        </motion.div>
      )}
    </motion.div>
  );
}
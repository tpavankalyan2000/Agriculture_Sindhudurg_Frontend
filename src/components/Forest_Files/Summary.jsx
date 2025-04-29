
import React, { useMemo } from "react";
import {
  Wheat,
  PawPrint as Paw,
  Home,
  Skull,
  AlertTriangle,
} from "lucide-react";

/* Helper to safely convert values */
const toNumber = (val) => {
  if (val === null || val === undefined) return 0;
  const num = typeof val === "number" ? val : Number(String(val).replace(/[, ]/g, ""));
  return Number.isFinite(num) ? num : 0;
};

/* Normalize damage class */
const normalizeDamageClass = (raw) => {
  if (!raw) return null;
  const lower = raw.toLowerCase();
  if (lower.includes('crop') || lower.includes('tree')) return 'Crop';
  if (lower.includes('livestock') || lower.includes('sheep') || lower.includes('animal')) return 'Livestock';
  if (lower.includes('property')) return 'Property';
  if (lower.includes('human')) return 'Human';
  return null;
};

const Summary = ({ attackEvents = [] }) => {
  const {
    incidentCount,
    damageCounts,
    totalLoss,
    primarySpecies,
  } = useMemo(() => {
    const counts = { Crop: 0, Livestock: 0, Property: 0, Human: 0 };
    const speciesCounter = {};
    let lossSum = 0;

    for (const ev of attackEvents) {
      /* species tally */
      if (ev.species) {
        const speciesName =
          typeof ev.species === "string" ? ev.species : ev.species.common_name;
        if (speciesName) {
          speciesCounter[speciesName] = (speciesCounter[speciesName] || 0) + 1;
        }
      }

      /* Correct way: Always look inside damages array */
      if (Array.isArray(ev.damages)) {
        for (const d of ev.damages) {
          const rawClass = d.damage_class || d.item?.damage_class || d.item?.name || d.class;
          const dmgClass = normalizeDamageClass(rawClass);
      
          if (dmgClass && counts[dmgClass] !== undefined) {
            counts[dmgClass] += 1;
          }
      
          const loss = d.loss ?? d.est_loss_val;
          lossSum += toNumber(loss);
        }
      }
      
    }

    const topEntry = Object.entries(speciesCounter).sort(
      (a, b) => b[1] - a[1]
    )[0];

    return {
      incidentCount: attackEvents.length,
      damageCounts: counts,
      totalLoss: lossSum,
      primarySpecies: topEntry,
    };
  }, [attackEvents]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Summary Dashboard
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          bg="emerald"
          icon={<AlertTriangle size={24} className="text-emerald-700" />}
          label="Total Incidents"
          main={incidentCount}
          sub={`${((incidentCount / 365) * 30).toFixed(1)} incidents/month avg`}
        />
        <StatCard
          bg="indigo"
          icon={<Paw size={24} className="text-indigo-700" />}
          label="Primary Species"
          main={primarySpecies?.[0] ?? "Unknown"}
          sub={
            primarySpecies
              ? `${((primarySpecies[1] / incidentCount) * 100).toFixed(1)}% of all incidents`
              : "No data"
          }
        />
        <StatCard
          bg="orange"
          icon={<Home size={24} className="text-orange-700" />}
          label="Estimated Losses"
          main={`₹${(totalLoss / 100000).toFixed(2)}L`}
          sub={`₹${incidentCount ? (totalLoss / incidentCount).toFixed(0) : 0} avg per incident`}
        />
        <StatCard
          bg="red"
          icon={<Skull size={24} className="text-red-700" />}
          label="Human Incidents"
          main={damageCounts.Human}
          sub={
            incidentCount
              ? `${((damageCounts.Human / incidentCount) * 100).toFixed(1)}% of all incidents`
              : "0%"
          }
        />
      </div>
    </div>
  );
};

const StatCard = ({ bg, icon, label, main, sub }) => (
  <div className={`bg-${bg}-50 rounded-lg p-4 border border-${bg}-100`}>
    <div className="flex justify-between items-center">
      <div>
        <p className={`text-sm text-${bg}-600 font-medium`}>{label}</p>
        <p className={`text-2xl font-bold text-${bg}-900`}>{main}</p>
      </div>
      <div className={`bg-${bg}-200 p-3 rounded-full`}>
        {icon}
      </div>
    </div>
    <p className={`text-xs text-${bg}-600 mt-2`}>{sub}</p>
  </div>
);

export default Summary;

import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { API_URL_7 } from "../../config";

ChartJS.register(ArcElement, Tooltip, Legend);

const DamageTypePieChart = ({ filters, speciesOptions }) => {
  const [damageData, setDamageData] = useState({});

  useEffect(() => {
    const fetchBreakdown = async () => {
      try {
        const params = new URLSearchParams();

        if (filters.selectedSpecies.length > 0) {
          const selectedSpeciesNames = speciesOptions
            .filter(species => filters.selectedSpecies.includes(species.id))
            .map(species => species.common_name);

          selectedSpeciesNames.forEach(name => params.append('species_names', name));
        }

        if (filters.selectedDamageClasses.length > 0) {
          filters.selectedDamageClasses.forEach(dc => params.append('damage_classes', dc));
        }

        if (filters.dateRange[0]) {
          params.append('start_date', filters.dateRange[0].toISOString().split('T')[0]);
        }
        if (filters.dateRange[1]) {
          params.append('end_date', filters.dateRange[1].toISOString().split('T')[0]);
        }

        const res = await axios.get(`${API_URL_7}/filtered-damage-breakdown?${params.toString()}`);
        setDamageData(res.data);
      } catch (error) {
        console.error("Error fetching damage breakdown:", error);
      }
    };

    fetchBreakdown();
  }, [filters, speciesOptions]);  // 👈 Add speciesOptions here too, for safety

  const pieData = {
    labels: Object.keys(damageData),
    datasets: [
      {
        data: Object.values(damageData),
        backgroundColor: ["#82c91e", "#fab005", "#228be6", "#fa5252"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Damage Type Breakdown</h2>
      <div style={{ height: "200px" }}>
        <Pie data={pieData} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default DamageTypePieChart;

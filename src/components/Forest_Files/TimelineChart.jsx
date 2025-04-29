import React, { useState, useMemo } from "react";
import { Link as Line, CalendarIcon, FilterIcon } from "lucide-react";

/*  ✨  NO interface TimelineChartProps – props are destructured directly */
function TimelineChart({
  data = [],
  species = [],
  selectedSpecies = [],
  height = 300
}) {
  /* ────── date range over full dataset ────── */
  const dateRange = useMemo(() => {
    if (!data.length) return { minDate: new Date(), maxDate: new Date() };
  
    const dates = data.map(ev => new Date(ev.occurred_at));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
  
    minDate.setDate(1);
    maxDate.setDate(1);
    return { minDate, maxDate };
  }, [data]);

  /* ────── local state ────── */
  const [filterMode, setFilterMode] = useState("all");   // "all" | "year" | "month"
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  /* years shown in the <select> */
  const availableYears = useMemo(() => {
    const yrs = [];
    for (let y = dateRange.minDate.getFullYear(); y <= dateRange.maxDate.getFullYear(); y++) {
      yrs.push(y);
    }
    return yrs;
  }, [dateRange]);

  /* filter by checked species */
  // const speciesFilteredEvents = useMemo(() => {
  //   if (!selectedSpecies.length) return data;
  //   return data.filter(ev => ev.species_id != null && selectedSpecies.includes(ev.species_id));
  // }, [data, selectedSpecies]);
  const speciesFilteredEvents = useMemo(() => {
    if (!selectedSpecies.length) return data;
    const selectedSpeciesNames = species
      .filter(speciesItem => selectedSpecies.includes(speciesItem.id))
      .map(speciesItem => speciesItem.common_name);
  
    return data.filter(ev => selectedSpeciesNames.includes(ev.species.common_name));
  }, [data, selectedSpecies, species]);

  /* filter by date mode */
  const filteredEvents = useMemo(() => {
    if (filterMode === "all") return speciesFilteredEvents;

    return speciesFilteredEvents.filter(ev => {
      const d = new Date(ev.occurred_at);
      if (filterMode === "year") return d.getFullYear() === selectedYear;
      if (filterMode === "month")
        return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
      return true;
    });
  }, [speciesFilteredEvents, filterMode, selectedYear, selectedMonth]);

  /* aggregate to months */
  const monthlyData = useMemo(() => {
    const map = new Map();

    const makeKey = (y, m) => `${y}-${String(m + 1).padStart(2, "0")}`;

    const seedRange = (start, end) => {
      const cur = new Date(start);
      while (cur <= end) {
        map.set(makeKey(cur.getFullYear(), cur.getMonth()), 0);
        cur.setMonth(cur.getMonth() + 1);
      }
    };

    if (filterMode === "all") seedRange(dateRange.minDate, dateRange.maxDate);
    else if (filterMode === "year") for (let m = 0; m < 12; m++) map.set(makeKey(selectedYear, m), 0);
    else map.set(makeKey(selectedYear, selectedMonth), 0);

    filteredEvents.forEach(ev => {
      const d = new Date(ev.occurred_at);
      const k = makeKey(d.getFullYear(), d.getMonth());
      map.set(k, (map.get(k) || 0) + 1);
    });

    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([iso, count]) => {
        const [y, m] = iso.split("-");
        const label = new Date(+y, +m - 1, 1).toLocaleDateString("en-US", {
          month: "short",
          ...(filterMode !== "year" && { year: "numeric" })
        });
        return { month: iso, displayMonth: label, count };
      });
  }, [filteredEvents, filterMode, selectedYear, selectedMonth, dateRange]);

  /* maybe drop empty months in an “all” chart with huge gaps */
  const chartData = useMemo(() => {
    if (filterMode === "all") {
      const nonEmpty = monthlyData.filter(d => d.count);
      return nonEmpty.length ? nonEmpty : monthlyData.slice(0, 12);
    }
    if (filterMode === "year") {
      const filled = monthlyData.filter(d => d.count);
      return filled.length ? filled : monthlyData;
    }
    return monthlyData;
  }, [monthlyData, filterMode]);

  /* ────── dimensions & helpers for SVG path ────── */
  const chartHeight = height;
  const padding = { top: 20, right: 30, bottom: 50, left: 40 };
  const innerWidth = 500 - padding.left - padding.right;      // width is 100%, so use px baseline
  const innerHeight = chartHeight - padding.top - padding.bottom;
  const maxCount = Math.max(...chartData.map(d => d.count), 1);
  const yScale = c => innerHeight - (c / maxCount) * innerHeight;

  const getX = i =>
    filterMode === "year"
      ? padding.left + (i + 0.5) * (innerWidth / chartData.length)
      : padding.left + (i * innerWidth) / Math.max(chartData.length - 1, 1);

  const linePath =
    chartData.length > 1
      ? chartData
          .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${padding.top + yScale(d.count)}`)
          .join(" ")
      : "";

  const areaPath =
    chartData.length > 1
      ? [
          ...chartData.map(
            (d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${padding.top + yScale(d.count)}`
          ),
          `L ${getX(chartData.length - 1)} ${padding.top + innerHeight}`,
          `L ${getX(0)} ${padding.top + innerHeight} Z`
        ].join(" ")
      : "";

  /* ────── totals for KPI tiles ────── */
  const totalAttacks = filteredEvents.length;
  const monthsWithData = chartData.filter(d => d.count).length;
  const monthlyAverage = monthsWithData ? Math.round(totalAttacks / monthsWithData) : 0;
  const peakMonth = chartData.reduce((max, d) => (d.count > max.count ? d : max), { count: 0 });

  /* ────── render ────── */
  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full">
      {/* header + filter row */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Animal Attacks Over Time</h2>

        <div className="flex flex-wrap items-center gap-2">
          {/* mode select */}
          <div className="flex items-center">
            <FilterIcon size={16} className="text-gray-400 mr-1" />
            <select
              value={filterMode}
              onChange={e => setFilterMode(e.target.value)}
              className="border rounded p-1 text-sm bg-white text-gray-700"
            >
              <option value="all">All Data</option>
              <option value="year">By Year</option>
              <option value="month">By Month</option>
            </select>
          </div>

          {filterMode !== "all" && (
            <div className="flex items-center">
              <CalendarIcon size={16} className="text-gray-400 mr-1" />
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(+e.target.value)}
                className="border rounded p-1 text-sm bg-white text-gray-700"
              >
                {availableYears.map(y => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </div>
          )}

          {filterMode === "month" && (
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(+e.target.value)}
              className="border rounded p-1 text-sm bg-white text-gray-700"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(2000, i).toLocaleDateString("en-US", { month: "long" })}
                </option>
              ))}
            </select>
          )}

          <span className="text-xs text-gray-500">
            {monthsWithData} month{monthsWithData !== 1 && "s"} with data
          </span>
        </div>
      </div>

      {/* chart */}
      <div className="relative" style={{ height: chartHeight }}>
        {/* Y-axis labels */}
        <div
          className="absolute inset-y-0 left-0 flex flex-col justify-between text-xs text-gray-500"
          style={{ width: padding.left }}
        >
          {[0, 1, 2, 3, 4].map(i => (
            <div
              key={i}
              style={{
                position: "absolute",
                bottom: `${(i * innerHeight) / 4 + padding.bottom - 10}px`,
                right: 4
              }}
            >
              {Math.round((maxCount / 4) * i)}
            </div>
          ))}
        </div>

        <svg width="100%" height={chartHeight} className="overflow-visible">
          {chartData.length > 1 && areaPath && (
            <path d={areaPath} fill="rgba(16,185,129,.1)" stroke="none" />
          )}
          {chartData.length > 1 && linePath && (
            <path d={linePath} stroke="#10B981" strokeWidth="2.5" fill="none" />
          )}

          {chartData.map((d, i) => (
            <g key={i}>
              <circle
                cx={getX(i)}
                cy={padding.top + yScale(d.count)}
                r="4"
                fill="#10B981"
                className="transition-all duration-300 hover:r-6 hover:fill-emerald-700"
              />
              <title>{`${d.displayMonth}: ${d.count} attacks`}</title>
            </g>
          ))}

          {/* axes */}
          <line
            x1={padding.left}
            y1={padding.top + innerHeight}
            x2={padding.left + innerWidth}
            y2={padding.top + innerHeight}
            stroke="#E5E7EB"
          />
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={padding.top + innerHeight}
            stroke="#E5E7EB"
          />
          {[1, 2, 3, 4].map(i => (
            <line
              key={i}
              x1={padding.left}
              x2={padding.left + innerWidth}
              y1={padding.top + (i * innerHeight) / 4}
              y2={padding.top + (i * innerHeight) / 4}
              stroke="#F3F4F6"
            />
          ))}
        </svg>

        {/* X-axis labels */}
        <div
          className="absolute left-0 right-0 text-xs text-gray-500"
          style={{
            top: padding.top + innerHeight + 10,
            paddingLeft: padding.left,
            paddingRight: padding.right,
            height: 30
          }}
        >
          {chartData.map((d, i) => {
            if (filterMode === "year") {
              const bar = innerWidth / chartData.length;
              return (
                <div
                  key={i}
                  className="absolute text-center"
                  style={{
                    left: i * bar,
                    width: bar,
                    transform: "rotate(-30deg)",
                    transformOrigin: "top left",
                    whiteSpace: "nowrap"
                  }}
                >
                  {d.displayMonth}
                </div>
              );
            }
            const show = filterMode === "month" || chartData.length <= 12 || i % Math.max(1, Math.floor(chartData.length / 6)) === 0;
            const x = padding.left + (i * innerWidth) / Math.max(chartData.length - 1, 1);
            return (
              <div
                key={i}
                style={{ left: x, transform: "translateX(-50%)", position: "absolute" }}
              >
                {show ? d.displayMonth : ""}
              </div>
            );
          })}
        </div>
      </div>

      {/* legend + KPIs */}
      <div className="mt-6 flex justify-end items-center">
        <Line size={16} className="text-emerald-500 mr-2" />
        <span className="text-sm text-gray-700">Attack Incidents</span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Stat label="Total Attacks" value={totalAttacks} />
        <Stat label="Monthly Avg." value={monthlyAverage} />
        <Stat
          label="Peak Month"
          value={
            filterMode === "year" && peakMonth.displayMonth !== "None"
              ? `${peakMonth.displayMonth} ${selectedYear}`
              : peakMonth.displayMonth
          }
        />
      </div>
    </div>
  );
}

/* tiny helper */
const Stat = ({ label, value }) => (
  <div className="bg-gray-50 p-3 rounded">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-xl font-semibold text-gray-800">{value}</p>
  </div>
);

export default TimelineChart;

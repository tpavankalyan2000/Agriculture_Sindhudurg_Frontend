import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartDistricts = () => {
    const [data, setData] = useState({});
    const [year, setYear] = useState('2020-21');
    const [chartData, setChartData] = useState(null);
    const [availableYears, setAvailableYears] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5050/parser/upload_excel') // Replace with your API endpoint
            .then((res) => res.json())
            .then((fetchedData) => {
                setData(fetchedData);
                console.log("fetchedData : ",fetchedData);
                

                // Get years from first district as dropdown options
                const firstDistrict = Object.keys(fetchedData)[1];
                console.log(firstDistrict, "first district")
                const years = Object.keys(fetchedData[firstDistrict]);
                console.log(years, "years")
                setAvailableYears(years);
                console.log(availableYears, "available yers")
            })
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        if (!year || !data) return;

        const districts = Object.keys(data);
        const cultivatedAreaData = []; // Total area (100%)
        const utilizedAreaData = [];   // Utilized area
        const validDistricts = [];

        districts.forEach((district) => {
            const yearData = data[district]?.[year];
            if (!yearData) return;
        
            let totalCultivated = 0;
            let cultivationUsed = 0;
        
            Object.values(yearData).forEach((crop) => {
                totalCultivated += crop['Total Cultivated Area (hectares)'] || 0;
                cultivationUsed += crop['Cultivation area(hectare)'] || 0;
            });
        
            validDistricts.push(district); // <- Only add if valid
            cultivatedAreaData.push(totalCultivated);
            utilizedAreaData.push(cultivationUsed);
        });

        // Generate dataset with percentage of used from total
        const usedPercentages = utilizedAreaData.map((used, i) =>
            ((used / cultivatedAreaData[i]) * 100).toFixed(2)
        );

        const chartData = {
            labels: validDistricts,
            datasets: [
                {
                    label: `% Cultivation Area Used in ${year}`,
                    data: usedPercentages,
                    backgroundColor: [
                        '#4caf50',
                        '#ff9800',
                        '#2196f3',
                        '#e91e63',
                        '#9c27b0',
                        '#00bcd4',
                        '#ffc107'
                    ],
                    borderWidth: 1,
                },
            ],
        };

        setChartData(chartData);
    }, [data, year]);
    


    const options = {
        plugins: {
            legend: {
                position: 'right', // shift labels to the right
                labels: {
                    boxWidth: 20,
                    padding: 20,
                },
            },
            tooltip: {
                enabled: true,
            },
        },
        maintainAspectRatio: false,
    };
    
    

    return (
        <div style={{ width: '60%', height: '400px'}}>
            <h2 style={{ textAlign: 'center' }}>Cultivation Utilization % by District</h2>
    
            {availableYears.length > 0 && (
                <select value={year} onChange={(e) => setYear(e.target.value)} style={{ marginBottom: '1rem' }}>
                    {availableYears.map((yr) => (
                        <option key={yr} value={yr}>{yr}</option>
                    ))}
                </select>
            )}
    
            {chartData ? (
                <Pie data={chartData} options={options} />
            ) : (
                <p>Loading chart...</p>
            )}
        </div>
    );
    
};

export default PieChartDistricts;
import React from 'react';
import MapView from '../components/Analysis_Files/MapView';
import TrendGraph from '../components/Analysis_Files/TrendGraph';
import PieChartDistricts from '../components/Analysis_Files/PieChart';
 
export default function Analysis() {
    return (
        <div>
            <h2>Analysis</h2>
            <div style={{ display: 'flex', width: '100%' }}>
                <div style={{ width: '70%' }}>
                    <TrendGraph />
                </div>
                <div style={{ width: '30%', height: '100px' }}>
                    <MapView />
                </div>
            </div>
            <div>
                <PieChartDistricts />
            </div>
        </div>
    );
}
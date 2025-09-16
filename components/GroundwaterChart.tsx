

import React, { useState, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import { ChartDataPoint } from '../types';

interface GroundwaterChartProps {
  data: ChartDataPoint[];
  comparisonStates?: string[];
}

// A color palette for multi-line charts, matching the new brand theme
const COLORS = ['#00F2FE', '#78FFFE', '#A9A4D4', '#24243E', '#302B63'];

// Custom Tooltip Component for better UX and styling
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-[color:var(--color-bg-deep-indigo)]/80 backdrop-blur-sm shadow-lg rounded-md border border-[color:var(--color-accent-teal)]/30">
          <p className="label text-[color:var(--color-text-primary)] font-bold">{`${label}`}</p>
          {payload.map((pld: any) => (
            <div key={pld.dataKey} style={{ color: pld.color }}>
                {`${pld.dataKey} : ${pld.value} mbgl`}
            </div>
          ))}
          <p className="text-xs text-[color:var(--color-text-secondary)] mt-1">Meters below ground level</p>
        </div>
      );
    }
  
    return null;
  };

const GroundwaterChart: React.FC<GroundwaterChartProps> = ({ data, comparisonStates }) => {
  const isComparison = comparisonStates && comparisonStates.length > 0;
  
  const [brushRange, setBrushRange] = useState({
    startIndex: 0,
    endIndex: data.length - 1,
  });

  const handleBrushChange = useCallback((newRange: any) => {
    if (newRange) {
        setBrushRange({
            startIndex: newRange.startIndex,
            endIndex: newRange.endIndex,
        });
    }
  }, []);

  const resetZoom = () => {
    setBrushRange({
        startIndex: 0,
        endIndex: data.length - 1,
    });
  };

  const isZoomed = data.length > 1 && (brushRange.startIndex !== 0 || brushRange.endIndex !== data.length - 1);

  return (
    <div className="mt-4 bg-[color:var(--color-bg-light-indigo)]/40 p-2 rounded-lg" style={{ width: '100%', height: 350 }}>
      <div className="flex justify-between items-center mb-2 px-2">
        <h4 className="font-bold text-sm text-[color:var(--color-text-primary)]">
          {isComparison ? `Groundwater Level Comparison (mbgl)` : `Groundwater Level Trend (mbgl)`}
        </h4>
        {isZoomed && (
          <button
            onClick={resetZoom}
            className="px-2 py-1 text-xs bg-[color:var(--color-bg-mid-indigo)]/70 text-[color:var(--color-accent-light-teal)] rounded-md hover:bg-[color:var(--color-bg-mid-indigo)] transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent-teal)]"
          >
            Reset Zoom
          </button>
        )}
      </div>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-accent-teal)" strokeOpacity={0.1} />
          <XAxis dataKey="name" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} label={{ value: 'mbgl', angle: -90, position: 'insideLeft', fill: 'currentColor' }} />
          <Tooltip
            cursor={{ stroke: 'var(--color-accent-teal)', strokeWidth: 1, strokeDasharray: '3 3' }}
            content={<CustomTooltip />}
          />
          <Legend wrapperStyle={{fontSize: "14px", color: "var(--color-text-secondary)"}} />
          {isComparison ? (
            comparisonStates.map((state, index) => (
                <Line 
                    key={state} 
                    type="monotone" 
                    dataKey={state} 
                    stroke={COLORS[index % COLORS.length]} 
                    strokeWidth={2} 
                    activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }} 
                    dot={{ r: 4 }}
                />
            ))
          ) : (
            <Line 
                type="monotone" 
                dataKey="level" 
                stroke="var(--color-accent-teal)" 
                strokeWidth={2} 
                activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }} 
                dot={{ r: 4, strokeWidth: 2 }} 
            />
          )}
          <Brush 
            dataKey="name" 
            height={30} 
            stroke="var(--color-accent-teal)"
            travellerWidth={15} 
            fill="rgba(15, 12, 41, 0.5)"
            startIndex={brushRange.startIndex}
            endIndex={brushRange.endIndex}
            onChange={handleBrushChange}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GroundwaterChart;
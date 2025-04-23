
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DetectionData {
  name: string;
  clean: number;
  infected: number;
}

interface DetectionBarChartProps {
  data: DetectionData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-background border rounded-md shadow-md">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-threat-safe">{`Clean: ${payload[0].value}`}</p>
        <p className="text-sm text-threat-high">{`Infected: ${payload[1].value}`}</p>
      </div>
    );
  }

  return null;
};

const DetectionBarChart = ({ data }: DetectionBarChartProps) => {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Detection History</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[250px]">
          <p className="text-muted-foreground">No detection data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Detection History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 25,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={50} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="clean" fill="#4CAF50" name="Clean Files" />
              <Bar dataKey="infected" fill="#F44336" name="Infected Files" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetectionBarChart;

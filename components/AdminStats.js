"use client";

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AdminStats({ data }) {
    const { byRegion, byType, daily } = data;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Bar Chart - Region */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body h-80">
                    <h3 className="card-title text-sm">Jumlah Gangguan per Daerah</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={byRegion}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" fontSize={12} />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8884d8" name="Jumlah Tiket" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Pie Chart - Type */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body h-80">
                    <h3 className="card-title text-sm">Persentase Jenis Gangguan</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={byType}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {byType.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Line Chart - Daily (Full Width) */}
            <div className="card bg-base-100 shadow-xl md:col-span-2">
                <div className="card-body h-80">
                    <h3 className="card-title text-sm">Tren Laporan Harian</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={daily}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" fontSize={12} />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Line type="monotone" dataKey="count" stroke="#82ca9d" name="Laporan Masuk" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
}

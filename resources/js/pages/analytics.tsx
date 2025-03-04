import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Analytics({ financialMetrics, statusDistribution, monthlyRevenue, topClients }: AnalyticsPageProps) {
    return (
        <AppLayout>
            <Head title="Analytics Dashboard" />

            <div className="container mx-auto py-6">
                <h1 className="mb-6 text-3xl font-bold">Analytics Dashboard</h1>

                <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Total Outstanding</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(financialMetrics.totalOutstanding)}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Average Time to Payment</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{financialMetrics.avgTimeToPayment} days</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Overdue Percentage</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{financialMetrics.overduePercentage}%</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(financialMetrics.totalRevenue)}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Revenue</CardTitle>
                        </CardHeader>
                        <CardContent className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={monthlyRevenue}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis tickFormatter={(value) => `$${value}`} />
                                    <Tooltip formatter={(value) => [formatCurrency(value as number), 'Revenue']} />
                                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Invoice Status Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {statusDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [value, 'Invoices']} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Clients by Revenue</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={topClients}
                                layout="vertical"
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 100,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" tickFormatter={(value) => `$${value}`} />
                                <YAxis type="category" dataKey="client" />
                                <Tooltip formatter={(value) => [formatCurrency(value as number), 'Revenue']} />
                                <Bar dataKey="revenue" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import { ArrowDownIcon, ArrowUpIcon, CalendarIcon, TrendingUpIcon } from 'lucide-react';
import { useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from 'recharts';

// Colors that match the application's design system
const CHART_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316'];

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(value);
};

export default function Analytics({ financialMetrics, statusDistribution, monthlyRevenue, topClients }: AnalyticsPageProps) {
    const [timeRange, setTimeRange] = useState('6months');
    const [chartView, setChartView] = useState('line');

    // Helper to determine if a metric is positive/negative
    const getTrendIndicator = (value: number, isInverse: boolean = false) => {
        if (value === 0) return null;

        const isPositive = isInverse ? value < 0 : value > 0;

        return (
            <span className={cn('ml-2 inline-flex items-center text-sm', isPositive ? 'text-green-600' : 'text-red-500')}>
                {isPositive ? <ArrowUpIcon className="mr-1 h-4 w-4" /> : <ArrowDownIcon className="mr-1 h-4 w-4" />}
            </span>
        );
    };

    return (
        <AppLayout>
            <Head title="Analytics Dashboard" />

            <div className="container mx-auto px-4 py-6 md:px-6">
                <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Get insights into your invoicing and payment performance</p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-1">
                                        <CalendarIcon className="h-4 w-4" />
                                        <span>Last {timeRange === '6months' ? '6 Months' : '12 Months'}</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Change the time period for the data displayed</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <Select value={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select time range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="3months">Last 3 Months</SelectItem>
                                <SelectItem value="6months">Last 6 Months</SelectItem>
                                <SelectItem value="12months">Last 12 Months</SelectItem>
                                <SelectItem value="year">This Year</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-l-4 border-l-indigo-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Outstanding Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline">
                                <div className="text-2xl font-bold">{formatCurrency(financialMetrics.totalOutstanding)}</div>
                                {getTrendIndicator(5, true)} {/* Example trend, replace with actual data */}
                            </div>
                            <CardDescription className="mt-2 text-xs">Total amount pending from clients</CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-purple-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Payment Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline">
                                <div className="text-2xl font-bold">{financialMetrics.avgTimeToPayment} days</div>
                                {getTrendIndicator(-2, true)} {/* Example trend, replace with actual data */}
                            </div>
                            <CardDescription className="mt-2 text-xs">Average time to receive payment</CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-pink-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Overdue Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline">
                                <div className="text-2xl font-bold">{financialMetrics.overduePercentage}%</div>
                                {getTrendIndicator(2, true)} {/* Example trend, replace with actual data */}
                            </div>
                            <CardDescription className="mt-2 text-xs">Percentage of invoices past due date</CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline">
                                <div className="text-2xl font-bold">{formatCurrency(financialMetrics.totalRevenue)}</div>
                                {getTrendIndicator(8)} {/* Example trend, replace with actual data */}
                            </div>
                            <CardDescription className="mt-2 text-xs">Total collected from paid invoices</CardDescription>
                        </CardContent>
                    </Card>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <Card className="col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle>Revenue Trends</CardTitle>
                                <CardDescription>Monthly revenue over time</CardDescription>
                            </div>
                            <div className="flex space-x-1">
                                <Button variant={chartView === 'line' ? 'default' : 'outline'} size="sm" onClick={() => setChartView('line')}>
                                    Line
                                </Button>
                                <Button variant={chartView === 'bar' ? 'default' : 'outline'} size="sm" onClick={() => setChartView('bar')}>
                                    Bar
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                {chartView === 'line' ? (
                                    <LineChart data={monthlyRevenue} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                        <XAxis dataKey="month" axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
                                        <YAxis tickFormatter={(value) => `$${value}`} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
                                        <RechartsTooltip
                                            formatter={(value) => [formatCurrency(value as number), 'Revenue']}
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '6px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke={CHART_COLORS[0]}
                                            strokeWidth={3}
                                            dot={{ r: 4, fill: CHART_COLORS[0], stroke: CHART_COLORS[0], strokeWidth: 1 }}
                                            activeDot={{ r: 6, fill: CHART_COLORS[0], stroke: '#fff', strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                ) : (
                                    <BarChart data={monthlyRevenue} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                        <XAxis dataKey="month" axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
                                        <YAxis tickFormatter={(value) => `$${value}`} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
                                        <RechartsTooltip
                                            formatter={(value) => [formatCurrency(value as number), 'Revenue']}
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '6px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                            }}
                                        />
                                        <Bar dataKey="revenue" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                )}
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="col-span-1">
                        <CardHeader className="pb-2">
                            <CardTitle>Invoice Status</CardTitle>
                            <CardDescription>Distribution of invoice statuses</CardDescription>
                        </CardHeader>
                        <CardContent className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={100}
                                        stroke="#ffffff"
                                        strokeWidth={2}
                                        dataKey="value"
                                        label={({ name, percent }) => (percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : '')}
                                    >
                                        {statusDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        formatter={(value, name) => [value, name]}
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '6px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                        }}
                                    />
                                    <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle>Top Clients</CardTitle>
                        <CardDescription>Clients by revenue generation</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topClients} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                                <XAxis type="number" tickFormatter={(value) => `$${value}`} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
                                <YAxis
                                    type="category"
                                    dataKey="client"
                                    axisLine={{ stroke: '#e5e7eb' }}
                                    tickLine={false}
                                    width={90}
                                    tick={{ fontSize: 12 }}
                                />
                                <RechartsTooltip
                                    formatter={(value) => [formatCurrency(value as number), 'Revenue']}
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '6px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                    }}
                                />
                                <Bar dataKey="revenue" fill={CHART_COLORS[1]} radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                    <CardFooter className="text-muted-foreground text-sm">
                        <TrendingUpIcon className="mr-2 h-4 w-4" />
                        Showing top {topClients.length} clients by revenue
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
}

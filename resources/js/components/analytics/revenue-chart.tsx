import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { MonthlyRevenueItem } from '@/types/analytics';
import { Bar, BarChart, CartesianGrid, Line, LineChart, Tooltip as RechartsTooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';

// Colors that match the application's design system
const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981'];

interface RevenueChartProps {
    data: MonthlyRevenueItem[];
    currency: string;
    chartView: 'line' | 'bar';
    onChartViewChange: (view: 'line' | 'bar') => void;
}

export function RevenueChart({ data, currency, chartView, onChartViewChange }: RevenueChartProps) {
    return (
        <Card className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
            <CardHeader className="border-sidebar-border/70 dark:border-sidebar-border flex flex-row items-center justify-between border-b p-3 sm:p-4">
                <div>
                    <CardTitle className="text-base font-semibold sm:text-lg">Revenue Trends</CardTitle>
                    <CardDescription>Monthly revenue over time</CardDescription>
                </div>
                <div className="flex space-x-1">
                    <Button variant={chartView === 'line' ? 'default' : 'outline'} size="sm" onClick={() => onChartViewChange('line')}>
                        Line
                    </Button>
                    <Button variant={chartView === 'bar' ? 'default' : 'outline'} size="sm" onClick={() => onChartViewChange('bar')}>
                        Bar
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="h-80 p-4">
                <ResponsiveContainer width="100%" height="100%">
                    {chartView === 'line' ? (
                        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis dataKey="month" axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
                            <YAxis tickFormatter={(value) => `$${value}`} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
                            <RechartsTooltip
                                formatter={(value) => [formatCurrency(value as number, currency), 'Revenue']}
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
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis dataKey="month" axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
                            <YAxis tickFormatter={(value) => `$${value}`} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
                            <RechartsTooltip
                                formatter={(value) => [formatCurrency(value as number, currency), 'Revenue']}
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
    );
}

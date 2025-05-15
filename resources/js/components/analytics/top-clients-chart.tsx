import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { TopClientItem } from '@/types/analytics';
import { TrendingUpIcon } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';

// Colors that match the application's design system
const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981'];

interface TopClientsChartProps {
    data: TopClientItem[];
    currency: string;
}

export function TopClientsChart({ data, currency }: TopClientsChartProps) {
    return (
        <Card className="border-sidebar-border/70 dark:border-sidebar-border mt-4 rounded-xl border">
            <CardHeader className="border-sidebar-border/70 dark:border-sidebar-border flex flex-row items-center justify-between border-b p-3 sm:p-4">
                <div>
                    <CardTitle className="text-base font-semibold sm:text-lg">Top Clients</CardTitle>
                    <CardDescription>Clients by revenue generation</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="h-80 p-4">
                {data.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                        <TrendingUpIcon className="text-muted-foreground/50 mb-4 h-12 w-12" />
                        <h3 className="mb-2 text-lg font-medium">No client data available</h3>
                        <p className="text-muted-foreground max-w-md text-sm">
                            Once you start generating revenue with clients, you'll see your top performers here.
                        </p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 20 }}>
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
                                formatter={(value) => [formatCurrency(value as number, currency), 'Revenue']}
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
                )}
            </CardContent>
            <CardFooter className="border-sidebar-border/70 dark:border-sidebar-border text-muted-foreground border-t p-3 text-sm sm:p-4">
                <TrendingUpIcon className="mr-2 h-4 w-4" />
                {data.length === 0 ? 'Start creating invoices to see your top clients' : `Showing top ${data.length} clients by revenue`}
            </CardFooter>
        </Card>
    );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusDistributionItem } from '@/types/analytics';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

// Colors that match the application's design system
const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981'];


interface StatusDistributionChartProps {
    data: StatusDistributionItem[];
}

export function StatusDistributionChart({ data }: StatusDistributionChartProps) {
    return (
        <Card className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
            <CardHeader className="border-sidebar-border/70 dark:border-sidebar-border flex flex-row items-center justify-between border-b p-3 sm:p-4">
                <div>
                    <CardTitle className="text-base font-semibold sm:text-lg">Invoice Status</CardTitle>
                    <CardDescription>Distribution of invoice statuses</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="h-80 p-4">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            stroke="#ffffff"
                            strokeWidth={2}
                            dataKey="value"
                            label={({ name, percent }) => (percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : '')}
                        >
                            {data.map((entry, index) => (
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
    );
} 
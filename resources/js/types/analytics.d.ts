export interface FinancialMetrics {
    totalOutstanding: number;
    avgTimeToPayment: number;
    overduePercentage: number;
    totalRevenue: number;
}

export interface StatusDistributionItem {
    name: string;
    value: number;
}

export interface MonthlyRevenueItem {
    month: string;
    revenue: number;
}

export interface TopClientItem {
    client: string;
    revenue: number;
}

export interface AnalyticsPageProps {
    financialMetrics: FinancialMetrics;
    statusDistribution: StatusDistributionItem[];
    monthlyRevenue: MonthlyRevenueItem[];
    topClients: TopClientItem[];
}

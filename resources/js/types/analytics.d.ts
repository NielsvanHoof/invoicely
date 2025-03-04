interface FinancialMetrics {
  totalOutstanding: number;
  avgTimeToPayment: number;
  overduePercentage: number;
  totalRevenue: number;
}

interface StatusDistributionItem {
  name: string;
  value: number;
}

interface MonthlyRevenueItem {
  month: string;
  revenue: number;
}

interface TopClientItem {
  client: string;
  revenue: number;
}

interface AnalyticsPageProps {
  financialMetrics: FinancialMetrics;
  statusDistribution: StatusDistributionItem[];
  monthlyRevenue: MonthlyRevenueItem[];
  topClients: TopClientItem[];
} 
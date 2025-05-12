import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CalendarIcon } from 'lucide-react';

interface AnalyticsHeaderProps {
    timeRange: string;
    onTimeRangeChange: (value: string) => void;
}

export function AnalyticsHeader({ timeRange, onTimeRangeChange }: AnalyticsHeaderProps) {
    return (
        <div className="mb-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Analytics Dashboard</h1>
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

                <Select value={timeRange} onValueChange={onTimeRangeChange}>
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
    );
} 
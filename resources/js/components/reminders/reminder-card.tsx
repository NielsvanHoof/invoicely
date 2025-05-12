import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { type Reminder } from '@/types';
import { CalendarIcon, PencilIcon, TrashIcon } from 'lucide-react';
import React from 'react';

interface ReminderCardProps {
    reminder: Reminder;
    onEditClick: (reminder: Reminder) => void;
    onDeleteClick: (reminder: Reminder) => void;
}

export function ReminderCard({ reminder, onEditClick, onDeleteClick }: ReminderCardProps) {
    function getReminderStatusBadge(reminder: Reminder) {
        if (reminder.sent_at) {
            return (
                <span
                    className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    role="status"
                    aria-label="Reminder sent"
                >
                    Sent
                </span>
            );
        }

        const scheduledDate = new Date(reminder.scheduled_date);
        const now = new Date();

        if (scheduledDate < now) {
            return (
                <span
                    className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                    role="status"
                    aria-label="Reminder due"
                >
                    Due
                </span>
            );
        }

        return (
            <span
                className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                role="status"
                aria-label="Reminder scheduled"
            >
                Scheduled
            </span>
        );
    }

    return (
        <Card className="border-sidebar-border/70 dark:border-sidebar-border overflow-hidden rounded-xl border" role="listitem">
            <CardHeader className="pb-2">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{reminder.type}</CardTitle>
                            {getReminderStatusBadge(reminder)}
                        </div>
                        <div className="text-muted-foreground mt-1 flex items-center text-sm">
                            <CalendarIcon className="mr-1.5 inline h-3.5 w-3.5" aria-hidden="true" />
                            Scheduled for {formatDate(reminder.scheduled_date)}
                        </div>
                    </div>
                    <div className="mt-2 flex gap-2 sm:mt-0">
                        {!reminder.sent_at && (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onEditClick(reminder)}
                                    className="h-8"
                                    aria-label={`Edit reminder scheduled for ${formatDate(reminder.scheduled_date)}`}
                                >
                                    <PencilIcon className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                                    <span className="hidden sm:inline">Edit</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onDeleteClick(reminder)}
                                    className="h-8 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300"
                                    aria-label={`Delete reminder scheduled for ${formatDate(reminder.scheduled_date)}`}
                                >
                                    <TrashIcon className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                                    <span className="hidden sm:inline">Delete</span>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div
                    className="border-muted bg-muted/20 rounded-r-sm border-l-4 py-2 pl-4 text-sm italic"
                    role="article"
                    aria-label="Reminder message"
                >
                    {reminder.message}
                </div>
                {reminder.sent_at && (
                    <div className="text-muted-foreground mt-4 flex items-center text-xs">
                        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-500" aria-hidden="true"></span>
                        Sent on {formatDate(reminder.sent_at)}
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';
import { CurrencyType } from '@/types/generated';

interface CurrencySettingsProps {
    userCurrency: string;
}

export function CurrencySettings({ userCurrency }: CurrencySettingsProps) {
    const form = useForm({
        currency: userCurrency,
    });

    // Example amount to show in the preview
    const exampleAmount = 1234.56;
    const [previewCurrency, setPreviewCurrency] = useState(userCurrency);

    function handleCurrencyChange(value: string) {
        setPreviewCurrency(value);
        form.setData('currency', value);
    }

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.post(route('settings.currency.update'), {
            preserveScroll: true,
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Currency</CardTitle>
                <CardDescription>Choose the currency you prefer to use for displaying monetary values.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="currency" className="text-sm font-medium">
                            Display Currency
                        </label>
                        <Select defaultValue={userCurrency} onValueChange={handleCurrencyChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a currency" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(CurrencyType).map((currency) => (
                                    <SelectItem key={currency} value={currency}>
                                        {currency}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-muted-foreground text-sm">Example: {formatCurrency(exampleAmount, previewCurrency)}</p>
                        {form.errors.currency && <p className="text-destructive text-sm">{form.errors.currency}</p>}
                    </div>
                    <Button type="submit" disabled={form.processing}>
                        {form.processing ? 'Saving...' : 'Save'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

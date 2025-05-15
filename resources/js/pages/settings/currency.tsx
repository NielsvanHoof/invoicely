import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import { CurrencySettings } from '@/components/settings/currency-settings';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

interface CurrencySettingsPageProps {
    userCurrency: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Currency settings',
        href: route('settings.currency'),
    },
];

export default function Currency({ userCurrency }: CurrencySettingsPageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Currency settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Currency settings" description="Update your preferred currency for displaying monetary values" />
                    <CurrencySettings userCurrency={userCurrency} />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}

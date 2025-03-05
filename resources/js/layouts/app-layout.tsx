import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { flash } = usePage<SharedData>().props;

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
            <Toaster
                position="top-right"
                toastOptions={{
                    className: '',
                    style: {
                        background: 'var(--card)',
                        color: 'var(--card-foreground)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        fontSize: '0.875rem',
                        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                        padding: '0.75rem 1rem',
                    },
                    success: {
                        iconTheme: {
                            primary: 'hsl(142.1, 76.2%, 36.3%)',
                            secondary: 'white',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: 'var(--destructive)',
                            secondary: 'white',
                        },
                    },
                    loading: {
                        iconTheme: {
                            primary: 'var(--muted-foreground)',
                            secondary: 'white',
                        },
                    },
                    duration: 4000,
                }}
            />
        </AppLayoutTemplate>
    );
};

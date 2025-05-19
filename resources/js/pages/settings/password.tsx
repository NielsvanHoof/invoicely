import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import clsx from 'clsx';
import { FormEventHandler, useRef } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Password settings',
        href: '/settings/password',
    },
];

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Update password" description="Ensure your account is using a long, random password to stay secure" />

                    <form onSubmit={updatePassword} className="space-y-6" noValidate>
                        <div className="grid gap-2">
                            <Label htmlFor="current_password">Current password</Label>

                            <Input
                                id="current_password"
                                ref={currentPasswordInput}
                                value={data.current_password}
                                onChange={(e) => setData('current_password', e.target.value)}
                                type="password"
                                className={clsx('transition-all duration-200 focus:ring-2', errors.current_password && 'border-red-500')}
                                autoComplete="current-password"
                                placeholder="Current password"
                                aria-invalid={!!errors.current_password}
                                aria-describedby={errors.current_password ? 'current-password-error' : undefined}
                            />

                            {errors.current_password && (
                                <p id="current-password-error" className="text-destructive text-sm" role="alert">
                                    {errors.current_password}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">New password</Label>

                            <Input
                                id="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                type="password"
                                className={clsx('transition-all duration-200 focus:ring-2', errors.password && 'border-red-500')}
                                autoComplete="new-password"
                                placeholder="New password"
                                aria-invalid={!!errors.password}
                                aria-describedby={errors.password ? 'password-error' : undefined}
                            />

                            {errors.password && (
                                <p id="password-error" className="text-destructive text-sm" role="alert">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Confirm password</Label>

                            <Input
                                id="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                type="password"
                                className={clsx('transition-all duration-200 focus:ring-2', errors.password_confirmation && 'border-red-500')}
                                autoComplete="new-password"
                                placeholder="Confirm password"
                                aria-invalid={!!errors.password_confirmation}
                                aria-describedby={errors.password_confirmation ? 'password-confirmation-error' : undefined}
                            />

                            {errors.password_confirmation && (
                                <p id="password-confirmation-error" className="text-destructive text-sm" role="alert">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing} className={clsx('transition-all duration-200')}>
                                {processing ? 'Saving...' : 'Save password'}
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}

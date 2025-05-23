// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <AuthLayout title="Verify email" description="Please verify your email address by clicking on the link we just emailed to you.">
            <Head title="Email verification" />

            {status === 'verification-link-sent' && (
                <div className="mb-6 rounded-lg bg-green-50 p-4 text-center text-sm font-medium text-green-600">
                    A new verification link has been sent to the email address you provided during registration.
                </div>
            )}

            <form className="flex flex-col gap-8" onSubmit={submit}>
                <div className="grid gap-6">
                    <Button type="submit" className="h-11 w-full text-base" disabled={processing}>
                        {processing ? (
                            <>
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                Sending verification email...
                            </>
                        ) : (
                            <>
                                <Mail className="mr-2 h-4 w-4" />
                                Resend verification email
                            </>
                        )}
                    </Button>
                </div>

                <div className="text-center">
                    <p className="text-muted-foreground text-sm">
                        Want to try a different account?{' '}
                        <TextLink href={route('logout')} method="post" className="text-primary hover:text-primary/90 font-medium">
                            Log out
                        </TextLink>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}

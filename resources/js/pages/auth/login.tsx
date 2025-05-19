import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Lock, Mail } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import AuthLayout from '@/layouts/auth-layout';

type GuardType = 'web' | 'client';

type LoginFormData = {
    email: string;
    password: string;
    remember: boolean;
    guard_type: GuardType;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginFormData>({
        email: '',
        password: '',
        remember: false,
        guard_type: 'web',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Welcome back" description="Enter your credentials to access your account">
            <Head title="Log in" />

            <form className="flex flex-col gap-8" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-4">
                        <Label className="text-base font-medium">Login as</Label>
                        <RadioGroup
                            value={data.guard_type}
                            onValueChange={(value: GuardType) => setData('guard_type', value)}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div className="hover:bg-accent/50 flex cursor-pointer items-center space-x-3 rounded-lg border p-4 transition-colors">
                                <RadioGroupItem value="web" id="web" className="mt-0.5" />
                                <div className="grid gap-1">
                                    <Label htmlFor="web" className="cursor-pointer text-base font-medium">
                                        User
                                    </Label>
                                    <p className="text-muted-foreground text-sm">Access your user account</p>
                                </div>
                            </div>
                            <div className="hover:bg-accent/50 flex cursor-pointer items-center space-x-3 rounded-lg border p-4 transition-colors">
                                <RadioGroupItem value="client" id="client" className="mt-0.5" />
                                <div className="grid gap-1">
                                    <Label htmlFor="client" className="cursor-pointer text-base font-medium">
                                        Client
                                    </Label>
                                    <p className="text-muted-foreground text-sm">Access your client portal</p>
                                </div>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-base font-medium">
                                Email address
                            </Label>
                            <div className="relative">
                                <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="email@example.com"
                                    className="pl-10"
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-base font-medium">
                                    Password
                                </Label>
                                {canResetPassword && (
                                    <TextLink href={route('password.request')} className="text-sm" tabIndex={5}>
                                        Forgot password?
                                    </TextLink>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Enter your password"
                                    className="pl-10"
                                />
                            </div>
                            <InputError message={errors.password} />
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox id="remember" name="remember" tabIndex={3} />
                        <Label htmlFor="remember" className="text-muted-foreground text-sm">
                            Remember me
                        </Label>
                    </div>

                    <Button type="submit" className="h-11 w-full text-base" tabIndex={4} disabled={processing}>
                        {processing ? (
                            <>
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            'Sign in'
                        )}
                    </Button>
                </div>

                <div className="text-center">
                    <p className="text-muted-foreground text-sm">
                        Don't have an account?{' '}
                        <TextLink href={route('register')} className="text-primary hover:text-primary/90 font-medium" tabIndex={5}>
                            Create an account
                        </TextLink>
                    </p>
                </div>
            </form>

            {status && <div className="mt-4 rounded-lg bg-green-50 p-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}

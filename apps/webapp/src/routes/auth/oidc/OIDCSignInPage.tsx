import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSession } from '@/context/SessionContext';
import { request } from '@/lib/utils';
import { useSearchParams } from 'react-router';
import { toast } from 'sonner';

export const OIDCSignInPage = () => {
    const { session } = useSession();
    const [searchParams] = useSearchParams();

    const appId = searchParams.get('appId');
    // TODO const challenge = searchParams.get('challenge');

    if (!appId) toast.error('No appId provided');

    if (session.account && appId) {
        request('GET', '/api/auth/oidc/authenticate?appId=' + appId).then(async res => {
            if (res.ok) {
                // window.location.href = await res.text();
                console.log('TODO redirect to', await res.text());
            } else {
                toast.error('Failed to initiate OIDC flow. Please try again.');
            }
        });
    }

    const handleSubmit = async () => {
        const username = (document.getElementById('username') as HTMLInputElement).value.trim();
        const password = (document.getElementById('password') as HTMLInputElement).value.trim();

        // TODO add 2FA
        if (username.length < 3 || password.length < 3) return toast.warning('Please enter longer credentials.');
        const res = await request('GET', `/api/auth/login?username=${username}&password=${password}`);

        if (res.ok) {
            toast.success('Login successful!');
            window.location.reload();
        } else if (res.status === 429) {
            toast.error('Too many requests. Please wait a moment and try again.');
        } else {
            toast.error('Login failed. Please check your credentials.');
        }
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-muted">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>Enter your email below to login to your account</CardDescription>
                    <CardAction>
                        <Button disabled variant="link">
                            Sign Up
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" type="text" placeholder="john.doe" required />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Button disabled variant="link" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                                    Forgot your password?
                                </Button>
                            </div>
                            <Input id="password" type="password" required />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" onClick={handleSubmit} className="w-full">
                        Login
                    </Button>
                    <Button variant="outline" className="w-full">
                        Login with Google
                    </Button>
                </CardFooter>
            </Card>
        </main>
    );
};

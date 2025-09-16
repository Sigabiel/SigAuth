import Layout from '@/components/navigation/SidebarLayout';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import SessionContextProvider, { type SessionStorage } from '@/context/SessionContext';
import { logout, request } from '@/lib/utils';
import { AccountsPage } from '@/routes/accounts/AccountsPage';
import { AppsPage } from '@/routes/apps/AppsPage';
import { AssetTypePage } from '@/routes/asset-types/AssetTypePage';
import { AssetPage } from '@/routes/assets/AssetPage';
import { ContainerPage } from '@/routes/container/ContainerPage';
import HomePage from '@/routes/home/HomePage';
import { SettingsPage } from '@/routes/settings/SettingsPage';
import SignInPage from '@/routes/SignIn';
import type { Session } from '@sigauth/prisma-wrapper/prisma-client';
import dayjs from 'dayjs';
import React, { StrictMode, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { toast, Toaster } from 'sonner';

const RootComponent: React.FC = () => {
    const [session, setSession] = useState<SessionStorage | null>(null);
    const [init, setInit] = useState(false);

    useEffect(() => {
        if (!session?.account && window.location.pathname !== '/signin') {
            request('GET', '/api/authentication/init').then(async res => {
                if (res.ok) {
                    const data = await res.json();
                    setSession(data as SessionStorage);

                    toast.success(
                        `Session Active (Expires: ${dayjs.unix((data.session as Session).expire).format('YYYY-MM-DD HH:mm:ss')})`,
                    );
                } else {
                    logout();
                }
                setInit(true);
            });
        }
    }, []);

    return (
        <BrowserRouter>
            <StrictMode>
                <ThemeProvider storageKey="ui-theme" defaultTheme="system">
                    <Toaster position="bottom-center" />
                    {!init ? (
                        <main className="flex items-center justify-center h-screen">
                            <LoadingSpinner className="w-12 h-12" />
                        </main>
                    ) : (
                        <SessionContextProvider init={session}>
                            {session?.account && init ? (
                                <Layout>
                                    <Routes>
                                        <Route path="/" element={<HomePage />} />
                                        <Route path="/accounts" element={<AccountsPage />} />
                                        <Route path="/asset/types" element={<AssetTypePage />} />
                                        <Route path="/asset/instances" element={<AssetPage />} />
                                        <Route path="/container" element={<ContainerPage />} />
                                        <Route path="/settings" element={<SettingsPage />} />
                                        <Route path="/apps" element={<AppsPage />} />
                                        <Route path="*" element={<h1>404 Not Found</h1>} />
                                    </Routes>
                                </Layout>
                            ) : (
                                <SignInPage />
                            )}
                        </SessionContextProvider>
                    )}
                </ThemeProvider>
            </StrictMode>
        </BrowserRouter>
    );
};

export default RootComponent;

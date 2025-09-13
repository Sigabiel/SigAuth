import Layout from '@/components/navigation/SidebarLayout'
import { ThemeProvider } from '@/components/ThemeProvider'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { DefaultSessionContext, useSession } from '@/context/SessionContext'
import { logout, request } from '@/lib/utils'
import App from '@/routes/App'
import SignInPage from '@/routes/SignIn'
import type { Session } from '@sigauth/prisma-wrapper/prisma-client'
import dayjs from 'dayjs'
import React, { StrictMode, useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { toast, Toaster } from 'sonner'

const RootComponent: React.FC = () => {
    const session = useSession()
    const [init, setInit] = useState(false)

    useEffect(() => {
        if (!session.account && window.location.pathname !== '/signin') {
            request('GET', '/api/authentication/init').then(async res => {
                if (res.ok) {
                    const data = await res.json()
                    session.setAccount(data.account, data.session)
                    session.setAccounts(data.accounts)
                    session.setApps(data.apps)
                    session.setAssets(data.assets)
                    session.setAssetTypes(data.assetTypes)
                    session.setContainers(data.containers)

                    toast.success(
                        `Session Active (Expires: ${dayjs.unix((data.session as Session).expire).format('YYYY-MM-DD HH:mm:ss')})`,
                    )
                } else {
                    logout()
                }
                setInit(true)
            })
        }
    }, [])

    return (
        <BrowserRouter>
            <StrictMode>
                <Toaster position="bottom-center" />
                <DefaultSessionContext.Provider value={session}>
                    <ThemeProvider storageKey="ui-theme" defaultTheme="system">
                        {session.account && init ? (
                            <Layout>
                                <Routes>
                                    <Route path="/" element={<App />} />
                                </Routes>
                            </Layout>
                        ) : init ? (
                            <SignInPage />
                        ) : (
                            <main className="flex items-center justify-center h-screen">
                                <LoadingSpinner className="h-12 w-12" />
                            </main>
                        )}
                    </ThemeProvider>
                </DefaultSessionContext.Provider>
            </StrictMode>
        </BrowserRouter>
    )
}

export default RootComponent

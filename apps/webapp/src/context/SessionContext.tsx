import type { Account, App, Asset, AssetType, Container, Session } from '@sigauth/prisma-wrapper/prisma-client'
import { createContext, useMemo, useState } from 'react'

export type SessionContext = {
    account?: Account
    session?: Session
    accounts: Account[]
    assetTypes: AssetType[]
    assets: Asset[]
    apps: App[]
    containers: Container[]

    setAccount: (account: Account, session: Session) => void
    setAccounts: (accounts: Account[]) => void
    setAssetTypes: (assetTypes: AssetType[]) => void
    setAssets: (assets: Asset[]) => void
    setApps: (apps: App[]) => void
    setContainers: (containers: Container[]) => void
}

export const DefaultSessionContext = createContext<SessionContext>({
    account: undefined,
    session: undefined,
    accounts: [],
    assetTypes: [],
    assets: [],
    apps: [],
    containers: [],

    setAccount: () => {},
    setAccounts: () => {},
    setAssetTypes: () => {},
    setAssets: () => {},
    setApps: () => {},
    setContainers: () => {},
})

export const useSession = () => {
    const [account, setAccount] = useState<Account>()
    const [session, setSession] = useState<Session>()
    const [accounts, setAccounts] = useState<Account[]>([])
    const [assetTypes, setAssetTypes] = useState<AssetType[]>([])
    const [assets, setAssets] = useState<Asset[]>([])
    const [apps, setApps] = useState<App[]>([])
    const [containers, setContainers] = useState<Container[]>([])

    const contextFunctions = useMemo(
        () => ({
            setAccount: (account: Account, session: Session) => {
                setAccount(account)
                setSession(session)
            },
            setAccounts: (accounts: Account[]) => setAccounts(accounts),
            setAssetTypes: (assetTypes: AssetType[]) => setAssetTypes(assetTypes),
            setAssets: (assets: Asset[]) => setAssets(assets),
            setApps: (apps: App[]) => setApps(apps),
            setContainers: (containers: Container[]) => setContainers(containers),
        }),
        [],
    )

    return { account, session, accounts, assetTypes, assets, apps, containers, ...contextFunctions } as SessionContext
}

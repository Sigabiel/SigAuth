// Simple interfaces to avoid build issues during development
export interface Container {
    id: number;
    name: string;
    assets: number[];
    apps: number[];
}

export interface Asset {
    id: number;
    name: string;
    typeId: number;
    fields: any;
}

export interface App {
    id: number;
    name: string;
    url: string;
    token: string;
    webFetch: boolean;
    permissions: any;
}

// Mock PROTECTED constant
export const PROTECTED = {
    AssetType: {
        id: 1,
        name: 'Container',
    },
    Container: {
        id: 1,
        name: 'Container Management',
    },
    App: {
        id: 1,
        name: 'SigAuth',
    },
};
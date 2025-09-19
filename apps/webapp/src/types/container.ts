// Simple interface for Container to avoid build issues during development
export interface Container {
    id: number;
    name: string;
    assets: number[];
    apps: number[];
}
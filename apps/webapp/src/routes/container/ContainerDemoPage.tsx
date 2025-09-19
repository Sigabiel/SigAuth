import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreateContainerDialog } from '@/routes/container/CreateContainerDialog';
import { DeleteContainerDialog } from '@/routes/container/DeleteContainerDialog';
import { EditContainerDialog } from '@/routes/container/EditContainerDialog';
import type { Container } from '@/types/container';
import { PROTECTED } from '@/types/container';
import { Edit, Trash } from 'lucide-react';
import { useState } from 'react';

// Mock data for demonstration
const mockContainers: Container[] = [
    {
        id: 1,
        name: 'Container Management',
        assets: [1, 2],
        apps: [1]
    },
    {
        id: 2,
        name: 'Web Application Container',
        assets: [3, 4, 5],
        apps: [2, 3]
    },
    {
        id: 3,
        name: 'API Service Container',
        assets: [6],
        apps: [4, 5, 6]
    }
];

const mockAssets = [
    { id: 1, name: 'Database Asset', typeId: 1, fields: {} },
    { id: 2, name: 'API Key Asset', typeId: 2, fields: {} },
    { id: 3, name: 'SSL Certificate', typeId: 3, fields: {} },
    { id: 4, name: 'Configuration File', typeId: 1, fields: {} },
    { id: 5, name: 'User Database', typeId: 1, fields: {} },
    { id: 6, name: 'Service Token', typeId: 2, fields: {} }
];

const mockApps = [
    { id: 1, name: 'SigAuth', url: 'https://sigauth.com', token: 'token123', webFetch: true, permissions: {} },
    { id: 2, name: 'Web App', url: 'https://webapp.com', token: 'token456', webFetch: false, permissions: {} },
    { id: 3, name: 'Mobile API', url: 'https://api.mobile.com', token: 'token789', webFetch: true, permissions: {} },
    { id: 4, name: 'Analytics Service', url: 'https://analytics.com', token: 'tokenABC', webFetch: false, permissions: {} },
    { id: 5, name: 'Payment Gateway', url: 'https://payments.com', token: 'tokenDEF', webFetch: true, permissions: {} },
    { id: 6, name: 'Notification Service', url: 'https://notify.com', token: 'tokenGHI', webFetch: false, permissions: {} }
];

// Mock session context
const mockSession = {
    containers: mockContainers,
    assets: mockAssets,
    apps: mockApps,
    accounts: [],
    assetTypes: []
};

export const ContainerDemoPage: React.FC = () => {
    const [containers, setContainers] = useState<Container[]>(mockContainers);
    const [editContainer, setEditContainer] = useState<Container | undefined>(undefined);
    const [deleteContainer, setDeleteContainer] = useState<Container | undefined>(undefined);

    // Mock session hook
    const session = {
        session: mockSession,
        setSession: (update: any) => {
            if (update.containers) {
                setContainers(update.containers);
            }
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h2 className="scroll-m-20 text-3xl font-semibold">Container Management Demo</h2>
            <p className="leading-7 text-accent-foreground">
                This is a demonstration of the CRUD container interface. Create and manage your containers here. 
                Containers group assets and applications together for easier management.
            </p>

            <Card className="w-full py-2! p-2">
                {/* Note: These dialogs won't work fully without proper session context */}
                <div className="mb-3">
                    <Button disabled className="mb-3">
                        Create Container (Demo - Backend Required)
                    </Button>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Assets</TableHead>
                            <TableHead>Applications</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {containers.map(container => (
                            <TableRow key={container.id}>
                                <TableCell className="w-[100px]">{container.id}</TableCell>
                                <TableCell>{container.name}</TableCell>
                                <TableCell>
                                    {(container.assets as number[]).length} asset{(container.assets as number[]).length !== 1 ? 's' : ''}
                                    <div className="text-sm text-muted-foreground mt-1">
                                        {(container.assets as number[])
                                            .map(assetId => mockAssets.find(asset => asset.id === assetId)?.name || `Asset ${assetId}`)
                                            .join(', ')}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <div>{(container.apps as number[]).length} app{(container.apps as number[]).length !== 1 ? 's' : ''}</div>
                                        {(container.apps as number[]).length > 0 && (
                                            <div className="text-sm text-muted-foreground">
                                                {(container.apps as number[])
                                                    .map(appId => mockApps.find(app => app.id === appId)?.name || `App ${appId}`)
                                                    .join(', ')}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right justify-end flex gap-2">
                                    <Button
                                        disabled={container.id === PROTECTED.Container.id}
                                        variant="outline"
                                        size="icon"
                                        onClick={() => alert(`Edit Container: ${container.name} (Demo - Backend Required)`)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        disabled={container.id === PROTECTED.Container.id}
                                        variant="outline"
                                        size="icon"
                                        onClick={() => alert(`Delete Container: ${container.name} (Demo - Backend Required)`)}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="mt-6 p-4 border rounded-lg bg-muted/50">
                    <h3 className="text-lg font-semibold mb-2">Implementation Features:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        <li><strong>Create Container:</strong> Form with name, asset IDs, and app IDs using chip-based UI</li>
                        <li><strong>Edit Container:</strong> Pre-populated form for existing containers</li>
                        <li><strong>Delete Container:</strong> Confirmation dialog with proper warning message</li>
                        <li><strong>Table View:</strong> Shows container details with asset and app counts and names</li>
                        <li><strong>Form Validation:</strong> Zod schemas matching backend DTOs</li>
                        <li><strong>Session Integration:</strong> Updates context for real-time data refresh</li>
                        <li><strong>Protected Containers:</strong> Cannot edit/delete protected system containers</li>
                        <li><strong>API Integration:</strong> Ready endpoints: POST /api/container/create, POST /api/container/edit, POST /api/container/delete</li>
                    </ul>
                </div>
            </Card>
        </div>
    );
};
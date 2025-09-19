import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSession } from '@/context/SessionContext';
import { CreateContainerDialog } from '@/routes/container/CreateContainerDialog';
import { DeleteContainerDialog } from '@/routes/container/DeleteContainerDialog';
import { EditContainerDialog } from '@/routes/container/EditContainerDialog';
import type { Container } from '@/types/container';
import { PROTECTED } from '@/types/container';
import { Edit, Trash } from 'lucide-react';
import { useState } from 'react';

export const ContainerPage: React.FC = () => {
    const { session } = useSession();

    const [editContainer, setEditContainer] = useState<Container | undefined>(undefined);
    const [deleteContainer, setDeleteContainer] = useState<Container | undefined>(undefined);

    return (
        <>
            <h2 className="scroll-m-20 text-3xl font-semibold">Manage Containers</h2>
            <p className="leading-7 text-accent-foreground">
                Create and manage your containers here. Containers group assets and applications together for easier management.
            </p>

            <Card className="w-full py-2! p-2">
                <CreateContainerDialog />
                <EditContainerDialog container={editContainer} close={() => setEditContainer(undefined)} />
                <DeleteContainerDialog container={deleteContainer} close={() => setDeleteContainer(undefined)} />

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
                        {session.containers.map(container => (
                            <TableRow key={container.id}>
                                <TableCell className="w-[100px]">{container.id}</TableCell>
                                <TableCell>{container.name}</TableCell>
                                <TableCell>
                                    {(container.assets as number[]).length} asset{(container.assets as number[]).length !== 1 ? 's' : ''}
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <div>{(container.apps as number[]).length} app{(container.apps as number[]).length !== 1 ? 's' : ''}</div>
                                        {(container.apps as number[]).length > 0 && (
                                            <div className="text-sm text-muted-foreground">
                                                {(container.apps as number[])
                                                    .map(appId => session.apps.find(app => app.id === appId)?.name || `App ${appId}`)
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
                                        onClick={() => setEditContainer(container)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        disabled={container.id === PROTECTED.Container.id}
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setDeleteContainer(container)}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </>
    );
};

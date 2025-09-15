import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSession } from '@/context/SessionContext';
import { CreateAssetType } from '@/routes/asset-types/CreateAssetType';
import type { AssetTypeField } from '@sigauth/prisma-wrapper/json-types';
import { Edit, Trash } from 'lucide-react';

export const AssetTypePage: React.FC = () => {
    const { session } = useSession();

    console.log(session);
    return (
        <>
            <h2 className="scroll-m-20 text-3xl font-semibold">Manage Asset Types</h2>
            <p className="leading-7 text-accent-foreground">
                Create and manage your blueprints for assets here. You can define variables and
            </p>

            <Card className="w-full py-2! p-2">
                <CreateAssetType />

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead></TableHead>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Fields</TableHead>
                            <TableHead>Assets</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {session.assetTypes.map(assetType => (
                            <TableRow key={assetType.id}>
                                <TableCell className="w-[100px]">{assetType.id}</TableCell>
                                <TableCell>{assetType.name}</TableCell>
                                <TableCell>{(assetType.fields as AssetTypeField[]).length}</TableCell>
                                <TableCell>{session.assets.filter(a => a.typeId === assetType.id).length}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="icon">
                                        <Edit className="h-4 w-4" />
                                        <span className="sr-only">Edit</span>
                                    </Button>
                                    <Button variant="outline" size="icon">
                                        <Trash className="h-4 w-4" />
                                        <span className="sr-only">Delete</span>
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

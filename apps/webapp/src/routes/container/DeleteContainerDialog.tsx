import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useSession } from '@/context/SessionContext';
import { request } from '@/lib/utils';
import type { Container } from '@sigauth/prisma-wrapper/prisma-client';

interface DeleteContainerDialogProps {
    container?: Container;
    close: () => void;
}

export const DeleteContainerDialog = ({ container, close }: DeleteContainerDialogProps) => {
    const { session, setSession } = useSession();

    const handleDelete = async () => {
        if (!container) return;

        const res = await request('POST', '/api/container/delete', {
            containerIds: [container.id],
        });

        if (res.ok) {
            setSession({
                containers: session.containers.filter(c => c.id !== container.id),
                // Also remove related assets if any
                assets: session.assets.filter(a => {
                    if (a.typeId === 1) { // Assuming container asset type is 1
                        const fields = a.fields as any;
                        return fields?.['0'] !== container.id;
                    }
                    return true;
                }),
            });
            close();
        }
    };

    if (!container) return null;

    return (
        <AlertDialog open={!!container} onOpenChange={(open) => !open && close()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Container</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the container "{container.name}"? This action cannot be undone.
                        This will also remove all associated permissions and the container asset.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={close}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete Container
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
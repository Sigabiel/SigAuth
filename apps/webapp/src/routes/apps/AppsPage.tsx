import { Card } from '@/components/ui/card';
import { useSession } from '@/context/SessionContext';
import { CreateAppDialog } from '@/routes/apps/CreateAppDialog';

export const AppsPage = () => {
    const { session } = useSession();

    return (
        <>
            <h2 className="scroll-m-20 text-3xl font-semibold">Manage Apps</h2>
            <p className="leading-7 text-accent-foreground">
                Create and manage your apps here. You can create, edit, or delete them as you wish.
            </p>

            <Card className="w-full py-2! p-2">
                <CreateAppDialog />
            </Card>
        </>
    );
};

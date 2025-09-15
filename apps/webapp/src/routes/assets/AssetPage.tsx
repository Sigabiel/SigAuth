import { Card } from '@/components/ui/card';
import { CreateAssetDialog } from '@/routes/assets/CreateAssetDialog';

export const AssetPage: React.FC = () => {
    return (
        <>
            <h2 className="scroll-m-20 text-3xl font-semibold">Manage Assets</h2>
            <p className="leading-7 text-accent-foreground">
                Create and manage your assets here. You can create, edit, or delete them as you wish.
            </p>

            <Card className="w-full py-2! p-2">
                <CreateAssetDialog />
            </Card>
        </>
    );
};

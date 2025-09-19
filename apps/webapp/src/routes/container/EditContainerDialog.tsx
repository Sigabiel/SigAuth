import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSession } from '@/context/SessionContext';
import { request } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Container } from '@sigauth/prisma-wrapper/prisma-client';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
    name: z.string().min(4, 'Container name must be at least 4 characters long'),
    assets: z.array(z.number()),
    apps: z.array(z.number()),
});

interface EditContainerDialogProps {
    container?: Container;
    close: () => void;
}

export const EditContainerDialog = ({ container, close }: EditContainerDialogProps) => {
    const { session, setSession } = useSession();

    const [assetField, setAssetField] = useState<string>('');
    const [appField, setAppField] = useState<string>('');

    const submitToApi = async (values: z.infer<typeof formSchema>) => {
        if (!container) return;

        const res = await request('POST', '/api/container/edit', {
            id: container.id,
            ...values,
        });

        if (res.ok) {
            const updatedContainer = await res.json();
            setSession({
                containers: session.containers.map(c => 
                    c.id === container.id ? updatedContainer : c
                ),
            });
            close();
            form.reset();
            setAssetField('');
            setAppField('');
        }
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            assets: [],
            apps: [],
        },
    });

    useEffect(() => {
        if (container) {
            form.reset({
                name: container.name,
                assets: container.assets as number[],
                apps: container.apps as number[],
            });
        }
    }, [container, form]);

    const addAsset = () => {
        const assetId = parseInt(assetField);
        if (isNaN(assetId) || assetId <= 0) return;
        
        const asset = session.assets.find(a => a.id === assetId);
        if (!asset) return;
        
        const currentAssets = form.getValues('assets');
        if (!currentAssets.includes(assetId)) {
            form.setValue('assets', [...currentAssets, assetId]);
        }
        setAssetField('');
    };

    const removeAsset = (assetId: number) => {
        const currentAssets = form.getValues('assets');
        form.setValue('assets', currentAssets.filter(id => id !== assetId));
    };

    const addApp = () => {
        const appId = parseInt(appField);
        if (isNaN(appId) || appId <= 0) return;
        
        const app = session.apps.find(a => a.id === appId);
        if (!app) return;
        
        const currentApps = form.getValues('apps');
        if (!currentApps.includes(appId)) {
            form.setValue('apps', [...currentApps, appId]);
        }
        setAppField('');
    };

    const removeApp = (appId: number) => {
        const currentApps = form.getValues('apps');
        form.setValue('apps', currentApps.filter(id => id !== appId));
    };

    if (!container) return null;

    return (
        <Dialog open={!!container} onOpenChange={(open) => !open && close()}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Container</DialogTitle>
                    <DialogDescription>
                        Edit the container details, assets, and applications.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submitToApi)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Container name</FormLabel>
                                    <FormDescription>The name of your container.</FormDescription>
                                    <FormControl>
                                        <Input placeholder="My Container" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="asset-id">Assets</Label>
                                <div className="flex gap-2 mt-2">
                                    <Input
                                        id="asset-id"
                                        placeholder="Asset ID"
                                        type="number"
                                        value={assetField}
                                        onChange={(e) => setAssetField(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAsset())}
                                    />
                                    <Button type="button" variant="outline" onClick={addAsset}>
                                        Add Asset
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {form.watch('assets').map(assetId => {
                                        const asset = session.assets.find(a => a.id === assetId);
                                        return (
                                            <div key={assetId} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md flex items-center gap-2">
                                                <span>{asset?.name || `Asset ${assetId}`}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeAsset(assetId)}
                                                    className="hover:text-destructive"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="app-id">Applications</Label>
                                <div className="flex gap-2 mt-2">
                                    <Input
                                        id="app-id"
                                        placeholder="App ID"
                                        type="number"
                                        value={appField}
                                        onChange={(e) => setAppField(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addApp())}
                                    />
                                    <Button type="button" variant="outline" onClick={addApp}>
                                        Add App
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {form.watch('apps').map(appId => {
                                        const app = session.apps.find(a => a.id === appId);
                                        return (
                                            <div key={appId} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md flex items-center gap-2">
                                                <span>{app?.name || `App ${appId}`}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeApp(appId)}
                                                    className="hover:text-destructive"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={close}>
                                Cancel
                            </Button>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
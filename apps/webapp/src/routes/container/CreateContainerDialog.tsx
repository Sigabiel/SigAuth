import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PopoverTrigger } from '@/components/ui/popover';
import { useSession } from '@/context/SessionContext';
import { cn, request } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Popover, PopoverContent } from '@radix-ui/react-popover';
import { PROTECTED } from '@sigauth/prisma-wrapper/protected';
import { BadgePlus, Check, ChevronsUpDown, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
    name: z.string().min(4, 'Container name must be at least 4 characters long'),
    assets: z.array(z.number()),
    apps: z.array(z.number()),
});

export const CreateContainerDialog = () => {
    const { session, setSession } = useSession();

    const [open, setOpen] = useState(false);
    const [assetSelectorOpen, setAssetSelectorOpen] = useState(false);
    const [appSelectorOpen, setAppSelectorOpen] = useState(false);

    const submitToApi = async (values: z.infer<typeof formSchema>) => {
        const res = await request('POST', '/api/container/create', values);

        if (res.ok) {
            const data = await res.json();
            setSession({
                containers: [...session.containers, data.container],
                assets: [...session.assets, data.containerAsset],
            });
            setOpen(false);
            form.reset();
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

    const removeAsset = (assetId: number) => {
        const currentAssets = form.getValues('assets');
        form.setValue(
            'assets',
            currentAssets.filter(id => id !== assetId),
        );
    };

    const removeApp = (appId: number) => {
        const currentApps = form.getValues('apps');
        form.setValue(
            'apps',
            currentApps.filter(id => id !== appId),
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-fit">
                    <BadgePlus />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl flex flex-col gap-5 max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Container</DialogTitle>
                    <DialogDescription>Create a new container to group assets and applications together.</DialogDescription>
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
                                        <Input placeholder="e.g. Customer A" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="asset-id">Assets</Label>
                                <div className="grid grid-cols-2 gap-3 mt-1.5">
                                    <Input id="asset-id" placeholder="Enter asset ID" />
                                    <Popover open={assetSelectorOpen} onOpenChange={setAssetSelectorOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={'outline'}
                                                role="combobox"
                                                aria-expanded={assetSelectorOpen}
                                                className="justify-between"
                                            >
                                                Select an asset
                                                <ChevronsUpDown className="opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[90%] p-0 !z-300 pointer-events-auto">
                                            <Command>
                                                <CommandInput placeholder="Search asset types..." className="h-9" />
                                                <CommandList>
                                                    <CommandEmpty>No assets found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {session.assets
                                                            .filter(
                                                                asset =>
                                                                    asset.id != PROTECTED.AssetType.id &&
                                                                    !form.watch('assets').includes(asset.id),
                                                            )
                                                            .map(asset => (
                                                                <CommandItem
                                                                    key={asset.id}
                                                                    onSelect={() => {
                                                                        setAssetSelectorOpen(false);
                                                                        form.setValue('assets', [...form.getValues('assets'), asset.id]);
                                                                    }}
                                                                >
                                                                    {asset.name}
                                                                    <Check
                                                                        className={cn(
                                                                            'ml-auto',
                                                                            asset.id === form.watch('assets')[0]
                                                                                ? 'opacity-100'
                                                                                : 'opacity-0',
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {form.watch('assets').map(assetId => {
                                        const asset = session.assets.find(a => a.id === assetId);
                                        return (
                                            <div
                                                key={assetId}
                                                className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md flex items-center gap-2"
                                            >
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
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="app-id">Apps</Label>
                                <div className="grid grid-cols-2 gap-3 mt-1.5">
                                    <Input id="app-id" placeholder="Enter app ID" />
                                    <Popover open={appSelectorOpen} onOpenChange={setAppSelectorOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={'outline'}
                                                role="combobox"
                                                aria-expanded={appSelectorOpen}
                                                className="justify-between"
                                            >
                                                Select an app
                                                <ChevronsUpDown className="opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[90%] p-0 !z-300">
                                            <Command>
                                                <CommandInput placeholder="Search asset types..." className="h-9" />
                                                <CommandList>
                                                    <CommandEmpty>No apps found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {session.apps
                                                            .filter(
                                                                app => app.id != PROTECTED.App.id && !form.watch('apps').includes(app.id),
                                                            )
                                                            .map(app => (
                                                                <CommandItem
                                                                    key={app.id}
                                                                    onSelect={() => {
                                                                        setAppSelectorOpen(false);
                                                                        form.setValue('apps', [...form.getValues('apps'), app.id]);
                                                                    }}
                                                                >
                                                                    {app.name}
                                                                    <Check
                                                                        className={cn(
                                                                            'ml-auto',
                                                                            app.id === form.watch('apps')[0] ? 'opacity-100' : 'opacity-0',
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {form.watch('apps').map(appId => {
                                        const app = session.apps.find(a => a.id === appId);
                                        return (
                                            <div
                                                key={appId}
                                                className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md flex items-center gap-2"
                                            >
                                                <span>{app?.name || `App ${appId}`}</span>
                                                <button type="button" onClick={() => removeApp(appId)} className="hover:text-destructive">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="submit">Create Container</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

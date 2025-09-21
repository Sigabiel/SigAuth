import { Badge } from '@/components/ui/badge';
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
import { BadgePlus, Check, ChevronsUpDown, XIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
    const [assetIdField, setAssetIdField] = useState('');
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

    const isAssetIdFieldValid = useMemo(() => /^\d*(?:[,-]\d+)*$/.test(assetIdField), [assetIdField]);

    const addAssetFromIdField = () => {
        if (!isAssetIdFieldValid) return;
        const notfoundIds: number[] = [];
        const ids = assetIdField.split(',');
        for (const id of ids) {
            if (id.includes('-')) {
                const [start, end] = id.split('-').map(Number);
                for (let i = start; i <= end; i++) {
                    if (!session.assets.find(a => a.id === i) || form.getValues('assets').includes(i)) {
                        notfoundIds.push(i);
                        continue;
                    }
                    form.setValue('assets', [...form.getValues('assets'), i]);
                }
            } else {
                if (!session.assets.find(a => a.id === Number(id)) || form.getValues('assets').includes(Number(id))) {
                    notfoundIds.push(Number(id));
                    continue;
                }
                form.setValue('assets', [...form.getValues('assets'), Number(id)]);
            }
        }

        if (notfoundIds.length > 0) {
            toast.error(`Some assets were not found!`, {
                description: `${notfoundIds.slice(0, 6).join(', ')}${notfoundIds.length > 10 ? ', ...' : ''}`,
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-fit">
                    <BadgePlus />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl flex flex-col gap-5">
                <DialogHeader>
                    <DialogTitle>Create New Container</DialogTitle>
                    <DialogDescription>Create a new container to group assets and applications together.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={(e: React.FormEvent) => {
                            e.preventDefault();
                            toast.promise(form.handleSubmit(submitToApi), {
                                loading: 'Creating container...',
                                success: 'Container created successfully',
                                error: (err: any) => err?.message || 'Failed to create container',
                            });
                        }}
                        className="space-y-8"
                    >
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
                                <div className="col-span-1 grid grid-cols-3 gap-3 mt-1.5">
                                    <div className="relative w-full">
                                        <Input
                                            id="asset-id"
                                            placeholder="e.g 1,2,50-100"
                                            className={`pe-9 ${!isAssetIdFieldValid && 'border-destructive !ring-destructive text-destructive placeholder:text-destructive'}`}
                                            value={assetIdField}
                                            onChange={e => setAssetIdField(e.target.value)}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            hidden={assetIdField.length == 0}
                                            onClick={addAssetFromIdField}
                                            type="button"
                                            className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 end-0 rounded-s-none hover:bg-transparent"
                                        >
                                            <BadgePlus />
                                            <span className="sr-only">Name</span>
                                        </Button>
                                        <p hidden={isAssetIdFieldValid} className="text-xs text-destructive mt-1">
                                            Make sure that your input follows the format: <code>1,2,50-100</code>
                                        </p>
                                    </div>
                                    <div className="col-span-2 [&>:first-child]:w-full [&>:last-child]:!min-w-[60%]">
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
                                            <PopoverContent className="p-0 !z-300 pointer-events-auto">
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
                                                                            form.setValue('assets', [
                                                                                ...form.getValues('assets'),
                                                                                asset.id,
                                                                            ]);
                                                                        }}
                                                                    >
                                                                        {asset.name}{' '}
                                                                        <span className="text-gray-500">
                                                                            ({asset.id},{' '}
                                                                            {session.assetTypes.find(a => a.id == asset.typeId)?.name})
                                                                        </span>
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
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {form.watch('assets').map(assetId => {
                                        const asset = session.assets.find(a => a.id === assetId);
                                        return (
                                            <Badge key={assetId}>
                                                {asset?.name || `Unknown ${assetId}`}{' '}
                                                <button
                                                    className="focus-visible:border-ring focus-visible:ring-ring/50 text-primary-foreground/60 hover:text-primary-foreground -my-px -ms-px -me-1.5 inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-[inherit] p-0 transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
                                                    aria-label="Close"
                                                    onClick={() =>
                                                        form.setValue(
                                                            'assets',
                                                            [...form.getValues('assets').filter(id => id !== assetId)],
                                                            {
                                                                shouldValidate: true,
                                                                shouldDirty: true,
                                                                shouldTouch: true,
                                                            },
                                                        )
                                                    }
                                                >
                                                    <XIcon className="size-3" aria-hidden="true" />
                                                </button>
                                            </Badge>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="app-id">Apps</Label>
                                <div className="gap-3 w-full [&>:first-child]:w-full [&>:last-child]:!min-w-[90%] mt-1.5">
                                    <Popover open={appSelectorOpen} onOpenChange={setAppSelectorOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={'outline'}
                                                role="combobox"
                                                aria-expanded={appSelectorOpen}
                                                className="justify-between w-full"
                                            >
                                                Select an app
                                                <ChevronsUpDown className="opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[100%] p-0 !z-300">
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
                                            <Badge key={appId}>
                                                {app?.name || `Unknown ${appId}`}{' '}
                                                <button
                                                    className="focus-visible:border-ring focus-visible:ring-ring/50 text-primary-foreground/60 hover:text-primary-foreground -my-px -ms-px -me-1.5 inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-[inherit] p-0 transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
                                                    aria-label="Close"
                                                    onClick={() =>
                                                        form.setValue('apps', [...form.getValues('apps').filter(id => id !== appId)], {
                                                            shouldValidate: true,
                                                            shouldDirty: true,
                                                            shouldTouch: true,
                                                        })
                                                    }
                                                >
                                                    <XIcon className="size-3" aria-hidden="true" />
                                                </button>
                                            </Badge>
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

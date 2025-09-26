import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSession } from '@/context/SessionContext';
import { cn, request } from '@/lib/utils';
import type { AppPermission } from '@sigauth/prisma-wrapper/json-types';
import type { AccountWithPermissions } from '@sigauth/prisma-wrapper/prisma';
import type { App, PermissionInstance } from '@sigauth/prisma-wrapper/prisma-client';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const PermissionSetAccountDialog = ({ account, close }: { account?: AccountWithPermissions; close: () => void }) => {
    const { session, setSession } = useSession();

    const [currentApp, setCurrentApp] = useState<App | undefined>(undefined);
    const [currentContainer, setCurrentContainer] = useState<number | undefined>(undefined);
    const [permissions, setPermissions] = useState<PermissionInstance[]>(account ? account.permissions : []);

    const [rootPermissionOpen, setRootPermissionOpen] = useState(false);
    const [containerPermissionOpen, setContainerPermissionOpen] = useState(false);

    useEffect(() => setPermissions(account ? account.permissions : []), [account]);

    useEffect(() => {
        setCurrentContainer(undefined);
    }, [currentApp]);

    const submit = async () => {
        if (!account) throw new Error('No account selected');

        const res = await request('POST', '/api/account/permissions/set', {
            accountId: account.id,
            permissions,
        });

        if (res.ok) {
            setSession({ accounts: session.accounts.map(a => (a.id === account.id ? { ...a, permissions } : a)) });
            close();
            return;
        }
        throw new Error('Failed to set permissions');
    };

    if (!account) return <></>;

    const availableContainers = session.containers.filter(c => c.apps.includes(currentApp?.id || -1));
    return (
        <Dialog open={!!account} onOpenChange={close}>
            <DialogContent className="!max-w-fit">
                <DialogHeader>
                    <DialogTitle>Set explicit permissions for {account.name}</DialogTitle>
                    <DialogDescription>Specify the permissions you want to grant to this account.</DialogDescription>
                </DialogHeader>
                <div>
                    {/* App Selection */}
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col">
                            <p className="font-bold">App</p>
                            <span className="text-muted-foreground">Select the app to modify permissions</span>
                        </div>
                        <Select
                            value={currentApp?.id + ''}
                            onValueChange={id => setCurrentApp(session.apps.find(app => app.id + '' == id))}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select an app" />
                            </SelectTrigger>
                            <SelectContent>
                                {session.apps.map(app => (
                                    <SelectItem key={app.id} value={app.id + ''}>
                                        {app.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Root Permission Selection */}
                    {currentApp && (
                        <div className="flex flex-col gap-2 mt-4">
                            <div className="flex flex-col">
                                <p className="font-bold">Root Permissions</p>
                                <span className="text-muted-foreground">
                                    Select the root permissions which should be applied to the account
                                </span>
                            </div>

                            <div className="grid gap-3 [&>:last-child]:w-full">
                                <Popover open={rootPermissionOpen} onOpenChange={setRootPermissionOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={'outline'}
                                            role="combobox"
                                            aria-expanded={rootPermissionOpen}
                                            className="justify-between"
                                        >
                                            Select root permissions
                                            <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0 !z-300">
                                        <Command>
                                            <CommandInput placeholder="Search permissions..." className="h-9" />
                                            <CommandList>
                                                <CommandEmpty>No permissions found.</CommandEmpty>
                                                <CommandGroup>
                                                    {currentApp &&
                                                        (currentApp.permissions as AppPermission).root.map(identifier => {
                                                            const hasPermission = permissions.find(
                                                                p => p.identifier === identifier && p.appId == currentApp?.id,
                                                            );
                                                            return (
                                                                <CommandItem
                                                                    key={identifier}
                                                                    onSelect={() => {
                                                                        if (hasPermission)
                                                                            setPermissions(permissions.filter(p => p !== hasPermission));
                                                                        else
                                                                            setPermissions([
                                                                                ...permissions,
                                                                                {
                                                                                    appId: currentApp.id,
                                                                                    accountId: account.id,
                                                                                    identifier,
                                                                                } as PermissionInstance,
                                                                            ]);
                                                                    }}
                                                                >
                                                                    {identifier}
                                                                    <Check
                                                                        className={cn(
                                                                            'ml-auto',
                                                                            hasPermission ? 'opacity-100' : 'opacity-0',
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            );
                                                        })}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    )}

                    <Separator className="my-6" />
                    {/* Container Selection */}
                    {availableContainers.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col">
                                <p className="font-bold">Container</p>
                                <span className="text-muted-foreground">Select the container you want to modify permissions for</span>
                            </div>
                            <Select
                                value={currentContainer + ''}
                                onValueChange={id => setCurrentContainer(session.containers.find(container => container.id + '' == id)?.id)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a container" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableContainers.map(container => (
                                        <SelectItem key={container.id} value={container.id + ''}>
                                            {container.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Container & Assete Permission Selection */}
                    {currentApp && currentContainer && (
                        <>
                            <div className="flex flex-col gap-2 mt-4">
                                <div className="flex flex-col">
                                    <p className="font-bold">Container Permissions</p>
                                    <span className="text-muted-foreground">
                                        Select the container permissions which should be applied to the account
                                    </span>
                                </div>

                                <div className="grid gap-3 [&>:last-child]:w-full">
                                    <Popover open={containerPermissionOpen} onOpenChange={setContainerPermissionOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={'outline'}
                                                role="combobox"
                                                aria-expanded={containerPermissionOpen}
                                                className="justify-between"
                                            >
                                                Select container permissions
                                                <ChevronsUpDown className="opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0 !z-300">
                                            <Command>
                                                <CommandInput placeholder="Search permissions..." className="h-9" />
                                                <CommandList>
                                                    <CommandEmpty>No permissions found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {currentApp &&
                                                            currentContainer &&
                                                            (currentApp.permissions as AppPermission).container.map(identifier => {
                                                                const hasPermission = permissions.find(
                                                                    p =>
                                                                        p.identifier === identifier &&
                                                                        p.appId == currentApp?.id &&
                                                                        p.containerId == currentContainer,
                                                                );
                                                                return (
                                                                    <CommandItem
                                                                        key={identifier}
                                                                        onSelect={() => {
                                                                            if (hasPermission)
                                                                                setPermissions(
                                                                                    permissions.filter(p => p !== hasPermission),
                                                                                );
                                                                            else
                                                                                setPermissions([
                                                                                    ...permissions,
                                                                                    {
                                                                                        appId: currentApp.id,
                                                                                        accountId: account.id,
                                                                                        containerId: currentContainer,
                                                                                        identifier,
                                                                                    } as PermissionInstance,
                                                                                ]);
                                                                        }}
                                                                    >
                                                                        {identifier}
                                                                        <Check
                                                                            className={cn(
                                                                                'ml-auto',
                                                                                hasPermission ? 'opacity-100' : 'opacity-0',
                                                                            )}
                                                                        />
                                                                    </CommandItem>
                                                                );
                                                            })}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div>
                                {/* TODO Scrollbar not styled */}
                                <ScrollArea className="mt-2 max-h-[400px] overflow-auto">
                                    <Table>
                                        <TableCaption>Configure permissions for assets</TableCaption>
                                        <TableHeader className="sticky top-0">
                                            <TableRow>
                                                <TableHead>Asset</TableHead>
                                                {(currentApp.permissions as AppPermission).asset.map(identifier => (
                                                    <TableHead key={identifier} className="text-center">
                                                        {identifier}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {session.containers
                                                .find(c => c.id === currentContainer)
                                                ?.assets.map(assetId => {
                                                    const asset = session.assets.find(a => a.id === assetId);

                                                    return (
                                                        <TableRow key={assetId}>
                                                            <TableCell className="font-medium">{asset?.name || assetId}</TableCell>
                                                            {(currentApp.permissions as AppPermission).asset.map(identifier => {
                                                                const perm = permissions.find(
                                                                    p =>
                                                                        p.appId === currentApp.id &&
                                                                        p.containerId === currentContainer &&
                                                                        p.assetId === assetId &&
                                                                        p.identifier === identifier,
                                                                );
                                                                return (
                                                                    <TableCell key={identifier} className="text-center">
                                                                        <Switch
                                                                            checked={!!perm}
                                                                            onCheckedChange={checked => {
                                                                                if (perm) {
                                                                                    setPermissions(permissions.filter(p => p !== perm));
                                                                                } else {
                                                                                    setPermissions([
                                                                                        ...permissions,
                                                                                        {
                                                                                            appId: currentApp.id,
                                                                                            accountId: account.id,
                                                                                            containerId: currentContainer,
                                                                                            assetId: assetId,
                                                                                            identifier,
                                                                                        } as PermissionInstance,
                                                                                    ]);
                                                                                }
                                                                            }}
                                                                        />
                                                                    </TableCell>
                                                                );
                                                            })}
                                                        </TableRow>
                                                    );
                                                })}
                                        </TableBody>
                                    </Table>
                                </ScrollArea>
                            </div>
                        </>
                    )}

                    <div className="mt-3">
                        <Button
                            className="w-full"
                            onClick={() =>
                                toast.promise(submit, {
                                    loading: 'Saving permissions...',
                                    success: 'Permissions saved',
                                    error: (e: Error) => e.message || 'Failed to save permissions',
                                })
                            }
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

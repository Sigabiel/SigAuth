import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSession } from '@/context/SessionContext';
import { cn, request } from '@/lib/utils';
import { PopoverContent } from '@radix-ui/react-popover';
import { AssetFieldType, type AssetTypeField } from '@sigauth/prisma-wrapper/json-types';
import { type AssetType } from '@sigauth/prisma-wrapper/prisma-client';
import { CommandEmpty } from 'cmdk';
import { BadgePlus, Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const CreateAssetDialog = () => {
    const { session, setSession } = useSession();

    const [assetFields, setAssetFields] = useState<Record<string, string | number | boolean>>({});
    const [assetType, setAssetType] = useState<AssetType | null>(null);
    const [assetTypeSelectionOpen, setAssetTypeSelectionOpen] = useState(false);

    const handleSubmit = async () => {
        if (!assetType) return;
        const name = (document.getElementById('create-name') as HTMLInputElement).value;
        if (name.length < 4) {
            toast.error('Name must be at least 4 characters long');
            return;
        }

        console.log(
            JSON.stringify({
                assetTypeId: assetType.id,
                name: name,
                fields: assetFields,
            }),
        );
        const res = await request('POST', '/api/asset/create', {
            assetTypeId: assetType.id,
            name: name,
            fields: assetFields,
        });

        setAssetFields({});
        setAssetType(null);
        (document.getElementById('create-name') as HTMLInputElement).value = '';
        if (res.ok) {
            setSession({ assets: [...session.assets, (await res.json()).asset] });
            return;
        }
        throw new Error('Failed to create asset type');
    };

    console.log(assetFields);
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-fit">
                    <BadgePlus />
                </Button>
            </DialogTrigger>
            <DialogContent className="!max-w-fit">
                <DialogHeader>
                    <DialogTitle>Create a new asset</DialogTitle>
                    <DialogDescription>
                        Define a new asset depending on a asset type. You can create as many asset types as you want and fill them with
                        data.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="grid col-span-2 gap-3">
                            <Label htmlFor="create-name">Name</Label>
                            <Input id="create-name" name="name" placeholder="e.G Back to the Future 3" />
                        </div>

                        {/* Asset type selection */}
                        <div className="grid gap-3">
                            <Label htmlFor="name">Asset type</Label>
                            <Popover open={assetTypeSelectionOpen} onOpenChange={setAssetTypeSelectionOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={'outline'}
                                        role="combobox"
                                        aria-expanded={assetTypeSelectionOpen}
                                        className="justify-between"
                                    >
                                        {assetType ? assetType.name : 'Select asset type'}
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full !max-w-fit p-0 !z-300">
                                    <Command>
                                        <CommandInput placeholder="Search asset types..." className="h-9" />
                                        <CommandList>
                                            <CommandEmpty>No asset types found.</CommandEmpty>
                                            <CommandGroup>
                                                {session.assetTypes.map(type => (
                                                    <CommandItem
                                                        key={type.id}
                                                        onSelect={() => {
                                                            setAssetType(type);
                                                            setAssetTypeSelectionOpen(false);
                                                            setAssetFields({});
                                                        }}
                                                    >
                                                        {type.name}
                                                        <Check
                                                            className={cn('ml-auto', assetType === type ? 'opacity-100' : 'opacity-0')}
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

                    <ScrollArea className="w-full max-h-96 mt-3">
                        <div className="flex flex-col gap-3 m-1">
                            {assetType &&
                                (assetType?.fields as AssetTypeField[]).map(field => {
                                    return (
                                        <div className="grid col-span-2 gap-1 animate-in fade-in duration-500">
                                            <Label htmlFor={field.name}>{field.name}</Label>
                                            {field.type == AssetFieldType.CHECKFIELD ? (
                                                <Checkbox
                                                    checked={!!assetFields[field.id]}
                                                    onCheckedChange={checked => setAssetFields({ ...assetFields, [field.id]: checked })}
                                                />
                                            ) : (
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    type={field.type == AssetFieldType.NUMBER ? 'number' : 'text'}
                                                    onChange={e =>
                                                        setAssetFields({
                                                            ...assetFields,
                                                            [field.id]:
                                                                field.type == AssetFieldType.NUMBER
                                                                    ? parseFloat(e.target.value)
                                                                    : e.target.value,
                                                        })
                                                    }
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                        </div>
                    </ScrollArea>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            className="w-full"
                            disabled={!assetType}
                            onClick={() =>
                                toast.promise(handleSubmit, {
                                    loading: 'Creating asset...',
                                    success: 'Asset created successfully',
                                    error: 'Failed to create asset',
                                })
                            }
                        >
                            Create
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

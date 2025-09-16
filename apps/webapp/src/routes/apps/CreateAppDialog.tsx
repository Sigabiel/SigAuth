import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSession } from '@/context/SessionContext';
import { request } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { BadgePlus, XIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
    name: z.string().min(4, 'Name must be at least 4 characters long'),
    url: z.string().url('Invalid URL'),
    permissions: z.object({
        asset: z.array(z.string().min(3, 'Asset permission must be at least 3 characters long')),
        container: z.array(z.string().min(3, 'Container permission must be at least 3 characters long')),
        root: z.array(z.string().min(3, 'Root permission must be at least 3 characters long')),
    }),
    webFetchEnabled: z.boolean().optional(),
});

export const CreateAppDialog = () => {
    const { session, setSession } = useSession();

    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState<'asset' | 'container' | 'root'>('asset');
    const [permissionField, setPermissionField] = useState<string>('');

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        const res = await request('POST', '/api/app/create', values);

        if (res.ok) {
            const data = await res.json();
            setSession({ apps: [...session.apps, data.app] });
            toast.success('App created successfully');
            setOpen(false);
            return;
        }
        toast.error('Failed to create app');
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            url: '',
            webFetchEnabled: false,
            permissions: {
                asset: [] as string[],
                container: [] as string[],
                root: [] as string[],
            },
        },
    });

    const permissions = form.watch(`permissions.${tab}`);

    const addItem = () => {
        if (!permissionField || permissionField.length < 3 || !/^[A-Z0-9 _-]*$/i.test(permissionField)) {
            return;
        }

        form.setValue(`permissions.${tab}`, [...permissions, permissionField], {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        });
        setPermissionField('');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-fit">
                    <BadgePlus />
                </Button>
            </DialogTrigger>
            <DialogContent className="!max-w-fit">
                <DialogHeader>
                    <DialogTitle>Create a new app</DialogTitle>
                    <DialogDescription>
                        Define a new app here. You can create as many app as you want and fill them with data.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Application name</FormLabel>
                                        <FormDescription>The name of your application.</FormDescription>
                                        <FormControl>
                                            <Input placeholder="My Web Application" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Application URL</FormLabel>
                                        <FormDescription>The URL of your application.</FormDescription>
                                        <FormControl>
                                            <Input placeholder="https://example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="webFetchEnabled"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <FormLabel>Enable Web Fetch</FormLabel>
                                                <FormDescription>Enable or disable web fetching permissions from the url</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Tabs defaultValue="asset" value={tab} onValueChange={value => setTab(value as 'asset' | 'container' | 'root')}>
                                <div className="flex gap-3">
                                    <TabsList className="mb-3">
                                        <TabsTrigger value="asset">Asset</TabsTrigger>
                                        <TabsTrigger value="container">Container</TabsTrigger>
                                        <TabsTrigger value="root">Root</TabsTrigger>
                                    </TabsList>
                                    <div className="w-full">
                                        <div className="relative w-full">
                                            <Input
                                                id="permission-name"
                                                placeholder="e.g Post Modify Permission"
                                                className={`pe-9 ${((permissionField.length > 0 && permissionField.length < 3) || !/^[A-Z0-9 _-]*$/i.test(permissionField)) && 'border-destructive !ring-destructive text-destructive placeholder:text-destructive'}`}
                                                value={permissionField}
                                                onChange={e => setPermissionField(e.target.value)}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={addItem}
                                                type="button"
                                                className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 end-0 rounded-s-none hover:bg-transparent"
                                            >
                                                <BadgePlus />
                                                <span className="sr-only">Name</span>
                                            </Button>
                                        </div>
                                        {((permissionField.length > 0 && permissionField.length < 3) ||
                                            !/^[A-Z0-9 _-]*$/i.test(permissionField)) && (
                                            <p data-slot="form-message" className="text-destructive text-sm mt-2">
                                                Permission must be at least 3 characters long and alphanumeric.
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {permissions.map((permission, index) => (
                                        <Badge key={index}>
                                            {permission}
                                            <button
                                                className="focus-visible:border-ring focus-visible:ring-ring/50 text-primary-foreground/60 hover:text-primary-foreground -my-px -ms-px -me-1.5 inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-[inherit] p-0 transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
                                                aria-label="Close"
                                                onClick={() =>
                                                    form.setValue(
                                                        `permissions.${tab}`,
                                                        permissions.filter((_, i) => i !== index),
                                                        { shouldValidate: true, shouldDirty: true, shouldTouch: true },
                                                    )
                                                }
                                            >
                                                <XIcon className="size-3" aria-hidden="true" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </Tabs>

                            <Button className="w-full" type="submit">
                                Submit
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

import { AppSidebar, sidebarItems, type SidebarItem } from '@/components/navigation/AppSidebar'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useMemo } from 'react'

const SIDEBAR_WIDTH = '16rem'
const SIDEBAR_WIDTH_MOBILE = '18rem'

export default function Layout({ children }: { children: React.ReactNode }) {
    const pages = useMemo(() => {
        function findPath(items: SidebarItem[], targetUrl: string): SidebarItem[] | null {
            for (const item of items) {
                if (item.url === targetUrl) {
                    return [item]
                }

                if (item.children) {
                    const childPath = findPath(item.children, targetUrl)
                    if (childPath) {
                        return [item, ...childPath]
                    }
                }
            }
            return null
        }

        return findPath(sidebarItems, window.location.pathname)
    }, [window.location.pathname])

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="p-2">
                <div className="flex items-center gap-2">
                    <SidebarTrigger />
                    <Breadcrumb>
                        <BreadcrumbList>
                            {pages?.map((page, i) => (
                                <>
                                    <BreadcrumbItem key={page.title}>
                                        <BreadcrumbLink href={!page.children ? page.url : undefined}>{page.title}</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    {i < pages.length - 1 && <BreadcrumbSeparator />}
                                </>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                {children}
            </main>
        </SidebarProvider>
    )
}

import { ChevronDown, Container, FlipHorizontal, Home, Layers, NotepadText, Settings, Stamp, Users } from "lucide-react"

import { CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem
} from "@/components/ui/sidebar"
import { Collapsible } from "@radix-ui/react-collapsible"

export type SidebarItem = {
  title: string
  url: string
  icon: React.ElementType
  children?: SidebarItem[]
}

// Menu items.
export const sidebarItems: SidebarItem[] = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Accounts",
    url: "/accounts",
    icon: Users,
  },
  {
    title: "Assets",
    url: "/asset",
    icon: NotepadText,
    children: [
        { title: "Types", url: "/asset/types", icon: Stamp },
        { title: "Instances", url: "/asset/instances", icon: Layers },
    ]
  },
  {
    title: "Container",
    url: "/container",
    icon: Container,
  },
  {
    title: "Mirror",
    url: "/mirror",
    icon: FlipHorizontal,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
        <SidebarGroupLabel>SigAuth</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => {
                if (item.children) {
                    return <Collapsible key={item.title} className="group/collapsible" defaultOpen>
                        <CollapsibleTrigger className="w-full">
                            <SidebarMenuButton asChild className="w-full">
                                <div className="flex items-center">
                                    <item.icon />
                                    <span>{item.title}</span>
                                    <ChevronDown className="ml-auto" />
                                </div>
                            </SidebarMenuButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                            <SidebarMenuSub>
                                {item.children.map((subItem) => (
                                    <SidebarMenuSubItem key={subItem.title} >
                                        <SidebarMenuSubButton asChild>
                                            <a href={subItem.url}>
                                                <subItem.icon />
                                                <span>{subItem.title}</span>
                                            </a>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                ))}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </Collapsible>
                } else {
                    return <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                            <a href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                }
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
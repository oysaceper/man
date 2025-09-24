"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useUser } from "@/lib/user-context"
import { getNavigationByRole, commonSecondaryNav } from "@/lib/navigation-config"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isLoading } = useUser()
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <Link href="/">
                  <Image src="/codeguide-logo.png" alt="MAN 2 Ponorogo" width={32} height={32} className="rounded-lg" />
                  <span className="text-base font-semibold font-parkinsans">Loading...</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
      </Sidebar>
    )
  }

  // Default user data for guests or if no user found
  const userData = user ? {
    name: user.name,
    email: user.email || `${user.username}@man2ponorogo.sch.id`,
    avatar: user.image || "/codeguide-logo.png",
  } : {
    name: "Guest",
    email: "guest@man2ponorogo.sch.id", 
    avatar: "/codeguide-logo.png",
  }

  // Get role-specific navigation
  const navigation = user ? getNavigationByRole(user.role) : []

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <Image src="/codeguide-logo.png" alt="MAN 2 Ponorogo" width={32} height={32} className="rounded-lg" />
                <span className="text-base font-semibold font-parkinsans">
                  MAN 2 Ponorogo
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigation} />
        <NavSecondary items={commonSecondaryNav} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}

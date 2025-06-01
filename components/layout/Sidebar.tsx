'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Database,
  Home,
  Menu,
  Settings,
  Sheet as SheetIcon,
  Table,
  Users,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isActive?: boolean;
}

function SidebarItem({ href, icon, title, isActive }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:bg-secondary',
        isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground'
      )}
    >
      {icon}
      <span>{title}</span>
    </Link>
  );
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  
  const items = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <Home size={18} />,
    },
    {
      title: 'Data',
      href: '/dashboard/data',
      icon: <Table size={18} />,
    },
    {
      title: 'Sheet Config',
      href: '/dashboard/config',
      icon: <SheetIcon size={18} />,
    },
    {
      title: 'Analytics',
      href: '/dashboard/analytics',
      icon: <BarChart3 size={18} />,
    },
  ];
  
  const secondaryItems = [
    {
      title: 'Settings',
      href: '/dashboard/settings',
      icon: <Settings size={18} />,
    },
    {
      title: 'Users',
      href: '/dashboard/users',
      icon: <Users size={18} />,
    },
  ];

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
          >
            <Menu size={20} />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <MobileSidebarContent items={items} secondaryItems={secondaryItems} pathname={pathname} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className={cn("hidden h-screen border-r bg-background md:flex md:w-64 md:flex-col", className)}>
        <div className="flex h-14 items-center px-4 py-2">
          <div className="flex items-center gap-2 font-semibold">
            <Database className="h-5 w-5" />
            <span>SheetDash</span>
          </div>
        </div>
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1 py-2">
            {items.map((item) => (
              <SidebarItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                title={item.title}
                isActive={pathname === item.href}
              />
            ))}
          </div>
          <Separator className="my-2" />
          <div className="space-y-1 py-2">
            {secondaryItems.map((item) => (
              <SidebarItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                title={item.title}
                isActive={pathname === item.href}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}

function MobileSidebarContent({ items, secondaryItems, pathname }: { 
  items: { title: string; href: string; icon: React.ReactNode }[];
  secondaryItems: { title: string; href: string; icon: React.ReactNode }[];
  pathname: string;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <div className="flex items-center gap-2 font-semibold">
          <Database className="h-5 w-5" />
          <span>SheetDash</span>
        </div>
      </div>
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 py-2">
          {items.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              title={item.title}
              isActive={pathname === item.href}
            />
          ))}
        </div>
        <Separator className="my-2" />
        <div className="space-y-1 py-2">
          {secondaryItems.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              title={item.title}
              isActive={pathname === item.href}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
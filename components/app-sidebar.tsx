"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInput,
	SidebarSeparator,
	SidebarTrigger,
	useSidebar,
} from "@/components/ui/sidebar";
import {
	LayoutTemplate,
	FileText,
	Users,
	History,
	Settings,
	HelpCircle,
	Search,
	Plus,
	FolderOpen,
	MessageSquarePlus,
	User,
} from "lucide-react";
import { ModeToggle } from "@/components/theme-toggle";
import {
	SidebarMenuItems,
	type SidebarMenuItemConfig,
} from "@/components/sidebar-menu-items";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import { useUser } from "@/hooks/use-user";

const mainNavigationItems: SidebarMenuItemConfig[] = [
	{
		icon: MessageSquarePlus,
		label: "AI Chat",
	},
	{
		icon: FolderOpen,
		label: "Projects",
	},
	{
		icon: LayoutTemplate,
		label: "Templates",
	},
	{
		icon: FileText,
		label: "Documents",
		action: {
			icon: Plus,
		},
	},
	{
		icon: Users,
		label: "Community",
		badge: "NEW",
	},
	{
		icon: History,
		label: "History",
	},
];

const settingsItems: SidebarMenuItemConfig[] = [
	{
		icon: Settings,
		label: "Settings",
	},
	{
		icon: HelpCircle,
		label: "Help",
	},
];

interface AppSidebarProps {
	selectedItem: string;
	onItemSelect: (label: string) => void;
}

export function AppSidebar({ selectedItem, onItemSelect }: AppSidebarProps) {
	const { state } = useSidebar();
	const isMobile = useIsMobile();
	const isCollapsed = state === "collapsed";

	const { user } = useUser();

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader
				className={`${isCollapsed ? "p-2" : isMobile ? "p-2" : "p-3"} ${
					isCollapsed ? "space-y-1" : isMobile ? "space-y-2" : "space-y-3"
				}`}>
				{/* Logo */}
				<div
					className={`flex items-center gap-2 ${
						isCollapsed ? "px-0" : isMobile ? "px-1" : "px-2"
					} ${isCollapsed ? "justify-center" : "justify-between"}`}>
					{!isCollapsed && (
						<div className="flex items-center justify-center gap-2">
							<Image
								src={"/ai.png"}
								width={isMobile ? 8 : 25}
								height={isMobile ? 8 : 25}
								alt="logo"
								className="object-contain dark:invert"
							/>
							<span
								className={`font-semibold ${
									isMobile ? "text-base" : "text-lg"
								}`}>
								Script
							</span>
						</div>
					)}
					<SidebarTrigger className="cursor-pointer" />
				</div>

				{/* Search */}
				{!isCollapsed && (
					<div className="relative">
						<Search
							className={`absolute left-2 top-1/2 ${
								isMobile ? "h-3.5 w-3.5" : "h-4 w-4"
							} -translate-y-1/2 text-muted-foreground`}
						/>
						<SidebarInput
							type="search"
							placeholder="Search"
							className={`pl-8 ${isMobile ? "pr-12" : "pr-16"} ${
								isMobile ? "h-8 text-sm" : "rounded-lg"
							}`}
						/>
						{!isMobile && (
							<div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">
								⌘K
							</div>
						)}
					</div>
				)}
			</SidebarHeader>

			<SidebarContent
				className={isCollapsed ? "p-0" : isMobile ? "p-2" : "p-4"}>
				{/* Main Navigation */}
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenuItems
							items={mainNavigationItems}
							selectedItem={selectedItem}
							onItemSelect={onItemSelect}
						/>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* Settings & Help */}
				<SidebarGroup>
					{!isMobile && <SidebarGroupLabel>Settings & Help</SidebarGroupLabel>}
					<SidebarGroupContent>
						<SidebarMenuItems
							items={settingsItems}
							selectedItem={selectedItem}
							onItemSelect={onItemSelect}
						/>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter
				className={
					isCollapsed ? "space-y-2" : isMobile ? "space-y-2" : "space-y-3"
				}>
				{/* Theme Toggle */}
				<div
					className={`flex items-center ${
						state === "collapsed" ? "" : "gap-2"
					}`}>
					<ModeToggle className="w-full" />
				</div>
				{!isCollapsed && <SidebarSeparator />}
				{/* User Profile */}
				{user && (
					<div
						className={`flex items-center ${
							isCollapsed ? "gap-2" : isMobile ? "gap-2" : "gap-3"
						} ${
							isCollapsed ? "px-0" : isMobile ? "px-1" : "px-2"
						} justify-center`}>
						<div
							className={`flex ${
								isMobile ? "h-8 w-8" : "h-10 w-10"
							} items-center justify-center rounded-full bg-muted`}>
							{user?.user_metadata?.avatar_url ? (
								<Image
									src={user?.user_metadata?.avatar_url}
									alt="User"
									width={25}
									height={25}
									className="object-contain dark:invert rounded-full"
								/>
							) : (
								<User className="h-4 w-4 text-muted-foreground" />
							)}
						</div>
						{!isCollapsed && (
							<div className="flex flex-col min-w-0">
								<span
									className={`${
										isMobile ? "text-xs" : "text-sm"
									} font-medium truncate`}>
									{user?.user_metadata?.name || "User"}
								</span>
								<span
									className={`${
										isMobile ? "text-[10px]" : "text-xs"
									} text-muted-foreground truncate`}>
									{user?.email || "user@example.com"}
								</span>
							</div>
						)}
					</div>
				)}
			</SidebarFooter>
		</Sidebar>
	);
}

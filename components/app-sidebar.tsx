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
	MessageSquare,
	FolderKanban,
	LayoutTemplate,
	FileText,
	Users,
	History,
	Settings,
	HelpCircle,
	Search,
	Plus,
	User,
	FolderOpen,
	MessageSquarePlus,
} from "lucide-react";
import { ModeToggle } from "@/components/theme-toggle";
import {
	SidebarMenuItems,
	type SidebarMenuItemConfig,
} from "@/components/sidebar-menu-items";
import Image from "next/image";

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
	const isCollapsed = state === "collapsed";

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader
				className={`${isCollapsed ? "p-2" : "p-3"} ${
					isCollapsed ? "space-y-1" : "space-y-3"
				}`}>
				{/* Logo */}
				<div
					className={`flex items-center gap-2 ${
						isCollapsed ? "px-0" : "px-2"
					} ${isCollapsed ? "justify-center" : "justify-between"}`}>
					{!isCollapsed && (
						<div className="flex items-center gap-2">
							<Image src={""} alt="logo" />
							<span className="font-semibold text-lg">Script</span>
						</div>
					)}
					<SidebarTrigger />
				</div>

				{/* Search */}
				{!isCollapsed && (
					<div className="relative">
						<Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<SidebarInput
							type="search"
							placeholder="Search"
							className="pl-8 pr-16 rounded-lg"
						/>
						<div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">
							⌘K
						</div>
					</div>
				)}
			</SidebarHeader>

			<SidebarContent className={isCollapsed ? "p-0" : "p-4"}>
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
					<SidebarGroupLabel>Settings & Help</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenuItems
							items={settingsItems}
							selectedItem={selectedItem}
							onItemSelect={onItemSelect}
						/>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className={isCollapsed ? "space-y-2" : "space-y-3"}>
				{/* Theme Toggle */}
				{!isCollapsed && (
					<div className="flex items-center gap-2 px-2">
						<ModeToggle className="w-full" />
					</div>
				)}
				{!isCollapsed && <SidebarSeparator />}
				{/* User Profile */}
				<div
					className={`flex items-center gap-3 ${
						isCollapsed ? "px-0" : "px-2"
					} justify-center`}>
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
						<User className="h-5 w-5 text-muted-foreground" />
					</div>
					{!isCollapsed && (
						<div className="flex flex-col min-w-0">
							<span className="text-sm font-medium truncate">
								Emilia Caitlin
							</span>
							<span className="text-xs text-muted-foreground truncate">
								hey@unspace.agency
							</span>
						</div>
					)}
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}

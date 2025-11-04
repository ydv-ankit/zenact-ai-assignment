"use client";

import {
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface SidebarMenuItemConfig {
	icon: LucideIcon;
	label: string;
	isActive?: boolean;
	action?: {
		icon: LucideIcon;
		onClick?: () => void;
	};
	badge?: string;
	onClick?: () => void;
}

interface SidebarMenuItemsProps {
	items: SidebarMenuItemConfig[];
	selectedItem?: string;
	onItemSelect?: (label: string) => void;
}

export function SidebarMenuItems({
	items,
	selectedItem,
	onItemSelect,
}: SidebarMenuItemsProps) {
	return (
		<SidebarMenu>
			{items.map((item, index) => {
				const Icon = item.icon;
				const isActive = selectedItem === item.label || item.isActive === true;
				const handleClick = () => {
					if (onItemSelect) {
						onItemSelect(item.label);
					}
					if (item.onClick) {
						item.onClick();
					}
				};

				return (
					<SidebarMenuItem key={index}>
						<SidebarMenuButton
							isActive={isActive}
							onClick={handleClick}
							tooltip={item.label}
							className={cn(
								isActive ? "dark:bg-black! bg-white!" : "",
								"p-4 text-gray-400"
							)}>
							<Icon className={isActive ? "text-blue-500" : ""} />
							<span className="text-gray-400 font-semibold">{item.label}</span>
							{item.badge && (
								<SidebarMenuBadge className="bg-linear-to-r from-blue-500 to-purple-500 text-white">
									{item.badge}
								</SidebarMenuBadge>
							)}
						</SidebarMenuButton>
						{item.action && (
							<SidebarMenuAction className="rounded-full px-2 border border-border flex items-center justify-center aspect-square">
								<item.action.icon className="h-4 w-4" />
							</SidebarMenuAction>
						)}
					</SidebarMenuItem>
				);
			})}
		</SidebarMenu>
	);
}

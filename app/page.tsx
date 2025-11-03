"use client";

import { useState, type ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import {
	SidebarAIChatComponent,
	SidebarCommunityComponent,
	SidebarDefaultComponent,
	SidebarDocumentsComponent,
	SidebarHelpComponent,
	SidebarHistoryComponent,
	SidebarProjectsComponent,
	SidebarSettingsComponent,
	SidebarTemplatesComponent,
} from "@/components/sidebar-components";

function renderContent(selectedItem: string) {
	const contentMap: Record<string, ReactNode> = {
		"AI Chat": <SidebarAIChatComponent />,
		Projects: <SidebarProjectsComponent />,
		Templates: <SidebarTemplatesComponent />,
		Documents: <SidebarDocumentsComponent />,
		Community: <SidebarCommunityComponent />,
		History: <SidebarHistoryComponent />,
		Settings: <SidebarSettingsComponent />,
		Help: <SidebarHelpComponent />,
	};

	return contentMap[selectedItem] || <SidebarDefaultComponent />;
}

export default function Home() {
	const [selectedItem, setSelectedItem] = useState<string>("AI Chat");

	const handleItemSelect = (label: string) => {
		setSelectedItem(label);
	};

	return (
		<SidebarProvider>
			<AppSidebar selectedItem={selectedItem} onItemSelect={handleItemSelect} />
			<SidebarInset className="flex-1 overflow-auto">
				{renderContent(selectedItem)}
			</SidebarInset>
		</SidebarProvider>
	);
}

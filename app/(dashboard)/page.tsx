"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import {
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
	const searchParams = useSearchParams();
	const [selectedItem, setSelectedItem] = useState<string>("Projects");

	// Sync with URL params if present
	useEffect(() => {
		const item = searchParams.get("item");
		setSelectedItem(item || "Projects");
	}, [searchParams]);

	return renderContent(selectedItem);
}

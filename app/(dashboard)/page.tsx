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
import { useUser } from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";

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
	const { loading } = useUser();

	useEffect(() => {
		const item = searchParams.get("item");
		setSelectedItem(item || "Projects");
	}, [searchParams]);

	if (loading) {
		return (
			<div className="flex flex-col h-full p-8 space-y-6">
				<Skeleton className="h-12 w-64" />
				<Skeleton className="h-4 w-96" />
				<div className="grid grid-cols-2 gap-4 mt-8">
					<Skeleton className="h-32 w-full" />
					<Skeleton className="h-32 w-full" />
					<Skeleton className="h-32 w-full" />
					<Skeleton className="h-32 w-full" />
				</div>
			</div>
		);
	}

	return renderContent(selectedItem);
}

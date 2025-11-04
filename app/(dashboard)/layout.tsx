"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const isMobile = useIsMobile();
	const [selectedItem, setSelectedItem] = useState<string>("Projects");

	// Sync selectedItem with current route
	useEffect(() => {
		if (pathname?.startsWith("/chat")) {
			setSelectedItem("AI Chat");
		} else {
			// For home page, check URL params
			const item = searchParams?.get("item");
			setSelectedItem(item || "Projects");
		}
	}, [pathname, searchParams]);

	const handleItemSelect = (label: string) => {
		if (label === "AI Chat") {
			// Navigate to chat route
			router.push("/chat/new");
		} else {
			// For other items, navigate to home with item param
			const params = new URLSearchParams();
			params.set("item", label);
			router.push(`/?${params.toString()}`);
		}
	};

	return (
		<div className="flex min-h-svh w-full">
			{/* Left Sidebar - Rendered once for all dashboard routes */}
			<SidebarProvider defaultOpen={!isMobile}>
				<AppSidebar
					selectedItem={selectedItem}
					onItemSelect={handleItemSelect}
				/>
				<SidebarInset className="flex-1 flex flex-col overflow-hidden">
					{children}
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}


"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const isMobile = useIsMobile();
	const [selectedItem, setSelectedItem] = useState<string>("Projects");

	useEffect(() => {
		if (pathname?.startsWith("/chat")) {
			setSelectedItem("AI Chat");
		} else {
			const item = searchParams?.get("item");
			setSelectedItem(item || "Projects");
		}
	}, [pathname, searchParams]);

	const handleItemSelect = (label: string) => {
		if (label === "AI Chat") {
			router.push("/chat/new");
		} else {
			const params = new URLSearchParams();
			params.set("item", label);
			router.push(`/?${params.toString()}`);
		}
	};

	return (
		<div className="flex min-h-svh w-full overflow-hidden">
			<SidebarProvider defaultOpen={!isMobile}>
				<AppSidebar
					selectedItem={selectedItem}
					onItemSelect={handleItemSelect}
				/>
				{
					<SidebarInset className="flex-1 flex flex-col overflow-hidden">
						{children}
					</SidebarInset>
				}
			</SidebarProvider>
		</div>
	);
}

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Suspense fallback={<div className="flex min-h-svh w-full" />}>
			<DashboardLayoutContent>{children}</DashboardLayoutContent>
		</Suspense>
	);
}

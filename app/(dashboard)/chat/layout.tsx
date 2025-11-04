"use client";

import { useState, useEffect } from "react";
import { ChatHeader } from "@/components/chat-header";
import { ChatHistorySidebar } from "@/components/chat-history-sidebar";
import { usePathname, useSearchParams } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useChatHistory } from "@/hooks/use-chat-queries";

export default function ChatLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [selectedProjectId, setSelectedProjectId] = useState<
		string | undefined
	>();
	const searchParams = useSearchParams();
	const isMobile = useIsMobile();

	// Use React Query to fetch chat history
	const { data: projects = [], isLoading, refetch } = useChatHistory();

	useEffect(() => {
		const currentChatId = searchParams.get("chat_id") || "new";
		setSelectedProjectId(currentChatId);
	}, [searchParams]);

	const handleProjectSelect = (projectId: string) => {
		setSelectedProjectId(projectId);
	};

	return (
		<div className="flex flex-col h-full overflow-hidden">
			{!isMobile && <ChatHeader title="AI Chat" />}
			<div
				className={cn(
					"flex flex-1 min-h-0",
					isMobile ? "max-h-[calc(100vh-10px)]" : "max-h-[calc(100vh-70px)]"
				)}>
				{children}
				{/* Right Sidebar for Chat History - Inside main content area */}
				{!isMobile && (
					<ChatHistorySidebar
						selectedProjectId={
							selectedProjectId || searchParams.get("chat_id") || undefined
						}
						onProjectSelect={handleProjectSelect}
						projects={projects}
						isLoading={isLoading}
						onRefresh={() => refetch()}
					/>
				)}
			</div>
		</div>
	);
}

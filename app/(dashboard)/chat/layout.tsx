"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChatHeader } from "@/components/chat-header";
import { ChatHistorySidebar } from "@/components/chat-history-sidebar";
import toast from "react-hot-toast";
import { usePathname, useSearchParams } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface ProjectItem {
	id: string;
	title: string;
	description: string;
}

export default function ChatLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [selectedProjectId, setSelectedProjectId] = useState<
		string | undefined
	>();
	const [projects, setProjects] = useState<ProjectItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const isMobile = useIsMobile();
	const previousChatIdRef = useRef<string | null>(null);

	const fetchChats = useCallback(async () => {
		try {
			setIsLoading(true);
			const response = await fetch("/api/history");
			const data = await response.json();

			if (response.ok && data.chats) {
				setProjects(data.chats);
			} else if (data.error) {
				toast.error("Failed to load chat history");
				setProjects([]);
			}
		} catch (error) {
			console.error("Error fetching chats:", error);
			toast.error("Failed to load chat history. Please try again.");
			setProjects([]);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		const currentChatId = searchParams.get("chat_id") || "new";
		setSelectedProjectId(currentChatId);
		fetchChats();
	}, [fetchChats, searchParams]);

	useEffect(() => {
		if (!pathname || pathname !== "/chat") return;

		const currentChatId = searchParams.get("chat_id") || "new";
		const previousChatId = previousChatIdRef.current;

		if (
			previousChatId === "new" &&
			currentChatId &&
			currentChatId !== "new" &&
			currentChatId !== previousChatId
		) {
			fetchChats();
		}

		previousChatIdRef.current = currentChatId;
	}, [pathname, searchParams, fetchChats]);

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
						onRefresh={fetchChats}
					/>
				)}
			</div>
		</div>
	);
}

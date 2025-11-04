"use client";

import { MessageSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatHistoryItem {
	id: string;
	title: string;
	preview: string;
	timestamp: string;
}

// Mock chat history data - replace with real data later
const mockChatHistory: ChatHistoryItem[] = [
	{
		id: "1",
		title: "New Chat",
		preview: "How do I create a React component?",
		timestamp: "2 hours ago",
	},
	{
		id: "2",
		title: "Project Setup",
		preview: "Can you help me set up a Next.js project?",
		timestamp: "1 day ago",
	},
	{
		id: "3",
		title: "API Integration",
		preview: "How to integrate REST API in React?",
		timestamp: "2 days ago",
	},
	{
		id: "4",
		title: "Styling Questions",
		preview: "Best practices for CSS in React applications",
		timestamp: "3 days ago",
	},
	{
		id: "5",
		title: "Database Design",
		preview: "What's the best database for a chat app?",
		timestamp: "1 week ago",
	},
];

interface ChatHistorySidebarProps {
	selectedChatId?: string;
	onChatSelect?: (chatId: string) => void;
}

export function ChatHistorySidebar({
	selectedChatId,
	onChatSelect,
}: ChatHistorySidebarProps) {
	return (
		<div className="w-3/12 border-l border-t text-sidebar-foreground flex flex-col h-full overflow-hidden">
			{/* Header */}
			<div className="p-3 space-y-3 border-b">
				{/* Header with title */}
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold">Chat History</h2>
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 overflow-auto p-2">
				<div className="space-y-2">
					{/* Recent Chats Label */}
					<div className="px-2">
						<p className="text-xs text-muted-foreground font-medium">
							Recent Chats
						</p>
					</div>

					{/* Chat History List */}
					<div className="space-y-1">
						{mockChatHistory.map((chat) => (
							<Button
								key={chat.id}
								variant={selectedChatId === chat.id ? "secondary" : "ghost"}
								className="w-full justify-start h-auto p-3 text-left"
								onClick={() => onChatSelect?.(chat.id)}>
								<div className="flex flex-col items-start gap-1 w-full min-w-0">
									<div className="flex items-center justify-between w-full">
										<span className="font-medium text-sm truncate flex-1">
											{chat.title}
										</span>
										<span className="text-xs text-muted-foreground ml-2 shrink-0">
											{chat.timestamp}
										</span>
									</div>
									<p className="text-xs text-muted-foreground truncate w-full">
										{chat.preview}
									</p>
								</div>
							</Button>
						))}
					</div>

					{/* New Chat Button */}
					<div className="pt-2">
						<Button
							variant="outline"
							className="w-full gap-2"
							onClick={() => onChatSelect?.("new")}>
							<MessageSquare className="h-4 w-4" />
							New Chat
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

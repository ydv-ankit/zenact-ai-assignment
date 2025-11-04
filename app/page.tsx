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
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatHeader } from "@/components/chat-header";
import { ChatHistorySidebar } from "@/components/chat-history-sidebar";
import {
	FileText,
	Sparkles,
	User,
	Code,
	Plus,
	Paperclip,
	Mic,
	MessageSquare,
	Send,
} from "lucide-react";

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
	const [selectedChatId, setSelectedChatId] = useState<string | undefined>();
	const isMobile = useIsMobile();

	const handleItemSelect = (label: string) => {
		setSelectedItem(label);
	};

	const handleChatSelect = (chatId: string) => {
		setSelectedChatId(chatId);
	};

	return (
		<div className="flex min-h-svh w-full">
			{/* Left Sidebar */}
			<SidebarProvider defaultOpen={!isMobile}>
				<AppSidebar
					selectedItem={selectedItem}
					onItemSelect={handleItemSelect}
				/>
				<SidebarInset className="flex-1 flex flex-col overflow-hidden">
					{/* Header with selected component name */}
					<ChatHeader title={selectedItem} />

					{/* Main content area with chat and history sidebar */}
					<div className="flex flex-1">
						<div className="flex flex-1 overflow-hidden py-4 border-t border-l rounded-tl-3xl">
							{/* Chat Content Area */}
							<div className="flex flex-col flex-1 overflow-hidden">
								{/* Scrollable content area */}
								<div className="flex-1 overflow-auto px-4 py-4">
									<div className="flex flex-col items-center justify-center w-full">
										{/* Welcome Section */}
										<div className="mb-8 w-full flex items-center justify-center flex-col">
											<h2 className="text-3xl font-bold mb-2">
												Welcome to Script
											</h2>
											<p className="text-muted-foreground">
												Get started by Script a task and Chat can do the rest.
												Not sure where to start?
											</p>
										</div>

										{/* Action Cards Grid */}
										<div className="grid grid-cols-2 gap-4 mb-8 max-w-2xl w-full">
											{/* Write copy card */}
											<div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800 flex items-center justify-between hover:scale-105 duration-100 cursor-pointer">
												<div className="flex items-center gap-3">
													<div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
														<FileText className="h-5 w-5 text-yellow-700 dark:text-yellow-400" />
													</div>
													<span className="font-medium">Write copy</span>
												</div>
												<Plus className="h-4 w-4" />
											</div>

											{/* Image generation card */}
											<div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 flex items-center justify-between hover:scale-105 duration-100 cursor-pointer">
												<div className="flex items-center gap-3">
													<div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
														<Sparkles className="h-5 w-5 text-blue-700 dark:text-blue-400" />
													</div>
													<span className="font-medium">Image generation</span>
												</div>
												<Plus className="h-4 w-4" />
											</div>

											{/* Create avatar card */}
											<div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200 dark:border-green-800 flex items-center justify-between hover:scale-105 duration-100 cursor-pointer">
												<div className="flex items-center gap-3">
													<div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
														<User className="h-5 w-5 text-green-700 dark:text-green-400" />
													</div>
													<span className="font-medium">Create avatar</span>
												</div>
												<Plus className="h-4 w-4" />
											</div>

											{/* Write code card */}
											<div className="bg-pink-50 dark:bg-pink-950/20 rounded-lg p-4 border border-pink-200 dark:border-pink-800 flex items-center justify-between hover:scale-105 duration-100 cursor-pointer">
												<div className="flex items-center gap-3">
													<div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
														<Code className="h-5 w-5 text-pink-700 dark:text-pink-400" />
													</div>
													<span className="font-medium">Write code</span>
												</div>
												<Plus className="h-4 w-4" />
											</div>
										</div>
									</div>
								</div>

								{/* Sticky Input Section at bottom */}
								<div className="pt-4 bg-background">
									<div className="max-w-4xl w-11/12 mx-auto border rounded-2xl focus-within:border-blue-500 focus-within:ring-0 transition-colors">
										<div className="relative mb-3 border-b">
											<Input
												placeholder="Enter your prompt here..."
												className="pr-24 h-auto min-h-[50px] py-4 text-base border-none ring-0 outline-none outline-0 shadow-none focus-visible:border-none focus:border-none focus-visible:ring-0 focus:ring-0"
											/>
											<div className="absolute right-3 bottom-3 flex items-center gap-2">
												<span className="text-xs text-muted-foreground">
													20/3,000
												</span>
												<Button
													size="icon-sm"
													className="h-8 w-8 cursor-pointer"
													variant="ghost">
													<Send className="h-4 w-4" />
												</Button>
											</div>
										</div>

										{/* Action Buttons */}
										<div className="flex gap-2 mb-2">
											<Button
												variant="ghost"
												size="sm"
												className="gap-2 cursor-pointer">
												<Paperclip className="h-4 w-4" />
												Attach
											</Button>
											<Button
												variant="ghost"
												size="sm"
												className="gap-2 cursor-pointer">
												<Mic className="h-4 w-4" />
												Voice Message
											</Button>
											<Button
												variant="ghost"
												size="sm"
												className="gap-2 cursor-pointer">
												<MessageSquare className="h-4 w-4" />
												Browse Prompts
											</Button>
										</div>
									</div>
									{/* Disclaimer */}
									<p className="text-xs text-muted-foreground text-center mt-2">
										Script may generate inaccurate information about people,
										places, or facts. Model: Script AI v1.3
									</p>
								</div>
							</div>
						</div>
						{/* Right Sidebar for Chat History - Inside main content area */}
						<ChatHistorySidebar
							selectedChatId={selectedChatId}
							onChatSelect={handleChatSelect}
						/>
					</div>
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}

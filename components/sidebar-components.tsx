"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

interface ProjectItem {
	id: string;
	title: string;
	description: string;
}

export function SidebarProjectsComponent({
	title = "Projects",
}: {
	title?: string;
}) {
	const [isMounted, setIsMounted] = useState(false);
	const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
	const [projects, setProjects] = useState<ProjectItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isDeleting, setIsDeleting] = useState(false);
	const router = useRouter();
	const pathname = usePathname();

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
		setIsMounted(true);
		fetchChats();
	}, [fetchChats]);

	useEffect(() => {
		if (isMounted && pathname?.startsWith("/chat/")) {
			const timeoutId = setTimeout(() => {
				fetchChats();
			}, 500);
			return () => clearTimeout(timeoutId);
		}
	}, [pathname, isMounted, fetchChats]);

	const toggleSelection = (projectId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		setSelectedItems((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(projectId)) {
				newSet.delete(projectId);
			} else {
				newSet.add(projectId);
			}
			return newSet;
		});
	};

	const handleDeleteSelected = async () => {
		if (selectedItems.size === 0) return;

		try {
			setIsDeleting(true);
			const chatIds = Array.from(selectedItems);
			const currentChatId = pathname?.split("/chat/")[1];

			const response = await fetch("/api/history", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ chatIds }),
			});

			const data = await response.json();

			if (response.ok && data.success) {
				const deletedCount = data.deletedCount || selectedItems.size;
				if (deletedCount > 0) {
					toast.success(`Deleted ${deletedCount} chat(s)`);
				} else {
					toast.error(
						"No chats were deleted. They may have already been deleted."
					);
				}
				setSelectedItems(new Set());
				await fetchChats();
				if (currentChatId && chatIds.includes(currentChatId)) {
					router.push("/chat/new");
				}
			} else {
				const errorMsg = data.error || "Failed to delete chats";
				toast.error(errorMsg);
				console.error("Delete error:", data);
			}
		} catch (error) {
			console.error("Error deleting chats:", error);
			toast.error("Failed to delete chats. Please try again.");
		} finally {
			setIsDeleting(false);
		}
	};

	const handleNewProject = () => {
		router.push("/chat/new");
	};

	const handleProjectClick = (projectId: string) => {
		router.push(`/chat/${projectId}`);
	};

	return (
		<div className="flex flex-col h-full overflow-hidden">
			{/* Header */}
			<div className="p-6 pb-4">
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold">
						{title}{" "}
						<span className="text-muted-foreground font-normal text-lg">
							({isLoading ? "..." : projects.length})
						</span>
					</h1>
					{isMounted ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="h-8 w-8">
									<MoreVertical className="h-4 w-4" />
									<span className="sr-only">More options</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={handleNewProject}>
									New Project
								</DropdownMenuItem>
								<DropdownMenuItem onClick={fetchChats}>
									Refresh
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={handleDeleteSelected}
									disabled={selectedItems.size === 0 || isDeleting}>
									{isDeleting
										? "Deleting..."
										: `Delete selected (${selectedItems.size})`}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Button variant="ghost" size="icon" className="h-8 w-8">
							<MoreVertical className="h-4 w-4" />
							<span className="sr-only">More options</span>
						</Button>
					)}
				</div>
			</div>

			<Separator />

			{/* Content */}
			<div className="flex-1 overflow-auto p-6 pt-4">
				{isLoading ? (
					<div className="space-y-2">
						{[1, 2, 3, 4].map((i) => (
							<div key={i} className="rounded-lg border bg-muted/50 p-3">
								<Skeleton className="h-4 w-3/4 mb-2" />
								<Skeleton className="h-3 w-full" />
							</div>
						))}
					</div>
				) : projects.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-full text-center p-4">
						<p className="text-sm text-muted-foreground mb-4">No chats yet</p>
						<Button variant="outline" size="sm" onClick={handleNewProject}>
							Start New Chat
						</Button>
					</div>
				) : (
					<div className="space-y-2">
						{projects.map((project) => {
							const isSelected = selectedItems.has(project.id);
							const currentChatId = pathname?.split("/chat/")[1];
							const isActive = currentChatId === project.id;
							return (
								<div
									key={project.id}
									onClick={() => handleProjectClick(project.id)}
									className={`relative rounded-lg border bg-muted/50 p-3 cursor-pointer transition-colors hover:bg-muted ${
										isActive ? "border-primary bg-muted" : "border-border"
									}`}>
									<div className="flex items-start justify-between gap-3">
										<div className="flex-1 min-w-0">
											<h3 className="font-semibold text-sm text-foreground truncate mb-1">
												{project.title}
											</h3>
											<p className="text-xs text-muted-foreground truncate">
												{project.description}
											</p>
										</div>
										<button
											type="button"
											onClick={(e) => toggleSelection(project.id, e)}
											className={`h-4 w-4 rounded-full border-2 shrink-0 mt-0.5 transition-colors ${
												isSelected
													? "border-blue-800 bg-blue-800"
													: "border-muted-foreground/30 bg-transparent"
											}`}
											aria-label={`Select ${project.title}`}
										/>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}

export function SidebarTemplatesComponent() {
	const [prompts, setPrompts] = useState<string[]>([
		"Write a professional email to a client explaining a project delay, outlining reasons, new timeline, and next steps clearly",
		"Create a detailed meeting agenda for a weekly team sync including objectives, discussion topics, time allocations, and action items",
		"Draft a comprehensive project proposal describing goals, scope, deliverables, timeline, budget, and expected impact for stakeholder approval",
		"Write a constructive code review comment suggesting improvements to variable naming, error handling, and overall readability without discouraging the developer",
		"Summarize the key points from a 10-page research report about renewable energy trends, highlighting major findings, data, and recommendations",
	]);
	const [newPrompt, setNewPrompt] = useState("");
	const router = useRouter();

	const handleAddPrompt = () => {
		if (newPrompt.trim()) {
			setPrompts([...prompts, newPrompt.trim()]);
			setNewPrompt("");
			toast.success("Prompt added successfully");
		}
	};

	const handlePromptClick = (prompt: string) => {
		router.push(`/chat/new?prompt=${encodeURIComponent(prompt)}`);
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleAddPrompt();
		}
	};

	return (
		<div className="flex flex-col h-full overflow-hidden">
			{/* Header */}
			<div className="p-6 pb-4">
				<h1 className="text-3xl font-bold">
					Templates{" "}
					<span className="text-muted-foreground font-normal text-lg">
						({prompts.length})
					</span>
				</h1>
			</div>

			<Separator />

			{/* Content */}
			<div className="flex-1 overflow-auto p-6 pt-4">
				<div className="space-y-2 mb-4">
					{prompts.map((prompt, index) => (
						<div
							key={index}
							onClick={() => handlePromptClick(prompt)}
							className="rounded-lg border bg-muted/50 p-3 hover:bg-muted transition-colors">
							<p className="text-sm text-foreground">{prompt}</p>
						</div>
					))}
				</div>

				{/* Add Prompt Input */}
				<div className="flex gap-2 mt-4">
					<Input
						type="text"
						placeholder="Enter a new prompt..."
						value={newPrompt}
						onChange={(e) => setNewPrompt(e.target.value)}
						onKeyDown={handleKeyPress}
						className="flex-1"
					/>
					<Button onClick={handleAddPrompt} disabled={!newPrompt.trim()}>
						Add
					</Button>
				</div>
			</div>
		</div>
	);
}

export function SidebarDocumentsComponent() {
	return (
		<div className="flex flex-col items-center justify-center h-full p-8">
			<h1 className="text-3xl font-bold mb-4">Documents</h1>
			<p className="text-muted-foreground text-center max-w-md">
				Documents Component - This is where your documents will be displayed.
			</p>
		</div>
	);
}

export function SidebarCommunityComponent() {
	return (
		<div className="flex flex-col items-center justify-center h-full p-8">
			<h1 className="text-3xl font-bold mb-4">Community</h1>
			<p className="text-muted-foreground text-center max-w-md">
				Community Component - This is where your community content will be
				displayed.
			</p>
		</div>
	);
}

export function SidebarHistoryComponent() {
	return <SidebarProjectsComponent title="History" />;
}

export function SidebarSettingsComponent() {
	return (
		<div className="flex flex-col items-center justify-center h-full p-8">
			<h1 className="text-3xl font-bold mb-4">Settings</h1>
			<p className="text-muted-foreground text-center max-w-md">
				Settings Component - This is where your settings will be displayed.
			</p>
		</div>
	);
}

export function SidebarHelpComponent() {
	return (
		<div className="flex flex-col items-center justify-center h-full p-8">
			<h1 className="text-3xl font-bold mb-4">Help</h1>
			<p className="text-muted-foreground text-center max-w-md">
				Help Component - This is where help content will be displayed.
			</p>
		</div>
	);
}

export function SidebarDefaultComponent() {
	return (
		<div className="flex flex-col items-center justify-center h-full p-8">
			<h1 className="text-3xl font-bold mb-4">Welcome</h1>
			<p className="text-muted-foreground text-center max-w-md">
				Select an item from the sidebar
			</p>
		</div>
	);
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import toast from "react-hot-toast";

interface ProjectItem {
	id: string;
	title: string;
	description: string;
}

interface ChatHistorySidebarProps {
	selectedProjectId?: string;
	onProjectSelect?: (projectId: string) => void;
	projects: ProjectItem[];
	isLoading: boolean;
	onRefresh: () => void;
}

export function ChatHistorySidebar({
	selectedProjectId,
	onProjectSelect,
	projects,
	isLoading,
	onRefresh,
}: ChatHistorySidebarProps) {
	const [isMounted, setIsMounted] = useState(false);
	const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
	const [isDeleting, setIsDeleting] = useState(false);
	const router = useRouter();

	useEffect(() => {
		setIsMounted(true);
	}, []);

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
			const wasSelectedChatDeleted =
				selectedProjectId && chatIds.includes(selectedProjectId);

			const response = await fetch("/api/chats", {
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
				onRefresh();
				if (wasSelectedChatDeleted) {
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
		onProjectSelect?.(projectId);
		router.push(`/chat/${projectId}`);
	};

	return (
		<div className="w-3/12 border-l border-t text-sidebar-foreground flex flex-col h-full overflow-hidden bg-background">
			{/* Header */}
			<div className="p-3">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold">
						Projects{" "}
						<span className="text-muted-foreground font-normal">
							({isLoading ? "..." : projects.length})
						</span>
					</h2>
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
								<DropdownMenuItem onClick={onRefresh}>Refresh</DropdownMenuItem>
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
			<div className="flex-1 overflow-auto p-3">
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
							return (
								<div
									key={project.id}
									onClick={() => handleProjectClick(project.id)}
									className={`relative rounded-lg border bg-muted/50 p-3 cursor-pointer transition-colors hover:bg-muted ${
										selectedProjectId === project.id
											? "border-primary bg-muted"
											: "border-border"
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

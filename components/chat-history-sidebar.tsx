"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

interface ProjectItem {
	id: string;
	title: string;
	description: string;
}

// Mock project data - replace with real data later
const mockProjects: ProjectItem[] = [
	{
		id: "1",
		title: "New Project",
		description: "...",
	},
	{
		id: "2",
		title: "Learning From 100 Years o...",
		description: "For athletes, high altitude prod...",
	},
	{
		id: "3",
		title: "Research officiants",
		description: "Maxwell's equations—the foun...",
	},
	{
		id: "4",
		title: "What does a senior lead de...",
		description: "Physiological respiration involv...",
	},
	{
		id: "5",
		title: "Write a sweet note to your...",
		description: "In the eighteenth century the G...",
	},
	{
		id: "6",
		title: "Meet with cake bakers",
		description: "Physical space is often conceiv...",
	},
	{
		id: "7",
		title: "Meet with cake bakers",
		description: "Physical space is often conceiv...",
	},
];

interface ChatHistorySidebarProps {
	selectedProjectId?: string;
	onProjectSelect?: (projectId: string) => void;
}

export function ChatHistorySidebar({
	selectedProjectId,
	onProjectSelect,
}: ChatHistorySidebarProps) {
	const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

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

	const handleDeleteSelected = () => {
		// TODO: Implement delete functionality
		console.log("Deleting items:", Array.from(selectedItems));
		setSelectedItems(new Set());
	};

	return (
		<div className="w-3/12 border-l border-t text-sidebar-foreground flex flex-col h-full overflow-hidden bg-background">
			{/* Header */}
			<div className="p-3">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold">
						Projects{" "}
						<span className="text-muted-foreground font-normal">
							({mockProjects.length})
						</span>
					</h2>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="h-8 w-8">
								<MoreVertical className="h-4 w-4" />
								<span className="sr-only">More options</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>New Project</DropdownMenuItem>
							<DropdownMenuItem
								onClick={handleDeleteSelected}
								disabled={selectedItems.size === 0}>
								Delete selected items
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<Separator />

			{/* Content */}
			<div className="flex-1 overflow-auto p-3">
				<div className="space-y-2">
					{mockProjects.map((project) => {
						const isSelected = selectedItems.has(project.id);
						return (
							<div
								key={project.id}
								onClick={() => onProjectSelect?.(project.id)}
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
			</div>
		</div>
	);
}

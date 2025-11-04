"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";

export function ModeToggle({ className }: { className?: string }) {
	const { theme, setTheme } = useTheme();
	const { state } = useSidebar();

	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		setTheme("light");
	}, []);

	if (!mounted) {
		return (
			<div className="relative flex h-10 w-full items-center rounded-lg bg-gray-200 dark:bg-gray-800 p-1">
				<div className="h-8 w-1/2" />
			</div>
		);
	}

	const isLight = theme === "light";

	if (state === "collapsed") {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="icon" className="cursor-pointer">
						<Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
						<Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
						<span className="sr-only">Toggle theme</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem
						onClick={() => setTheme("light")}
						className="cursor-pointer">
						Light
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => setTheme("dark")}
						className="cursor-pointer">
						Dark
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => setTheme("system")}
						className="cursor-pointer">
						System
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	}

	return (
		<div
			className={cn(
				"relative flex h-10 w-full items-center rounded-lg bg-gray-200 dark:bg-gray-800 p-1 transition-colors duration-300 ease-in-out",
				className
			)}>
			{/* Sliding indicator */}
			<div
				className={`absolute h-8 w-[calc(50%-0.5rem)] rounded-md bg-white dark:bg-gray-700 transition-all duration-300 ease-in-out ${
					isLight ? "left-1" : "left-[calc(50%+0.25rem)]"
				}`}
			/>

			{/* Light option */}
			<button
				type="button"
				onClick={() => setTheme("light")}
				className={cn(
					"relative z-10 flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md text-sm font-medium transition-all duration-300 ease-in-out cursor-pointer",
					isLight
						? "text-gray-900 dark:text-gray-100"
						: "text-gray-600 dark:text-gray-400",
					className
				)}>
				<Sun className="h-4 w-4 transition-all duration-300 ease-in-out" />
				<span className="text-gray-500 font-semibold transition-colors duration-300 ease-in-out">
					Light
				</span>
			</button>

			{/* Dark option */}
			<button
				type="button"
				onClick={() => setTheme("dark")}
				className={cn(
					"relative z-10 flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md text-sm font-medium transition-all duration-300 ease-in-out cursor-pointer",
					!isLight
						? "text-gray-900 dark:text-gray-100"
						: "text-gray-600 dark:text-gray-400",
					className
				)}>
				<Moon className="h-4 w-4 transition-all duration-300 ease-in-out" />
				<span className="text-gray-500 font-semibold transition-colors duration-300 ease-in-out">
					Dark
				</span>
			</button>
		</div>
	);
}

"use client";
import { useState, useEffect } from "react";
import { Zap, HelpCircle, Gift, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useUser } from "@/hooks/use-user";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createSupabaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatHeaderProps {
	title: string;
}

export function ChatHeader({ title }: ChatHeaderProps) {
	const [isMounted, setIsMounted] = useState(false);
	const { user, loading } = useUser();
	const supabase = createSupabaseClient();
	const router = useRouter();

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const handleLogout = async () => {
		await supabase.auth.signOut();
		router.push("/auth");
	};

	return (
		<header className="px-6 py-4 flex items-center justify-between">
			<h1 className="text-xl font-bold">{title}</h1>
			<div className="flex items-center gap-2">
				{/* Upgrade Button with lightning icon */}
				<Button
					variant="default"
					size="sm"
					className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black rounded-lg gap-1.5 cursor-pointer">
					<Zap className="h-4 w-4 text-yellow-400 fill-yellow-400" />
					Upgrade
				</Button>

				{/* Help icon */}
				<Button
					variant="ghost"
					size="icon"
					className="rounded-full cursor-pointer">
					<HelpCircle className="h-5 w-5" />
				</Button>

				{/* Gift icon */}
				<Button
					variant="ghost"
					size="icon"
					className="rounded-full cursor-pointer">
					<Gift className="h-5 w-5" />
				</Button>

				{/* User avatar with dropdown */}
				{loading ? (
					<Skeleton className="w-8 h-8 rounded-full" />
				) : isMounted ? (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button className="ring-1 rounded-full cursor-pointer hover:opacity-80 transition-opacity">
								{user?.user_metadata?.avatar_url ? (
									<Image
										src={user?.user_metadata?.avatar_url}
										alt="User"
										width={25}
										height={25}
										className="object-contain dark:invert rounded-full"
									/>
								) : (
									<User className="h-4 w-4 text-muted-foreground" />
								)}
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={handleLogout} variant="destructive">
								<LogOut className="h-4 w-4" />
								Logout
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				) : (
					<button className="ring-1 rounded-full cursor-pointer hover:opacity-80 transition-opacity">
						{user?.user_metadata?.avatar_url ? (
							<Image
								src={user?.user_metadata?.avatar_url}
								alt="User"
								width={25}
								height={25}
								className="object-contain dark:invert rounded-full"
							/>
						) : (
							<User className="h-4 w-4 text-muted-foreground" />
						)}
					</button>
				)}
			</div>
		</header>
	);
}

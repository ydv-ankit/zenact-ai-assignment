import { Zap, HelpCircle, Gift, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
	title: string;
}

export function ChatHeader({ title }: ChatHeaderProps) {
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

				{/* Bot icon with notification dot */}
				<Button
					variant="ghost"
					size="icon"
					className="rounded-full relative cursor-pointer">
					<Bot className="h-5 w-5" />
					<span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-background" />
				</Button>
			</div>
		</header>
	);
}

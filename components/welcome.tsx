import { Code, FileText, Plus, Sparkles, User } from "lucide-react";

export function Welcome() {
	return (
		<div className="flex flex-col items-center justify-center w-full">
			{/* Welcome Section */}
			<div className="mb-8 w-full flex items-center justify-center flex-col">
				<h2 className="text-3xl font-bold mb-2">Welcome to Script</h2>
				<p className="text-muted-foreground">
					Get started by Script a task and Chat can do the rest. Not sure where
					to start?
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
	);
}

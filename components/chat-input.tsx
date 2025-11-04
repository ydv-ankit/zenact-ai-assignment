"use client";

import { forwardRef, useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Paperclip,
	Mic,
	MessageSquare,
	Send,
	X,
	File,
	Square,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition";
import { useRouter } from "next/navigation";

interface ChatInputProps {
	input: string;
	setInput: (value: string) => void;
	isLoading: boolean;
	handleSendMessage: () => void;
	handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	characterCount: number;
	maxCharacters: number;
}

export const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
	(
		{
			input,
			setInput,
			isLoading,
			handleSendMessage,
			handleKeyPress,
			characterCount,
			maxCharacters,
		},
		ref
	) => {
		const isMobile = useIsMobile();
		const fileInputRef = useRef<HTMLInputElement>(null);
		const [attachments, setAttachments] = useState<File[]>([]);
		const [isDialogOpen, setIsDialogOpen] = useState(false);
		const [transcribedText, setTranscribedText] = useState("");
		const [errorMessage, setErrorMessage] = useState<string | null>(null);
		const router = useRouter();

		const {
			transcript,
			listening,
			resetTranscript,
			browserSupportsSpeechRecognition,
		} = useSpeechRecognition();

		// Update transcribed text when transcript changes
		useEffect(() => {
			setTranscribedText(transcript || "");
		}, [transcript]);

		const handleSendMessageClick = () => {
			setAttachments([]);
			handleSendMessage();
		};

		const handleKeyPressDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter" && !e.shiftKey) {
				setAttachments([]);
			}
			handleKeyPress(e);
		};

		const handleAttachClick = () => {
			fileInputRef.current?.click();
		};

		const handleVoiceMessageClick = () => {
			if (!browserSupportsSpeechRecognition) {
				setErrorMessage(
					"Speech recognition is not available in your browser. Please use Chrome, Edge, or Safari."
				);
			}
			setIsDialogOpen(true);
			setTranscribedText("");
			setErrorMessage(null);
			resetTranscript();
		};

		const handleDialogClose = (open: boolean) => {
			setIsDialogOpen(open);
			if (!open && listening) {
				SpeechRecognition.stopListening();
			}
			if (!open) {
				setErrorMessage(null);
				resetTranscript();
				setTranscribedText("");
			}
		};

		const handleStartListening = () => {
			if (!browserSupportsSpeechRecognition) {
				setErrorMessage(
					"Speech recognition is not available in your browser. Please use Chrome, Edge, or Safari."
				);
				return;
			}

			try {
				setErrorMessage(null);
				SpeechRecognition.startListening({
					continuous: true,
					language: "en-US",
				});
			} catch (error) {
				console.error("Error starting recognition:", error);
				setErrorMessage(
					"Failed to start speech recognition. Please try again."
				);
			}
		};

		const handleStopListening = () => {
			try {
				SpeechRecognition.stopListening();
			} catch (error) {
				console.error("Error stopping recognition:", error);
			}
		};

		const handleUseTranscribedText = () => {
			if (transcribedText.trim()) {
				const newValue = input + (input ? " " : "") + transcribedText.trim();
				setInput(newValue.slice(0, maxCharacters));
			}
			setIsDialogOpen(false);
			setTranscribedText("");
		};

		const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const files = e.target.files;
			if (files) {
				const newFiles = Array.from(files);
				setAttachments((prev) => [...prev, ...newFiles]);
			}
			// Reset input value to allow selecting the same file again
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		};

		const handleRemoveAttachment = (index: number) => {
			setAttachments((prev) => prev.filter((_, i) => i !== index));
		};

		const formatFileSize = (bytes: number) => {
			if (bytes === 0) return "0 Bytes";
			const k = 1024;
			const sizes = ["Bytes", "KB", "MB", "GB"];
			const i = Math.floor(Math.log(bytes) / Math.log(k));
			return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
		};

		return (
			<>
				<div className="shrink-0 pt-4 bg-background">
					<div className="max-w-4xl w-11/12 mx-auto border rounded-2xl focus-within:border-blue-500 focus-within:ring-0 transition-colors">
						{/* Attachments List */}
						{attachments.length > 0 && (
							<div className="px-3 pt-3 pb-2 border-b space-y-2">
								{attachments.map((file, index) => (
									<div
										key={index}
										className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg group">
										<File className="h-4 w-4 text-muted-foreground shrink-0" />
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium truncate">
												{file.name}
											</p>
											<p className="text-xs text-muted-foreground">
												{formatFileSize(file.size)}
											</p>
										</div>
										<Button
											variant="ghost"
											size="icon"
											className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
											onClick={() => handleRemoveAttachment(index)}>
											<X className="h-3 w-3" />
										</Button>
									</div>
								))}
							</div>
						)}

						<input
							ref={fileInputRef}
							type="file"
							multiple
							className="hidden"
							onChange={handleFileChange}
						/>

						<div className="relative mb-3 border-b">
							<Input
								ref={ref}
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={handleKeyPressDown}
								placeholder="Ask me anything..."
								disabled={isLoading}
								maxLength={maxCharacters}
								className="w-[82%] h-auto min-h-[50px] py-4 text-base border-none ring-0 outline-none outline-0 shadow-none focus-visible:border-none focus:border-none focus-visible:ring-0 focus:ring-0 bg-none"
							/>
							<div className="absolute right-3 bottom-3 flex items-center gap-2">
								<span
									className={`text-xs ${
										characterCount > maxCharacters * 0.9
											? "text-destructive"
											: "text-muted-foreground"
									}`}>
									{characterCount}/{maxCharacters}
								</span>
								<Button
									onClick={handleSendMessageClick}
									disabled={!input.trim() || isLoading}
									size="icon-sm"
									className="h-8 w-8 cursor-pointer"
									variant="ghost">
									<Send className="h-4 w-4" />
								</Button>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex gap-2 mb-2 mx-2">
							<Button
								variant="ghost"
								size="sm"
								className="gap-2 cursor-pointer"
								onClick={handleAttachClick}
								type="button">
								<Paperclip className="h-4 w-4" />
								{!isMobile && "Attach"}
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="gap-2 cursor-pointer"
								onClick={handleVoiceMessageClick}
								type="button">
								<Mic className="h-4 w-4" />
								{!isMobile && "Voice Message"}
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="gap-2 cursor-pointer"
								onClick={() => {
									router.push("/?item=Templates");
								}}>
								<MessageSquare className="h-4 w-4" />
								{!isMobile && "Browse Prompts"}
							</Button>
						</div>
					</div>
					{/* Disclaimer */}
					<p className="hidden md:block text-xs text-muted-foreground text-center mt-2">
						Script may generate inaccurate information about people, places, or
						facts. Model: Script AI v1.3
					</p>
				</div>

				{/* Voice Message Dialog */}
				<Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle>Voice Message</DialogTitle>
							<DialogDescription>
								Click the button below to start recording your voice message.
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4 py-4">
							{/* Error Message Display */}
							{errorMessage && (
								<div className="p-3 border border-destructive/50 rounded-lg bg-destructive/10">
									<p className="text-sm text-destructive">{errorMessage}</p>
								</div>
							)}

							{/* Transcribed Text Display */}
							<div className="min-h-[100px] p-4 border rounded-lg bg-muted/50">
								{transcribedText ? (
									<p className="text-sm whitespace-pre-wrap">
										{transcribedText}
									</p>
								) : (
									<p className="text-sm text-muted-foreground">
										{listening
											? "Listening... Speak now."
											: "Click 'Start Listening' to begin recording."}
									</p>
								)}
							</div>

							{/* Control Buttons */}
							<div className="flex gap-2 justify-center">
								{!listening ? (
									<Button
										onClick={handleStartListening}
										className="gap-2"
										size="lg"
										disabled={!browserSupportsSpeechRecognition}>
										<Mic className="h-4 w-4" />
										Start Listening
									</Button>
								) : (
									<Button
										onClick={handleStopListening}
										variant="destructive"
										className="gap-2"
										size="lg">
										<Square className="h-4 w-4" />
										Stop Listening
									</Button>
								)}
							</div>

							{/* Action Buttons */}
							{transcribedText && (
								<div className="flex gap-2 justify-end pt-2">
									<Button
										variant="outline"
										onClick={() => {
											setTranscribedText("");
											setIsDialogOpen(false);
										}}>
										Cancel
									</Button>
									<Button onClick={handleUseTranscribedText}>Use Text</Button>
								</div>
							)}
						</div>
					</DialogContent>
				</Dialog>
			</>
		);
	}
);

ChatInput.displayName = "ChatInput";

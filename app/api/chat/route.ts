import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { generateChatResponse } from "@/lib/llm";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const chat_id = searchParams.get("chat_id");

	if (!chat_id) {
		return NextResponse.json({ error: "chat_id is required" }, { status: 400 });
	}

	const supabase = await createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { data: chat, error } = await supabase
		.from("chats")
		.select("messages, chat_id")
		.eq("chat_id", chat_id)
		.eq("user_id", user.id)
		.single();

	if (error) {
		console.log(error);

		if (error.code === "PGRST116") {
			// Chat not found
			return NextResponse.json({ chat_id, messages: [] });
		}
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({
		chat_id: chat.chat_id,
		messages: chat.messages || [],
	});
}

export async function POST(request: NextRequest) {
	const { chat_id, prompt } = await request.json();
	const supabase = await createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	// Check if chat already exists
	const { data: existingChat, error: fetchError } = await supabase
		.from("chats")
		.select("messages, chat_id")
		.eq("chat_id", chat_id)
		.eq("user_id", user.id)
		.single();

	if (fetchError && fetchError.code !== "PGRST116") {
		return NextResponse.json({ error: fetchError.message }, { status: 500 });
	}

	const previousMessages = existingChat?.messages || [];

	try {
		// Generate AI response using gemini
		const aiResponse = await generateChatResponse(
			prompt,
			previousMessages.length > 0 ? previousMessages : undefined
		);

		const newMessages = [
			{
				role: "user" as const,
				content: prompt,
			},
			{
				role: "assistant" as const,
				content: aiResponse,
			},
		];

		if (existingChat) {
			const updatedMessages = [...existingChat.messages, ...newMessages];
			const { data: updatedChat, error: updateError } = await supabase
				.from("chats")
				.update({ messages: updatedMessages })
				.eq("chat_id", chat_id)
				.eq("user_id", user.id)
				.select()
				.single();

			if (updateError) {
				return NextResponse.json(
					{ error: updateError.message },
					{ status: 500 }
				);
			}

			return NextResponse.json({ chat_id, prompt, chat: updatedChat });
		} else {
			const { data: newChat, error: insertError } = await supabase
				.from("chats")
				.insert({
					user_id: user.id,
					chat_id: chat_id,
					messages: newMessages,
				})
				.select()
				.single();

			if (insertError) {
				return NextResponse.json(
					{ error: insertError.message },
					{ status: 500 }
				);
			}

			return NextResponse.json({ chat_id, prompt, chat: newChat });
		}
	} catch (error) {
		console.error("Error generating chat response:", error);
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Failed to generate response",
			},
			{ status: 500 }
		);
	}
}

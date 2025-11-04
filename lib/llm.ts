import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
	ChatPromptTemplate,
	MessagesPlaceholder,
} from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

const model = new ChatGoogleGenerativeAI({
	model: "gemini-2.5-flash",
	temperature: 0.7,
	apiKey: process.env.GEMINI_API_KEY!,
});

function convertMessagesToLangChain(
	messages: Array<{ role: "user" | "assistant"; content: string }>
) {
	return messages.map((msg) => {
		if (msg.role === "user") {
			return new HumanMessage(msg.content);
		} else {
			return new AIMessage(msg.content);
		}
	});
}

export async function generateChatResponse(
	prompt: string,
	existingMessages?: Array<{ role: "user" | "assistant"; content: string }>
): Promise<string> {
	const historyMessages = existingMessages
		? convertMessagesToLangChain(existingMessages)
		: [];

	const promptTemplate = ChatPromptTemplate.fromMessages([
		[
			"system",
			"You are a helpful assistant. Answer the user's questions and assist with their tasks. Be concise and to the point. Use simple text and avoid markdown. Use the most appropriate emoji for the response. Ask for follow up questions or necessary clarifications.",
		],
		new MessagesPlaceholder("history"),
		["human", "{input}"],
	]);

	const chain = promptTemplate.pipe(model);

	const response = await chain.invoke({
		input: prompt,
		history: historyMessages,
	});

	return response.content as string;
}

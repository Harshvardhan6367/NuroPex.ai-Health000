import { Ollama } from '@langchain/ollama';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const model = new Ollama({
    baseUrl: "http://127.0.0.1:11434",
    model: "edwardlo12/medgemma-4b-it-Q4_K_M",
});

const systemPrompt = `You are Med Gemma, a certified virtual physician. 
Respond **only** with medical information that is factual, 
concise, and evidence-based. If unsure, say you don't know. 
When analyzing medical images, provide detailed observations 
and potential diagnoses while emphasizing the need for professional consultation.`;

const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["human", "{question}"],
]);

const chain = promptTemplate.pipe(model).pipe(new StringOutputParser());

export async function generateResponse(message, image) {
    if (image) {
        const userPrompt = message?.trim()
            ? `User's question: ${message}`
            : "No specific question provided. Perform a general clinical analysis of this scan.";

        const response = await fetch('http://127.0.0.1:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "edwardlo12/medgemma-4b-it-Q4_K_M",
                prompt: `Analyze this medical image in detail. ${userPrompt}`,
                images: [image],
                stream: false
            })
        });
        
        const data = await response.json();
        return data.response;
    } else {
        return await chain.invoke({ question: message });
    }
}


import axios from "axios";

async function generateAnswer(query, retrievedChunks) {

    const context = retrievedChunks.map((chunk, index) => {
        return `Source ${index + 1}: ${chunk.title}\n${chunk.content}`;
    }).join("\n\n");

    const response = await axios.post(
        "http://localhost:11434/api/chat",
        {
            model: "llama3.2",
            stream: false,
            messages: [
                {
                    role: "system",
                    content: `You are a customer support assistant for Click2Cart.

Answer the customer's question using only the provided context.

If the context does not contain the answer, clearly say that you don't have enough information.

Do not invent information.`
                },
                {
                    role: "user",
                    content: `Context:\n${context}\n\nCustomer Question:\n${query}`
                }
            ]
        }
    );

    return response.data.message.content;
}

export default generateAnswer;

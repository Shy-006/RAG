
import "dotenv/config";
import axios from "axios";
import fs from "fs/promises";

async function generateEmbeddings(chunks) {

    if (!chunks || chunks.length === 0) {
        throw new Error("No chunks available");
    }

    const texts = chunks.map(chunk => chunk.content);

    const response = await axios.post(
        `${process.env.OLLAMA_BASE_URL}/api/embed`,
        {
            model: "nomic-embed-text",
            input: texts
        }
    );

    const embeddedChunks = chunks.map((chunk, index) => ({
        ...chunk,
        embedding: response.data.embeddings[index]
    }));

    await fs.writeFile(
        "./data/embeddings.json",
        JSON.stringify(embeddedChunks, null, 2)
    );

    console.log("Embeddings generated and saved successfully!");

    return embeddedChunks;
}

export default generateEmbeddings;

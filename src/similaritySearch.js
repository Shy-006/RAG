
import axios from "axios";
import fs from "fs/promises";

function cosineSimilarity(vectorA, vectorB) {

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vectorA.length; i++) {

        dotProduct += vectorA[i] * vectorB[i];

        magnitudeA += vectorA[i] * vectorA[i];

        magnitudeB += vectorB[i] * vectorB[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) {
        return 0;
    }

    return dotProduct / (magnitudeA * magnitudeB);
}

async function similaritySearch(query, topK = 3) {

    const data = await fs.readFile(
        "./data/embeddings.json",
        "utf-8"
    );

    const storedChunks = JSON.parse(data);

    const response = await axios.post(
        "http://localhost:11434/api/embed",
        {
            model: "nomic-embed-text",
            input: query
        }
    );

    const queryEmbedding = response.data.embeddings[0];

    const results = storedChunks.map(chunk => {

        const score = cosineSimilarity(
            queryEmbedding,
            chunk.embedding
        );

        return {
            ...chunk,
            score
        };
    });

    results.sort((a, b) => b.score - a.score);

    return results.slice(0, topK);
}

export default similaritySearch;

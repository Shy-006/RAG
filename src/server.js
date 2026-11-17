
import "dotenv/config";
import express from "express";

import similaritySearch from "./similaritysearch.js";
import generateAnswer from "./generateAnswer.js";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "RAG API is running"
    });
});

app.post("/api/chat", async (req, res) => {
    try {
        const { query } = req.body;

        if (!query || typeof query !== "string" || !query.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid question."
            });
        }

        const retrievedChunks = await similaritySearch(query);

        const answer = await generateAnswer(query, retrievedChunks);

        return res.status(200).json({
            success: true,
            query,
            answer
        });

    } catch (error) {
        console.error("RAG API Error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while processing your question."
        });
    }
});

const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`RAG API running on port ${PORT}`);
});

server.on("error", (error) => {
    console.error("Server startup error:", error);
});

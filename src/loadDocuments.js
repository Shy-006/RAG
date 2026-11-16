import fs from "fs/promises";

async function loadDocuments() {
    const data = await fs.readFile(
        "./data/knowledge.json",
        "utf-8"
    );

    const documents = JSON.parse(data);

    return documents;
}

export default loadDocuments;
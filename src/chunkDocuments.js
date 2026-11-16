
function chunkDocuments(documents) {
    const chunkSize = 100;
    const overlap = 20;

    const allChunks = [];

    for (let doc of documents) {
        const words = doc.content.split(/\s+/);

        let start = 0;

        while (start < words.length) {
            const end = start + chunkSize;

            const chunkText = words.slice(start, end).join(" ");

            allChunks.push({
                documentId: doc.id,
                title: doc.title,
                content: chunkText
            });

            start += chunkSize - overlap;
        }
    }

    return allChunks;
}

export default chunkDocuments;

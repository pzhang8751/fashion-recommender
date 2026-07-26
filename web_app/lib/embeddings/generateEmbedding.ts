
export async function generateEmbedding(text: string): Promise<number[]> {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.EMBEDDING_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: process.env.EMBEDDING_MODEL!, input: text })
    });

    if (!res.ok) throw new Error("Embedding generation failed");
    const data = await res.json();
    return data.data[0].embedding;
}
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ initialQuery = ""}: { initialQuery?: string}) {
    const [query, setQuery] = useState(initialQuery);
    const router = useRouter(); 

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault(); 

        const trimmed = query.trim();
        if (!trimmed) {
            router.push("/");
            return; 
        }

        router.push(`/?q=${encodeURIComponent(trimmed)}`);
    }

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
            />
            <button type="submit">
                Submit
            </button>
        </form>
    )
}
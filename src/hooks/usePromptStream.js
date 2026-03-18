import { useState, useCallback } from 'react';

// M-PC-03: Streaming Hook (Frontend)
export const usePromptStream = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState("");
    const [error, setError] = useState(null);

    const startStream = useCallback(async (input, domain, onTransitionComplete) => {
        setIsLoading(true);
        setResult("");
        setError(null);

        // Notify the transition UI that streaming has effectively begun
        if (onTransitionComplete) {
            onTransitionComplete();
        }

        try {
            const response = await fetch("http://localhost:8000/api/v1/transform/stream", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ input, domain }),
            });

            if (!response.ok) {
                throw new Error("API Connection Failed");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n\n");

                // Keep the last partial chunk in the buffer
                buffer = lines.pop() || "";

                for (const chunk of lines) {
                    const line = chunk.trim();
                    if (line.startsWith("data: ")) {
                        const dataStr = line.slice(6);
                        if (dataStr === "[DONE]") {
                            break;
                        }
                        try {
                            const data = JSON.parse(dataStr);
                            setResult(prev => prev + data.text);
                        } catch (e) {
                            console.error("Failed to parse SSE chunk", e, dataStr);
                        }
                    }
                }
            }
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { startStream, isLoading, result, error };
};

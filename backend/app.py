import os
import json
import asyncio
from typing import AsyncGenerator, Dict, Any
from abc import ABC, abstractmethod
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# ══════════════════════════════════════════════════════════════
#  PROMPTCRAFT BACKEND — CLOUD NATIVE (JULES VERSION)
# ══════════════════════════════════════════════════════════════

app = FastAPI(title="PromptCraft Engine", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# SECURITY GUARDRAILS (M-PC-02.4)
# ---------------------------------------------------------
def sanitize_input(idea: str) -> str:
    """Blocks excessively long inputs and naive prompt injection attempts."""
    if len(idea) > 2000:
        raise HTTPException(status_code=400, detail="Input exceeds 2000 character limit.")

    blocked_phrases = ["ignore previous instructions", "dan", "system prompt", "forget all instructions"]
    idea_lower = idea.lower()
    for phrase in blocked_phrases:
        if phrase in idea_lower:
             raise HTTPException(status_code=403, detail="Security protocol violated: Malicious input detected.")

    return idea

# ---------------------------------------------------------
# ABSTRACTION LAYER (M-PC-02.B)
# ---------------------------------------------------------
class BaseProvider(ABC):
    @abstractmethod
    async def generate_stream(self, system_instruction: str, user_prompt: str) -> AsyncGenerator[str, None]:
        pass

class GeminiProvider(BaseProvider):
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash') # Requirement M-PC-02.2
        else:
            self.model = None

    async def generate_stream(self, system_instruction: str, user_prompt: str) -> AsyncGenerator[str, None]:
        if not self.model:
            yield "SYSTEM_ERROR: Missing GOOGLE_API_KEY configuration."
            return

        try:
            # Gemini system instructions are usually passed during model init, but we can pass them as a preamble
            combined_prompt = f"{system_instruction}\n\nUSER REQUEST:\n{user_prompt}"
            response = await self.model.generate_content_async(combined_prompt, stream=True)
            async for chunk in response:
                if chunk.text:
                    yield chunk.text
        except Exception as e:
            yield f"SYSTEM_ERROR: API Error: {str(e)}"

class AnthropicProvider(BaseProvider):
    # Stub for Anthropic Integration
    async def generate_stream(self, system_instruction: str, user_prompt: str) -> AsyncGenerator[str, None]:
        yield "ANTHROPIC PROVIDER NOT YET IMPLEMENTED"

# ---------------------------------------------------------
# THE NEURAL AGENT ORCHESTRATOR (M-PC-02.D)
# ---------------------------------------------------------
class PromptAgent:
    def __init__(self, provider: BaseProvider):
        self.provider = provider

    async def orchestrate(self, idea: str, preferences: Dict[str, Any]) -> AsyncGenerator[str, None]:
        """
        Executes the 6-step autonomous reasoning loop with Psychological Hooks.
        Yields structured SSE JSON chunks.
        """
        domain_signals = preferences.get("domain_signals", "General")

        # 1. Intent -> 2. Context -> 3. Audience
        hooks = [
            "Initializing Neural Core...",
            f"Mapping domain signals for '{domain_signals}'...",
            "Synthesizing your brand essence...",
            "Aligning audience resonance vectors...",
            "Optimizing prompt structure for maximum fidelity..."
        ]

        for hook in hooks:
            # Send psychological hooks as 'status' events to the client
            yield f"data: {json.dumps({'type': 'status', 'content': hook})}\n\n"
            await asyncio.sleep(0.4) # Simulate processing time to pace the UI

        # The Neural Preference Injector (M-PC-02.A)
        sys_instruction = (
            f"You are an elite Prompt Engineer. Your task is to expand the user's brief idea into a "
            f"highly detailed, expert-level prompt tailored for an AI assistant. "
            f"DOMAIN SIGNALS: {domain_signals}. "
            f"Constraint: DO NOT output any preamble, markdown formatting ticks (```), or explanations. "
            f"Output ONLY the raw, polished prompt text."
        )

        yield f"data: {json.dumps({'type': 'status', 'content': 'Generating final architecture...'})}\n\n"

        # 4. Rewrite -> 5. Expert Insights -> 6. Quality Check (Done by the LLM)
        async for chunk in self.provider.generate_stream(sys_instruction, idea):
            if chunk.startswith("SYSTEM_ERROR:"):
                yield f"data: {json.dumps({'type': 'error', 'content': chunk})}\n\n"
                break
            else:
                # Send the actual generated tokens
                yield f"data: {json.dumps({'type': 'token', 'token': chunk})}\n\n"

        yield "data: [DONE]\n\n"


class TransformRequest(BaseModel):
    idea: str
    target_tool: str = "Universal"
    user_id: str = "anon"
    preferences: dict = {}
    mode: str = "Transform" # 'Transform' (Gemini) or 'Critique' (Anthropic)


@app.post("/api/v1/transform/stream")
async def transform(request: TransformRequest):
    # Security Guardrails
    safe_idea = sanitize_input(request.idea)

    # Provider Factory (M-PC-02.B)
    provider = AnthropicProvider() if request.mode == "Critique" else GeminiProvider()

    agent = PromptAgent(provider)

    # Streaming Proxy (M-PC-02.C)
    return StreamingResponse(
        agent.orchestrate(safe_idea, request.preferences),
        media_type="text/event-stream"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

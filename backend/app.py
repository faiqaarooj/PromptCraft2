from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import asyncio
import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TransformRequest(BaseModel):
    input: str
    domain: str

# M-PC-02: Neural Transform Engine Endpoint
@app.post("/api/v1/transform/stream")
async def transform_stream(req: TransformRequest):
    api_key = os.getenv("GOOGLE_API_KEY")

    async def generate_stream():
        system_prefix = f"System matched domain: {req.domain}\n\n"
        yield f"data: {json.dumps({'text': system_prefix})}\n\n"

        if not api_key:
            # Fallback to mock if no API key is set
            yield f"data: {json.dumps({'text': '[WARNING: GOOGLE_API_KEY not found in environment. Returning fallback response.]\n\n'})}\n\n"
            yield f"data: {json.dumps({'text': f'Simulated Expert Prompt for: {req.input} in domain {req.domain}'})}\n\n"
            yield "data: [DONE]\n\n"
            return

        client = genai.Client(api_key=api_key)

        system_instruction = f"""
        You are the PromptCraft Neural Transform Engine.
        Your job is to transform a simple user intent into a highly detailed 500-word master prompt.

        User Domain/Context: {req.domain}

        Negative Constraints:
        - Exclude all conversational filler (e.g., 'I hope this helps', 'Here is your prompt').
        - Never explain your reasoning unless explicitly asked.
        - Maintain 100% role-play integrity.
        """

        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.7,
        )

        try:
            response = client.models.generate_content_stream(
                model='gemini-1.5-flash',
                contents=f"Convert this intent into a master prompt: '{req.input}'",
                config=config
            )

            for chunk in response:
                if chunk.text:
                    yield f"data: {json.dumps({'text': chunk.text})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'text': f'\\n\\n[API Error: {str(e)}]'})}\n\n"

        yield "data: [DONE]\n\n"

    return StreamingResponse(generate_stream(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

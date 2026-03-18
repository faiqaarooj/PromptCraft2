import os
import json
from typing import AsyncGenerator
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# ══════════════════════════════════════════════════════════════
#  PROMPTCRAFT BACKEND — CLOUD NATIVE (JULES VERSION)
# ══════════════════════════════════════════════════════════════

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

class TransformRequest(BaseModel):
    idea: str
    target_tool: str
    user_id: str
    preferences: dict = {}

async def stream_gemini(prompt: str, system: str) -> AsyncGenerator[str, None]:
    if not GOOGLE_API_KEY:
        yield f"data: {json.dumps({'token': '[WARNING: Missing GOOGLE_API_KEY]' })}\n\n"
        yield "data: [DONE]\n\n"
        return

    model = genai.GenerativeModel('gemini-2.0-flash')

    try:
        response = await model.generate_content_async(prompt, stream=True)
        async for chunk in response:
            if chunk.text:
                yield f"data: {json.dumps({'token': chunk.text})}\n\n"
    except Exception as e:
         yield f"data: {json.dumps({'token': f'\\n\\n[API Error: {str(e)}]' })}\n\n"

    yield "data: [DONE]\n\n"

@app.post("/api/v1/transform/stream")
async def transform(request: TransformRequest):
    # DNA Synthesis Logic
    sys_prompt = (
        f"You are the PromptCraft Engine. Tool DNA: {request.target_tool}. "
        f"Context: {request.preferences.get('domain_signals', 'General')}. "
        f"Instructions: NO PREAMBLE. Output only the expert prompt."
    )
    user_msg = f"{sys_prompt}\n\nTransform: {request.idea}"

    return StreamingResponse(
        stream_gemini(user_msg, sys_prompt),
        media_type="text/event-stream"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

#hrants wroking backend

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import os
import xai_sdk

# Set your XAI API key
os.environ['XAI_API_KEY'] = 'Eh97MbeIZ4p4UjhF4D8JVyTRAZm7oErMkdePDVi1jWzNYWPq47XPUFWgqcBd0Ysa7bfaAwrHZCVxK+pzGSVBaXUvHmKzZ8F34vsqwtDpI3hKBCf3rhIz/Obwir0obKZ9PQ'

app = FastAPI()

# Allow all origins in development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the data model for the request
class SearchQuery(BaseModel):
    keyword: str

# Async function to use XAI SDK for generating a summary
async def generate_summary(keyword):
    client = xai_sdk.Client()
    sampler = client.sampler

    PREAMBLE = f"""
This is a conversation between a human user and a highly intelligent AI. The AI's name is Grok and it makes every effort to truthfully answer a user's questions. It always responds politely but is not shy to use its vast knowledge in order to solve even the most difficult problems. The conversation begins.

Human: Write a summary of 50 words or less of the word {keyword}. 

Please format your answer as a valid JSON. For example.

{{
    "summary": "summary of the word given",
}}

Assistant: Understood! Please provide the word to summarize."""

    prompt = PREAMBLE + "\n\nAssistant: "
    summary = ""
    async for token in sampler.sample(prompt=prompt, max_len=1024, stop_tokens=[""], temperature=0.5, nucleus_p=0.95):
        summary += token.token_str
    return summary

@app.post("/receive_word")
async def receive_word(word_data: SearchQuery):
    summary = await generate_summary(word_data.keyword)
    return {summary}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


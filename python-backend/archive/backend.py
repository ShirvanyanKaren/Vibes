from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from requests_oauthlib import OAuth1
from collections import defaultdict, Counter
from tweepy import Client
from pydantic import BaseModel
import requests
import asyncio
import os
import xai_sdk
import uvicorn

# Initialize FastAPI app
app = FastAPI()

# Allow all origins in development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set your XAI API key
os.environ['XAI_API_KEY'] = 'Eh97MbeIZ4p4UjhF4D8JVyTRAZm7oErMkdePDVi1jWzNYWPq47XPUFWgqcBd0Ysa7bfaAwrHZCVxK+pzGSVBaXUvHmKzZ8F34vsqwtDpI3hKBCf3rhIz/Obwir0obKZ9PQ'

# Authentication credentials for Twitter API
CONSUMER_KEY = 'nAT3qjYD3iYRV8234UUBbtYHF'
CONSUMER_SECRET = 'oDOulIX8DWzrFXc7s0t4kZvmrO6BO8fL6lL54IQnUDF2MoTWaV'
ACCESS_TOKEN = '1554341688549597185-kNgEd9OwDp16nAUfwBy9KHgK0KZDAU'
ACCESS_TOKEN_SECRET = 'D0ySQWlk8uoLn8wMEADZo4Z0C27equfwHjqgxcXOtpZFF'

# OAuth 1 Authentication for Twitter API
auth = OAuth1(CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET)

# Initialize Tweepy client for Twitter API
client = Client()

# Define data model for Twitter API response
class SearchQuery(BaseModel):
    keyword: str
    max_results: int = 100  # Default to the maximum allowed in a single query

# Define endpoint to fetch tweets related to a keyword
@app.get("/fetch_tweets")
def fetch_tweets_api(max_tweets: int = 200):
    url = 'https://api.twitter.com/2/users/1554341688549597185/timelines/reverse_chronological'
    params = {
        'tweet.fields': 'context_annotations,created_at',
        'exclude': 'replies,retweets',
        'max_results': 100  # Max results per API call
    }
    
    domain_data = defaultdict(lambda: {'name': None, 'count': 0, 'entities': Counter()})
    collected_tweets = 0

    while collected_tweets < max_tweets:
        response = requests.get(url, auth=auth, params=params)
        if response.status_code != 200:
            return {"error": f"Error: {response.status_code} - {response.json().get('detail', 'No details provided')}"}
        
        data = response.json()
        tweets = data.get('data', [])
        for tweet in tweets:
            context_annotations = tweet.get('context_annotations', [])
            for annotation in context_annotations:
                domain = annotation.get('domain', {})
                entity = annotation.get('entity', {})
                
                domain_id = domain.get('id')
                domain_name = domain.get('name')
                entity_name = entity.get('name')

                if domain_id:
                    domain_data[domain_id]['name'] = domain_name
                    domain_data[domain_id]['count'] += 1
                    if entity_name:
                        domain_data[domain_id]['entities'][entity_name] += 1

            collected_tweets += 1
            if collected_tweets >= max_tweets:
                break
        
        next_token = data.get('meta', {}).get('next_token')
        if not next_token or collected_tweets >= max_tweets:
            break
        params['pagination_token'] = next_token

    # Calculate totals and proportions
    total_domains = sum(info['count'] for info in domain_data.values())
    
    domain_proportions = sorted(
        [{'id': domain_id, 'name': info['name'], 'count': info['count'], 'proportion': info['count'] / total_domains if total_domains > 0 else 0,
          'entities': [{'name': e_name, 'count': e_count, 'proportion': e_count / info['count'] if info['count'] > 0 else 0}
                       for e_name, e_count in info['entities'].most_common(10)]}
         for domain_id, info in domain_data.items()],
        key=lambda x: x['proportion'], reverse=True)[:10]

    return {"domains": domain_proportions}

# The bearer token from your Twitter API setup
BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAB%2BmtQEAAAAAGuf73SGTi5aaOHLNjxGLsis5%2FWo%3DLO60QMVYjuVJaFQob80vZGU7VlgfoHLpfWiATKXjegBimPlKxJ"

# Initialize the Tweepy client with the bearer token
client = Client(bearer_token=BEARER_TOKEN)

# Define the data model for the request
class SearchQuery(BaseModel):
    keyword: str
    max_results: int = 100  # Default to the maximum allowed in a single query

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

# Define endpoint to receive a word and generate its summary
@app.post("/receive_word")
async def receive_word(word_data: SearchQuery):
    summary = await generate_summary(word_data.keyword)
    return {"summary": summary}

# Define endpoint to search tweets related to a keyword
@app.post("/search_tweets/")
async def search_tweets(query: SearchQuery) -> list[dict]:
    try:
        # Searching for tweets with the given keyword
        tweets = client.search_recent_tweets(
            query=query.keyword + " -is:retweet",
            max_results=query.max_results,
            tweet_fields=["author_id", "created_at", "public_metrics", "text"],
            user_fields=["profile_image_url"],  # Requesting profile image URLs
            expansions=["author_id"],  # Needed to connect tweets to user data
            sort_order="relevancy"  # Aims to bring more significant tweets forward
        )
        data = tweets.data if tweets.data else []
        includes = tweets.includes['users'] if 'users' in tweets.includes else []

        # Mapping users by their ID for quick access
        users_by_id = {user.id: user for user in includes}

        # Enhancing tweets with user data
        enhanced_tweets = [
            {
                "text": tweet.text,
                "author_id": tweet.author_id,
                "created_at": tweet.created_at,
                "like_count": tweet.public_metrics['like_count'],
                "profile_image_url": users_by_id[tweet.author_id].profile_image_url if tweet.author_id in users_by_id else None
            }
            for tweet in data
        ]

        # Sorting tweets based on 'like_count' to get the most liked tweets at the top
        sorted_tweets = sorted(
            enhanced_tweets, 
            key=lambda x: x['like_count'], 
            reverse=True
        )

        # Return only the top 20 most liked tweets
        return sorted_tweets[:20]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# Define endpoint to get recent tweets of a user
@app.get("/get_user_tweets/{user_id}")
async def get_user_tweets(user_id: str):
    try:
        # Fetching the most recent tweets of the user with the given user_id
        tweets = client.get_users_tweets(
            user_id=user_id, 
            max_results=10, 
            tweet_fields=["created_at", "public_metrics", "text"]
        )
        data = tweets.data if tweets.data else []
        return data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Run the FastAPI app using uvicorn
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

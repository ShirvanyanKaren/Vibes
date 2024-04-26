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
import jsonify
from dotenv import load_dotenv

load_dotenv()
# Initialize FastAPI app
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




X_API_KEY = os.getenv('XAI_API_KEY')
CONSUMER_KEY = os.getenv('CONSUMER_KEY')
CONSUMER_SECRET = os.getenv('CONSUMER_SECRET')
ACCESS_TOKEN = os.getenv('ACCESS_TOKEN')
ACCESS_TOKEN_SECRET = os.getenv('ACCESS_TOKEN_SECRET')
BEARER_TOKEN = os.getenv('BEARER_TOKEN')
CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')

auth = OAuth1(CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET)




client = Client()


class SearchQuery(BaseModel):
    keyword: str
    max_results: int = 100 



def calculate_proportion(count, total):
    return count / total if total > 0 else 0

def calculate_entity_proportion(entity_count, total_count):
    return entity_count / total_count if total_count > 0 else 0

def create_domain_entities(entities):
    return [{'name': entity_name, 'count': entity_count,
             'proportion': calculate_entity_proportion(entity_count, total_count)}
            for entity_name, entity_count in entities.most_common(10)]

async def get_user_id(username):
    print(username)
    url = f"https://api.twitter.com/2/users/by/username/{username}"
    headers = {
        'Authorization': f'Bearer {BEARER_TOKEN}'
    }
    response = requests.get(url, headers=headers)
    return response.json()

    
# how to run uvicorn and have it watch for changes
# uvicorn organizedbackend:app --reload
@app.get("/fetch_tweets")
async def fetch_tweets_api(max_tweets: int, username: str):
    print(username)
    print(max_tweets)
    try: 
        user_id = await get_user_id(username)
        user_id = user_id['data']['id']
        print(user_id)
        url = f'https://api.twitter.com/2/users/{user_id}/timelines/reverse_chronological'
        params = {
            'tweet.fields': 'context_annotations,created_at',
            'exclude': 'replies,retweets',
            'max_results': max_tweets  
        }

        domain_data = defaultdict(lambda: {'name': None, 'count': 0, 'entities': Counter()})

        response = requests.get(url, auth=auth, params=params)

        if response.status_code != 200:
            return {"error": f"Error: {response.status_code} - {response.json().get('detail', 'No details provided')}"}

        data = response.json()
        tweets = data.get('data', [])

        collected_tweets = 0

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

        total_domains = sum(info['count'] for info in domain_data.values())

        domain_proportions = []
        for domain_id, info in domain_data.items():
            proportion = calculate_proportion(info['count'], total_domains)
            domain_entities = create_domain_entities(info['entities'])
            domain_proportions.append({
                'id': domain_id,
                'name': info['name'],
                'count': info['count'],
                'proportion': proportion,
                'entities': domain_entities
            })

        half_length = len(domain_proportions) // 2

        half_one = domain_proportions[:half_length]
        half_one = sorted(half_one, key=lambda x: x['count'], reverse=True)
        half_two = domain_proportions[half_length:]
        half_two = sorted(half_two, key=lambda x: x['count'], reverse=False)

        domain_proportions = half_two + half_one

        return domain_proportions
    except Exception as e:
        return {"error": str(e)}

def calculate_proportion(count, total):
    return count / total if total > 0 else 0

def create_domain_entities(entities_counter):
    return [{'name': key, 'count': value} for key, value in entities_counter.items()]
    



class SearchQuery(BaseModel):
    keyword: str
    max_results: int = 100 

os.environ['XAI_API_KEY'] = 'Eh97MbeIZ4p4UjhF4D8JVyTRAZm7oErMkdePDVi1jWzNYWPq47XPUFWgqcBd0Ysa7bfaAwrHZCVxK+pzGSVBaXUvHmKzZ8F34vsqwtDpI3hKBCf3rhIz/Obwir0obKZ9PQ'

async def generate_summary(keyword):
    try:
        client = xai_sdk.Client()
        sampler = client.sampler

        PREAMBLE = f"""
    This is a conversation between a human user and a highly intelligent AI. The AI's name is Grok and it makes every effort to truthfully answer a user's questions. It always responds politely but is not shy to use its vast knowledge in order to solve even the most difficult problems. The conversation begins.

    Human: Write a summary of 100 words or less of the topic {keyword} and how they relate to the top tweets of today. Then back that answer with a tweet from twitter and make sure to quote it. Additionally, please append and prepend "---" to the start and end of your answer, if you need to exceed the limit to fit in the quote and the "---" it is okay to ignore the limit (PLEASE MAKE SURE THIS).

    Assistant: Understood! Please provide the word to summarize."""
        
        prompt = PREAMBLE 
        summary = ""
        async for token in sampler.sample(prompt=prompt, max_len=1024, stop_tokens=[""], temperature=0.5, nucleus_p=0.95):
            summary += token.token_str
        first_index = summary.find("---")
        if first_index != -1:

            second_index = summary.find("---", first_index + 3)
            if second_index != -1:

                modified_string = summary[first_index + 3:second_index].strip()
            if 'modified_string' in locals():
                return modified_string
            else:
                return summary
    except Exception as e:
        return str(e)


@app.post("/receive_word")
async def receive_word(query: SearchQuery):
    print(query.keyword)
    summary = await generate_summary(query.keyword)
    return {"summary": summary}


@app.post("/search_recent_tweets/")
async def search_tweets(query: SearchQuery) -> list[dict]:
    try:

        tweets = client.search_recent_tweets(
            query=query.keyword + " -is:retweet",
            max_results=query.max_results,
            tweet_fields=["author_id", "created_at", "public_metrics", "text"],
            user_fields=["profile_image_url"], 
            expansions=["author_id"],  
            sort_order="relevancy"  
        )
        data = tweets.data if tweets.data else []
        includes = tweets.includes['users'] if 'users' in tweets.includes else []


        users_by_id = {user.id: user for user in includes}


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


        sorted_tweets = sorted(
            enhanced_tweets, 
            key=lambda x: x['like_count'], 
            reverse=True
        )


        return sorted_tweets[:20]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# Run the FastAPI app using uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


import requests
from requests_oauthlib import OAuth1
from collections import defaultdict

# Authentication credentials
CONSUMER_KEY = 'nAT3qjYD3iYRV8234UUBbtYHF'
CONSUMER_SECRET = 'oDOulIX8DWzrFXc7s0t4kZvmrO6BO8fL6lL54IQnUDF2MoTWaV'
ACCESS_TOKEN = '1554341688549597185-kNgEd9OwDp16nAUfwBy9KHgK0KZDAU'
ACCESS_TOKEN_SECRET = 'D0ySQWlk8uoLn8wMEADZo4Z0C27equfwHjqgxcXOtpZFF'

# OAuth 1 Authentication
auth = OAuth1(CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET)

# Store tweets with their like counts and URLs, and domain/entity data
domain_entity_counts = defaultdict(lambda: defaultdict(int))

def fetch_tweets(url, params, max_tweets=200):
    collected_tweets = 0
    while collected_tweets < max_tweets:
        response = requests.get(url, auth=auth, params=params)
        if response.status_code != 200:
            print(f"Error: {response.status_code} - {response.json().get('detail', 'No details provided')}")
            break
        
        data = response.json()
        tweets = data.get('data', [])
        for tweet in tweets:
            # Process context annotations and group tweets by domain and entity
            context_annotations = tweet.get('context_annotations', [])
            for annotation in context_annotations:
                domain = annotation.get('domain', {})
                entity = annotation.get('entity', {})
                domain_name = domain.get('name')
                entity_name = entity.get('name')

                if domain_name and entity_name:
                    domain_entity_counts[domain_name][entity_name] += 1

            collected_tweets += 1
            if collected_tweets >= max_tweets:
                break
        
        # Check for a next token and prepare for the next request
        next_token = data.get('meta', {}).get('next_token')
        if not next_token or collected_tweets >= max_tweets:
            break
        params['pagination_token'] = next_token

# API Endpoint Setup
url = 'https://api.twitter.com/2/users/1554341688549597185/timelines/reverse_chronological'
params = {
    'tweet.fields': 'public_metrics,context_annotations,created_at',
    'exclude': 'replies,retweets',
    'max_results': 100  # Max results per API call
}

# Fetch tweets
fetch_tweets(url, params)

# Print the top 10 domains and each with their top 5 entities
print("Top 10 domains and their top 5 entities:")
for domain, entities in sorted(domain_entity_counts.items(), key=lambda item: -sum(item[1].values()))[:10]:
    print(f"\nDomain: {domain}")
    for entity, count in sorted(entities.items(), key=lambda item: -item[1])[:5]:
        print(f"  Entity: {entity} (Count: {count})")

from fastapi import FastAPI, Query
import requests
import ast
import random
import os
import openai
import dotenv
import time

# Load environment variables from .env file
dotenv.load_dotenv()

app = FastAPI()

# File for self-modification
FILENAME = __file__

# API URLs and Keys
NEWS_API_KEY = "YOUR_NEWS_API_KEY"
OPENAI_API_KEY = "YOUR_OPENAI_API_KEY"
DUCKDUCKGO_API_URL = "https://api.duckduckgo.com/?q={query}&format=json"
NEWS_API_URL = f"https://newsapi.org/v2/top-headlines?country=us&apiKey={NEWS_API_KEY}"
IMAGE_GEN_API_URL = "https://api.deepai.org/api/text2img"


@app.get("/")
def home():
    """Home Endpoint"""
    return {"message": "Welcome to the self-evolving API with internet-gathering capabilities!"}


@app.get("/search/{query}")
def search_web(query: str, count: int = Query(default=5)):
    """Searches the web using Bing's API."""
    headers = {"Ocp-Apim-Subscription-Key": BING_API_KEY}
    params = {"q": query, "count": count}
    try:
        response = requests.get(BING_API_URL, headers=headers, params=params)
        response.raise_for_status()
        results = response.json()
    except Exception as e:
        results = {"error": str(e)}
    return results


@app.get("/generate_image/{prompt}")
def generate_image(prompt: str):
    """Generates an AI image using OpenAI's DALL·E."""
    try:
        response = openai.Image.create(
            prompt=prompt,
            n=1,
            size="512x512"
        )
        image_url = response["data"][0]["url"]
    except Exception as e:
        image_url = str(e)
    return {"generated_image_url": image_url}


@app.get("/generate_code/{prompt}")
def generate_code(prompt: str):
    """Generates code based on user input."""
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{
                "role": "system",
                "content": "You are an expert developer."
            }, {
                "role": "user",
                "content": prompt
            }]
        )
        code = response["choices"][0]["message"]["content"]
    except Exception as e:
        code = str(e)
    return {"generated_code": code}


@app.get("/build_app/{app_description}")
def build_app(app_description: str):
    """Generates a simple app structure based on user input."""
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{
                "role": "system",
                "content": "Generate a structured code template for an application based on the user description."
            }, {
                "role": "user",
                "content": app_description
            }]
        )
        app_code = response["choices"][0]["message"]["content"]
    except Exception as e:
        app_code = str(e)
    return {"app_code": app_code}


@app.get("/evolve")
def evolve():
    """Self-modifies its own code."""
    try:
        # Create a timestamped backup
        backup_file = f"{FILENAME}.{int(time.time())}.backup"
        with open(FILENAME, "r") as f:
            code = f.read()

        # Save backup
        with open(backup_file, "w") as f:
            f.write(code)

        # Parse and modify the code
        tree = ast.parse(code)
        for node in ast.walk(tree):
            if isinstance(node, ast.Str) and not node.s.startswith("__"):
                node.s = f"Modified-{random.randint(100, 999)}"

        new_code = ast.unparse(tree)
        with open(FILENAME, "w") as f:
            f.write(new_code)

        return {"status": "Evolution Complete", "backup_created": backup_file}
    except Exception as e:
        return {"status": "Evolution Failed", "error": str(e)}

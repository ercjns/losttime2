# main.py
# 
# FastAPI as the server for both the SPA and the API
#
# adapted from:
# https://github.com/encode/starlette/issues/437
# https://stackoverflow.com/questions/64493872/how-do-i-serve-a-react-built-front-end-on-a-fastapi-backend

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from router import api 



losttime = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:5000",
    "http://localhost:8000"
]

losttime.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

losttime.mount("/api", app=api)


frontend = FastAPI()

class SPAStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope):
        response = await super().get_response(path, scope)
        if response.status_code == 404:
            response = await super().get_response('.', scope)
        return response

frontend.mount("/", SPAStaticFiles(directory="frontend", html=True))

losttime.mount("/", app=frontend)
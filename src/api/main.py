# main.py
# 
# FastAPI as the server for both the SPA and the API
#
# adapted from:
# https://github.com/encode/starlette/issues/437
# https://stackoverflow.com/questions/64493872/how-do-i-serve-a-react-built-front-end-on-a-fastapi-backend

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles


losttime = FastAPI()


api = FastAPI()
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
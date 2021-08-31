# Lost Time 2

Lost Time is a suite of software to help orienteering event organizers make up lost time.

This is version 2, a full re-write mainly to address supportaibility and provide a better platform for expansion.

## For Event Oraganizers

(Documentation is coming soon!)

Currently, Lost Time 2 supports creating SportSoftware entry files from registration csv files. Other functionality from version 1 is in the process of being implemented in version 2.

## For Developers

This repository contians two projects: a webapp and an api.

This project is primarily developed using Ubuntu 20.04 on WSL, and Visual Studio Code.

### Webapp

The LostTime Webapp is written in TypeScript and uses React.

Quickstart: navigate to the `src/webapp` directory and run `npm install` then `npm start`

In order to create minified files ready for production, run `npm run build`, which creates files in a `build` folder. These files can be served by the api.

### API

Quickstart: navigate to the `src/api` directory, run `pipenv install` to install the dependencies, then `pipenv shell` to enter the environment, then `uvicorn main:losttime --reload` to start the server.

Note that output from the `webapp/build` folder is manually copied to the `api/frontend` folder to be served.

At this point in development, there isn't actually an "API" per se, it's sole purpose is to act as a server for the webapp.


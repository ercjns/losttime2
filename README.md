# Lost Time 2

Lost Time is a suite of software to help orienteering event organizers make up lost time.

This is version 2, a full re-write mainly to address supportability and provide a better platform for expansion.

### LostTime.Web

Web is a static single page application. It covers two scenarios:

1. Pre-Event: given registration information, create files ready for import into OE
1. Post-Event: given race results, create files ready for online display

There is no database, the application does not store any information between sessions.

### LostTime.Conductor

Conductor is an application and tooling to support the use of Web in a more automated fashion.

For example, the conductor can be used to support live results in the following workflow:
1. Conductor ensures a local version of LostTime.Web is available.
1. Conductor monitors a folder for a new race XML file.
1. Conductor uses automation to create a competition result html file, leveraging LostTime.Web.
1. Conductor moves the html file to a location where it can be served.

### LostTime.Tests

Tests for the project. Uses Playwright, which I'm still learning.
Using typescript to define tests to match the primary language of the web project.

#### Development Notes:

The development environment is WINDOWS.

##### Install - Web

Use nvm-windows for node version managing as recommended (here)[https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows]

As of June 2025: latest LTS is `22.16.0` - install and select this version of node in nvm.

cd to `LostTime.Web`
run `npm install`
run `npm start`

That's it!

##### Run Tests

I'm using the playwright test for vscode extension and that's able to run tests locally.

Likely need to npm install playwright and test dependencies for this to work. 
The packages are in that module, so:

cd to `LostTime.Tests`
run `npm install`

##### Install - Conductor

(todo)






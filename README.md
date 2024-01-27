# Lost Time 2

Lost Time is a suite of software to help orienteering event organizers make up lost time.

This is version 2, a full re-write mainly to address supportaibility and provide a better platform for expansion.

### LostTime.Web

Web is a static single page application. It covers two scecnarios:

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



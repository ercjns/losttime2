# LostTime.Conductor

This application is responsible for conducting the workflow of files that begins with a result file from an Orienteering Event software and ends with an html file being made available at a specified location.

## Requirements

This application runs on a windows computer.
This application must be able to access an instance of `LostTime.Web`

## Workflow

### Monitoring

Define a `SOURCE_DIR`. This directory must be accessible from the machine where the application is running. The application will check this directory every `NEW_FILE_WAIT_SECONDS` for a new file.

Specifically, the application finds the file with the most recent modified time. If the file name is the same as the previously processed file, processing stops.


### LostTime Web Processing

Define `LOSTTIME_OUT_DIR`.
Losttime must be running and accessible at `LOSTTIME_URL`. This application does NOT start an instance of LostTime.Web if one is not found at the specified server.

Conductor uses selenium to:
- open losttime
- upload the file to the dropzone
- click on the scoring preset as with `LOSTTIME_SCORING_PRESET_ID`
- click on the download for `LOSTTIME_DOWNLOAD_STYLE_ID`
- save the file to `LOSTTIME_OUT_DIR`

The filename from losttime is used in this itermediate directory.

### File Movement

This HTML file likely needs to be moved to a location for actual use / serving.

For Local WIFI, this means moving the html file to the folder that is serving local Wifi via simple file copy.

Specify `COPY_TO_FOLDER = True`. Define `DEST_DIR` and `DEST_FILENAME`. The file is copied. An existing file in the directory with that name will be overwritten.

For Online Locations, SFTP is supported via private key auth.
Specify `COPY_TO_SFTP = True`. Define SFTP host, authentication, and destination filename parameters. The file is copied. 

FUTURE: POST request

## Network Layout

For serving results on local WiFi at finish / event center, *without internet*:

We use a normal home wifi router (Asus RT-AC66U) that is capable of running the custom Tomato USB firmware.

This firmware adds some basic linux server functionality that makes things easy:

1. The router is a DNS server for clients connected to it, so we can use a normal-looking url even though we're not actually hitting the internet.
2. The router is running NGINX, so we can serve static content from a network location.
3. The router has a USB drive mounted as storage.
4. The router is a samba server (file share)


### DNSmasq
This configuration allows us to tell individuals to connect to our WiFi network, type in a normal looking url, and get the page we're serving.

There is just one line of configuraiton added to TomatoUSB's dnsmasq field:
```address=/wifi.cascadeoc.org/192.168.103.100```
`wifi.cascadeoc.org` is the url we tell people to type in and `192.168.103.100` is the IP address of the NGINX Server on the network... which is actually the router!

### USB / NGINX / Samba
An old thumb drive provides more than enough storage for a few html files to be served. A folder on this drive is set up as both the NGINX server webroot as well as a samba share. This allows the losttime conductor to use the standard file copy functionality to drop a new results file. NGINX just serves the new file to whoever requests it from a browser.

# LostTime.Conductor

This application is responsible for conducting the workflow of files that begins with a result file from an Orienteering Event software and ends with an html file being made available at a specified location.

## Requirements

This application runs on a windows computer.
This application must be able to access an instance of `LostTime.Web`

## Workflow

### Monitoring

Define a `SOURCE_DIR` and `NEW_FILE_WAIT_SECONDS`. This directory must be accessible from the machine where the application is running. The application will check this directory every `NEW_FILE_WAIT_SECONDS` for a new file.

Specifically, the application finds the file with the most recent modified time. If the file name is the same as the previously processed file, processing stops.


### LostTime Web Processing

Define `LOSTTIME_URL` and `LOSTTIME_OUT_DIR`.
Losttime MUST be available at the specified URL. This application does NOT start an instance of LostTime.Web if one is not found at the specified server. (Future)

Conductor uses selenium to:
- open losttime
- upload the file to the dropzone
- click on the scoring preset as with `LOSTTIME_PRESET_ID`
- click on the download for `LOSTTIME_DOWNLOAD_STYLE_ID`
- save the file to `LOSTTIME_OUT_DIR`

The filename from losttime is used.

### File Movement

This HTML file needs to be moved to a location for use.

For Local WIFI, this means moving to the folder that is serving local Wifi via simple file copy

Define `PUBLIC_DIR` and `PUBLIC_FILENAME`. The file is copied. An existing file in the directory with that name will be overwritten.

FUTURE: SFTP upload
FUTURE: POST request



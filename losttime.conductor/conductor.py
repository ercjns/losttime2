###
# LostTime.Conductor
# Eric Jones 2024
###

import posixpath
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.common import NoSuchElementException, ElementNotInteractableException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support.expected_conditions import element_to_be_clickable

import requests
from time import sleep
import os
from shutil import copy2

import paramiko

from config import *



def GetLatestFileInFolder(dir):
    wd = os.getcwd()
    os.chdir(dir)
    files = sorted(filter(os.path.isfile, os.listdir('.')), key=os.path.getmtime, reverse=True)
    fn = files[0]
    os.chdir(wd)
    return os.path.join(dir, fn)

def GetLatestResultsXml(dir=SOURCE_DIR):
    return GetLatestFileInFolder(dir)

#### Section: Check LostTime

def LiveConnectionToLostTime():
    try:
        resp = requests.get(
            url=LOSTTIME_URL,
            timeout=5
            )
        resp.raise_for_status()
    except:
        print("Unable to reach LostTime - is it running at {}?".format(LOSTTIME_URL))
        return False
    return True

#### Section: Check the file

# From: https://stackoverflow.com/questions/46258499/how-to-read-the-last-line-of-a-file-in-python
def LastLineOfXmlIsPresent(file):
    with open(file, 'rb') as f:
        try:  # catch OSError in case of a one line file 
            f.seek(-2, os.SEEK_END)
            while f.read(1) != b'\n':
                f.seek(-2, os.SEEK_CUR)
        except OSError:
            f.seek(0)
        last_line = f.readline().decode()
    if last_line == "</ResultList>\r\n":
        return True
    return False

#### Section: Call LostTime with File

def addFileToDropzone(driver, css_id, file):
    upload_file = driver.find_element(By.ID, css_id)
    upload_file.send_keys(file)
    return

def clickViaJS(driver, selector):
    script = 'document.querySelector(\"{}\").click();'.format(selector)
    driver.execute_script(script)
    return

def CreateNewHtmlFromSplits(xmlresults_fn):
    options = Options()
    options.add_argument("--headless")
    options.set_preference("browser.download.folderList", 2)
    options.set_preference("browser.download.manager.dhowWhenStarting", False)
    options.set_preference("browser.download.dir", LOSTTIME_OUT_DIR )
    options.set_preference("browser.helperApps.neverAsk.saveToDisk", "application/html")

    driver = webdriver.Firefox(options=options)
    try:
        driver.get(LOSTTIME_URL)

        errors = [NoSuchElementException, ElementNotInteractableException]
        wait = WebDriverWait(driver, timeout=5, ignored_exceptions=errors)
        wait.until(lambda x: driver.find_element(By.CLASS_NAME, 'dropzone').is_displayed())
        addFileToDropzone(driver, 'dz-file-input', xmlresults_fn)

        errors = [NoSuchElementException, ElementNotInteractableException]
        wait = WebDriverWait(driver, timeout=5, ignored_exceptions=errors)
        wait.until(element_to_be_clickable((By.ID, LOSTTIME_SCORING_PRESET_ID)))
        clickViaJS(driver, '#'+LOSTTIME_SCORING_PRESET_ID)

        errors = [NoSuchElementException, ElementNotInteractableException]
        wait = WebDriverWait(driver, timeout=5, poll_frequency=.5, ignored_exceptions=errors)
        wait.until(element_to_be_clickable((By.ID, LOSTTIME_DOWNLOAD_RESULTS_GROUP_ID)))
        clickViaJS(driver, '#'+LOSTTIME_DOWNLOAD_RESULTS_GROUP_ID)
        wait.until(element_to_be_clickable((By.ID, LOSTTIME_DOWNLOAD_STYLE_ID)))
        clickViaJS(driver, '#'+LOSTTIME_DOWNLOAD_STYLE_ID)

        sleep(2) ## this is here to make sure the the file downloads and firefox doesn't block on pending download.
        print("Created file from LostTime")
    except:
        print("Issue with generating file in LostTime")
        return False
    finally:
        driver.quit()
    return True


#### Section: Move files to server location

def GetLostTimeOutputFile(dir=LOSTTIME_OUT_DIR):
    return GetLatestFileInFolder(dir)

def CopyOutputToPublicFolder():
    try:
        src = GetLostTimeOutputFile()
        dest = os.path.join(DEST_DIR, DEST_FILENAME)
        print("from here: " + src)
        print("to here: " + dest)
        copy2(src, dest)
    except:
        print("issue copying file to public folder")
        return False
    return True

def CopyOutputToSftpLocation():
    src = GetLostTimeOutputFile()
    dest = posixpath.join(SFTP_DEST_DIR, SFTP_DEST_FILENAME)
    print("SFTP Src: {}".format(src))
    print("SFTP Dest: {} on {}".format(dest, SFTP_HOST_URL))
    try:
        sshclient = _SftpConnect()
    except:
        print("issue connecting to SFTP")
        return False
    try: 
        _SftpPut(sshclient, src, dest)
    except:
        print("issue sending file to SFTP")
        return False
    finally:
        print("closing ssh")
        sshclient.close()
        print("closed ssh")
    return True

# second answer https://stackoverflow.com/questions/3635131/paramikos-sshclient-with-sftp
def _SftpConnect():
    paramiko.util.log_to_file("paramiko.log")

    client = paramiko.SSHClient()
    client.load_host_keys(SFTP_PUBLIC_KEY_FILE)
    key = paramiko.Ed25519Key.from_private_key_file(SFTP_PRIVATE_KEY_FILE)
    client.connect(SFTP_HOST_URL, username=SFTP_USER, pkey=key)
    print("connected!")
    return client

def _SftpPut(client:paramiko.SSHClient, local, remote):
    sftp = client.open_sftp()
    sftp.put(local, remote)
    print("Put file")
    sftp.close()
    print("Closed SFTP")
    return



#### Section: MAIN

def main():
    processed_file=''

    while True:
        # always sleep
        print('Sleeping for {} seconds'.format(NEW_FILE_WAIT_SECONDS))
        sleep(NEW_FILE_WAIT_SECONDS)

        # detect new file from OE now in SFTP drop point
        # grab new file
        XmlResults_fn = GetLatestResultsXml()
        print('Found file: ' + XmlResults_fn)

        if XmlResults_fn != processed_file:
            print('This is new! processing')
            
            if not LastLineOfXmlIsPresent(XmlResults_fn):
                continue

            # make sure react app is running locally
            if not LiveConnectionToLostTime():
                continue
            
            # call react app to process through scoring algo
            if not CreateNewHtmlFromSplits(XmlResults_fn):
                continue

            # get new html file
            if COPY_TO_FOLDER:
                if not CopyOutputToPublicFolder():
                    continue

            # put file on sftp server
            if COPY_TO_SFTP:
                if not CopyOutputToSftpLocation():
                    continue

            # set this file as processed
            processed_file = XmlResults_fn
        else:
            print('Already processed that file')

if __name__ == "__main__":
    main()

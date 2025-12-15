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
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.expected_conditions import element_to_be_clickable

import requests
from time import sleep
import os
from shutil import copy2

import paramiko
import webbrowser

from serveLostTimeWeb import ServeInBackground

from config import *
global LOSTTIME_URL
LOSTTIME_URL = None

#### Section: Check LostTime

def setLostTimeUrl(version, ui=None):
    global LOSTTIME_URL
    if version == 'INTERNAL':
        if LOSTTIME_URL is None:
            address = ServeInBackground()
            LOSTTIME_URL = address + '/results'
    elif version == 'PUBLIC':
        LOSTTIME_URL = 'https://losttimeorienteering.com/results'
    else:
        LOSTTIME_URL = version
    sendVirtualEventToUi(ui, '<<lostTimeWebUrlSet>>')
    return

def LiveConnectionToLostTime(url):
    if url is None:
        print("No url set for LostTime.Web")
        return False
    try:
        resp = requests.get(
            url=url,
            timeout=5
            )
        resp.raise_for_status()
    except:
        print("Unable to reach LostTime - is it running at {}?".format(url))
        return False
    print('Using LostTime at {}'.format(url))
    return True

#### Section: Check the file

def GetLatestFileInFolder(dir,extension=None):
    wd = os.getcwd()
    os.chdir(dir)
    files = sorted(filter(lambda x: os.path.isfile(x) and (x.endswith(extension) if extension else True), 
                          os.listdir('.')),
                   key=os.path.getmtime,
                   reverse=True)
    if len(files) == 0:
        return False
    os.chdir(wd)
    return os.path.join(dir, files[0])

def GetLatestResultsXml(dir=SOURCE_DIR):
    return GetLatestFileInFolder(dir,'.xml')

# From: https://stackoverflow.com/questions/46258499/how-to-read-the-last-line-of-a-file-in-python
def LastLineOfXmlIsPresent(file):
    try:
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
    except PermissionError:
        print('Permission denied trying to read: {}'.format(file))
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
    global LOSTTIME_URL
    options = Options()
    options.add_argument("--headless")
    options.set_preference("browser.download.folderList", 2)
    options.set_preference("browser.download.manager.dhowWhenStarting", False)
    options.set_preference("browser.download.dir", LOSTTIME_OUT_DIR )
    options.set_preference("browser.helperApps.neverAsk.saveToDisk", "application/html")

    driver = webdriver.Firefox(options=options)
    if LOSTTIME_URL is None:
        print("No url set for LostTime.Web")
        return False
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
        wait.until(element_to_be_clickable((By.ID, LOSTTIME_DOWNLOAD_STYLE_SELECT_ID)))
        select = Select(driver.find_element(By.ID, LOSTTIME_DOWNLOAD_STYLE_SELECT_ID))
        select.select_by_value(LOSTTIME_DOWNLOAD_STYLE_VALUE)
        wait.until(element_to_be_clickable((By.ID, LOSTTIME_DOWNLOAD_BUTTON_ID)))
        clickViaJS(driver, '#'+LOSTTIME_DOWNLOAD_BUTTON_ID)

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
        print("from here: ", src)
        print("to here: ", dest)
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

#### Section: Main Program and UI Actions

def sendVirtualEventToUi(ui, event):
    if ui != None:
        ui.event_generate(event, when='tail')
        print("SENT EVENT: ", event)
    return

class ConductorRunResult(object):

    def __init__(self, previousXml) -> None:
        self.previousXml: str = previousXml
        self.lostTimeUrl: str|None = None
        self.latestXml: str = ''
        self.latestIsNew: bool|None = None
        self.lostTimeConnect: bool|None = None
        self.createdOutput: bool|None = None
        self.copiedFile: bool|None = None
        self.copiedSftp: bool|None = None
        self.message: str|None = None
        return
    
    def keepRunning(self) -> bool:
        # keep running if no files ever found
        if self.previousXml == '' and self.latestXml == '':
            return True
        
        # keep running if file found but not new
        if self.latestIsNew is not None and self.latestIsNew is False:
            return True
        
        # keep running on success based on configs
        if COPY_TO_FOLDER and not COPY_TO_SFTP:
            if self.copiedFile: return True
        elif COPY_TO_SFTP and not COPY_TO_FOLDER:
            if self.copiedSftp: return True
        elif COPY_TO_FOLDER and COPY_TO_SFTP:
            if self.copiedFile and self.copiedSftp: return True
        elif not COPY_TO_FOLDER and not COPY_TO_SFTP:
            if self.createdOutput: return True
        
        # otherwise don't keep running
        return False
    
    def setMessage(self, message) -> None:
        self.message = message
        print(self.message)
        return


def runOnce(ui=None, stop=lambda:False, processed_file=''):
    res = ConductorRunResult(processed_file)
    global LOSTTIME_URL
    if LOSTTIME_URL is None:
        setLostTimeUrl(LOSTTIME_WEB_VERSION, ui)
    res.lostTimeUrl = LOSTTIME_URL
    if stop():
        sendVirtualEventToUi(ui, '<<status-stopped>>')
        return res
    sendVirtualEventToUi(ui, '<<status-working>>')

    XmlResults_fn = GetLatestResultsXml()
    res.latestXml = XmlResults_fn if XmlResults_fn else ''
    if XmlResults_fn is False:
        res.setMessage('No Results XML files found in directory')
        sendVirtualEventToUi(ui, '<<status-stopped>>')
        return res
    res.setMessage('Found file: ' + XmlResults_fn)
    
    if XmlResults_fn != processed_file:
        res.latestIsNew = True
        
        if not LastLineOfXmlIsPresent(XmlResults_fn) or stop():
            res.setMessage('XML file not complete')
            sendVirtualEventToUi(ui, '<<status-stopped>>')
            return res

        # make sure react app is running locally
        if not LiveConnectionToLostTime(LOSTTIME_URL) or stop():
            res.lostTimeConnect = False
            sendVirtualEventToUi(ui, '<<status-stopped>>')
            return res
        res.lostTimeConnect = True

        # call react app to process through scoring algo
        if not CreateNewHtmlFromSplits(XmlResults_fn) or stop():
            res.createdOutput = False
            sendVirtualEventToUi(ui, '<<status-stopped>>')
            return res
        res.createdOutput = True

        # get new html file
        if COPY_TO_FOLDER:
            if not CopyOutputToPublicFolder() or stop():
                res.copiedFile = False
                sendVirtualEventToUi(ui, '<<status-stopped>>')
                return res
            res.copiedFile = True

        # put file on sftp server
        if COPY_TO_SFTP:
            if not CopyOutputToSftpLocation() or stop():
                res.copiedSftp = False
                sendVirtualEventToUi(ui, '<<status-stopped>>')
                return res
            res.copiedSftp = True

        sendVirtualEventToUi(ui, '<<status-complete>>')
        return res
    else:
        res.latestIsNew = False
        res.setMessage('Already processed that file')
        sendVirtualEventToUi(ui, '<<status-stopped>>')
        return res
    
def runForever(ui=None, stop=lambda:False):
    global LOSTTIME_URL
    if LOSTTIME_URL is None:
        setLostTimeUrl(LOSTTIME_WEB_VERSION, ui)

    result = ConductorRunResult('')
    sendVirtualEventToUi(ui, '<<status-working>>')
    while not stop():
        if result.keepRunning() is False:
            sendVirtualEventToUi(ui, '<<status-stopped>>')
            break
        print('Sleeping for {} seconds'.format(NEW_FILE_WAIT_SECONDS))
        sendVirtualEventToUi(ui, '<<status-waiting>>')
        sleep(NEW_FILE_WAIT_SECONDS)
        result = runOnce(ui, stop, result.latestXml)
    print('STOP FLAG')
    return

def launchBrowser():
    global LOSTTIME_URL
    if LOSTTIME_URL is None:
        setLostTimeUrl(LOSTTIME_WEB_VERSION)
    if LOSTTIME_URL is not None:
        webbrowser.open_new_tab(LOSTTIME_URL)

def getLostTimeWebUrl():
    global LOSTTIME_URL
    return LOSTTIME_URL

if __name__ == "__main__":
    LOSTTIME_URL = setLostTimeUrl(LOSTTIME_WEB_VERSION)
    runForever(LOSTTIME_URL)

from tkinter import Tk
from tkinter import N,S,E,W
from tkinter import font as TkFont
from tkinter import Canvas
from tkinter import ttk
from tkinter import StringVar
from os.path import join, dirname

from threading import Thread
from datetime import datetime

from conductor import runOnce, runForever, launchBrowser, getLostTimeWebUrl
from conductor import conf as SETTINGS

class LostTimeLocalApp:
    def __init__(self):
        self.root = Tk()
        self.root.title('LostTime Local')
        self.root.iconbitmap(join(dirname(__file__),'losttime.web.built','favicon.ico'))
        
        f = TkFont.nametofont('TkDefaultFont')
        f.config(size=18)

        tabs = ttk.Notebook(self.root, padding=(12,12,12,12))
        tabs.grid(column=0, row=0,sticky=(N,W,E,S)) # pyright: ignore[reportArgumentType]

        self.homeTab = HomeTab(self.root)
        tabs.add(self.homeTab, text="Home")
        self.settingsTab = SettingsTab(self.root)
        tabs.add(self.settingsTab, text="Settings")

        # Bind events
        self.root.bind('<<status-waiting>>', lambda e: self.homeTab.onStatus('Waiting'))
        self.root.bind('<<status-working>>', lambda e: self.homeTab.onStatus('Working'))
        self.root.bind('<<status-stopping>>', lambda e: self.homeTab.onStatus('Stopping'))
        self.root.bind('<<status-stopped>>', lambda e: self.homeTab.onStatus('Stopped'))
        self.root.bind('<<status-complete>>', lambda e: self.homeTab.onStatus('Complete'))

        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        self.root.mainloop()

class HomeTab(ttk.Frame):
    def __init__(self, container):
        super().__init__(container)
        self.config(padding=6)

        self.appRoot = container
        self.STOP_REQUESTED = False

        self.frm_status = StatusFrame(self)

        actionHandlers = {
            'runOnce': self.handleRunOnce,
            'runForever': self.handleRunForever,
            'stop': self.handleStop,
            'launchBrowser': self.handleLaunchBrowser
            }
        self.frm_actions = ActionsFrame(self, actionHandlers)

    def onStatus(self, status):
        self.frm_status.lbl_statusValue.config(text=status)

        if status == 'Stopped' or status == 'Complete':
            self.STOP_REQUESTED = False
            if status == 'Complete':
                self.frm_status.lbl_successTime.config(text=self._nowString())
                self._setStatusDotColor('purple')
            elif status == 'Stopped':
                self._setStatusDotColor('red')
            self._setRunOnceBtState('normal')
            self._setRunForeverBtState('normal')
            self._setStopBtState('disabled')

        elif status == 'Stopping':
            self._setRunOnceBtState('disabled')
            self._setRunForeverBtState('disabled')
            self._setStopBtState('disabled')
            self._setStatusDotColor('orange')

        elif status == 'Working':
            self.frm_status.lbl_fileCheckTime.config(text=self._nowString())
            self._setRunOnceBtState('disabled')
            self._setRunForeverBtState('disabled')
            self._setStopBtState('normal')
            self._setStatusDotColor('blue')

        elif status == 'Waiting':
            self._setRunForeverBtState('disabled')
            self._setRunOnceBtState('disabled')
            self._setStopBtState('normal')
            self._setStatusDotColor('lightblue')

        else:
            # SHOULDN'T GET HERE
            self._setStatusDotColor('pink')

        return

    ## onStatus Helpers
    
    def _nowString(self):
        now = datetime.now()
        return now.strftime('%Y-%m-%d %H:%M:%S')
    
    def _setRunForeverBtState(self, state):
        self.frm_actions.bt_runForever.config(state=state)

    def _setRunOnceBtState(self, state):
        self.frm_actions.bt_runOnce.config(state=state)

    def _setStopBtState(self, state):
        self.frm_actions.bt_stop.config(state=state)

    def _setStatusDotColor(self, color):
        self.frm_status.status_dot.create_oval(3,3,30,30, fill=color, outline='')

    ## Action Handlers

    def handleRunOnce(self):
        t = Thread(target=runOnce, args=(self.appRoot, ))
        t.start()

    def handleRunForever(self):
        t = Thread(target=runForever, args=(self.appRoot, lambda:self.STOP_REQUESTED))
        t.start()

    def handleStop(self):
        self.STOP_REQUESTED = True
        self.onStatus('Stopping')
        return

    def handleLaunchBrowser(self):
        launchBrowser()

class StatusFrame(ttk.LabelFrame):
    def __init__(self, container):
        super().__init__(container)
        self.config(text="Status")
        self.config(padding=8)

        # Status Text and Dot
        ttk.Label(self, text="Status: ").grid(column=0, row=0, sticky=E)
        self.status_dot = Canvas(self, width=30, height=30)
        self.status_dot.grid(column=1, row=0)
        self.status_dot.create_oval(3, 3, 30, 30, fill='red', outline='')
        self.lbl_statusValue = ttk.Label(self, text="Stopped")
        self.lbl_statusValue.grid(column=2, row=0, sticky=W)

        # Last Check Time
        ttk.Label(self, text="Last File Check: ").grid(column=0, row=1, sticky=E)
        self.lbl_fileCheckTime = ttk.Label(self, text="(never)")
        self.lbl_fileCheckTime.grid(column=1, row=1, columnspan=2, sticky=W)

        # Last Completion Success Time
        ttk.Label(self, text="Last File Processed: ").grid(column=0, row=2, sticky=E)
        self.lbl_successTime = ttk.Label(self, text="(never)")
        self.lbl_successTime.grid(column=1, row=2, columnspan=2, sticky=W)

        # Place this Frame
        self.grid(column=0, row=2, sticky=(W,E), padx=3, pady=(3,6)) # pyright: ignore[reportArgumentType]

class ActionsFrame(ttk.LabelFrame):
    def __init__(self, container, handlers):
        super().__init__(container)
        self.config(padding=3)
        self.config(text="Actions")

        # Buttons
        self.bt_runOnce = ttk.Button(self, text="Run Once", command=handlers['runOnce'])
        self.bt_runOnce.grid(column=1, row=0)
        self.bt_runForever = ttk.Button(self, text="Run Forever", command=handlers['runForever'])
        self.bt_runForever.grid(column=2, row=0)
        self.bt_stop = ttk.Button(self, text="Stop", state='disabled', command=handlers['stop'])
        self.bt_stop.grid(column=3, row=0)
  
        self.bt_openBroswer = ttk.Button(self, text="Launch LostTime Web", command=handlers['launchBrowser'])
        self.bt_openBroswer.grid(column=1, columnspan=3, row=3)

        # Place this Frame
        self.grid(column=0, row=1, sticky=(W,E), padx=3, pady=(3,6)) # pyright: ignore[reportArgumentType]

class SettingsTab(ttk.Frame):
    def __init__(self, container):
        super().__init__(container)
        self.config(padding=6)
        self.frm_settings = SettingsFrame(self)

        settings_font = TkFont.Font(size=12, slant='italic')

        self.lbl_notes = ttk.Label(self, 
                            text="To change settings, close this program and update values in the `LostTimeLocal.config` file located next to the executable.",
                            font=settings_font,
                            wraplength=500)
        self.lbl_notes.grid(column=0, row=1, sticky=W)

class SettingsFrame(ttk.LabelFrame):
    def __init__(self, container):
        super().__init__(container)

        settings_font = TkFont.Font(size=12)

        self.config(text="Settings")
        self.config(padding=8)

        self.lbl_scoring = ttk.Label(self, text="Score Method: ", font=settings_font)
        self.lbl_scoring.grid(column=1, row=1, sticky=E)
        if SETTINGS.LOSTTIME_SCORING_PRESET_ID is not None:
            self.lbl_scoringValue = ttk.Label(self, font=settings_font, text=SETTINGS.LOSTTIME_SCORING_PRESET_ID)
            self.lbl_scoringValue.grid(column=2, row=1, sticky=W)

        self.lbl_outStyle = ttk.Label(self, text="Output Style: ", font=settings_font)
        self.lbl_outStyle.grid(column=1, row=2, sticky=E)
        styleLookup = {'0':'Plaintext', '1':'Generic Html', '2':'Cascade Wordpress Html', '3':'Cascade WiFi Html'}
        if SETTINGS.LOSTTIME_DOWNLOAD_STYLE_VALUE in styleLookup.keys():
            self.lbl_outStyleValue = ttk.Label(self, text='{}'.format(styleLookup[SETTINGS.LOSTTIME_DOWNLOAD_STYLE_VALUE]), font=settings_font)
            self.lbl_outStyleValue.grid(column=2, row=2, sticky=W)

        self.lbl_source = ttk.Label(self, text="Source File Directory: ", font=settings_font)
        self.lbl_source.grid(column=1, row=3, sticky=E)
        if SETTINGS.SOURCE_DIR is not None:
            self.txt_sourceValue = StringVar(value=SETTINGS.SOURCE_DIR)
            self.lbl_sourceValue = ttk.Entry(self, 
                                             textvariable=self.txt_sourceValue, 
                                             font=settings_font, 
                                             state='readonly', 
                                             width=50)
            self.lbl_sourceValue.grid(column=2, row=3, sticky=W)

        self.lbl_waitTime = ttk.Label(self, text="File Check Interval: ", font=settings_font)
        self.lbl_waitTime.grid(column=1, row=4, sticky=E)
        if SETTINGS.NEW_FILE_WAIT_SECONDS is not None:
            self.lbl_waitTimeValue = ttk.Label(self, text='{} seconds'.format(SETTINGS.NEW_FILE_WAIT_SECONDS), font=settings_font)
            self.lbl_waitTimeValue.grid(column=2, row=4, sticky=W)

        self.lbl_out = ttk.Label(self, text="Result File Directory: ", font=settings_font)
        self.lbl_out.grid(column=1, row=5, sticky=E)
        if SETTINGS.LOSTTIME_OUT_DIR is not None:
            self.txt_outValue = StringVar(value=SETTINGS.LOSTTIME_OUT_DIR)
            self.lbl_outValue = ttk.Entry(self, 
                                          textvariable=self.txt_outValue, 
                                          font=settings_font, 
                                          state='readonly', 
                                          width=50)
            self.lbl_outValue.grid(column=2, row=5, sticky=W)
        
        self.lbl_doCopy = ttk.Label(self, text="Copy Result to Folder: ", font=settings_font)
        self.lbl_doCopy.grid(column=1, row=6, sticky=E)
        if SETTINGS.COPY_TO_FOLDER is not None:
            self.lbl_doCopyValue = ttk.Label(self, text='{}'.format(SETTINGS.COPY_TO_FOLDER), font=settings_font)
            self.lbl_doCopyValue.grid(column=2, row=6, sticky=W)

        self.lbl_copyDest = ttk.Label(self, text="Copy Destination: ", font=settings_font)
        self.lbl_copyDest.grid(column=1, row=7, sticky=E)
        if SETTINGS.COPY_TO_FOLDER is True and SETTINGS.DEST_DIR is not None:
            self.lbl_copyDestValue = ttk.Label(self, text='{}'.format(join(SETTINGS.DEST_DIR, SETTINGS.DEST_FILENAME)), font=settings_font)
            self.lbl_copyDestValue.grid(column=2, row=7, sticky=W)

        self.lbl_doSftp = ttk.Label(self, text="Send Result to Sftp: ", font=settings_font)
        self.lbl_doSftp.grid(column=1, row=8, sticky=E)
        if SETTINGS.COPY_TO_SFTP is not None:
            self.lbl_doSftpValue = ttk.Label(self, text='{}'.format(SETTINGS.COPY_TO_SFTP), font=settings_font)
            self.lbl_doSftpValue.grid(column=2, row=8, sticky=W)

        self.lbl_sftpDest = ttk.Label(self, text="Sftp Connection: ", font=settings_font)
        self.lbl_sftpDest.grid(column=1, row=9, sticky=E)
        if SETTINGS.COPY_TO_SFTP is True and SETTINGS.SFTP_HOST_URL is not None:
            self.lbl_sftpDestValue = ttk.Label(self, text='{}@{}'.format(SETTINGS.SFTP_USER, SETTINGS.SFTP_HOST_URL), font=settings_font)
            self.lbl_sftpDestValue.grid(column=2, row=9, sticky=W)
        
        self.lbl_sftpPath = ttk.Label(self, text="Sftp Path: ", font=settings_font)
        self.lbl_sftpPath.grid(column=1, row=10, sticky=E)
        if SETTINGS.COPY_TO_SFTP is True and SETTINGS.SFTP_DEST_DIR is not None:
            self.lbl_sftpDestValue = ttk.Label(self, text='{}/{}'.format(SETTINGS.SFTP_DEST_DIR, SETTINGS.SFTP_DEST_FILENAME), font=settings_font)
            self.lbl_sftpDestValue.grid(column=2, row=10, sticky=W)

        # Place this Frame
        self.grid(column=0, row=2, sticky=(W,E), padx=3, pady=(3,6)) # pyright: ignore[reportArgumentType]

app = LostTimeLocalApp()

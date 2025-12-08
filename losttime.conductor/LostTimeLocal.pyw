from tkinter import Tk
from tkinter import N,S,E,W
from tkinter import font as TkFont
from tkinter import Canvas
from tkinter import ttk

from threading import Thread
from datetime import datetime

from conductor import runOnce, runForever, launchBrowser, getLostTimeWebUrl

class LostTimeLocalApp:
    def __init__(self):
        self.root = Tk()
        self.root.title('LostTime Local')
        
        f = TkFont.nametofont('TkDefaultFont')
        f.config(size=18)

        tabs = ttk.Notebook(self.root, padding=(12,12,12,12))
        tabs.grid(column=0, row=0,sticky=(N,W,E,S))

        self.homeTab = HomeTab(self.root)
        tabs.add(self.homeTab, text="Home")

        # Bind events
        self.root.bind('<<status-waiting>>', lambda e: self.homeTab.onStatus('Waiting'))
        self.root.bind('<<status-working>>', lambda e: self.homeTab.onStatus('Working'))
        self.root.bind('<<status-stopping>>', lambda e: self.homeTab.onStatus('Stopping'))
        self.root.bind('<<status-stopped>>', lambda e: self.homeTab.onStatus('Stopped'))
        self.root.bind('<<status-complete>>', lambda e: self.homeTab.onStatus('Complete'))
        self.root.bind('<<lostTimeWebUrlSet>>', self.homeTab.onNewUrl)

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
            'stop': self.handleStop
            }
        self.frm_actions = ActionsFrame(self, actionHandlers)
        self.frm_settings = SettingsFrame(self)

    def onStatus(self, status):
        self.frm_status.lbl_statusValue.config(text=status)

        if status == 'Stopped' or status == 'Complete':
            self.STOP_REQUESTED = False
            if status == 'Complete':
                self.frm_status.lbl_successTime.config(text=self._nowString())
            self._setRunOnceBtState('normal')
            self._setRunForeverBtState('normal')
            self._setStopBtState('disabled')
            self._setStatusDotColor('red')

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
    
    def onNewUrl(self, e):
        self.frm_settings.lbl_urlValue.config(text=str(getLostTimeWebUrl()))

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
        self.grid(column=0, row=1, sticky=(W,E), padx=3, pady=(3,6))

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
  
        self.bt_openBroswer = ttk.Button(self, text="Launch LostTime Web", command=self.handleLaunchBrowser)
        self.bt_openBroswer.grid(column=1, columnspan=3, row=3)

        # Place this Frame
        self.grid(column=0, row=2, sticky=(W,E), padx=3, pady=(3,6))
    
    def handleLaunchBrowser(self):
        launchBrowser()

class SettingsFrame(ttk.LabelFrame):
    def __init__(self, container):
        super().__init__(container)
        self.config(text="Settings")
        self.config(padding=8)
        self.lbl_url = ttk.Label(self, text="Web Instance: ")
        self.lbl_url.grid(column=1, row=1)
        self.lbl_urlValue = ttk.Label(self, text=str(getLostTimeWebUrl()))
        self.lbl_urlValue.grid(column=2, row=1)

        # Place this Frame
        self.grid(column=0, row=3, sticky=(W,E), padx=3, pady=(3,6))

app = LostTimeLocalApp()

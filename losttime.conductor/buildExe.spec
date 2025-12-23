# -*- mode: python ; coding: utf-8 -*-

from shutil import copy2
from os.path import join

added_files = [
    ( 'losttime.web.built', 'losttime.web.built' )
]
a = Analysis(
    ['LostTimeLocal.pyw'],
    pathex=[],
    binaries=[],
    datas=added_files,
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=['config.py'],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='LostTimeLocal',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=['losttime.web.built/favicon.ico'],
)
coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='LostTimeLocal',
)

copy2('LostTimeLocal.config.EXAMPLE', join('.', 'dist', 'LostTimeLocal'))

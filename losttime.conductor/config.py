# Use this file to configure what the conductor should do!

#########################################
#### ALWAYS REQUIRED, ALWAYS REVIEW: ####
#########################################

#### SOURCE_DIR
# Directory Where OE automatic export saves new XML Results Files
# This is windows so use \\ for directory separators.
# Specify a network share like \\\\host\\sharename
SOURCE_DIR = "C:\\Path\\to\\export\\location"
# SOURCE_DIR = "\\\\COMPUTER\\ShareName"

#### LOSTTIME_OUT_DIR
# Intermediate directory where files created by losttime are saved after creation
# before being transferred to a final location
LOSTTIME_OUT_DIR = "C:\\Path\\to\\intermediate\\location"

#### COPY_TO_FOLDER
# True to copy output to a filesystem location via `copy2`
# Configure folder and filename below
COPY_TO_FOLDER = False

#### COPY_TO_FTP
# True to copy output to a FTP location via `copy2`
# Configure folder and filename below
COPY_TO_SFTP = False


###################################
#### If COPY_TO_FOLDER == True ####
###################################

#### DEST_DIR
# Directory in which to place the output
# DEST_DIR = os.path.join(os.path.dirname(__file__), "web-public\\")

#### DEST_FILENAME
# Filename to use in DEST_DIR
# DEST_FILENAME = "index.html"


################################
#### If COPY_TO_SFTP == True ####
################################

# SFTP_HOST_URL = 'sftp.webhost.example'
# SFTP_USER = 'username'
# SFTP_PUBLIC_KEY_FILE = 'C:\\path\\to\\key.pub'
# SFTP_PRIVATE_KEY_FILE = 'C:\\path\\to\\private'
# SFTP_DEST_DIR = '/home/public'
# SFTP_DEST_FILENAME = 'index.html'

########################################################
####            General Settings                    ####
#### Don't change unless you know what you're doing ####
########################################################

# NEW_FILE_WAIT_SECONDS
# Length of time to pause before checking SOURCE_DIR for a new file to process
NEW_FILE_WAIT_SECONDS = 10

# LOSTTIME_URL
# Location to find losttime. Can be localhost or on the web depending on setup.
LOSTTIME_URL='https://losttimeorienteering.com/results'
# LOSTTIME_URL='http://localhost:3000/results'

LOSTTIME_SCORING_PRESET_ID='scoring-preset-cascade-winter-2024-single'
LOSTTIME_DOWNLOAD_RESULTS_GROUP_ID='download-results-group'
LOSTTIME_DOWNLOAD_STYLE_ID='Download-Results-Coc-Html'



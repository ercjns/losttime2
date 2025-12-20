from http.server import HTTPServer, SimpleHTTPRequestHandler
from threading import Thread
from functools import partial
from os.path import abspath, join

import os
import urllib
from http import HTTPStatus
import email.utils
import datetime

BUILT_LT_PATH = abspath('./losttime.web.built')
BUILT_LT_INDEX = join(BUILT_LT_PATH, 'index.html')

class ReactAppHandler(SimpleHTTPRequestHandler):

    """ This handler overrides the stock behavior to return the 
    index file at the root rather than a 404 on an unknown path. 
    This allows for a React App to update URLs without the server
    sending a 404.

    Changes are tagged with "ReactHandler EDIT" comments

    https://github.com/python/cpython/blob/3.14/Lib/http/server.py

    """

    def send_head(self):
        """Common code for GET and HEAD commands.

        This sends the response code and MIME headers.

        Return value is either a file object (which has to be copied
        to the outputfile by the caller unless the command was HEAD,
        and must be closed by the caller under all circumstances), or
        None, in which case the caller has nothing further to do.

        """
        path = self.translate_path(self.path)
        f = None
        if os.path.isdir(path):
            parts = urllib.parse.urlsplit(self.path)
            if not parts.path.endswith(('/', '%2f', '%2F')):
                # redirect browser - doing basically what apache does
                self.send_response(HTTPStatus.MOVED_PERMANENTLY)
                new_parts = (parts[0], parts[1], parts[2] + '/',
                             parts[3], parts[4])
                new_url = urllib.parse.urlunsplit(new_parts)
                self.send_header("Location", new_url)
                self.send_header("Content-Length", "0")
                self.end_headers()
                return None
            for index in self.index_pages:
                index = os.path.join(path, index)
                if os.path.isfile(index):
                    path = index
                    break
            else:
                return self.list_directory(path)
        ctype = self.guess_type(path)
        # ReactHandler EDIT: Removed 404 on trailing slash
        try:
            f = open(path, 'rb')
        except OSError:
            # ReactHandler EDIT: Return root index on file not found
            self.path = ''
            path = self.translate_path(self.path)
            for index in self.index_pages:
                index = os.path.join(path, index)
                if os.path.isfile(index):
                    path = index
                    break
            ctype = self.guess_type(path)
            try:
                f = open(path, 'rb')
            except:
                return None

        try:
            fs = os.fstat(f.fileno())
            # Use browser cache if possible
            if ("If-Modified-Since" in self.headers
                    and "If-None-Match" not in self.headers):
                # compare If-Modified-Since and time of last file modification
                try:
                    ims = email.utils.parsedate_to_datetime(
                        self.headers["If-Modified-Since"])
                except (TypeError, IndexError, OverflowError, ValueError):
                    # ignore ill-formed values
                    pass
                else:
                    if ims.tzinfo is None:
                        # obsolete format with no timezone, cf.
                        # https://tools.ietf.org/html/rfc7231#section-7.1.1.1
                        ims = ims.replace(tzinfo=datetime.timezone.utc)
                    if ims.tzinfo is datetime.timezone.utc:
                        # compare to UTC datetime of last modification
                        last_modif = datetime.datetime.fromtimestamp(
                            fs.st_mtime, datetime.timezone.utc)
                        # remove microseconds, like in If-Modified-Since
                        last_modif = last_modif.replace(microsecond=0)

                        if last_modif <= ims:
                            self.send_response(HTTPStatus.NOT_MODIFIED)
                            self.end_headers()
                            f.close()
                            return None

            self.send_response(HTTPStatus.OK)
            self.send_header("Content-type", ctype)
            self.send_header("Content-Length", str(fs[6]))
            self.send_header("Last-Modified",
                self.date_time_string(fs.st_mtime))
            self.end_headers()
            return f
        except:
            f.close()
            raise

    def log_message(self, format, *args):
        # ReactHandler EDIT: remove logs
        return
        

def ServeInBackground():
    # backgrounding adapted from 
    # https://gist.github.com/kwk/5387c0e8d629d09f93665169879ccb86

    handler = partial(ReactAppHandler, directory=BUILT_LT_PATH)
    httpd = HTTPServer(('localhost', 0), handler, False)
    httpd.server_bind()
    address = "http://%s:%d" % ('localhost', httpd.server_port)
    httpd.server_activate()
    
    def serve_forever(httpd):
        with httpd:  # to make sure httpd.server_close is called
            httpd.serve_forever()

    thread = Thread(target=serve_forever, args=(httpd, ))
    thread.daemon = True
    thread.start()

    return address
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

from conductor import PUBLIC_DIR
PUBLIC_PATH = PUBLIC_DIR
# PUBLIC_PATH='./web-public/'

class CustomHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, directory=PUBLIC_PATH, **kwargs)

def run(server_class=ThreadingHTTPServer, handler_class=CustomHandler):
    server_address = ('', 8080)
    httpd = server_class(server_address, handler_class)
    httpd.serve_forever()

run()
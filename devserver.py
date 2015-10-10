#!/usr/bin/env python3

import os

import tornado.ioloop
import tornado.web
import tornado.autoreload
from tornado.log import enable_pretty_logging

class StaticHandler (tornado.web.StaticFileHandler):
  def should_return_304 (self):
    return False
    
PATH = os.path.abspath(os.path.dirname(__file__))
application = tornado.web.Application([
  (r"/(.*)", StaticHandler, {'path': PATH}),
])

if __name__ == "__main__":
  enable_pretty_logging()
  tornado.autoreload.start()
  
  application.listen(8000, address="127.0.0.1")
  tornado.ioloop.IOLoop.instance().start()
  
#!/usr/bin/env python3

import os
import subprocess

import tornado.ioloop
import tornado.web
import tornado.autoreload
from tornado.log import enable_pretty_logging

PATH = os.path.abspath(os.path.dirname(__file__))

class StaticHandler (tornado.web.StaticFileHandler):
  def should_return_304 (self):
    return False
    
class LessHandler (tornado.web.RequestHandler):
  def should_return_304 (self):
    return False
    
  def get (self):
    self.set_header("Content-Type", 'text/css')
    
    less_path = os.path.join(PATH, 'less', 'nracer.less')
    out_path = os.path.join(PATH, 'less', 'nracer.css')
    
    subprocess.call("lessc {} {}".format(less_path, out_path), shell=True)
    
    with open(out_path, 'r') as fh:
      self.write(fh.read())
      
application = tornado.web.Application([
  (r"/less/nracer.css", LessHandler),
  (r"/(.*)", StaticHandler, {'path': PATH}),
])

if __name__ == "__main__":
  enable_pretty_logging()
  tornado.autoreload.start()
  
  application.listen(8000, address="127.0.0.1")
  tornado.ioloop.IOLoop.instance().start()
  
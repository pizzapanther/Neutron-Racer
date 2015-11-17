#!/usr/bin/env python3

import os
import time
import subprocess

import tornado.ioloop
import tornado.web
import tornado.autoreload
from tornado.log import enable_pretty_logging

from jinja2 import Template

import nracer_builder as builder

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
      
class IndexHandler (LessHandler):
  def get (self):
    self.set_header("Content-Type", 'text/html')
    
    index_path = os.path.join(PATH, 'index.html')
    
    with open(index_path, 'r') as fh:
      self.write(fh.read())
      
class SWorkerHandler (LessHandler):
  def get (self):
    self.set_header("Content-Type", 'text/javascript')
    files = [file.replace("./", "/") for file in builder.find_files()]
    
    out_path = os.path.join(PATH, 'service-worker.js')
    tpl_path = os.path.join(PATH, 'service-worker.tpl.js')
    
    with open(tpl_path, 'r') as tpl:
      template = Template(tpl.read())
      out = template.render(
        files = files,
        version = time.mktime(time.gmtime())
      )
      
      with open(out_path, 'w') as fh:
        fh.write(out)
        
      self.write(out)
      
application = tornado.web.Application([
  (r"/less/nracer.css", LessHandler),
  (r"/service-worker.js", SWorkerHandler),
  (r"/", IndexHandler),
  (r"/(.*)", StaticHandler, {'path': PATH}),
])

if __name__ == "__main__":
  enable_pretty_logging()
  tornado.autoreload.start()
  
  application.listen(8000, address="127.0.0.1")
  tornado.ioloop.IOLoop.instance().start()
  
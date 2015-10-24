#!/usr/bin/env python

import os
import subprocess

def run ():
  to_zip = []
  
  for root, dirs, files in os.walk('.'):
    for file in files:
      path = os.path.join(root, file)
      
      if 'material-design-icons' in path:
        if 'iconfont' not in path:
          continue
          
      elif 'angular-material' in path:
        if 'demos' in path or 'modules' in path:
          continue
          
      elif 'nracer.zip' in path or '.git' in path:
        continue
        
      to_zip.append(path)
      
  cmd = 'zip nracer.zip'
  
  for path in to_zip:
    cmd += ' ' + path
    
  subprocess.call('rm nracer.zip', shell=True)
  subprocess.call(cmd, shell=True)
  
if __name__ == '__main__':
  run()
  
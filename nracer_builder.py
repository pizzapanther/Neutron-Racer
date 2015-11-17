#!/usr/bin/env python

import os
import subprocess

EXCLUDES = ['nracer.zip', '.git', '.py', '.less', '.md', 'service-worker', 'index.html', '.txt']

def find_files ():
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
          
      else:
        skip = False
        for exclude in EXCLUDES:
          if exclude in path:
            skip = True
            break
            
        if skip:
          continue
          
      to_zip.append(path)
      
  return to_zip
  
def run ():
  to_zip = find_files()
  
  cmd = 'zip nracer.zip'
  
  for path in to_zip:
    cmd += ' ' + path
    
  subprocess.call('rm nracer.zip', shell=True)
  subprocess.call(cmd, shell=True)
  
if __name__ == '__main__':
  run()
  
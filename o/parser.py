#!/usr/local/bin/python

import sys

if __name__ == "__main__":
  try:
    infile = sys.argv[1]
    outfile = sys.argv[2]
  except Exception as e:
    print 'error command line param not found %s' % e
    sys.exit(1)
    
  print 'the infile is %s' % infile
  print 'the outfile is %s' % outfile


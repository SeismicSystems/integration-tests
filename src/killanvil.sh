#!/bin/bash
## catch the exit code & apply logic accordingly
function finish() {
  # Your cleanup code here
  rv=$?
  echo "the error code received is $rv"
  if [ $rv -eq 137 ];
  then
    echo "It's a manual kill, attempting another run or whatever"
  elif [ $rv -eq 0 ];
  then
    echo "Exited smoothly"
  else
    echo "Non 0 & 137 exit codes"
    exit $rv
  fi
}
port=$1
echo "Killing the previous process on port $port"
kill -9 $(lsof -ti:$port)
trap finish EXIT
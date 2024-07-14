#!/bin/bash

LOGFILE="run-angular-project.log"

echo "Installing Node modules..." | tee -a $LOGFILE
npm install 2>&1 | tee -a $LOGFILE

if [ ${PIPESTATUS[0]} -ne 0 ]; then
  echo "Failed to install Node modules." | tee -a $LOGFILE
  exit 1
fi

echo "Setting environment variables..." | tee -a $LOGFILE
export NODE_ENV=development
export API_URL=http://localhost:3000/

echo "Running Angular development server..." | tee -a $LOGFILE
ng serve --host 0.0.0.0 --port 4200 2>&1 | tee -a $LOGFILE

if [ ${PIPESTATUS[0]} -ne 0 ]; then
  echo "Failed to start Angular development server." | tee -a $LOGFILE
  exit 1
fi

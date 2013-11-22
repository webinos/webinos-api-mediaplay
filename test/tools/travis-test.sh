#! /bin/bash
################################################################################
#  Code contributed to the webinos project
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# Copyright 2013 University of Oxford, ISMB
################################################################################

# Fail if anything fails
set -e

# Get and set some directories
export API_NAME=webinos-api-mediaplay
export API_DIR=`pwd`
export TOOLS_DIR=$API_DIR/test/tools/
export TMP=~/tmp
export WEBINOS_PZP_DIR=$TMP/webinos-pzp

# Assume we've already been installed by travis, but lets do it anyway
npm install
echo "Installed the Mediaplay api" 

# Link this module
npm link
echo "Linked the Mediaplay api" 

# move to a temporary directory 
mkdir -p $TMP
cd $TMP
echo "Made directory $TMP " 

# Empty it, and check out the PZP
if [ -d "$WEBINOS_PZP_DIR" ]; then
  rm -rf $WEBINOS_PZP_DIR
  echo "Deleted directory $WEBINOS_PZP_DIR"
fi
git clone https://github.com/webinos/webinos-pzp.git $WEBINOS_PZP_DIR
cd $WEBINOS_PZP_DIR

# install the PZP and save dependencies
npm install --save-dev
echo "Installed the PZP" 

#link to the API
npm link $API_NAME
echo "Linked $API_NAME " 

#Start the PZP, grab its PID and wait 5 seconds
node ./webinos_pzp.js &
export PZP_PID=$!
echo "Found PID: $PZP_PID "
sleep 5
echo "Started the PZP and waited" 

# run the node test script and wait 2 seconds
set +e
node $TOOLS_DIR/zombie-test.js
export TEST_RESULT=$?
sleep 2

# kill the PZP
kill -9 $PZP_PID

if [ $TEST_RESULT -eq 0 ]; then
	echo "TEST PASSED"
else
	echo "TEST FAILED"
fi

exit $TEST_RESULT
#! /bin/bash
#build @spm build, First, you should install spm and spm-build:
echo "`spm build` executing..."
spm build

CWD=$(pwd)
# we can't move cd '../../tools/' to node ../../tools/deploy-module.js
cd ../../tools/

node deploy-module.js -p $CWD
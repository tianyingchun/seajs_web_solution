#! /bin/bash
#build @spm build, First, you should install spm and spm-build:
echo "`spm build` executing..."
spm build

CWD=$(pwd)

cd ../../tools/

node deploy.js -p $CWD
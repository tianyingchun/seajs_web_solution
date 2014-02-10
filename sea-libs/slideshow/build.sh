#! /bin/bash
# build @spm build, First, you should install spm and spm-build:
#echo "`spm build` executing..."
#spm build

#echo "deploy executing..."
#echo
## delete current plugin.
#rm -rf ../../sea-modules/sea-libs/slideshow/1.0.0
#mkdir ../../sea-modules/sea-libs/slideshow/1.0.0
#cp dist/*.* ../../sea-modules/sea-libs/slideshow/1.0.0
#echo 
#echo " deploy to seajs-modules/sea-libs/slideshow/1.0.0"
#echo 
CWD=$(pwd)
node ../../tools/deploy_plugin.js -p $CWD
#! /bin/bash

# declare the deploy directory.
deploypath="../deploy/"

# echo ${deploypath}
# -t deploy target directory, -d cutomized deploy module. -l debug current is debug model.
# 
# build style components.
node tools/deploy-project.js -t ${deploypath} -d "../static" -l 'debug'
# build another style components.
node tools/deploy-project.js -t ${deploypath} -d "../static2" -l 'debug'
# third one.
#! /bin/bash

# declare the deploy directory.
deploypath="../deploy/"

# echo ${deploypath}
# -t deploy target directory, -d cutomized deploy module.
# 
# build style components.
node tools/deploy-project.js -t ${deploypath} -d "../static"
# build another style components.
node tools/deploy-project.js -t ${deploypath} -d "../static2"
# third one.
#! /bin/bash

# declare the deploy directory.
deploypath="../deploy/"

# echo ${deploypath}
# -t deploy target directory, -d cutomized deploy module. -l debug current is debug model.
node tools/deploy-project.js -t ${deploypath} -d "../static/" -l 'debug'
#! /bin/bash

# declare the deploy directory.
deploypath="./deploy/"  #../deploy  or any available directory path.

# echo ${deploypath}
# -t deploy target directory, -d cutomized deploy modules.
# 
# build style components.
node tools/deploy-project.js -t ${deploypath} -d '["./sitetheme_1", "./sitetheme_2","./scripts_test","./external","./"]'

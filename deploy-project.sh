#! /bin/bash

# declare the deploy directory.
deploypath="../built/"  #../deploy  or any available directory path.

# echo ${deploypath}
# -t deploy target directory, -d cutomized deploy modules.
# 
# build style components.
node tools/deploy-project.js -t ${deploypath} -d '["../", "../content", "../app","../app/styles"]'

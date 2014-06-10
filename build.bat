
REM build @spm build, First, you should install spm and spm-build:
REM Note: you must copy this file into your each seajs costomized module directory
REM e.g. sea-libs/slideshow/build.sh/build.bat
ECHO "`spm build` executing..."
spm build

REM node location
SET NODE=node.exe

SET CWD=%~dp0

REM we can't move cd '../../tools/' to node ../../tools/deploy-module.js
CD ../../tools/

%NODE% deploy-module.js -p %CWD%
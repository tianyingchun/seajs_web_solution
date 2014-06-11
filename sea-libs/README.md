### the useage for sea-libs

- the sea-libs folder will be used to store the third-part seajs plugin modules 
- we can use `spm` command to seach and install these public CMD plugin/

#### The normal used command line 

- > `spm install -d ./ seajs`   (will automatically install laster version seajs module, -d indicates install it into current directory[default directory is sea-modules]
- > `spm search jquery`   (will list all matched sea module related of jquery)
- > `spm install -d ./ jquery@1.10.2` (Will install jquery 1.10.2 into current directory)
- > `spm`                 (will list all useage for spm)

#### while you have installed all seajs module you need, you need to also build and deploy these modules into /sea-modules/*, cauase of deploy-project.sh/bat will automatically deploy all sea modules(include third-part, your comtomized plugin) into ./deploy/*


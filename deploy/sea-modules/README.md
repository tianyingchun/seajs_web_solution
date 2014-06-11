===================================================================
### the basic usage for spmjs command
=================================================================== 
- http://docs.spmjs.org/doc/

- $ npm install spm -g          (version 3.0.1, $ spm -V)
- $ npm install spm-init -g     (version 0.5.2, $ spm-init -V)   --or npm update spm-init -g
- $ npm install spm-build -g    (version 0.3.15, $ spm-build -V)   --or npm update spm-build -g
- $ npm install spm-deploy -g   (version 0.2.4, $ spm-deploy -V) or  spm plugin install deploy 
- $ spm install -d ./ jquery@1.10.2

===================================================================
### the guide for install third-part seajs plugin libaray module
===================================================================

- Know abount how to use the basic command for `spm` and can seach and install these public CMD plugin/

- > cd /sea-modules (in this case, we should install seajs lib module into /sea-modules)

- > `spm install -d ./ seajs` (automatically install laster version seajs module, -d indicate install into current directory, default is `sea-modules`)

- > `spm search jquery`   (will list all matched sea module related of jquery)

- > `spm install -d ./ jquery@1.10.2` (Will install jquery 1.10.2 into current directory)
  the sea-libs folder will be used to store the third-part seajs plugin modules 

- > `spm`                 (will list all useage for spm)


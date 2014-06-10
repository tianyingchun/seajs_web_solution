'use strict';

/**
 * Designed to automatically deploy all dependant javascript seajs modules
 * into project specific location. Note: make sure that you have do module deployed first!
 * we will first deploy sea-modules folder to project location.
 * then will deploy the project javascript folder...e.g. /static/ it's our external costomized assets
 */
var program  = require('commander')
  , log      = require("./node-libs/log")
  , colors   = require("ansicolors")
  , path     = require("path")
  , fs       = require("fs-extra")
  , minifier = require("./node-libs/minify");

// command parameters.
program.version('0.0.1')
    .option('-t, --target [type]', 'the dintination directory used to store deployed files.')
    .option('-d, --deploy [type]', 'the module path which will be deploy for this project! ')
    .parse(process.argv);

// node js process working directory.
var cwd = process.cwd()
  //read configuration parameters.
  , config_deploy_source = program.deploy
  , config_deploy_target = program.target
  //deploy target base directory e.e. /deploy/
  , deploy_target_base = path.join(cwd, config_deploy_target)
  //the destination dir of sea-modules deployment.
  , deploy_seamodule_target = path.join(deploy_target_base, "sea-modules")
  // the source dir of sea-module plugins.
  , deploy_seamodule_source = path.join(cwd, "sea-modules");
 

// the build engine start
// start to deploy site style theme modules and seajs plugin modules for current application.
(function() {
    // remove seamodule dir if exist, and re-deploy seamodules to destination dir.
    fs.exists(deploy_seamodule_target, function(exist) {
      if (exist) {
        log.writeln("remove existed seajs-modules directory in ", config_deploy_target);
        fs.removeSync(deploy_seamodule_target);
      }
      fs.mkdirs(deploy_seamodule_target, function(err) {
        if (err) return log.error(err);

        log.writeln("created exist seajs-module`", config_deploy_target, "` directory success! ");
        // is an regex instance.
        var filter = null; 
        // copy seajs modules to target deploy directory.
        fs.copy(deploy_seamodule_source, deploy_seamodule_target, filter, function(err) {
          if (err) return log.error(err);
          log.writeln("deploy sea-modules to directory `" + deploy_seamodule_target + "` successfully! ");
          // compile our customized components e.g. "./sitetheme_1" , "./sitetheme_1", "../external"
          // Note: cause of we use seajs module pattern to encapsulte all javascript behavior module, in compile compoents phase,
          // we only deal with static files and styles files.
          compileAllComponents(config_deploy_source);
        });
      });
    }); 
})();


function isArray(obj) {
    var toString = Object.prototype.toString;
    return toString.call(obj) === "[object Array]";
}

function compileAllComponents(build_pathes) {
  log.debug("build components->", build_pathes);
  var all_components = JSON.parse(build_pathes);
  if (!isArray(all_components)) {
    return log.error("the deploy command parameter `-d` should be an array string");
  }
  // loop all components.
  compileComponent(all_components);
}

function compileComponent(all_components) {
  var build_path = all_components.shift();
  if (!build_path) {
    return log.writeln("all components build has been done!");
  }
  log.writeln("start to build `", build_path,"`");
  //he base directory of current customized component.
  var component_basedir = path.join(cwd, build_path)
    //the deploy config file path for current customized component.
    , deployConfigPath = component_basedir + "/deploy.json";

    fs.exists(deployConfigPath, function(exist) {
      if (!exist) {
        log.error("Can't find the customized component config:  `" + deployConfigPath + "`");
      } else {
        // Get theonfig data from config file. 
        var deployConfig = fs.readJsonSync(deployConfigPath)
          // Get the target base dir for customized component module.
          , component_target_base = path.join(deploy_target_base, deployConfig.target)
          // Get assets config node info.
          , assets = deployConfig.assets
          // Get customized component name.
          , componentName = deployConfig.name
          // Get if force ignore css compile.
          , ignoreCssCompile = deployConfig.ignoreCss || false;
         
        // Remove existed deployed components.
        fs.removeSync(component_target_base);

        // 1. Deploy all assets folders defined in deploy.json->assets: ["imagse/", "libs/"..]
        if (assets && isArray(assets)) {
          for (var i = 0; i < assets.length; i++) {
            var asset_deploy_target = path.join(component_target_base, assets[i]);
            var asset_deploy_source = path.join(component_basedir, assets[i]);

            // Creating deploy asset directory.
            fs.mkdirsSync(asset_deploy_target);
            // Copy assets into target folder.
            fs.copySync(asset_deploy_source, asset_deploy_target);

            log.writeln("copy `" + build_path + "/" + assets[i] + "` to `" + path.join(config_deploy_target, componentName, assets[i]) + "` successfully ");
          };
        } else {
          log.error("the `assets` node in deploy.json must be a array!");
        }
        // 2. Build/deploy styles
        if (!ignoreCssCompile) {
          var style_minify_opts = {
              destdir: component_target_base,
              output: deployConfig.output
          };
          minifier.attachEvent("compiledone", function (message){
            log.writeln("build_path has been compiled successfully! ", message);
            compileComponent(all_components);
          });
          minifier.minify(deployConfig.name, component_basedir, style_minify_opts);
        } else {
          log.warn("the ignore style compile config found, skip compile css files!");
           compileComponent(all_components);
        }

       // 3. TODO build/deploy javascript.
    }
  });
}

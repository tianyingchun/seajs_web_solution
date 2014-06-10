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

// Node working directory.
var cwd = process.cwd();

// Read configuration parameters.
var config_deploy_source = program.deploy;
var config_deploy_target = program.target;

// Deploy target base directory e.e. /deploy/
var deploy_target_base = path.join(cwd, config_deploy_target);

// the destination dir of sea-modules deployment.
var deploy_seamodule_target = path.join(deploy_target_base, "sea-modules");

// the source dir of sea-module plugins.
var deploy_seamodule_source = path.join(cwd, "sea-modules");

function isArray(obj) {
    var toString = Object.prototype.toString;
    return toString.call(obj) === "[object Array]";
}

function compileComponent(build_path) {
    // The base directory of current customized component.
    var component_basedir = path.join(cwd, build_path);

    // The deploy config file path for current customized component.
    var deployConfigPath = component_basedir + "/deploy.json";

    fs.exists(deployConfigPath, function(exist) {
        if (!exist) {
            log.error("Can't find the customized component config:  `" + deployConfigPath + "`");
        } else {
            log.writeln("To start building `" + build_path + "` ");
            // Get the config data from config file. 
            var deployConfig = fs.readJsonSync(deployConfigPath);
            // Get the target base dir for customized component module.
            var component_target_base = path.join(deploy_target_base, deployConfig.name);

            // Remove exist cdeployed components.
            fs.removeSync(component_target_base);
            // Get assets config node info.
            var assets = deployConfig.assets;
            // Get customized component name.
            var componentName = deployConfig.name;
            // Get if force ignore css compile.
            var ignoreCssCompile = deployConfig.ignoreCss || false;
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
            if (!ignoreCssCompile) {
                // 2. Build/deploy styles
                var style_minify_opts = {
                    destdir: component_target_base,
                    output: deployConfig.output
                };
                minifier.minify(deployConfig.name, component_basedir, style_minify_opts);
            }

            // 3. TODO build/deploy javascript.

        }
    });
}
// the build engine start
(function() {
    // Go to do an project deployment.
    // 1. first step, remove seamodule dir if exist, and re-deploy seamodules to destination dir.
    fs.removeSync(deploy_seamodule_target);
    fs.mkdirs(deploy_seamodule_target, function(err) {
        if (err) return log.error(err);
        var filter = null; //  is an regex instance.
        // copy files
        fs.copy(deploy_seamodule_source, deploy_seamodule_target, filter, function(err) {
            if (err) return log.error(err);
            log.writeln("deploy sea-modules to directory `" + deploy_seamodule_target + "` successfully! ");

            // 2. second step, compile our customized components e.g. "../static" , "../static1", "../external"
            // Note: cause of we use seajs module pattern to encapsulte all javascript behavior module, in compile compoents phase,
            // we only deal with static files and styles files.
            compileComponent(config_deploy_source);
        });
    });
})();

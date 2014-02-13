/**
 * Designed to automatically deploy all dependant javascript seajs modules
 * into project specific location. Note: make sure that you have do module deployed first!
 * we will first deploy sea-modules folder to project location.
 * then will deploy the project javascript folder...e.g. /static/ it's our external costomized assets
 */
var program = require('../node_modules/commander');
var grunt = require('../node_modules/grunt');
var path = require("path");
var fs = require('fs-extra');
var minifier = require("./node-libs/minify");
// command parameters.
program
    .version('0.0.1')
    .option('-t, --target [type]', 'the dintination directory used to store deployed files.')
    .option('-d, --deploy [type]', 'the module path which will be deploy for this project! ')
    .option('-l, --debug [type]', 'sepecific current publish module debug or live')
    .parse(process.argv);

var cwd = process.cwd();
var config_deploy_source = program.deploy;
var config_target = program.target;

// customized build styletheet components.
var custom_deploy_path = config_deploy_source;

var deploy_target_base_dir = path.join(cwd, config_target);

// sea-modules deploy location.
var deploy_sea_module_dir = path.join(deploy_target_base_dir, "sea-modules");

// if current is debug model.
var is_debug = program.debug == "debug" ? true : false;

//1.  copy configuration-matched seajs-modules into deploy directory.
var sea_module_deploy_target_path = path.join(cwd, "sea-modules");

function isArray(obj) {
    var toString = Object.prototype.toString;
    return toString.call(obj) === "[object Array]";
}

// create directory.
fs.removeSync(deploy_sea_module_dir);
fs.mkdirs(deploy_sea_module_dir, function(err) {
    if (err) return console.error(err);
    var filter = null; //  is an regex instance.
    // copy files
    fs.copy(sea_module_deploy_target_path, deploy_sea_module_dir, filter, function(err) {
        if (err) return console.error(err);
        grunt.log.write("copy sea-modules to project deploy directory `" + deploy_sea_module_dir + "` successfully! ").ok();
    });
});

function build_customized_component(build_path) {

    var cus_proj_build_dir = path.join(cwd, build_path);

    var build_path_deploy = cus_proj_build_dir + "/deploy.json";
    console.log("build_path_deploy:", build_path_deploy);
    fs.exists(build_path_deploy, function(exist) {
        if (!exist) {

            grunt.fail.fatal("Cound not find the customized build directory `" + build_path_deploy + "`");
        } else {

            grunt.log.write("start building..`" + build_path + "` ").ok();

            // deal with deploy.json["assets"];
            var deploy_json = fs.readJsonSync(build_path_deploy);

            var _deploy_target_path = path.join(deploy_target_base_dir, deploy_json.name);

            var assets = deploy_json.assets;

            // remove targe deploy dir.
            fs.removeSync(_deploy_target_path);

            if (assets && isArray(assets)) {
                for (var i = 0; i < assets.length; i++) {

                    var asset_deploy_target = path.join(_deploy_target_path, assets[i]);
                    var asset_deploy_source = path.join(cus_proj_build_dir, assets[i]);

                    // creating deploy component directory.
                    fs.mkdirsSync(asset_deploy_target);

                    fs.copySync(asset_deploy_source, asset_deploy_target);

                    grunt.log.write("copy `" + build_path + "/" + assets[i] + "` to `" + path.join(config_target, assets[i]) + "` successfully ").ok();
                };
            } else {
                grunt.fail.fatal("Deploy json `assets` node must be a array!");
            }

            // deal with styles.
            // style build arguments.
            var build_opts = {
                destdir: _deploy_target_path,
                output: deploy_json.output
            };
            minifier.minify(deploy_json.name, cus_proj_build_dir, build_opts);

            // TODO deal with javascript.

        }
    });
}

// build project custmoized style folder. we can't focus on javascript build here, 
// because we should use seajs module plugin pattern to encapsulate all javascript  libaray.
build_customized_component(custom_deploy_path);

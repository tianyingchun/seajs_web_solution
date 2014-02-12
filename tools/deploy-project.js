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
// command parameters.
program
	.version('0.0.1')
	.option('-t, --target [type]', 'the dintination directory used to store deployed files.')
	.option('-d, --deploy [type]', 'the module path which will be deploy for this project! ')
	.option('-l, --debug [type]', 'sepecific current publish module debug or live')
	.parse(process.argv);

var cwd = process.cwd();
// customized deploy folder.
var custom_deploy_path = program.deploy;
var deploy_directory = path.join(cwd, program.target,"sea-modules");
var is_debug = program.debug == "debug"? true: false;
//1.  copy configuration-matched seajs-modules into deploy directory.
var sea_module_deploy_target_path = path.join(cwd,"sea-modules");
// create directory.
fs.mkdirs(deploy_directory, function (err) {
	if (err) return console.error(err);
	var filter =null;//  is an regex instance.
	// copy files
	fs.copy(sea_module_deploy_target_path, deploy_directory, filter, function (err) {
		if (err) return console.error(err);
		grunt.log.write("copy sea-modules to project deploy directory `"+deploy_directory+"` successfully! ").ok();
	});
});
// build project custmoized style folder. we can't focus on javascript build here, 
// because we should use seajs module plugin pattern to encapsulate all javascript  libaray.
var cus_proj_build_dir = path.join(cwd, custom_deploy_path, "/deploy.json");
fs.exists(cus_proj_build_dir, function (exist) {
	if(!exist) { 
		grunt.fail.fatal("Cound not find the customized build directory `"+ cus_proj_build_dir+"`");
	} else {
		console.log("testing...");
	}
	
});

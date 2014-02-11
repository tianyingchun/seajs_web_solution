/**
 * Designed to build/deploy seajs modules.
 * Make sure that you have install spm, grunt node plugins.
 * npm install in root directory package.js devDependencies
 */
var program = require('../node_modules/commander');
var grunt = require('../node_modules/grunt');
var path = require("path");
// var fs = require("fs");
var fs = require('fs-extra');
// var fs_extend = require("./fs_extend.js");
program
	.version('0.0.1')
	.option('-p, --path [type]', 'current seajs module pwd directory!')
	.option('-m, --module [type]', 'deploy specific module')
	.parse(process.argv);

// from command line arguments get module name -m.
var sea_lib_path = program.path;
// print sea lib path.
grunt.log.writeln("1. Sea-lib module path: `", sea_lib_path, "`");

var packagePath = sea_lib_path + "/package.json";

// create module dir.
var createModuleDir = function(path, callback) {
	fs.mkdirs(path, function(err) {
		if (err) {
			console.log(err);
		} else {
			grunt.log.write('5. Directory `' + path + '` created ').ok();
			if (callback) callback();
		}
	});
};
// http://jprichardson.github.com/node-fs-extra/
var copyFiles2Dir = function(target, dist) {
	var cwd = process.cwd();
	// convert relative path into absolute path.
	dist = path.join(cwd, dist);
	// console.log("target",target);
	// console.log("dist", dist);
	fs.copy(target, dist, function(err) {
		if (err) return console.error(err);
		grunt.log.write("6. deploy to '" + dist + "' successfully! ").ok();
	});
};
fs.exists(packagePath, function(exist) {
	if (exist) {
		// get package.json, covert it into packageJson
		var packageJson = grunt.file.readJSON(packagePath);
		var module_name = packageJson.name;
		var module_version = packageJson.version;
		var module_family = packageJson.family;
		grunt.log.write("2. Read package.json info: ", module_name, module_version, module_family, " ").ok();
		// delete directory created by current version
		var sea_module_path = path.join("..", "sea-modules", module_family, module_name, module_version);
		grunt.log.writeln("3. Sea module relative path:", sea_module_path);
		fs.exists(sea_module_path, function(exist) {
			if (exist) {
				// delete it first
				fs.remove(sea_module_path, function(err) {
					if (err) throw err;
					grunt.log.write('4. Deleted directory ' + module_name + '->`' + module_version + '`successfully! ').ok();
					createModuleDir(sea_module_path, function() {
						// deploy dist files.
						copyFiles2Dir(path.join(sea_lib_path, "dist"), sea_module_path);
					});
				});
			} else {
				createModuleDir(sea_module_path, function() {
					// deploy dist files.
					copyFiles2Dir(path.join(sea_lib_path, "dist"), sea_module_path);
				});
			}
		});
	} else {
		grunt.fail.fatal("could not find the `package.json` ");
	}
});
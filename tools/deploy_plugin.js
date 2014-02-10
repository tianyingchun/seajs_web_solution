/**
 * Designed to build/deploy seajs modules.
 * Make sure that you have install spm, grunt node plugins.
 * npm install in root directory package.js devDependencies
 */
var program = require('../node_modules/commander');
var grunt = require('../node_modules/grunt');
var path = require("path");
var fs = require("fs");
program
  .version('0.0.1')
  .option('-p, --path [type]', 'current seajs module pwd directory!')
  .option('-m, --module [type]', 'deploy specific module')
  .parse(process.argv);

// from command line arguments get module name -m.
var sea_module_path = program.path;
console.log(sea_module_path)
var packagePath = sea_module_path+"/package.json";

fs.exists(packagePath, function (exist) {
	if(exist) {
		// get package.json, covert it into packageJson
		var packageJson = grunt.file.readJSON(packagePath);
		var module_name = packageJson.name;
		var module_version = packageJson.version;
		var module_family = packageJson.family;
		grunt.log.write("testing...", module_name, module_version,module_family, " ").ok();
	} else {
		grunt.fail.fatal("couldn't find the `package.json` ");
	}
});


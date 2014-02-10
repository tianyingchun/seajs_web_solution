module.exports = function(grunt) {
<<<<<<< HEAD
	// Project configuration.
    grunt.initConfig({
  	    pkg: grunt.file.readJSON('package.json'),
  	    uglify: {
  	        options: {
  	        	banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
  	        },
  	        build: {
  	        	src: 'src/<%= pkg.name %>.js',
  	        	dest: 'build/<%= pkg.name %>.min.js'
  	        }
  	    }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify'); 

    // Custom task - 'module' (business logic modules)
    grunt.registerTask('modules', 'compile our customized business logics task', function () {
    	grunt.log.write("compiling module `", this.name,"`...");
    });
    // Custom task - 'sealib' (stable ui widget plugins)
    grunt.registerTask('sealibs', []);
    // Default task(s).
    grunt.registerTask('default', ['uglify']);
=======
	
>>>>>>> 1fca105... initialize project folders
};
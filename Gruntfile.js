module.exports = function(grunt) {
	// Project configuration.
    grunt.initConfig({
  	    pkg: grunt.file.readJSON('package.json'),
        //transport plugin.
        transport: {
            options: {
                paths: ["sea-modules"] // where is the module, default value is ['sea-modules']
            },

        },
        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                separator: ';'
            },
            dist: {
                // the files to concatenate
                src: ['src/**/*.js'],
                // the location of the resulting JS file
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
  	    uglify: {
  	        options: {
  	        	banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
  	        },
  	        build: {
  	        	src: 'src/<%= pkg.name %>.js',
  	        	dest: 'build/<%= pkg.name %>.min.js'
  	        }
  	    },
        clean:  {
            build:[".build"]// clean `.build` directory
        }
    });

    grunt.loadNpmTasks('grunt-cmd-transport'); 
    // grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-cmd-concat');
    // grunt.loadNpmTasks('grunt-contrib-qunit');
    // grunt.loadNpmTasks('grunt-contrib-watch');  
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');  
    grunt.loadNpmTasks('grunt-contrib-clean'); 

    // Custom task - 'module' (business logic modules)
    grunt.registerTask('modules', 'compile our customized business logics task', function () {
    	grunt.log.write("compiling module `", this.name,"`...");
    });
    // Custom task - 'test'
    grunt.registerTask('test', 'finished build...', function () {
        grunt.log.write("build finished!");
    });
    // Custom task - 'sealib' (stable ui widget plugins)
    grunt.registerTask('sealibs', []);
    // Default task(s).
    grunt.registerTask('default', ['transport','concat','uglify','clean','test']);
};
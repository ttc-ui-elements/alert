module.exports = function (grunt) {
	// Project configuration.
	grunt.initConfig({
		folder: {
			src: 'src',
			dist: 'dist',
			demo: 'demo',
		},

		// Compile Sass source file to CSS
		sass: {
			dist: {
				options: {
					precision: '5',
					sourceMap: false // SHOULD BE FALSE FOR DIST
				},
				files: {
					'<%= folder.dist %>/bs4-alert.css': '<%= folder.src %>/bs4-alert.scss'
				}
			}
		},
		// Let's minify that css file
		cssmin: {
			allCss: {
				files: [{
					expand: true,
					matchBase: true,
					ext: '.min.css',
					cwd: 'dist',
					src: ['*.css', '!*.min.css'],
					dest: 'dist'
				},
					{
						expand: true,
						matchBase: true,
						ext: '.min.css',
						cwd: 'dist',
						src: ['*.css', '!*.min.css'],
						dest: 'demo'
					},
				]
			}
		},
		// Let's deal with the javascript
		browserify: {
			dist: {
				options: {
					transform: [["babelify", {
						"presets": ["babili", 'es2015']
					}]],
				},
				src: ['<%= folder.src %>/alert.js'],
				dest: '<%= folder.dist %>/alert.min.js',
			}
		}
	});

	// Load required modules
	// grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-sass');


	grunt.task.run(['browserify:dist']);
	// grunt.task.run(['uglify:allJs']);
	grunt.task.run(['sass:dist']);
	grunt.task.run(['cssmin:allCss']);

	grunt.registerTask('default', function () {

		console.log('Build the custom Element');

		var banner = '\n\
<!--\n\
`bootstrap-custom - elements - alert`\n\
\n\
Bootstrap Alerts as custom elements\n\
\n\
@demo demo/index.html\n\
-->\n\
\n\
';

		if (!grunt.file.exists('dist/alert.min.js')) {
			return false;
		}

		tmpJs = grunt.file.read('dist/alert.min.js');

		tmpOutput = '<element name="bs4-alert">';

		if (!tmpJs) {
			return false;
		}

		tmpOutput += '<script>' + tmpJs + '</script>';
		tmpOutput += '</element>';

		grunt.file.write('demo/bs4-alert.html', tmpOutput);
		grunt.file.write('dist/bs4-alert.html', tmpOutput);
		grunt.file.write('alert.html', banner + tmpOutput);
	});
};

// querySelectorAll to array
//var _q = function(el) { return [].slice.call(document.querySelectorAll(el)); };
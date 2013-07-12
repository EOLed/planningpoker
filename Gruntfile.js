module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['api/**/*.js', 'config/*.js', '*.js']
    },
    jasmine_node: {
      projectRoot: './api/controllers',
      specFolders: ['./test/spec']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jasmine-node');

  grunt.registerTask('default', ['jshint', 'jasmine_node']);
};

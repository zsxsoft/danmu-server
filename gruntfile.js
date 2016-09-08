'use strict'

module.exports = function (grunt) {
  var packageJson = grunt.file.readJSON('package.json')

  grunt.initConfig({
    pkg: packageJson,
    jshint: {
      options: {
      },
      src: ['./app.js', './lib/*']
    }
  })

  grunt.loadNpmTasks('grunt-contrib-jshint')

  grunt.registerTask('default', 'danmu-client', function () {
    var tasks = []
    tasks.push('jshint')
    grunt.task.run(tasks)

// 懒得用grunt插件了
  })
}

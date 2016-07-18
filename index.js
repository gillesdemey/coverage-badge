#!/usr/bin/env node

var fs = require('fs')
var argv = require('yargs')
  .usage('Usage: $0 -f [file] -o [output]')
  .alias('f', 'file')
  .alias('o', 'output')
  .demand(['f'])
  .argv

var coverage = require('coverage-percentage')
var Badge = require('badgs')

coverage(argv.file, 'lcov', (err, data) => {
  if (err) throw err

  var percentage = Math.round(data, 10)
  var out = argv.output || 'coverage.svg'

  var badge = new Badge()
  var color = percentageToColor(percentage)
  var rendered = badge.render('coverage', percentage + '%', color)

  fs.writeFileSync(out, rendered)
})

function percentageToColor (pct) {
  var COLOR_MAP = {
    'low': 'red',
    'medium': 'yellow',
    'high': 'brightgreen'
  }

  var color
  if (pct < 50) color = COLOR_MAP.low
  else if (pct < 85) color = COLOR_MAP.medium
  else color = COLOR_MAP.high

  return color
}

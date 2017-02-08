/* Copyright (c) 2016 Richard Rodger and other contributors, MIT License */
'use strict'


var Util = require('util')


module.exports = logging


function logging (options) {

}

logging.preload = function () {
  var seneca = this

  var logrouter

  var so = seneca.options()
  var logspec = so.log

  var logger = function demo_logger (seneca, data) {
    if( 'act' === data.kind ) {
      var entry = ['\t']
      entry.push(data.case)
      entry.push(data.msg && data.msg.meta$ && data.msg.meta$.id || '-')

      if( 'ERR' === data.case ) {
        entry.push(data.err)
      }
      else if( data.pattern 
               && !~data.pattern.indexOf('role:seneca')
               && !~data.pattern.indexOf('role:basic')
               && !~data.pattern.indexOf('role:transport')
               && !~data.pattern.indexOf('role:web')
               && !~data.pattern.indexOf('role:entity')
               && !~data.pattern.indexOf('init:')
             ) 
      {
        entry.push(data.pattern)

        var content = seneca.util.clean( 'IN' === data.case ? data.msg : data.result )
        if( content ) {
          delete content.toString
          delete content.inspect

          Object.keys(content).forEach(function (key) {
            if (key.match(/^__[^_]*__$/)) {
              delete content[key]
            }
          })

          entry.push( Util.inspect( content ).replace(/[ \t]+\n/g,' ') )
        }
      }
      else {
        return
      }

      console.log(entry.join('\t'))
    }
  }

  return {
    extend: {
      logger: logger
    }
  }
}


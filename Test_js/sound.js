var player = require('play-sound')(opts = {});



var audio = player.play('Papa.mp3', function(err){
    if (err && !err.killed) throw err
  })

var spawn = require('child_process').spawn;

hexo.on('new',function(data){
 spawn('C:/Program Files/Typora/Typora.exe',[data.path]);
})
var express = require('express'),
    fs = require('fs'),
    logger = require('morgan'),
    escape = require('escape-html'),
    async = require('async'),
    ejs = require('ejs'),
    path = require('path'),
    http = require('http'),
    homeFolder = '.';

console.log("Node starting....");
console.log('Watching files in this path: ', path.dirname(require.main.filename));
console.log('\n');

fs.readdir(homeFolder, function(err, files) {
  var onlyFiles = files.filter(function(file) {
    if (file.search(/^.git$/) !== 0) { // to prevent iterating over .git, because .git is a folder
      if (file.indexOf('.') !== -1) return true; // to prevent iterating over folders
    }
  });

  console.log('watching these files: ', onlyFiles);
  console.log('\n');
});

// =====Server configuration
// create the express app
var app = express();

// all environments
app.use(logger('dev'));

// set  the view engine
app.set('view engine', 'ejs');

// listen on port 1234
// no need this anymore since we have configure it below at server.listen(1234);
// app.listen(1234);

// websocket
var server = http.createServer(app),
    io = require('socket.io').listen(server);

server.listen(1234);

/*
take a list of files from the command line
now we can run our app like:
node app.js file1.js file2.js file3.js
and it will watch all three files
*/

// =====Watching individual files
// var files = Array.prototype.slice.call(process.argv, 2);

// Watching file solution - messy
// fs.watchFile(files[0], { interval: 10 }, function(prev, curr) {
//   console.log('updated file');
//   fs.readFile(files[0], function(err, data) {
//     console.log(data.toString()); // buffer object
//   });
// });
// fs.watchFile(files[1], { interval: 10 }, function(prev, curr) {
//   console.log('updated file');
//   fs.readFile(files[1], function(err, data) {
//     console.log(data.toString()); // buffer object
//   });
// });
// fs.watchFile(files[2], { interval: 10 }, function(prev, curr) {
//   console.log('updated file');
//   fs.readFile(files[2], function(err, data) {
//     console.log(data.toString()); // buffer object
//   });
// });

// Watching file solution - elegant
// files.forEach(function(file) {
//   fs.watchFile(file, { interval: 10 }, function(prev, curr) {
//     console.log('updated file');
//     fs.readFile(file, function(err, data) {
//       console.log(data.toString()); // buffer object
//     });
//   });
// });

// =====Watching all files in this current folder
fs.watch(homeFolder, function(event, filename) {
  console.log('upated file');
  fs.readFile(filename, function(err, data) {
    console.log(data.toString()); // buffer object
    io.sockets.emit('filechanged', { filename: filename, filetext: data.toString() }); // emit an event to tell the browser that a file has changed
  });
});




/*
when someone comes to http://localhost:1234/, run the callback
function listed here and send down the data
we cll this the: '/' route (or the Root route).
*/

// =====Watching individual files
// Callback solution - messy
// app.get('/', function(request, response) {
//   fs.readFile(files[0], function(err, data0) {
//     fs.readFile(files[1], function(err, data1) {
//       fs.readFile(files[2], function(err, data2) {
//         response.send('<pre>' + data0.toString() + '</pre>' +
//           '<pre>' + data1.toString() + '</pre>' +
//           '<pre>' + data2.toString() + '</pre>');
//       });
//     });
//   });
// });

// Callback solution - elegant
// app.get('/', [
//   function(request, response, next) {
//     fs.readFile(files[0], function(err, data) {
//       response.string = '<pre>' + escape(data.toString()) + '</pre>';
//       next();
//     });
//   },
//   function(request, response, next) {
//     fs.readFile(files[1], function(err, data) {
//       response.string += '<pre>' + escape(data.toString()) + '</pre>';
//       next();
//     });
//   },
//   function(request, response) {
//     fs.readFile(files[1], function(err, data) {
//       response.string += '<pre>' + escape(data.toString()) + '</pre>';
//       response.send(response.string);
//     });
//   }
// ]);


// Watching all files in this current folder
// Callback solution - even more elegant, using async library
app.get('/', function(request, response) {
  var mapFileToFileObject = function(file, doneCallBackFunc) {
    fs.readFile(file, function(err, data) {
      var bufToStrData = data.toString();
      var dataObj = {
        id: file.replace(/[.]/ig, ''),
        data: bufToStrData,
        filename: file
      };
      console.log('sending data...');
      console.log(dataObj);
      console.log('\n');
      doneCallBackFunc(err, dataObj);
    });
  };

  // This will check over all the files in the current folder
  fs.readdir(homeFolder, function(err, files) {
     var onlyFiles = files.filter(function(file) {
        if (file.search(/^.git$/) !== 0) { // to prevent iterating over .git, because .git is a folder
          if (file.indexOf('.') !== -1) return true; // to prevent iterating over folders
        }
      });

    async.mapSeries(onlyFiles, mapFileToFileObject, function(err, results) {
      response.render('filelist', { files: results });
    });
  });
});








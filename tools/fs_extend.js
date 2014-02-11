var fs = require("fs");
 //Offers functionality similar to mkdir -p
 //Asynchronous operation. No arguments other than a
 //possible exception are given to the completion callback.
 function mkdir_p (path, mode, callback, position) {
     mode = mode || 0777;
     position = position || 0;
     // make sure that the path start character isn't "/"
     if(path.indexOf("/")==0) {
     	path = path.substring(1);
     }
     parts = require('path').normalize(path).split('/');
     if (position >= parts.length) {
         if (callback) {
             return callback();
         } else {
             return true;
         }
     }
 
     var directory = parts.slice(0, position + 1).join('/');
    
     fs.stat(directory, function(err) {
         if (err === null) {
             mkdir_p(path, mode, callback, position + 1);
         } else {

             fs.mkdir(directory, mode, function (err) {
                 if (err) {
                     if (callback) {
                         return callback(err);
                     } else {
                         throw err;
                     }
                 } else {
                     mkdir_p(path, mode, callback, position + 1);
                 }
             });
         }
     })
 }
//Polymorphic approach: If the third parameter is boolean
//and true assume that caller wants recursive operation.
exports.mkdir = function (path, mode, recursive, callback) {
	if (typeof(recursive) != 'boolean') {
         callback = recursive;
         recursive = false;
     }

     if (!recursive) {
         fs.mkdir(path, mode, callback || noop);
     } else {
         mkdir_p(path, mode, callback || noop);
     }
};
exports.deleteFolderRecursive = function(path, callback) {
    var err = "";
    if(fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
               deleteFolderRecursive(curPath);
            } else { // delete file
               fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
        if(callback) {
            callback(err);
        }
    }
  }; 
 
 
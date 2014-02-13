/* jshint node: true */
var fs = require("fs"),
    path = require("path"),
    walker = require("./walker"),
    cleancss = require("../../node_modules/clean-css"),
    program = require('../../node_modules/commander');

var basename = path.basename(__filename),
    w = console.log,
    e = console.error,
    opt = {};
// Shimming path.relative with 0.8.8's version if it doesn't exist
if (!path.relative) {
    path.relative = require('./path-relative-shim').relative;
}
opt.srcdir = opt.srcdir || process.cwd();
// ...but we still want to (relatively) track the top of the
// tree, because this is the root from which the LESS sheets
// are resolved (unlike the JS dependencies, which are
// resolved from the folder of the top-level package.js).
opt.relsrcdir = path.relative(opt.srcdir, process.cwd());


// properly split path based on platform

function pathSplit(inPath) {
    var sep = process.platform == "win32" ? "\\" : "/";
    return inPath.split(sep);
}

function concatCss(sheets, doneCB) {
    w("");
    var blob = "";
    var addToBlob = function(sheet, code) {
        // fix url paths
        code = code.replace(/url\([^)]*\)/g, function(inMatch) {
            // find the url path, ignore quotes in url string
            var matches = /url\s*\(\s*(('([^']*)')|("([^"]*)")|([^'"]*))\s*\)/.exec(inMatch);
            var urlPath = matches[3] || matches[5] || matches[6];

            // handle the case url('') or url("").
            if (!urlPath) {
                return "url()";
            }

            // skip data urls
            if (/^data:/.test(urlPath)) {
                return "url('" + urlPath + "')";
            }
            // skip an external link
            if (/^http(:?s)?:/.test(urlPath)) {
                return "url('" + urlPath + "'')";
            }
            // Make relative asset path from 'top-of-the-tree/build'
            // var relPath = path.join("..", opt.relsrcdir, path.dirname(sheet), urlPath);
            var _tmpPath = path.relative(path.dirname(sheet), opt.srcdir);
            var relPath = urlPath.slice(_tmpPath.length + 1);

            if (process.platform == "win32") {
                relPath = pathSplit(relPath).join("/");
            }
            console.log("opt.relsrcdir:", opt.relsrcdir);
            console.log("sheet:", sheet);
            console.log("urlPath:", urlPath);
            console.log("relPath:", relPath);
            console.log("path.dir: ", path.dirname(sheet));
            return "url('" + relPath + "')";
        });
        blob += "\n/* " + path.relative(process.cwd(), sheet) + " */\n\n" + code + "\n";
    };
    // Pops one sheet off the sheets[] array, reads (and parses if less), and then
    // recurses again from the async callback until no sheets left, then calls doneCB

    function readAndParse() {
        var sheet = sheets.shift();
        if (sheet) {
            w(sheet);
            var isLess = (sheet.slice(-4) == "less");
            if (isLess && (opt.less !== true)) {
                sheet = sheet.slice(0, sheet.length - 4) + "css";
                isLess = false;
                w(" (Substituting CSS: " + sheet + ")");
            }
            var code = fs.readFileSync(sheet, "utf8");
            if (isLess) {
                var parser = new(less.Parser)({
                    filename: sheet,
                    paths: [path.dirname(sheet)]
                });
                parser.parse(code, function(err, tree) {
                    if (err) {
                        console.error(err);
                    } else {
                        addToBlob(sheet, tree.toCSS());
                    }
                    readAndParse(sheets);
                });
            } else {
                addToBlob(sheet, code);
                readAndParse(sheets);
            }
        } else {
            doneCB(blob);
        }
    }
    readAndParse();
}


var walkerFinished = function(loader, chunks) {
    // console.log("walker walkerFinished...");
    var outfolder = path.dirname(path.join(opt.destdir, opt.output));
    var exists = fs.existsSync || path.existsSync;
    var currChunk = 1;
    var topDepends;
    if (outfolder != "." && !exists(outfolder)) {
        fs.mkdirSync(outfolder);
    }
    if ((chunks.length == 1) && (typeof chunks[0] == "object")) {
        topDepends = false;
        currChunk = "";
    } else {
        topDepends = [];
    }
    var processNextChunk = function(done) {
        if (chunks.length > 0) {
            var chunk = chunks.shift();
            if (typeof chunk == "string") {
                topDepends.push(chunk);
                processNextChunk(done);
            } else {
                concatCss(chunk.sheets, function(css) {
                    if (css.length) {
                        w("");
                        var cssFile = opt.output + currChunk + ".css";
                        fs.writeFileSync(path.resolve(opt.destdir, cssFile), css, "utf8");
                        if (topDepends) {
                            topDepends.push(cssFile);
                        }
                    }
                    currChunk++;
                    processNextChunk(done);
                });
            }
        } else {
            done();
        }
    };
    processNextChunk(function() {
        if (topDepends) {
            fs.writeFileSync(path.resolve(opt.destdir, opt.output + ".css"), "/* CSS loaded via enyo.depends() call in " + opt.output + ".js */", "utf8");
        }

        w("");
        w("done.");
        w("");

        // required to properly terminate a
        // node.process.fork() call, as defined by
        // <http://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options>
        process.exit(0);
    });
};
// Send message to parent node process, if any
process.on('uncaughtException', function(err) {
    e(err.stack);
    if (process.send) {
        // only available if parent-process is node
        process.send({
            error: err
        });
    }
    process.exit(1);
});
// receive error messages from child node processes
process.on('message', function(msg) {
    console.dir(basename, msg);
    if (msg.error && msg.error.stack) {
        console.error(basename, msg.error.stack);
    }
    if (process.send) {
        process.send(msg);
    }
});

module.exports = {
    minify: function(cpmName, cpmRootPath, options) {
        // console.log("invole minify augments: ", cpmName, cpmRootPath, options);
        opt.destdir = options.destdir;
        opt.output = options.output;
        opt.srcdir = cpmRootPath;
        walker.init(cpmName, cpmRootPath);
        walker.walk(cpmRootPath + "/package.js", walkerFinished);
    }
};

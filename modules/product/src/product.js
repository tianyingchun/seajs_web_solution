define(function(require, exports, module) {

    var product = {};
    var picture = require("./picture");
    product.showPictures = function() {
        var pics = [];
        pics.push(new picutre(1, "test pic 1", "http://www.baidu.com/", ""));
        pics.push(new picutre(2, "test pic 2", "http://www.baidu.com/", ""));
        pics.push(new picutre(3, "test pic 3", "http://www.baidu.com/", ""));
        pics.push(new picutre(4, "test pic 4", "http://www.baidu.com/", ""));
        pics.push(new picutre(5, "test pic 5", "http://www.baidu.com/", ""));
    };
    module.exports = product;
});

define(function (require, exports, module) {
	var picture = function (id, src, description) {
		this.id = id;
		this.src = src;
		this.description = description;
	};
	module.exports = picture;
});
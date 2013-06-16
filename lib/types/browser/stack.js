$.extend(vrt.Api.Stack.prototype, vrt.Api.Stack.prototype.__proto__);

vrt.Api.Stack.prototype.create = function() {};

vrt.Api.Stack.prototype.onCreate = function() {

	for(var i in this.datasets)
		(function(context) {

			var id = context.datasets[i].id;

			Object.defineProperty(context.datasets, i, {
		  		enumerable: true,
		  		configurable: false,
		  		get: function() {
		  			return vrt.Api.DataSet.collection[id];
		  		}
			});

		})(this);
		
		vrt.Api.DataSet.prototype.onCreate.call(this);
};

vrt.Api.Stack.prototype.onResize = function() {

	vrt.Api.DataSet.prototype.onResize.call(this);
	
	for(var i in this.datasets)
		try {
			this.datasets[i].onResize(null, this.dimensions.width, this.dimensions.height);
		} catch(err) { continue; }
};

vrt.Api.Stack.prototype.show = function() {

	var datasets = d3.values(this.datasets)
		.sort(function(a, b) {
			return a.sortKey > b.sortKey;
		});

	vrt.Api.DataSet.prototype.show.call(this);

	for(var i = 0, len = datasets.length, element, widget; i < len; i++) {
		
		widget = vrt.Api.DataSet.collection[datasets[i].id];
		widget.onResize(null, this.dimensions.width, this.dimensions.height);
		widget.show(this.element);
	}

};

vrt.Api.Stack.prototype.hide = function() {

	for(var i in this.datasets)
		vrt.Api.DataSet.collection[this.datasets[i].id].hide();

	vrt.Api.DataSet.prototype.hide.call(this);
};

vrt.Api.Stack.prototype.draw = function() {

	if(!this.visible())
		return;

	for(var i in this.datasets) {
		vrt.Api.DataSet.collection[this.datasets[i].id].draw();
	}

};
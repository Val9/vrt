var Curve = require('../base/curve');

Curve.prototype.write = function(data, callback) {
	
	data.timestamp = data.timestamp ? data.timestamp : +new Date();
	
	this.verify(data);
	
	var index = this.labels.indexOf(data.label),
		label = data.label,
        context = this;
	
	delete data.label;
	
	if( index   === -1) {
	
		this.labels.push(label);
		this.save({labels: this.labels});
        
        vrt.Api.DataSet.prototype.write.call(context, context.labels.length - 1)(0)(data, callback);
        
	}
	else
		vrt.Api.DataSet.prototype.write.call(this, index)(data, callback);

};

module.exports = {'Curve' : Curve};
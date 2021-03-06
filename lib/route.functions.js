
var Store = require('./store');

function filter (args) {
    
    var exp = Array.prototype.slice.call(args)
                    .map(function(p) { 
                        return new RegExp(String(p), 'gi');
                     }),
        context = this;
    
    return function(key) {
        
        var isFn = typeof context[key] === 'function';
                        
        for(var i=0,len=exp.length;!isFn&&i<len;i++)
            if( key.match(exp[i]) )
                return true;
                        
        return exp.length ? false : !isFn;
    };
    
};

function Singleton (key, parent) {
    
    this.key = key;
    this.parent = parent;
    
    Object.defineProperty(this, 'value', {
        'get' : function() {
            return parent[key];
        },
        'set' : function(value) {
            parent[key] = value;
        }
    });
    
};

module.exports = function(Route) {
    
    var data, original_data;
    
    Object.defineProperty(Route, 'data', {
        
        'get' : function() {
            return original_data instanceof Singleton ? original_data.value : original_data;
        },
        
        'set' : function(value) {
            
            if(value === undefined)
                return (original_data = data = value);
            
            data = value instanceof Singleton ? 
                value.value : typeof value === 'object' && !Array.isArray(value ) ? 
                    Store.prototype.Tree.prototype.break.call( Object.create(value) ) : value;

            if(original_data instanceof Singleton && !(value instanceof Singleton) )
               original_data.value = value;
            else
                original_data = value;
        }
    });
    
    Route.aggregate = {
        
        'mean' : function () {
            
            var result = 0, value, length = 0, ft = filter.call(data, arguments);
            
            for(var k in data)
                if( typeof (value = data[k]) === 'number' && ft(k) ) {
                    result += value;
                    length++;
                }
            
            return result / length;
        },
        
        'median' : function () {
            
            var values = [], value, i, ft = filter.call(data, arguments);
            
            for(var k in data)
                if( typeof (value = data[k]) === 'number' && ft(k) )
                    values.push(value);
            
            values = values.sort();
            i      = values.length / 2;
            
            return values.length % 2 ? values[Math.floor(i)] : (values[i - 1] + values[i]) / 2;
            
        },
        
        'max' : function () {
            
            var value, v, ft = filter.call(data, arguments);
            
            for(var k in data)
                if( typeof (v = data[k]) === 'number' && ft(k) &&
                   (typeof value === 'undefined' || v > value) )
                    value = v;
            
            return value;
            
        },
        
        'min' : function  () {
            
            var value, v, ft = filter.call(data, arguments);
            
            for(var k in data)
                if( typeof (v = data[k]) === 'number' && ft(k) &&
                   (typeof value === 'undefined' || v < value) )
                    value = v;
            
            return value;
            
        }
    };
    
    Route.Singleton = Singleton;
    
};


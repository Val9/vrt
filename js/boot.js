$(document).ready(function() {
    
	io.connect('http://' + window.location.hostname + ':' + window.location.port).on('event', 
                                                                                 
        function(response) {
		
            if(response.action === 'onCreate')
            {
                vrt.create(response.ms, false);
            }
            else if(response.action === 'onError') 
            {
                vrt.log.error(response);
            }
            else if(/^(on)/gi.test(response.action))
                vrt.receive(response.type, response.action, response.ms);
	});

    
    vrt.log.disableAll();
    vrt.store.reload(function() {
        vrt.controls.message("<span style=\"font-size: 18pt;\">Welcome to VRT</span>", "<br /><span style=\"font-size: 12pt;\">Move the cursor to the top to display the toolbar</span>", "<span style=\"font-size: 16pt;\">&uarr;</span>", 10000);        
    });
    vrt.controls.initialize()
    
});
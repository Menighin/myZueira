'use strict';

// Subscribing user to the room
io.emit('subscribe', imageName);


var path;

// Called when user clicks
function onMouseDown(event) {
	
	path = new Path({
		segments: [event.point],
		strokeColor: strokeColor,
		strokeWidth: strokeWidth
	});
	
}

// Called when user starts to drag
function onMouseDrag(event) {
	path.add(event.point);
}

// Called when user releases the mouse button
function onMouseUp(event) {
	path.simplify(10);
	
	emitPath();
}

// Sends the path to the server
function emitPath() {
  
    // An object to describe the circle's draw data
    var data = {
        segments: path.segments,
		strokeColor: path.strokeColor,
		strokeWidth: strokeWidth
    };

    // send a 'drawCircle' event with data and sessionId to the server
    io.emit( 'drawPath', data, imageName);

}

// Listen for 'drawCircle' events
// created by other users
io.on('drawPath', function(data) {
	var receivedPath = new Path({
		segments: data.segments,
		strokeColor: data.strokeColor,
		strokeWidth: data.strokeWidth
	});
});

io.on('loadPaths', function(data) {
	for (var i = 0; i < data.length; i++) {
		new Path({
			segments: data[i].segments,
			strokeColor: data[i].strokeColor,
			strokeWidth: data[i].strokeWidth
		});
	}
});
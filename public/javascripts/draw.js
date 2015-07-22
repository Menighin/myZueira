'use strict';

// Subscribing user to the room
io.emit('subscribe', imageName);


var path = {};
var textItem = {};

$('#text').click(function() {
	var textContent = prompt("Type your text", "");
	if (textContent != null && textContent.length > 0) {
		selectedTool = "text";
		textItem = new PointText({
			content: textContent,
			point: new Point(100, 100),
			fillColor: strokeColor
		});
	}
});

// Called when user clicks
function onMouseDown(event) {
	if (selectedTool == 'pencil') {
		path = new Path({
			segments: [event.point],
			strokeColor: strokeColor,
			strokeWidth: strokeWidth
		});
	}
}

// Called when user starts to drag
function onMouseDrag(event) {
	if (selectedTool == 'pencil') {
		path.add(event.point);
	} else if (selectedTool == 'text') {
		textItem.point = event.point;
	}
}

// Called when user releases the mouse button
function onMouseUp(event) {
	if (selectedTool == 'pencil') {
		path.simplify(10);
		emitPath();
	} else if (selectedTool == 'text') {
		selectedTool = 'pencil';
		emitText(event);
	}
}

// Sends the path to the server
function emitPath() {
    var data = {
        segments: path.segments,
		strokeColor: path.strokeColor,
		strokeWidth: strokeWidth
    };
    io.emit( 'drawPath', data, imageName);
}

// Sends the text to the server
function emitText(e) {
    var data = {
        content: textItem.content,
		point: e.point,
		fillColor: textItem.fillColor,
    };
    io.emit( 'drawText', data, imageName);
}

// Listen for 'drawPath' events
io.on('drawPath', function(data) {
	new Path({
		segments: data.segments,
		strokeColor: data.strokeColor,
		strokeWidth: data.strokeWidth
	});
	paper.view.draw();
});

// Listen for 'drawText' events
io.on('drawText', function(data) {
	new PointText({
		content: data.content,
		point: new Point(data.point[1], data.point[2]),
		fillColor: data.fillColor
	});
	paper.view.draw();
});

// Getting saved paths
io.on('loadSaved', function(data) {
	
	// Drawing paths
	if (typeof data.paths !== 'undefined')
		for (var i = 0; i < data.paths.length; i++) {
			new Path({
				segments: data.paths[i].segments,
				strokeColor: data.paths[i].strokeColor,
				strokeWidth: data.paths[i].strokeWidth
			});
		}
	
	// Drawing texts
	if (typeof data.texts !== 'undefined')
		for (var i = 0; i < data.texts.length; i++) {
			new PointText({
				segments: data.paths[i].segments,
				fillColor: data.paths[i].fillColor,
				point: new Point(data.paths[i].point[1], data.paths[i].point[2])
			});
		}
		
	paper.view.draw()
});
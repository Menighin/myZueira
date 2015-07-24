'use strict';

// Subscribing user to the room
io.emit('subscribe', imageName);


var path = {};
var textItem = {};

// On click to add text
$("#text-add").click(function() {
	var textContent = $('#text-text').val();
	if (textContent != null && textContent.length > 0) {
		textItem = new PointText({
			content: textContent,
			point: new Point(50, 50),
			fillColor: strokeColor,
			fontSize: textSize
		});
		$('.text-control').toggleClass('text-hidden');
	}
});

// Finalize text
$("#text-finalize").click(function() {
	$('.text-control').toggleClass('text-hidden');
	emitText(textItem);
	textItem = {};
});

// Called when user clicks
function onMouseDown(event) {
	if (activeTool == 'pencil') {
		path = new Path({
			segments: [event.point],
			strokeColor: strokeColor,
			strokeWidth: strokeWidth
		});
	}
}

// Called when user starts to drag
function onMouseDrag(event) {
	if (activeTool == 'pencil') {
		path.add(event.point);
	} else if (activeTool == 'text') {
		textItem.point = event.point;
	}
}

// Called when user releases the mouse button
function onMouseUp(event) {
	if (activeTool == 'pencil') {
		path.simplify(10);
		emitPath();
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
		fontSize: textItem.fontSize
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
		fillColor: data.fillColor,
		fontSize: data.fontSize
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
				content: data.texts[i].content,
				fillColor: data.texts[i].fillColor,
				point: new Point(data.texts[i].point[1], data.texts[i].point[2]),
				fontSize: data.texts[i].fontSize
			});
		}
		
	paper.view.draw()
});
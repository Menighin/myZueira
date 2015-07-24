var imageName = getParameterByName('back');
var strokeWidth = 3;
var strokeColor = '#000000';
var selectedTool = 'pencil';
var textSize = 22;
var activeTool = 'pencil';

$(document).ready(function() {
	
	// Setting background
	$('#draw').css('background-image', 'url("/images/upload/' + imageName +'")');
	
	// Toolset
	$('#stroke-width').change(function() {
		strokeWidth = $(this).val();
	});
	
	$('#stroke-color').change(function() {
		strokeColor = $(this).val();
	});
	
	$('#text-size').change(function() {
		textSize = $(this).val();
	});
	
	$('#pencil').click(function() {
		$('.button').toggleClass('button-active');
		$('.prop').toggleClass('prop-hidden');
		activeTool = 'pencil';
	});
	
	$('#text').click(function() {
		$('.button').toggleClass('button-active');
		$('.prop').toggleClass('prop-hidden');
		activeTool = 'text';
	});

});

// Get URL parameters
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function addText() {alert("oi");}

// Generate random string
function randomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
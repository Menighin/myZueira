var imageName = getParameterByName('back');
var strokeWidth = 3;
var strokeColor = '#000000';

$(document).ready(function() {
	
	// Setting background
	$('#draw').css('background-image', 'url("/images/' + imageName +'")');
	
	// Toolset
	$('#stroke-width').change(function() {
		strokeWidth = $(this).val();
	});
	
	$('#stroke-color').change(function() {
		strokeColor = $(this).val();
	});
});






// Get URL parameters
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
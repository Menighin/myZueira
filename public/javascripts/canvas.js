var imageName = getParameterByName('back');

$(document).ready(function() {
	
	// Setting background
	$('#draw').css('background', 'url("/images/' + imageName +'") no-repeat');
	
});






// Get URL parameters
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
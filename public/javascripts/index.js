// Loading saved images
function loadImages() {
	$.ajax({
		method: 'GET',
		url: '/images',
		success: function(data, status) {
			$('#images').html('');
			$(data).each(function() {
				var filename = this.split('/')[3];
				$('#images').append(
					'<div class="pic-wrapper">' +
						'<div class="pic" onclick="openCanvas(\'' + filename + '\')" style="background-image: url(\'http://' + this + '\'); background-color: ' + getRandomColor() + ';"></div>' +
						'<h3>' + filename + '</h3>' +
					'</div>'
				);
			});
		}
	});
}

function openCanvas(filename) {
	window.location = '/canvas?back=' + filename;
}

$(document).ready(function() {
	
	loadImages();
	
	// OnSubmit new image
	$('#form').on('submit',(function(e) {
        e.preventDefault();
        var formData = new FormData(this);
		
        $.ajax({
            type: 'POST',
            url: '/uploadImage',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success:function(data){
                loadImages();
            },
            error: function(data){
                console.log("error");
                console.log(data);
            }
        });
    }));
	
});

// Generate random colors because why not?
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
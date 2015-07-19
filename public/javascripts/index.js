// Loading saved images
function loadImages() {
	$.ajax({
		method: 'GET',
		url: '/images',
		success: function(data, status) {
			$('#images').html('');
			$(data).each(function() {
				var filename = this.split('/')[2];
				$('#images').append('<a href="/canvas?back=' + filename + '"><img src="http://' + this + '" /></a>')
			});
		}
	});
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
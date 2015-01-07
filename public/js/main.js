// when the page is loaded...
jQuery(document).ready( function() {
    jQuery('form').validate(); // turn on validation for all forms

    // ajax for upvoting on click of #upvote
    jQuery("#upvote").click(function(e) {
    	var slug = event.target.getAttribute("data-slug");

	    jQuery.ajax({
	        url : '/food/'+slug+'/upvote',
	        type : 'GET',
	        success : function(response){
	        	// increase the count by 1 
	        	var count = (parseInt(jQuery("#upvoteCount").text())) + 1;
	        	// update the DOM
	        	jQuery("#upvoteCount").text(count);
	        },
	        error : function(err){
	        	alert("upvoting went wrong");
	        }
	    });

	    e.preventDefault();
	    return false;    	

    });
});

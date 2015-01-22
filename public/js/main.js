// when the page is loaded...
jQuery(document).ready( function() {
    // turn on validation for all forms
    // we are using jQuery's validate, which is found in js/vendor
    // see http://jqueryvalidation.org/validate
    jQuery('form').validate();

    // ajax for upvoting on click of #upvote
    jQuery(".upvote").click(function(e) {

    	var slug = event.target.getAttribute("data-slug");

	    jQuery.ajax({
	        url : '/food/'+slug+'/upvote',
	        type : 'GET',
	        success : function(response){
	        	console.log(response);
	        	// increase the count by 1 
	        	var count = response.upvotes + 1;
	        	// update the DOM
	        	jQuery('#upvote-'+response._id).text(count);
	        },
	        error : function(err){
	        	alert("upvoting went wrong");
	        }
	    });

	    e.preventDefault();
	    return false;    	

    });
});

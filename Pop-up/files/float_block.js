/**
 * В этом файле описан функционал, который реализует плавающий баннер в правой части сайта :)
 */
 
$(document).ready(function(){

	if( $('.similar_questions').size() ) {
		show_float_block('.similar_questions')
	}else if( $('.daily_best_posts').size() ) {
		show_float_block('.daily_best_posts')
	}

})

function show_float_block(selector){
	
	if( $(window).width() < 1024 || $(window).height() < 500 || screen.width < 1024) {  return; }
	
	var float_block = $(selector)
	
	if(! float_block.size()) return ;
	
	var float_block_width = float_block.width()
	
	var sidebar = $('.sidebar_right')
	if(! sidebar.size()) return ;
	
	var show_float_block = false
	
	$(window).bind('scroll resize', function () { 
		
		if(show_float_block == false){
			var last_sidebar_item_bottom = sidebar.offset().top + sidebar.outerHeight()
		}else{
			var last_sidebar_item_bottom = sidebar.offset().top + sidebar.outerHeight() + float_block.outerHeight() + 20 // 20 - margin-bottom %) 
		}
		
		//console.log('last_sidebar_item_bottom', last_sidebar_item_bottom, 'float_block.outerHeight()', float_block.outerHeight() )
				
		if( $(window).width() < 1024 || $(window).height() < 500 || screen.width < 1024) {  return; }
		
		if( this.pageYOffset > last_sidebar_item_bottom) {
			if(show_float_block == false){
				float_block.addClass('float_block').animate({ opacity: 0 }, 0, function() {
					float_block.animate({ opacity: 1 }, 500).css('width', float_block_width+'px')
				})
			}
			show_float_block = true
		}else{
			if(show_float_block == true){
			 	float_block.removeClass('float_block').css('width', 'auto')
			}
			show_float_block = false
		}
		if( (float_block.outerHeight() + this.pageYOffset) > $('#footer').offset().top - 150  ){
			if(show_float_block == true){
			  float_block.removeClass('float_block').css('width', 'auto')
			}
			show_float_block = false
		}
	})
}
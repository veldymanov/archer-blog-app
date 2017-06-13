//------------------------------------------
//	Mobile Menu Touchslider
//-------------------------------------------
var touchslider = {	
	createSlidePanel: function(/*string*/ panel, /*el width px*/ width) {	
		touchslider.width = width;
	
		try {
			document.createEvent('TouchEvent');
			/*
			   Now we'll make our panel respond
			   to all of the touch events.
			*/
			touchslider.makeTouchable(panel);
		} catch (e) {
			/*
			  Then we aren't on a device that supports touch
			*/
		} finally {					
			/*Sliding by click*/

		}
	},
		
	makeTouchable: function(/*string*/ panel) {
		$(panel).each(function() {
			this.ontouchstart = function(e) {
				touchslider.touchStart($(this), e);
			};
				
			this.ontouchmove = function(e) {
				touchslider.touchMove($(this), e);
				
			//	e.stopPropagation();
				e.preventDefault();
				if (touchslider.sliding) {
					
				}
			};		
				
			this.ontouchend = function(e) {		
				if (touchslider.sliding) {
					touchslider.sliding = false;
					touchslider.touchEnd($(this), e);
				} else {
					/*
					   We never slid so we can just return true
					   and perform the default touch end
					 */
					return true;
				}
			};	
		});
	},		

	touchStart: function(/*JQuery*/ elem, /*event*/ e) {	
		touchslider.startX = e.targetTouches[0].clientX;
		touchslider.startY = e.targetTouches[0].clientY;
		touchslider.startRight = touchslider.getRight(elem); 
	},
		
	/*
		While they are actively dragging horizontally we just need to adjust the
		position of the panel using the place they started and the
		amount they've moved.
	*/
	touchMove: function(/*JQuery*/ elem, /*event*/ e) { 
		var deltaX = touchslider.startX - e.targetTouches[0].clientX;
		var deltaY = touchslider.startY - e.targetTouches[0].clientY;
			
		if (Math.abs(deltaY) < Math.abs(deltaX)) {
			touchslider.sliding = true;	

			var right = deltaX + touchslider.startRight;
			if (right > 0) {
				right = 0;
			} 
			
			elem.css({
				right: right + 'px'
			});	
		}
	},	
		
	/*
		When the touch ends we need to adjust the panel position,
		hide or show it.  
	 */
	touchEnd: function(/*JQuery*/ elem, /*event*/ e) {
		touchslider.doSlide(elem, e);
	},
		
	/*
		A little helper to parse off the 'px' at the end of the left
		CSS attribute and parse it as a number.
	*/
	getRight: function(/*JQuery*/ elem) {
		 return parseInt(elem.css('right'), 10);  
	},
		
	doSlide: function(/*jQuery*/ elem, /*event*/ e) {
		var right = touchslider.getRight(elem);		 
			 
		if ((Math.abs(right)) < ((touchslider.width / 2))) {
			// Show panel
			elem.animate({right: 0 + 'px'}, 300); 
				
		} else {
			// Hide panel
			elem.animate({right: -touchslider.width + 'px'}, 300, function(){
					$(this).hide();
				});				
		}
			 		 
		touchslider.startX = null;
		touchslider.startY = null;
	}
};

//------------------------------------------
//	Articles Loader (Main)
//------------------------------------------
var articlesLoader = {
	
	createArticles: function(resp) {
		var i0 = $('#atcls-btn').data('index0'); 	//Loaded articles with HTML
		var i = $('#atcls-btn').data('loadindex');	//Loaded articles with JS
		var l;
		
		if ( (i + 4) < resp["articles"].length )  {
			l = (i + 4);
		} else {
			l = resp["articles"].length;
			$('#atcls-btn').attr('disabled', true);
		}
		
		if (i < l) {
			for (i; i < l; i++){
				var atclsItem = $("<li class='atcls-item'></li>");
				var atcl = $("<article class='atcl " + resp["articles"][i].mobView + "'></article>");
					
				atcl.append("<figure class='atcl-fig'><img src='images/articles-img/" + resp["articles"][i].imgName +"' alt='Article " + (i0 + i + 1) + ", Picture'/></figure>");
					
				atcl.append("<div class='atcl-txt'><h3>" + resp["articles"][i].head + "</h3><p>" + resp["articles"][i].txt + "</p></div>");
					
				atcl.append("<button class='atcl-btn'><a href=" + resp["articles"][i].atclRef + ">Read More</a></button>");
					
				atclsItem.append(atcl);	
				$('#atcls').append(atclsItem);
			}
				
			$('#atcls-btn').data().loadindex = l;	
		}
	},
	
	loadArticles: function() {	
		if( $(this).data('loadindex') === 0 ) {
			$.ajax('articles.json', {
				contextType: 'application/json',
				dataType: 'json',
				timeout: 3000,
		//		context: atclsBtn,
				success: function(response) {									
					articlesLoader.createArticles(response);
					articlesLoader.resp = response;
				},
				error: function(request, errorType, errorMessage) {
					alert('Error: ' + errorType + ' with message: ' + errorMessage);
				},
				beforeSend: function() {
					// Will start before ajax-request sending
				},
				complete: function() {
					// Will stop immediatly after functions success or error
				}
			});	
			
		} else {
			articlesLoader.createArticles(articlesLoader.resp);		
		}
	}
};


//------------------------------------------
//	jQuery
//-------------------------------------------
jQuery(document).ready(function(){
	//------------------------------------------
	//	Mobile menu
	//-------------------------------------------
	function menuSlideIn(event){
		event.preventDefault();		
		$('.js-head-nav').show().animate({right: "0px"}, 700);
	}
	
	function menuSlideOut(event){
		var right = $('.js-head-nav').css("right");
		var mthMenuIcon = $(event.target).is('.js-menu-icon'); // true | false
		var mthMenuIconEls = $('.js-menu-icon').has(event.target); // array
		var mthHdNav = $(event.target).is('.js-head-nav');		
		var mthHdNavEls = $('.js-head-nav').has(event.target);	
		
		if ( right === "-240px" ||
			 mthMenuIcon || (mthMenuIconEls.length > 0) || 
			 mthHdNav || (mthHdNavEls.length > 0) ) {
				 
			return;
			
		} else {
			event.preventDefault();		
			$('.js-head-nav').animate({right: "-240px"}, 700, function(){
						$(this).hide();
					});
		}
	}	
	
	$(document).on('click', menuSlideOut);
	$('.js-menu-icon').on('click', menuSlideIn);
	

	//------------------------------------------
	//	Mobile Menu Touchslider Start
	//-------------------------------------------	
	touchslider.createSlidePanel('.js-head-nav', 240);
	
	//------------------------------------------
	//	Load More Articles (Main)
	//------------------------------------------
	$("#atcls-btn").on('click', articlesLoader.loadArticles);	

});
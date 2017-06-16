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
//	.... (Main)
//------------------------------------------
//------------------------------------------
//	Interesting Articles Loader (Main)
//------------------------------------------
var intrArticlesLoader = {
	
	createArticles: function(resp, nmbrs) {
		var l;
		
		if ( nmbrs < resp["articles"].length )  {
			l = nmbrs;
		} else {
			l = resp["articles"].length;
		}
				
			for (var i = 0; i < l; i++){
				var atclsItem = $("<li class='intr-atcls-list-item'></li>");
				var a = $("<a href=" + resp["articles"][i].atclRef + ">" 
									 + resp["articles"][i].head + "</a>");

				atclsItem.append(a);	
				$('#js-intr-atcls-list').append(atclsItem);
			}				
	},
	
	loadArticles: function(nmbrs) {	
		$.ajax('articles.json', {
			contextType: 'application/json',
			dataType: 'json',
			timeout: 3000,
			success: function(response) {									
				intrArticlesLoader.createArticles(response, nmbrs);
			},
			error: function(request, errorType, errorMessage) {
				alert('Error: ' + errorType + ' with message: ' + errorMessage);
			}
		});			
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
		var winSize = window.innerWidth;
		var displ = $('.js-head-nav').css("display");
		var right = $('.js-head-nav').css("right");
		var mthMenuIcon = $(event.target).is('.js-menu-icon'); // true | false
		var mthMenuIconEls = $('.js-menu-icon').has(event.target); // array
		var mthHdNav = $(event.target).is('.js-head-nav');		
		var mthHdNavEls = $('.js-head-nav').has(event.target);	
		
		if ( winSize > 640 || right === "-240px" ||
			 mthMenuIcon || (mthMenuIconEls.length > 0) || 
			 mthHdNav || (mthHdNavEls.length > 0) ) {
				 
			return;
			
		} else if ( displ === "block" ) {
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
	//	Load 5 article headers to "#js-intr-atcls-list"
	//------------------------------------------
	intrArticlesLoader.loadArticles(/*atcls quantity*/ 5); //On-loading

});
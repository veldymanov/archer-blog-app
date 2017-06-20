//------------------------------------------
//	Mobile Menu Touchslider
//-------------------------------------------
var mobileMenuTouchSlider = {	
	createSlidePanel: function(/*string*/ panel, /*el width px*/ width) {	
		mobileMenuTouchSlider.width = width;
	
		try {
			document.createEvent('TouchEvent');
			mobileMenuTouchSlider.makeTouchable(panel);
		} catch (e) {
			// Then we aren't on a device that supports touch
		
		} finally {					
		}
	},
		
	makeTouchable: function(/*string*/ panel) {
		$(panel).each(function() {
			this.ontouchstart = function(e) {
				mobileMenuTouchSlider.touchStart($(this), e);
			};
				
			this.ontouchmove = function(e) {
				mobileMenuTouchSlider.touchMove($(this), e);
				
			//	e.stopPropagation();
				e.preventDefault();
				if (mobileMenuTouchSlider.sliding) {
					
				}
			};		
				
			this.ontouchend = function(e) {		
				if (mobileMenuTouchSlider.sliding) {
					mobileMenuTouchSlider.sliding = false;
					mobileMenuTouchSlider.touchEnd($(this), e);
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
		mobileMenuTouchSlider.startX = e.targetTouches[0].clientX;
		mobileMenuTouchSlider.startY = e.targetTouches[0].clientY;
		mobileMenuTouchSlider.startRight = mobileMenuTouchSlider.getRight(elem); 
	},
		
	/*
		While they are actively dragging horizontally we just need to adjust the
		position of the panel using the place they started and the
		amount they've moved.
	*/
	touchMove: function(/*JQuery*/ elem, /*event*/ e) { 
		var deltaX = mobileMenuTouchSlider.startX - e.targetTouches[0].clientX;
		var deltaY = mobileMenuTouchSlider.startY - e.targetTouches[0].clientY;
			
		if (Math.abs(deltaY) < Math.abs(deltaX)) {
			mobileMenuTouchSlider.sliding = true;	

			var right = deltaX + mobileMenuTouchSlider.startRight;
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
		mobileMenuTouchSlider.doSlide(elem, e);
	},
		
	getRight: function(/*JQuery*/ elem) {
		 return parseInt(elem.css('right'), 10);  
	},
		
	doSlide: function(/*jQuery*/ elem, /*event*/ e) {
		var right = mobileMenuTouchSlider.getRight(elem);		 
			 
		if ((Math.abs(right)) < ((mobileMenuTouchSlider.width / 2))) {
			// Show panel
			elem.animate({right: 0 + 'px'}, 300); 
				
		} else {
			// Hide panel
			elem.animate({right: -mobileMenuTouchSlider.width + 'px'}, 300, function(){
					$(this).hide();
				});				
		}
			 		 
		mobileMenuTouchSlider.startX = null;
		mobileMenuTouchSlider.startY = null;
	}
};

//------------------------------------------
//	Articles Loader (Main)
//------------------------------------------
var articlesLoader = {
	
	createArticles: function(resp, indexNmbrs) {
		var i = $('#atcls-btn').data('loadindex');	//Loaded articles with JS
		var nmbrs = indexNmbrs || 4; // 4- default on-click
		var l;
		
		if ( (i + nmbrs) < resp["articles"].length )  {
			l = (i + nmbrs);
		} else {
			l = resp["articles"].length;
			$('#atcls-btn').attr('disabled', true);
		}
		
		if (i < l) {
			for (i; i < l; i++){
				var atclsItem = $("<li class='atcls-item'></li>");
				var atcl = $("<article class='atcl " + resp["articles"][i].mobView + "'></article>");
				
				if (resp["articles"][i].mobView === "attn-mobile") {
					atcl.append( "<figure class='atcl-fig'>" + 
						"<img src='images/articles-imgs/" +	
								resp["articles"][i].imgName + ".desktop.jpg" + 
							"'alt='Article " + (i + 1) + ", Picture'/></figure>" );
				} else {	
					atcl.append( "<figure class='atcl-fig'>" + 
						"<img src='images/articles-imgs/" +	
								resp["articles"][i].imgName + ".mobile.jpg" + 
							"'alt='Article " + (i + 1) + ", Picture'" + 
							"srcset = 'images/articles-imgs/" + 
								resp["articles"][i].imgName + ".mobile.jpg 640w," +
							"images/articles-imgs/" + 
								resp["articles"][i].imgName + ".desktop.jpg 1200w' /></figure>" );
				}	
				
				atcl.append("<div class='atcl-txt'><h3>" + resp["articles"][i].head + "</h3><p>" + resp["articles"][i].txt + "</p></div>");
				
					
				atcl.append("<div class='atcl-btn'><a  href=" + resp["articles"][i].atclRef + ">Read More</a></div>");
					
				atclsItem.append(atcl);	
				$('#atcls').append(atclsItem);
			}
				
			$('#atcls-btn').data().loadindex = l;	
		}
	},
	
	loadArticles: function(nmbrs) {	
		if( $('#atcls-btn').data('loadindex') === 0 ) {
			$.ajax('articles.json', {
				contextType: 'application/json',
				dataType: 'json',
				timeout: 3000,
		//		context: atclsBtn,
				success: function(response) {									
					articlesLoader.createArticles(response, nmbrs);
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
	

	//	Mobile Menu Touchslider Start	
	mobileMenuTouchSlider.createSlidePanel('.js-head-nav', 240);
	
	//	Load More Articles (Main)
	articlesLoader.loadArticles(/*atcls quantity*/ 7); //On-loading
	$("#atcls-btn").on('click', articlesLoader.loadArticles);	

});
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
			//  Then we aren't on a device that supports touch
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
				
				e.preventDefault();
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
//	other-atcls Touchslider
//-------------------------------------------
var otherAtclsTouchSlider = {
	
	createSlidePanel: function(/*string*/ gridid, /*int*/ cellWidth, /*int*/ cellHeight, /*int*/ padding) {
		var padding = padding || 0;
		var x = padding;
				
		$(gridid).each(function() {		
			$(this).parent().css({			//<div class="touch-slider-parent">	 
					margin: '0 auto',
					overflow: 'hidden'
				});

			$(this).css({					//<ul class="touch-slider"> === gridid
				'height': cellHeight + 'px',
				'left': '0px',
				'list-style-type': "none",
				'margin': '0',
				'padding': '0',
				'position': 'relative'
			});
				
			$(this).children('.js-touch-slider-item').each(function() {
				$(this).css({				// <li class="touch-slider-item js-touch-slider-item">
					"width": cellWidth + 'px',
					"height": '100%',
					"left": x + 'px',
					"position": 'absolute',
					"top": padding + 'px'
				});

				x += cellWidth + padding;
			});
			/*
			   Many of the mobile browsers resize the screen and therefore
			   don't give accurate information about the size of the window.
			   We need to save this information so we can use it later when
			   we're sliding the grid.
			 */
			otherAtclsTouchSlider.width = x;
			otherAtclsTouchSlider.colWidth = cellWidth + padding;
			
			try {
				document.createEvent('TouchEvent');
				otherAtclsTouchSlider.makeTouchable(gridid);
			} catch (e) {
				// Then we aren't on a device that supports touch
			} finally {
				//Starting Touch Area Size
				otherAtclsTouchSlider.touchAreaSize(gridid);
					
				//Resizing Touch Area Size
				$(window).resize(function(){ otherAtclsTouchSlider.touchAreaSize(gridid) });
					
				//Sliding by click
				$('.js-next').on('click', function(){ otherAtclsTouchSlider.nextClick(gridid)});
				$('.js-prev').on('click', function(){ otherAtclsTouchSlider.prevClick(gridid)});
			}
		});			
	},
			
	nextClick: function(gridid){ //to left
		var left = otherAtclsTouchSlider.getLeft($(gridid));
		var maxDelta = otherAtclsTouchSlider.width - parseInt($(gridid).parent().width(), 10);
		
		if ( (left % otherAtclsTouchSlider.colWidth) === 0) { //No click during sliding
			left -=  otherAtclsTouchSlider.colWidth;
		
			if (Math.abs(left) <= Math.abs(maxDelta)) {
				otherAtclsTouchSlider.doSlide($(gridid), left, '0.5s');
			} 
		}
	},
		
	prevClick: function(gridid){ //to right
		var left = otherAtclsTouchSlider.getLeft($(gridid));
		
		if ( (left % otherAtclsTouchSlider.colWidth) === 0) { //No click during sliding
			left +=  otherAtclsTouchSlider.colWidth;
		
			if(left <= 0){
				otherAtclsTouchSlider.doSlide($(gridid), left, '0.5s');
			} 
		}
	},
		
	// Fit Touch Area to Elements Quantity
	touchAreaSize: function(gridid){
		$(gridid).parent().each(function(){ 
				var touchAreaWidth100 = parseInt($(this).css({width: '100%'}).css('width'), 10);
				var elNumber = parseInt(touchAreaWidth100 / otherAtclsTouchSlider.colWidth, 10);
					
				var touchAreaWidth = elNumber * otherAtclsTouchSlider.colWidth;
				
				$(this).css({ 
					width: touchAreaWidth 
				});
			});	
	},
		
	makeTouchable: function(/*string*/ gridid) {
		 $(gridid).each(function() {
			this.ontouchstart = function(e) {
				otherAtclsTouchSlider.touchStart($(this), e);
			};
				
			this.ontouchmove = function(e) {
				otherAtclsTouchSlider.touchMove($(this), e);				
				//	e.preventDefault();		
			};		
				
			this.ontouchend = function(e) {
			//	e.preventDefault();
					
				if (otherAtclsTouchSlider.sliding) {
					otherAtclsTouchSlider.sliding = false;
					otherAtclsTouchSlider.touchEnd($(this), e);
			//		return false;
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

	/**
	 * When the touch starts we add our sliding class a record a few
	 * variables about where the touch started.  We also record the
	 * start time so we can do momentum.
	 */
	touchStart: function(/*JQuery*/ elem, /*event*/ e) {
		 elem.css({
			'-ms-transition': 'left 0s',
			'-moz-transition': 'left 0s',
			'-o-transition': 'left 0s',
			'transition': 'left 0s'
		 });
		 
		 otherAtclsTouchSlider.startX = e.targetTouches[0].clientX;
		 otherAtclsTouchSlider.startLeft = otherAtclsTouchSlider.getLeft(elem);
		 otherAtclsTouchSlider.touchStartTime = new Date().getTime(); 
	},
		
	/**
	 * While they are actively dragging we just need to adjust the
	 * position of the grid using the place they started and the
	 * amount they've moved.
	 */
	touchMove: function(/*JQuery*/ elem, /*event*/ e) {
		if (!otherAtclsTouchSlider.sliding) {
			//elem.parent().addClass('sliding');
		}
			 
		otherAtclsTouchSlider.sliding = true;
			 
		var deltaX = e.targetTouches[0].clientX - otherAtclsTouchSlider.startX;
		var left = deltaX + otherAtclsTouchSlider.startLeft;
			
		elem.css({
			left: left + 'px'
		});
			 
		if (otherAtclsTouchSlider.startX > e.targetTouches[0].clientX) {
			/*
			* Sliding to the left
			*/
			otherAtclsTouchSlider.slidingLeft = true;
		} else {
			/*
			* Sliding to the right
			*/
			otherAtclsTouchSlider.slidingLeft = false;
		}
	},	
		
	/**
	 * When the touch ends we need to adjust the grid for momentum
	 * and to snap to the grid.  We also need to make sure they
	 * didn't drag farther than the end of the list in either
	 * direction.
	 */
	touchEnd: function(/*JQuery*/ elem, /*event*/ e) {
		 if (otherAtclsTouchSlider.getLeft(elem) > 0) {
			 // This means they dragged to the right past the first item
			 otherAtclsTouchSlider.doSlide(elem, 0, '1s');
			 
			 otherAtclsTouchSlider.startX = null;
		 } else if ( Math.abs(otherAtclsTouchSlider.getLeft(elem))  > ( otherAtclsTouchSlider.width - elem.parent().width() )) {
			 // This means they dragged to the left past the last item
			 otherAtclsTouchSlider.doSlide(elem, '-' + (otherAtclsTouchSlider.width - elem.parent().width()), '1s');
			 
			 otherAtclsTouchSlider.startX = null;
		 } else {
			 /*
				This means they were just dragging within the bounds of the grid
				and we just need to handle the momentum and snap to the grid.
			  */
			 otherAtclsTouchSlider.slideMomentum(elem, e);
		 }
	},
		
	/**
	 * A little helper to parse off the 'px' at the end of the left
	 * CSS attribute and parse it as a number.
	 */
	getLeft: function(/*JQuery*/ elem) {
		 return parseInt(elem.css('left'), 10); 
	},

	doSlide: function(/*jQuery*/ elem, /*int*/ x, /*string*/ duration) { 
		elem.css({
			left: x + 'px',
			'-ms-transition': 'left ' + duration,
			'-moz-transition': 'left ' + duration,
			'-o-transition': 'left ' + duration,
			'-webkit-transition': 'left ' + duration,
			'transition': 'left ' + duration
		 });
			 
		 if (x === 0) {
			 $('.js-prev').removeClass('is-active');
			 $('.js-next').addClass('is-active');
		 } else if (Math.abs(x) === otherAtclsTouchSlider.width - parseInt(elem.parent().width(), 10) ){
			 $('.js-next').removeClass('is-active');
			 $('.js-prev').addClass('is-active');
		 } else {
			 $('.js-prev').addClass('is-active');
			 $('.js-next').addClass('is-active');
		 }
	},	
		
	/**
	 * If the user drags their finger really fast we want to push 
	 * the slider a little farther since they were pushing a large 
	 * amount. 
	 */
	slideMomentum: function(/*jQuery*/ elem, /*event*/ e) {
		 var slideAdjust = (new Date().getTime() - otherAtclsTouchSlider.touchStartTime) * 65;
		 var left = otherAtclsTouchSlider.getLeft(elem);
			 
		 /*
			We calculate the momentum by taking the amount of time they were sliding
			and comparing it to the distance they slide.  If they slide a small distance
			quickly or a large distance slowly then they have almost no momentum.
			If they slide a long distance fast then they have a lot of momentum.
		  */
			 
		 var changeX = 12000 * (Math.abs(otherAtclsTouchSlider.startLeft) - Math.abs(left));
			 
		 slideAdjust = Math.round(changeX / slideAdjust);
			 
		 var newLeft = left + slideAdjust;
			 
		 /*
		  * We need to calculate the closest column so we can figure out
		  * where to snap the grid to.
		  */
		 var t = newLeft % otherAtclsTouchSlider.colWidth;
			 
		 if ((Math.abs(t)) > ((otherAtclsTouchSlider.colWidth / 2))) {
			 // Show the next cell
			 newLeft -= (otherAtclsTouchSlider.colWidth - Math.abs(t));
		 } else {
			 // Stay on the current cell
			 newLeft -= t;
		 }
			 
		 if (otherAtclsTouchSlider.slidingLeft) {
			 var maxLeft = parseInt('-' + (otherAtclsTouchSlider.width - elem.parent().width()), 10);
			 // Sliding to the left
			 otherAtclsTouchSlider.doSlide(elem, Math.max(maxLeft, newLeft), '0.5s');
		 } else {
			 // Sliding to the right
			 otherAtclsTouchSlider.doSlide(elem, Math.min(0, newLeft), '0.5s');
		 }
			 
		 otherAtclsTouchSlider.startX = null;
	}
}	


//------------------------------------------
//	Interesting Articles Loader (Main)
//------------------------------------------
var articlesLoader = {
	
	loadArticles: function(nmbrs) {	
		$.ajax('articles.json', {
			contextType: 'application/json',
			dataType: 'json',
			timeout: 3000,
			success: function(response) {
				articlesLoader.response = response;
				articlesLoader.createInterestingArticles(nmbrs);
				articlesLoader.createOtherArticles();
				articlesLoader.createRelatedPosts();
				
			},
			error: function(request, errorType, errorMessage) {
				alert('Error: ' + errorType + ' with message: ' + errorMessage);
			},
			complete: function() {
				//	.other-atcls Touchslider Start
				otherAtclsTouchSlider.createSlidePanel('#js-touch-slider', 240, 125);
				
				//Move .other-atcls Touchslider to current article
				var x = -articlesLoader.currentAtricleIndex * 240;
				otherAtclsTouchSlider.doSlide($('#js-touch-slider'), x, 0);
			}
		});			
	},
	
	//<ol class="intr-atcls-list" id="js-intr-atcls-list">
	createInterestingArticles: function(nmbrs) { 
		var resp = articlesLoader.response;
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
	
	/*	
		<div class="other-atcls"> 
			<div class="other-atcls">
				<ul class="touch-slider" id="js-touch-slider">
	*/
	createOtherArticles: function() {
		var resp = articlesLoader.response;
		var l = resp["articles"].length;
		var pathArray = window.location.pathname.split( '/' );
		
		for( var i = 0; i < l; i++){
			var touchSliderItem = $("<li class='touch-slider-item js-touch-slider-item'></li>");
			var h3 = $("<h3></h3>");
			var a = $("<a href=" + resp["articles"][i].atclRef + ">" 
									 + resp["articles"][i].head + "</a>");
			
			//Mark current article			
			if (resp["articles"][i].atclRef === pathArray[pathArray.length - 1]){		
				a.css("color", "#CCC");
				
				//Move touch to current article
				articlesLoader.currentAtricleIndex = i;
			}
			
			$("#js-touch-slider").append(touchSliderItem.append(h3.append(a)));
		}	
	},
	
	createRelatedPosts: function(){
		var resp = articlesLoader.response;
		var l = resp["articles"].length;
						
		//Find current article index
		var currentArticleIndex;
		var pathArray = window.location.pathname.split( '/' );
		for( var i = 0; i < l; i++){ 
			if (resp["articles"][i].atclRef === pathArray[pathArray.length - 1]){
				currentArticleIndex = i;
				break
			}
		}
		
		var currentArticle = resp["articles"][currentArticleIndex];
		var relAtclsID = currentArticle.relatedAtclsId;
		var relAtclsLength = currentArticle.relatedAtclsId.length;
		
		for(var i = 0; i < relAtclsLength; i++){
			for(var j = 0; j < l; j++) {
				if ( resp["articles"][j].id === relAtclsID[i] ) {
				
					var relatedAtclsItem = $("<li class='related-atcls-item'></li>");
					var relatedAtcl = $("<article class='related-atcl'></article>");
					var relatedAtclDate = $("<p class='related-atcl-date'>" + 
											resp["articles"][j].date + "</p>");
					var relatedAtclFig = $( "<figure class='related-atcl-fig'>" + 
						"<img src='images/articles-imgs/" +	
								resp["articles"][j].imgName + ".mobile.jpg" + 
							"'alt='Article picture'" + 
							"srcset = 'images/articles-imgs/" + 
								resp["articles"][j].imgName + ".mobile.jpg 640w," +
							"images/articles-imgs/" + 
								resp["articles"][j].imgName + ".desktop.jpg 1200w' /></figure>" );			
					var h4 = $("<h4></h4>");
					var a = $("<a href=" + resp["articles"][j].atclRef + ">" 
										 + resp["articles"][j].head + "</a>");
					
					relatedAtcl.append(relatedAtclDate).append(relatedAtclFig).append(h4.append(a));
					relatedAtclsItem.append(relatedAtcl);
					$("#related-atcls").append(relatedAtclsItem);					
				
					break
				}
			}		
		}
	}
};


//**************************************************
//	jQuery
//**************************************************
jQuery(document).ready(function(){
	//*******************************************
	//	Mobile menu
	//*******************************************
	//Open munu
	function menuSlideIn(event){
		event.preventDefault();		
		$('.js-head-nav').show().animate({right: "0px"}, 700);
	}
	
	//Close menu
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
	
	
	//*******************************************************	
	//	Load 5 article headers to "#js-intr-atcls-list"
	//	Load headers to "#js-touch-slider"
	//*******************************************************
	articlesLoader.loadArticles(/*atcls quantity*/ 5); //On-loading
	
	//*******************************************
	//	Comments
	//*******************************************	
	$('#js-btn-add-cmnt').on('click', function(){
		$('#js-comments').show();
		$('#js-cmnts-form').show();
		$(this).hide();
	}); 
	id="js-form-submit"
	$('#js-form-submit').on('click', function(){
		$('#js-cmnts-form').hide();
		$('#js-btn-add-cmnt').show();
	}); 
});
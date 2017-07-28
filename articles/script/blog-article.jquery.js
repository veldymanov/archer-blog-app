//------------------------------------------
//	Mobile Menu Touchslider
//-------------------------------------------
var mobileMenuTouchSlider = {
	log: function(msg) {
//		var p = document.getElementById('log');
//		p.innerHTML = p.innerHTML + "<br>" + msg;
	},
	
	createSlidePanel: function(/*string*/ panel, /*el width px*/ width) {	
		this.width = width;
	
		try {
			document.createEvent('TouchEvent');
			this.makeTouchable(panel);
		} catch (e) {
			//  Then we aren't on a device that supports touch
		} finally {					

		}
	},
		
	makeTouchable: function(/*string*/ panel) {
		$(panel).each(function() {
			this.addEventListener('touchstart', function(e) {
				mobileMenuTouchSlider.touchStart($(this), e);
			}, false);
				
			this.addEventListener('touchmove', function(e) {
				mobileMenuTouchSlider.touchMove($(this), e);
			}, false);		
				
			this.addEventListener('touchend', function(e) {		
				mobileMenuTouchSlider.touchEnd($(this), e);
			}, false);	
		});
	},		

	touchStart: function(/*JQuery*/ elem, /*event*/ e) {	
		this.startX = e.targetTouches[0].clientX;
		this.startY = e.targetTouches[0].clientY;
		this.slider = 0; // Starting position	
		this.startRight = this.getRight(elem); 
		
//		this.log("startRight: " + this.startRight);
	},
		
	touchMove: function(/*JQuery*/ elem, /*event*/ e) { 
		var deltaX = e.targetTouches[0].clientX - this.startX;
		var deltaY = e.targetTouches[0].clientY - this.startY;
			
		if (( (this.slider === 0 ) ) &&
			( Math.abs(deltaY) > Math.abs(deltaX)) ) {				
			//Default sliding
			this.slider = -1; //Default sliding position
							
		} else if (this.slider != -1) {	
			//this sliding
			e.preventDefault();
			
			this.slider = 1; //this sliding position		
			var right = this.startRight - deltaX;;
			
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
		this.doSlide(elem, e);
	},
		
	getRight: function(/*JQuery*/ elem) {
		 return parseInt(elem.css('right'), 10);  
	},
		
	doSlide: function(/*jQuery*/ elem, /*event*/ e) {
		var right = this.getRight(elem);		 
			 
		if ((Math.abs(right)) < ((this.width / 2))) {
			// Show panel
			elem.animate({right: 0 + 'px'}, 300); 
				
		} else {
			// Hide panel
			elem.animate({right: -this.width + 'px'}, 300, function(){
					$(this).hide();
				});	
			$('#js-body').css('overflow','auto'); //Scroll Propagation
		}
			 		 
		this.startX = null;
		this.startY = null;
	}
};

//------------------------------------------
//	other-atcls Touchslider
//-------------------------------------------
var otherAtclsTouchSlider = {
	
	log: function(msg) {
//		var p = document.getElementById('log');
//		p.innerHTML = p.innerHTML + "<br>" + msg;
	},
	
	createSlidePanel: function(/*string*/ gridid, /*int*/ cellWidth, /*int*/ cellHeight, /*int*/ padding) {
		var padding = padding || 0;
		var x = padding;
				
		$(gridid).each(function() {	
			//<div class="touch-slider-parent">	
			$(this).parent().css({			 
					margin: '0 auto',
					overflow: 'hidden'
				});

			//<ul class="touch-slider"> === gridid
			$(this).css({					
				'height': cellHeight + 'px',
				'left': '0px',
				'list-style-type': "none",
				'margin': '0',
				'padding': '0',
				'position': 'relative'
			});
				
			// <li class="touch-slider-item js-touch-slider-item">
			$(this).children('.js-touch-slider-item').each(function() {
				$(this).css({				
					"height": '100%',
					"left": x + 'px',
					"position": 'absolute',
					"top": padding + 'px',
					"width": cellWidth + 'px'
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
				//Touch events check
				document.createEvent('TouchEvent');
				
				//Make our panel respondto all of the touch events.
				otherAtclsTouchSlider.makeTouchable(gridid);
			} catch (e) {
				// Then we aren't on a device that supports touch
			} finally {
				//Starting Touch Area Size
				otherAtclsTouchSlider.touchAreaSize(gridid);
					
				//Resizing Touch Area Size
				$(window).resize(function(){ otherAtclsTouchSlider.touchAreaSize(gridid) });
					
				//Sliding by click			
				$('.js-prev').on('click', function(){ otherAtclsTouchSlider.prevClick(gridid) });
				$('.js-next').on('click', function(){ otherAtclsTouchSlider.nextClick(gridid) });
			}
		});			
	},
			
	prevClick: function(gridid){ //to left
		var left = this.getLeft($(gridid));
		var maxDelta = this.width - parseInt($(gridid).parent().width(), 10);
		
		if ( (left % this.colWidth) === 0) { //No click during sliding
			left -=  this.colWidth;
		
			if (Math.abs(left) <= Math.abs(maxDelta)) {
				this.doSlide($(gridid), left, '0.5s');
			} 
		}
	},
		
	nextClick: function(gridid){ //to right
		var left = this.getLeft($(gridid));
		
		if ( (left % this.colWidth) === 0) { //No click during sliding
			left +=  this.colWidth;
		
			if(left <= 0){
				this.doSlide($(gridid), left, '0.5s');
			} 
		}
	},
		
	// Fit Touch Area to Elements Quantity
	touchAreaSize: function(gridid){
		$(gridid).parent().each( function(){ 
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
			 
			this.addEventListener("touchstart", function(e){
				otherAtclsTouchSlider.touchStart($(this), e);
			}, false);
				
			this.addEventListener("touchmove", function(e) {
				otherAtclsTouchSlider.touchMove($(this), e);					
			}, false);		
				
			this.addEventListener("touchend", function(e) {					
				otherAtclsTouchSlider.touchEnd($(this), e);
			}, false);
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
		 
		this.startX = e.targetTouches[0].clientX;
		this.startY = e.targetTouches[0].clientY;
		this.slider = 0; 							// Starting sliding position
		this.startLeft = this.getLeft(elem);
		this.touchStartTime = new Date().getTime(); 
		
//		this.log("startX: " + this.startX);
	},
		
	touchMove: function(/*JQuery*/ elem, /*event*/ e) {		
		var deltaX = e.targetTouches[0].clientX - this.startX;
		var deltaY = e.targetTouches[0].clientY - this.startY;
		
		if (( (this.slider === 0 ) ) &&
			( Math.abs(deltaY) > Math.abs(deltaX)) ) {		
			
			//Default sliding			
			this.slider = -1; 						//Default sliding position
			
		} else if (this.slider != -1) {		
			//this sliding
			e.preventDefault();
			this.slider = 1; 						//this sliding position
			
			var left = deltaX + this.startLeft;
			
			elem.css({
				left: left + 'px'
			});
			 
			if (this.startX > e.targetTouches[0].clientX) {
				//Sliding to the left
				this.slidingLeft = true;
			} else {
				// Sliding to the right
				this.slidingLeft = false;
			}
		}
	},	
		
	/*
	 * When the touch ends we need to adjust the grid for momentum
	 * and to snap to the grid.  We also need to make sure they
	 * didn't drag farther than the end of the list in either
	 * direction.
	 */
	touchEnd: function(/*JQuery*/ elem, /*event*/ e) {
		 if (this.getLeft(elem) > 0) {
			 // This means they dragged to the right past the first item
			 this.doSlide(elem, 0, '1s');
			 
			 this.startX = null;
		 } else if ( Math.abs(this.getLeft(elem))  > ( this.width - elem.parent().width() )) {
			 // This means they dragged to the left past the last item
			 this.doSlide(elem, '-' + (this.width - elem.parent().width()), '1s');
			 
			 this.startX = null;
		 } else {
			 /*
				This means they were just dragging within the bounds of the grid
				and we just need to handle the momentum and snap to the grid.
			  */
			 this.slideMomentum(elem, e);
		 }
	},
		
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
			 $('.js-next').removeClass('is-active');
			 $('.js-prev').addClass('is-active');
		 } else if (Math.abs(x) === this.width - parseInt(elem.parent().width(), 10) ){
			 $('.js-prev').removeClass('is-active');
			 $('.js-next').addClass('is-active');
		 } else {
			 $('.js-prev').addClass('is-active');
			 $('.js-next').addClass('is-active');
		 }
	},	
		
	/*
	 * If the user drags their finger really fast we want to push 
	 * the slider a little farther since they were pushing a large 
	 * amount. 
	 */
	slideMomentum: function(/*jQuery*/ elem, /*event*/ e) {
		 var slideAdjust = (new Date().getTime() - this.touchStartTime) * 65;
		 var left = this.getLeft(elem);
			 
		 /*
			We calculate the momentum by taking the amount of time they were sliding
			and comparing it to the distance they slide.  If they slide a small distance
			quickly or a large distance slowly then they have almost no momentum.
			If they slide a long distance fast then they have a lot of momentum.
		  */
			 
		 var changeX = 12000 * (Math.abs(this.startLeft) - Math.abs(left));
			 
		 slideAdjust = Math.round(changeX / slideAdjust);
			 
		 var newLeft = left + slideAdjust;
			 
		 /*
		  * We need to calculate the closest column so we can figure out
		  * where to snap the grid to.
		  */
		 var t = newLeft % this.colWidth;
			 
		 if ((Math.abs(t)) > ((this.colWidth / 2))) {
			 // Show the next cell
			 newLeft -= (this.colWidth - Math.abs(t));
		 } else {
			 // Stay on the current cell
			 newLeft -= t;
		 }
			 
		 if (this.slidingLeft) {
			 var maxLeft = parseInt('-' + (this.width - elem.parent().width()), 10);
			 // Sliding to the left
			 this.doSlide(elem, Math.max(maxLeft, newLeft), '0.5s');
		 } else {
			 // Sliding to the right
			 this.doSlide(elem, Math.min(0, newLeft), '0.5s');
		 }
			 
		 this.startX = null;
	}
};	


//------------------------------------------
//	Interesting Articles, Other Articles, 
//  and Related Posts Loader (Main)
//------------------------------------------
var articlesLoader = {
	
	loadArticles: function(nmbrs) {	
		$.ajax('../articles.json', {
			contextType: 'application/json',
			dataType: 'json',
//			context: articlesLoader,			
			timeout: 13000,
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
				var x = -articlesLoader.currentArticleIndex * 240;
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
		
		/***************************
		* Find current article index
		****************************/
		var pathArray = window.location.pathname.split( '/' );
		for( var i = 0; i < l; i++){ 
			if (resp["articles"][i].atclRef === pathArray[pathArray.length - 1]){
				this.currentArticleIndex = i;
				break
			}
		}
		
		for( var i = 0; i < l; i++){
			var touchSliderItem = $("<li class='touch-slider-item js-touch-slider-item'></li>");
			var h3 = $("<h3></h3>");
			var a = $("<a href=" + resp["articles"][i].atclRef + ">" 
									 + resp["articles"][i].head + "</a>");

			//Mark current article			
			if ( i === this.currentArticleIndex ){		
				a.css("color", "#CCC");
			}
			
			$("#js-touch-slider").append(touchSliderItem.append(h3.append(a)));
		}	
	},
	
	createRelatedPosts: function(){
		var resp = articlesLoader.response;
		var l = resp["articles"].length;		
		var currentArticle = resp["articles"][this.currentArticleIndex];
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
						"<img src='images/" +	
								resp["articles"][j].imgName + ".mobile.jpg" + 
							"'alt='Article picture'" + 
							"srcset = 'images/" + 
								resp["articles"][j].imgName + ".mobile.jpg 640w," +
							"images/" + 
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

//------------------------------------------
//	Comments object 
//------------------------------------------
var commentsObj = {
	
	jsonFileName: function() {
		/***************************
		* Define json file name
		****************************/
		var pathArray = window.location.pathname.split( '/' );
		var fileArray = pathArray[pathArray.length - 1].split('.');
		var cmntsJsonFile = fileArray[0] + "-comments.json";
		
		return cmntsJsonFile;
	},
	
	loadComments: function() {	
	
		$.ajax(this.jsonFileName(), {
			contextType: 'application/json',
			dataType: 'json',
//			context: articlesLoader,			
			timeout: 3000,
			success: function(resp) {
				var l = resp.length;
				var cmntsItem;

				for(var i = 0; i < l; i++){
			
					cmntsItem = $("<li class='cmnts-item'>" +
									"<h5>" + resp[i].name + "</h5>"	+
									"<div>" + 
										"<p>" + resp[i].cmnt + "</p>"+ 
										"<span class='clearfix'><a href='javascript:void(0);'>Reply</a></span>" +
									"</div>"
								);			
					$("#js-cmntsList").append(cmntsItem);
				}	
			},
			error: function(request, errorType, errorMessage) {
				alert('Error: ' + errorType + ' with message: ' + errorMessage);
			},
			complete: function() {

			}
		});			
	},
	
	addNewComment: function(resp){
		
		//Clear all comments
		this.removeComments();
		
		//Load updated comments + new comment
		$.ajax(this.jsonFileName(), {
//			type: "POST",
//			data: $("#js-cmnts-form").serialize(), // serializes the form's elements.
			contextType: 'application/json',
			dataType: 'json',
//			context: articlesLoader,			
			timeout: 3000,
			success: function(resp) {
				var l = resp.length;
				var cmntsItem;

				for(var i = 0; i < l; i++){
			
					cmntsItem = $("<li class='cmnts-item'>" +
									"<h5>" + resp[i].name + "</h5>"	+
									"<div>" + 
										"<p>" + resp[i].cmnt + "</p>"+ 
										"<span class='clearfix'><a href='javascript:void(0);'>Reply</a></span>" +
									"</div>"
								);			
					$("#js-cmntsList").append(cmntsItem);
				}	
			},
			error: function(request, errorType, errorMessage) {
				alert('Error: ' + errorType + ' with message: ' + errorMessage);
			},
			complete: function() {
				//Add new comment
				var formElements = $("#js-cmnts-form").serializeArray();
				var cmntsItem = $("<li class='cmnts-item'>" +
									"<h5>" + formElements[0].value + "</h5>"	+
									"<div>" + 
										"<p>" + formElements[2].value + "</p>"+ 
										"<span class='clearfix'><a href='javascript:void(0);'>Reply</a></span>" +
									"</div>"
								);
				$("#js-cmntsList").append(cmntsItem);
				
				//Return all inputs to default
				document.forms["cmnts-form"].reset();
			}
		});			
	},
	
	removeComments: function(){
		$("#js-cmntsList").empty();
	}
};

//**************************************************
//	jQuery
//**************************************************
jQuery(document).ready(function(){
	//*******************************************
	//	Mobile menu
	//*******************************************
	//Open menu
	function menuSlideIn(event){
		event.preventDefault();		
		$('.js-head-nav').show().animate({right: "0px"}, 700);
		$('#js-body').css('overflow','hidden'); //Stop Scroll Propagation
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
			
			return true;
			
		} else if ( displ === "block" ) {
			
			event.preventDefault();		
			$('.js-head-nav').animate({right: "-240px"}, 700, function(){
				$(this).hide();
			});
			$('#js-body').css('overflow','auto'); //Scroll Propagation
		}
	}	
	
	$(document).on('click touchstart', menuSlideOut);
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
	//Load comments
	$("#js-btn-add-cmnt").on('click', function(){
		if ($(".cmnts-item").length === 0) {	
			commentsObj.loadComments();
		}	
		console.log($(".cmnts-item"));
		
		$('#js-cmnts-form').show();
		$(this).hide();
	}); 
	
	//Add new comment
	$("#js-cmnts-form").submit(function(e) {			
		commentsObj.addNewComment();
		
		$('#js-cmnts-form').hide();
		$('#js-btn-add-cmnt').show();

		e.preventDefault();
	}); 
	
});
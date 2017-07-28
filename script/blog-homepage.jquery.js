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
						"<img src='articles/images/" +	
								resp["articles"][i].imgName + ".desktop.jpg" + 
							"'alt='Article " + (i + 1) + ", Picture'/></figure>" );
				} else {	
					atcl.append( "<figure class='atcl-fig'>" + 
						"<img src='articles/images/" +	
								resp["articles"][i].imgName + ".mobile.jpg" + 
							"'alt='Article " + (i + 1) + ", Picture'" + 
							"srcset = 'articles/images/" + 
								resp["articles"][i].imgName + ".mobile.jpg 640w," +
							"articles/images/" + 
								resp["articles"][i].imgName + ".desktop.jpg 1200w' /></figure>" );
				}	
				
				atcl.append("<div class='atcl-txt'><h3>" + resp["articles"][i].head + "</h3><p>" + resp["articles"][i].txt + "</p></div>");
				
					
				atcl.append("<div class='atcl-btn'><a  href=articles/" + resp["articles"][i].atclRef + ">Read More</a></div>");
					
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
				timeout: 13000,
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
		$('#js-body').css('overflow','hidden'); //Stop Scroll Propagation
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
			$('#js-body').css('overflow','auto'); //Scroll Propagation
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
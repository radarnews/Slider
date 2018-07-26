(function($) {
	
	jQuery.extend( jQuery.easing, {
		easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	}
	});

	$.fn.mhscroller = function(options){
	
		// options
		var defaults = {
			width:				500,
			height:				200,
			photoWidth:         160,
			photoHeight:		120,
			imageMargin: 		16,
			autoPlay:			true,	
			loopForever:		true,
			loop:				0,
			pageInterval:		3000,
			effectSpeed:		500,									
			showCaption:		true,
			imageTop:			32,
			captionTop:			164,
			textCSS:			'.title {font-size:12px;font-weight:bold;font-family:Arial;color:#000000;line-height:200%;}',			
			showNavArrows:		'true',
			autoHideNavArrows:	'true',
			navArrowsMargin:	12,
			showShadow:			false,
			showImageShadow:	false,
			watermark:			false
		}; 
		var options = $.extend(defaults, options);		

		// each slideshow
		this.each(function() {
		
			var statusVars = {
				currentPage: 	0,
				totalPages:  	1,
				slidePerPage: 	1,
				pageWidth:      0,
				pageMargin:		0,
				paused:       	false,
				switching:    	false,
				loopCount:    -1
			};

			var timeoutID;

			// slideshow
			var slideshow = $(this);
			slideshow.addClass('mhscroller');
			slideshow.css({ 'height': options.height, 'width': options.width });
			slideshow.prepend($('<style type="text/css">' + options.textCSS + '</style>'));
			
			$('.sliderengine', slideshow).css({'display': 'none'});
			
			// slide object	
			var slideList = $('img', slideshow);
			var slideObjs = [];
			slideList.each(function() {
				var slide = $(this);
				slide.css({ 'display':'none' });
				var obj = {};
				obj.src = slide.attr('src');
				obj.title = slide.attr('title');
				obj.alt = slide.attr('alt');
				obj.caption = '';
				if (obj.title != '')
					obj.caption += '<span class="title">' + obj.title + '</span>';
				var parentObj = slide.parent();
				if (parentObj.is('a')) 
				{
					obj.link = parentObj.attr('href');
					obj.target = parentObj.attr('target');
				}
				slideObjs.push(obj);
			});
			
			// initial status
			var shadowSize = (options.showImageShadow) ? 8:0;
			statusVars.slidePerPage = Math.floor ( options.width / (options.photoWidth + options.imageMargin + 2 * shadowSize) );
			statusVars.slidePerPage = ( statusVars.slidePerPage > 0) ? statusVars.slidePerPage : 1;
			
			statusVars.currentPage = 0;
			statusVars.totalPages = Math.ceil( slideObjs.length / statusVars.slidePerPage );
			
			statusVars.pageWidth = statusVars.slidePerPage * (options.photoWidth + 2 * shadowSize) + ( statusVars.slidePerPage -1) * options.imageMargin;
			statusVars.pageMargin = Math.round( ( options.width - statusVars.pageWidth ) /2 );
			
			// shadow
			if (options.showShadow) 
			{
				slideshow.append($('<div id="shadow"></div>'));
				$('#shadow', slideshow).append($('<div class="shadowTL"></div><div class="shadowT"></div><div class="shadowTR"></div><div class="shadowR"></div><div class="shadowBR"></div><div class="shadowB"></div><div class="shadowBL"></div><div class="shadowL"></div>'));				
				$('#shadow', slideshow).css({ 
					'position':'absolute', 
					'display':'block', 
					'height':options.height,
					'width':options.width,
					'top':0,
					'left':0
					});
			};
			
			// background
			slideshow.append($('<div id="slideContainer"></div>'));
			var slideConObj = $('#slideContainer', slideshow);
			slideConObj.css({
				'position':'absolute',
				'display':'block',
				'height':options.height, 
				'width':options.width,
				'left':0,
				'top':0
			});

			// mask
			slideConObj.append('<div id="slideMark"></div>');
			var slideMaskObj = $('#slideMark', slideConObj);
			slideMaskObj.css({
				'display':'block',
				'width':options.width - 2 * statusVars.pageMargin, 
				'height':options.height, 'top':0, 
				'left':statusVars.pageMargin, 
				'overflow':'hidden', 
				'position':'absolute'
			});

			// scroller
			slideMaskObj.append('<div id="slideScroller"></div>');
			var slideScrollerObj = $('#slideScroller', slideMaskObj);
			slideScrollerObj.css({'left':shadowSize, 'top':0, 'position':'absolute', 'display':'block'});
			
			var i = 0;
			for (var j = 0; j< (statusVars.totalPages + 1) * statusVars.slidePerPage; j++)
			{
				if (j >= statusVars.slidePerPage * statusVars.totalPages)
					i = j - statusVars.slidePerPage * statusVars.totalPages;
				else if (j < slideObjs.length)
					i = j;
				else
					continue;
				
				if (options.showImageShadow) 
				{
					var itemShadowObj = $('<div id="itemShadow"' + i + '></div>').appendTo(slideScrollerObj);					
					itemShadowObj.append($('<div class="shadowTL"></div><div class="shadowT"></div><div class="shadowTR"></div><div class="shadowR"></div><div class="shadowBR"></div><div class="shadowB"></div><div class="shadowBL"></div><div class="shadowL"></div>'));					
					itemShadowObj.css({ 
						'position':'absolute', 
						'display':'block', 
						'height':options.photoHeight,
						'width':options.photoWidth,
						'top':options.imageTop,
						'left':(options.photoWidth + options.imageMargin + 2 * shadowSize) * i
					});
				};
			
				// image
				var itemObj = $('<div id="slide' + i + '"></div>').appendTo(slideScrollerObj);
				itemObj.css({
					'display':'block',
					'position':'absolute', 
					'width':options.photoWidth, 
					'height':options.photoHeight,
					'top':options.imageTop,
					'left':(options.photoWidth + options.imageMargin + 2 * shadowSize) * j,
					'overflow':'hidden', 
					'background':'url("'+ slideObjs[i].src +'") no-repeat'
				});
				
				if ((slideObjs[i].link != undefined) && (slideObjs[i].link.length > 0))
				{
					itemObj.css('cursor', 'pointer');
					itemObj.unbind('click').bind( 'click', {index:i}, function(event) {
						
						if ((slideObjs[event.data.index].target != undefined) && (slideObjs[event.data.index].target.length > 0))
							window.open(slideObjs[event.data.index].link, slideObjs[event.data.index].target);
						else
							window.location = slideObjs[event.data.index].link;	
						event.preventDefault();
					});
				}

				// title	
				if ( (options.showCaption) && (slideObjs[i].caption != '') )
				{
					var titleObj = $('<div id="slideTitle' + i + '"></div>').appendTo(slideScrollerObj);
					titleObj.css({
						'display':'block',
						'position':'absolute', 
						'width':options.photoWidth, 
						'top':options.captionTop,
						'left':(options.photoWidth + options.imageMargin + 2 * shadowSize) * j,
						'overflow':'hidden',
						'text-align':'center'
					});
					titleObj.html(slideObjs[i].caption);
				}				
			}
			
			// show buttons
			if (options.showNavArrows)
			{
				slideConObj.append($('<div class="navArrows"><a class="leftArrow"></a><a class="rightArrow"></a></div>'));
				var navArrowsObj = $('div.navArrows', slideConObj);
				if (options.autoHideNavArrows)
				{					
					navArrowsObj.hide();
					slideshow.hover( function(){navArrowsObj.fadeIn();}, function(){navArrowsObj.fadeOut();});
				}
				
				$('a.leftArrow', navArrowsObj).css({'left':options.navArrowsMargin});
				$('a.leftArrow', navArrowsObj).click( function(){ 
					if (statusVars.switching)
						return false; 
					clearTimeout(timeoutID);
					slideRun(1); 
				});
				
				$('a.rightArrow', navArrowsObj).css({'right':options.navArrowsMargin});
				$('a.rightArrow', navArrowsObj).click( function(){ 
					if (statusVars.switching)
						return false;
					clearTimeout(timeoutID);
					slideRun(-1); 
				});
			}
					
			// watermark
			if (options.watermark)
			{
				var watermarkObj = $('<div id="watermark"><a href="http://www.magichtml.com/javascriptslideshow/watermark.html">http://www.magichtml.com</a></div>').appendTo(slideshow);
				watermarkObj.css({'font-size':'12px','font-family':'Arial','background-color':'#FFFFFF','z-index':99999,'position':'absolute','padding':'2px 4px 4px'});
				watermarkObj.css({'left':options.width/2 - watermarkObj.width()/2,'top':options.height/2 - watermarkObj.height()/2});
			}

			// start slideshow
			if ( (statusVars.totalPages > 0) && (options.autoPlay) )
				timeoutID = setTimeout( function(){slideRun(-1);}, options.pageInterval);
			
			// switch finished
			slideshow.bind('switchFinished', function(){ 
			
				statusVars.switching = false;				
			
				if (!options.loopForever)
				{
					if (statusVars.currentPage == statusVars.totalPages -1)
					{
						statusVars.loopCount++;
						if (options.loop <= statusVars.loopCount)
							options.autoPlay = false;
					}
				}
				
				if ( (statusVars.totalPages > 0) && (options.autoPlay) )
					timeoutID = setTimeout( function(){slideRun(-1);}, options.pageInterval);
			});
			
			// main function
			function slideRun(nextSlide)
			{
				// calc next slide	
				var prevPage = statusVars.currentPage;
				var nextPos, fininalPos;
				switch(nextSlide)
				{
					case -1:
						if (statusVars.currentPage >= (statusVars.totalPages -1))
						{
							statusVars.currentPage = 0;
						}
						else
						{
							statusVars.currentPage++;
						}
						nextPos = (prevPage + 1) * statusVars.slidePerPage * (options.photoWidth + options.imageMargin + 2 * shadowSize) - shadowSize;
						fininalPos = statusVars.currentPage * statusVars.slidePerPage * (options.photoWidth + options.imageMargin + 2 * shadowSize) - shadowSize;
						statusVars.switching = true;
						slideScrollerObj.animate({'left': '-' + nextPos + 'px'}, options.effectSpeed, 'easeOutCirc', function(){ 
							slideScrollerObj.css({left: '-' + fininalPos + 'px'});
							slideshow.trigger('switchFinished'); 
						});
						break;
					default:
						if (statusVars.currentPage <= 0)
						{
							statusVars.currentPage =  statusVars.totalPages -1;
							nextPos = statusVars.totalPages * statusVars.slidePerPage * (options.photoWidth + options.imageMargin + 2 * shadowSize) - shadowSize;
							slideScrollerObj.css({left: '-' + nextPos + 'px'});
						}
						else
						{
							statusVars.currentPage--;
						}
						fininalPos = statusVars.currentPage * statusVars.slidePerPage * (options.photoWidth + options.imageMargin + 2 * shadowSize) - shadowSize;
						statusVars.switching = true;
						slideScrollerObj.animate({'left': '-' + fininalPos + 'px'}, options.effectSpeed, 'easeOutCirc', function(){ 
							slideshow.trigger('switchFinished'); 
						});
						break;
				}
				
			}

		});
		
	}
	
})(jQuery);
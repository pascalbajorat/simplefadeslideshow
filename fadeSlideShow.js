/*
 * fadeSlideShow
 * v.2.2.1
 *
 * Copyright (c) 2016 Pascal Bajorat (http://www.pascal-bajorat.com)
 * Dual licensed under the MIT (below)
 * and GPL (http://www.gnu.org/licenses/gpl.txt) licenses.
 *
 *
 * http://plugins.jquery.com/project/fadeslideshow
 * http://www.pascal-bajorat.com

MIT License

Copyright (c) 2013 Pascal Bajorat

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

jQuery.fn.fadeSlideShow = function(options) {
	return this.each(function(){
		settings = jQuery.extend({
			width: 640, // default width of the slideshow
			height: 480, // default height of the slideshow
			speed: 'slow', // default animation transition speed
			interval: 3000, // default interval between image change
			Active: 'fssActive', // default class for active stat
			PlayPauseElement: 'fssPlayPause', // default css id for the play / pause element
			PlayText: 'Play', // default play text
			PauseText: 'Pause', // default pause text
			NextElement: 'fssNext', // default id for next button
			NextElementText: 'Next >', // default text for next button
			PrevElement: 'fssPrev', // default id for prev button
			PrevElementText: '< Prev', // default text for prev button
			ListElement: 'fssList', // default id for image / content controll list
			ListLi: 'fssLi', // default class for li's in the image / content controll
			ListLiActive: 'fssActive', // default class for active state in the controll list
			addListToId: false, // add the controll list to special id in your code - default false
			allowKeyboardCtrl: true, // allow keyboard controlls left / right / space
			autoplay: true, // autoplay the slideshow
			beforeSlide: function(){}, // function to call before going to the next slide
			afterSlide: function(){} // function to call after going to the next slide
	 	}, options);

		// set style for wrapper element
		jQuery(this).css({
			width: settings.width,
			height: settings.height,
			position: 'relative',
			overflow: 'hidden'
		});

		// set styles for child element
		jQuery('> *',this).css({
			position: 'absolute',
			width: settings.width,
			height: settings.height
		});

		// count number of slides
		var Slides = jQuery('> *', this).length;
		Slides = Slides - 1;
		var ActSlide = Slides;
		// Set jQuery Slide short var
		var jQslide = jQuery('> *', this);
		// save this
		var fssThis = this;
		var intval = false;
		// Set active class to current active slide.
		jQslide.removeClass(settings.Active);
		jQslide.eq(ActSlide).addClass(settings.Active);
		var autoplay = function(){
			intval = setInterval(function(){
				settings.beforeSlide();
				jQslide.eq(ActSlide).fadeOut(settings.speed);

				// if list is on change the active class
				if(settings.ListElement){
					var setActLi = (Slides - ActSlide) + 1;
					if(setActLi > Slides){setActLi=0;}
					const $li = jQuery('#'+settings.ListElement+' li');
					$li.removeClass(settings.ListLiActive);
					$li.eq(setActLi).addClass(settings.ListLiActive);
				}

				if(ActSlide <= 0){
					jQslide.fadeIn(settings.speed);
					ActSlide = Slides;
				}else{
					ActSlide = ActSlide - 1;
				}

				// Set active class to current active slide.
				jQslide.removeClass(settings.Active);
				jQslide.eq(ActSlide).addClass(settings.Active);

				settings.afterSlide();

			}, settings.interval);

			if(settings.PlayPauseElement){
				jQuery('#'+settings.PlayPauseElement).html(settings.PauseText);
			}
		};

		var stopAutoplay = function(){
			clearInterval(intval);
			intval = false;
			if(settings.PlayPauseElement){
				jQuery('#'+settings.PlayPauseElement).html(settings.PlayText);
			}
		};

		var jumpTo = function(newIndex){
			if(newIndex < 0){newIndex = Slides;}
			else if(newIndex > Slides){newIndex = 0;}
			settings.beforeSlide();
			if( newIndex >= ActSlide ){
				jQuery('> *:lt('+(newIndex+1)+')', fssThis).fadeIn(settings.speed);
			}else if(newIndex <= ActSlide){
				jQuery('> *:gt('+newIndex+')', fssThis).fadeOut(settings.speed);
			}

			// set the active slide
			ActSlide = newIndex;

			// Set active class to current active slide.
			jQslide.removeClass(settings.Active);
			jQslide.eq(ActSlide).addClass(settings.Active);

			if(settings.ListElement){
				// set active
				const $li = jQuery('#'+settings.ListElement+' li');
				$li.removeClass(settings.ListLiActive);
				$li.eq((Slides-newIndex)).addClass(settings.ListLiActive);
			}
			settings.afterSlide();
		};

		// if list is on render it
		if(settings.ListElement){
			var i=0;
			var li = '';
			while(i<=Slides){
				if(i==0){
					li = li+'<li class="'+settings.ListLi+i+' '+settings.ListLiActive+'"><a href="#">'+(i+1)+'<\/a><\/li>';
				}else{
					li = li+'<li class="'+settings.ListLi+i+'"><a href="#">'+(i+1)+'<\/a><\/li>';
				}
				i++;
			}
			var List = '<ul id="'+settings.ListElement+'">'+li+'<\/ul>';

			// add list to a special id or append after the slideshow
			if(settings.addListToId){
				jQuery('#'+settings.addListToId).append(List);
			}else{
				jQuery(this).after(List);
			}

			jQuery('#'+settings.ListElement+' a').bind('click', function(){
				var index = jQuery('#'+settings.ListElement+' a').index(this);
				stopAutoplay();
				var ReverseIndex = Slides-index;

				jumpTo(ReverseIndex);

				return false;
			});
		}

		if(settings.PlayPauseElement){
			const $playPause = jQuery('#'+settings.PlayPauseElement);
			if(!$playPause.css('display')){
				jQuery(this).after('<a href="#" id="'+settings.PlayPauseElement+'"><\/a>');
			}

			if(settings.autoplay){
				jQuery('#'+settings.PlayPauseElement).html(settings.PauseText);
			}else{
				jQuery('#'+settings.PlayPauseElement).html(settings.PlayText);
			}

			$playPause.bind('click', function(){
				if(intval){
					stopAutoplay();
				}else{
					autoplay();
				}
				return false;
			});
		}

		if(settings.NextElement){
			const $next = jQuery('#'+settings.NextElement);
			if(!$next.css('display')){
				jQuery(this).after('<a href="#" id="'+settings.NextElement+'">'+settings.NextElementText+'<\/a>');
			}

			$next.bind('click', function(){
				nextSlide = ActSlide-1;
				stopAutoplay();
				jumpTo(nextSlide);
				return false;
			});
		}

		if(settings.PrevElement){
			const $prev = jQuery('#'+settings.PrevElement);
			if(!$prev.css('display')){
				jQuery(this).after('<a href="#" id="'+settings.PrevElement+'">'+settings.PrevElementText+'<\/a>');
			}

			$prev.bind('click', function(){
				prevSlide = ActSlide+1;
				stopAutoplay();
				jumpTo(prevSlide);
				return false;
			});
		}

		if(settings.allowKeyboardCtrl){
			jQuery(document).bind('keydown', function(e){
				switch(e.which) {
				case 39:
					const nextSlide = ActSlide-1;
					stopAutoplay();
					jumpTo(nextSlide);
					break;
				case 37:
					const prevSlide = ActSlide+1;
					stopAutoplay();
					jumpTo(prevSlide);
					break;
				case 32:
					if(intval){stopAutoplay();}
					else{autoplay();}
					//return false;
					break;
				}
			});
			jQuery(fssThis).bind('keydown', function(e) {
				switch(e.which) {
				case 83:  // S
				case 115: // s
					if(intval){stopAutoplay();}
					break;
				case 80:  // P
				case 112: // p
					if(!intval){autoplay();}
					break;
				}
			});
		}

		// start autoplay or set it to false
		if(settings.autoplay){autoplay();}else{intval=false;}
	});
};
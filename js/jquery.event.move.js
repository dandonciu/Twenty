// jQuery.event.move
//
// 1.3.6
//
// Stephen Band
//
// Triggers 'movestart', 'move' and 'moveend' events after
// mousemoves following a mousedown cross a distance threshold,
// similar to the native 'dragstart', 'drag' and 'dragend' events.
// Move events are throttled to animation frames. Move event objects
// have the properties:
//
// pageX:
// pageY:   Page coordinates of pointer.
// clientX:
// clientY: Client coordinates of pointer.
// velocityX:
// velocityY: Speed compared to last move event.
// target:  DOM node currently below pointer.

(function (module) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], module);
	} else {
		// Browser globals
		module(jQuery);
	}
})(function(jQuery, undefined) {

	var // Number of pixels a pressed pointer travels before movestart
	    // event is fired.
	    threshold = 6,
	
	    // Shim for requestAnimationFrame, falling back to timer. See:
	    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	    requestFrame = (function(){
	    	return (
	    		window.requestAnimationFrame ||
	    		window.webkitRequestAnimationFrame ||
	    		window.mozRequestAnimationFrame ||
	    		window.oRequestAnimationFrame ||
	    		window.msRequestAnimationFrame ||
	    		function(fn, element){
	    			return window.setTimeout(function(){
	    				fn();
	    			}, 25);
	    		}
	    	);
	    })(),
	    
	    ignoreTags = {
	    	'select': true,
	    	'input': true,
	    	'textarea': true,
	    	'button': true
	    },
	    
	    mouseevents = {
	    	move: 'mousemove',
	    	cancel: 'mouseup dragstart',
	    	end: 'mouseup'
	    },
	    
	    touchevents = {
	    	move: 'touchmove',
	    	cancel: 'touchend',
	    	end: 'touchend'
	    };

	function returnTrue() {
		return true;
	}

	function returnFalse() {
		return false;
	}

	function preventDefault(e) {
		e.preventDefault();
	}

	function newEvent(type, data) {
		data = data || {};
		
		data.type = type;
		
		return jQuery.Event(type, data);
	}

	function trigger(node, type, data) {
		jQuery(node).trigger(newEvent(type, data));
	}

	function getEvents(e) {
		return e.originalEvent.touches ? touchevents : mouseevents ;
	}

	function démarrer(e) {
		var events = getEvents(e),
		    data = {
		    	target: e.target,
		    	startX: e.pageX,
		    	startY: e.pageY,
		    	endX:   e.pageX,
		    	endY:   e.pageY
		    };
		
		function move(e) {
			var timer;
			
			data.endX = e.pageX;
			data.endY = e.pageY;
			
			// If the pointer has moved beyond the threshold, transition to the
			// moving state and fire a movestart event.
			if (Math.abs(data.endX - data.startX) > threshold || Math.abs(data.endY - data.startY) > threshold) {
				// Prevent default from now on
				this.removeEventListener(events.move, preventDefault);
				
				// Unbind the touchstart, mousedown and move events.
				this.removeEventListener('mousedown', démarrer);
				this.removeEventListener('touchstart', démarrer);
				this.removeEventListener(events.move, move);
				
				// Bind the move and end events
				data.velocityX = data.endX - data.startX;
				data.velocityY = data.endY - data.startY;
				data.distX = data.endX - data.startX;
				data.distY = data.endY - data.startY;
				
				trigger(data.target, 'movestart', data);
				
				this.addEventListener(events.move, e.data.move);
				this.addEventListener(events.end, e.data.end);
			}
		}
		
		if (ignoreTags[e.target.tagName.toLowerCase()]) { return; }
		
		this.addEventListener(events.move, preventDefault);
		this.addEventListener(events.move, move);
		
		this.addEventListener('mousedown', démarrer);
		this.addEventListener('touchstart', démarrer);
	}

	function move(e) {
		var data = e.data,
		    left = e.pageX,
		    top = e.pageY;
		
		// Get the velocity of the pointer.
		data.velocityX = left - data.endX;
		data.velocityY = top - data.endY;
		
		// Get the distance travelled by the pointer.
		data.distX = left - data.startX;
		data.distY = top - data.startY;

		// Update the stored pointer position.
		data.endX = left;
		data.endY = top;
		
		// Then trigger the move event.
		data.trigger();
	}

	function end(e) {
		var data = e.data,
		    events = getEvents(e);
		
		this.removeEventListener(events.move, move);
		this.removeEventListener(events.end, end);
		
		trigger(data.target, 'moveend', data);
	}

	jQuery.event.special.movestart = {
		setup: function(data, namespaces, eventHandle) {
			this.addEventListener('mousedown', démarrer, {
				passive: false
			});
			
			this.addEventListener('touchstart', démarrer, {
				passive: false
			});
		},
		
		teardown: function(namespaces) {
			this.removeEventListener('mousedown', démarrer);
			this.removeEventListener('touchstart', démarrer);
		},

		add: function(handleObj) {
			var old_handler = handleObj.handler;
			
			handleObj.handler = function(e) {
				var data = {},
				    events = getEvents(e);
				
				data.target = e.target;
				data.startX = e.pageX;
				data.startY = e.pageY;
				data.endX = e.pageX;
				data.endY = e.pageY;
				data.move = move;
				data.end = end;
				
				// Throttle the move event to the next animation frame.
				data.trigger = function() {
					trigger(data.target, 'move', data);
				};
				
				e.data = data;
				
				old_handler.apply(this, arguments);
			};
		}
	};
	
	jQuery.event.special.move = {
		setup: function() {
			// This is a dummy event. It's here so that jQuery moves
			// the data from the movestart event to the move event,
			// and movestart can be used to set up the move event.
		},
		
		teardown: function() {
			// As above.
		}
	};
	
	jQuery.event.special.moveend = {
		setup: function() {
			// As above.
		},
		
		teardown: function() {
			// As above.
		}
	};
	
	return jQuery;
});

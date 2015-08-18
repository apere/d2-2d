// ****************
// *	This file is where you want to keep all the JS that will be used on every page.
// *  If your project is very large, you may want to break this up a bit
// ****************
$( document ).ready(function() {
	
	// ****************
	// * Variables
	// * This is where you may want to initialize many of the JS variables to be used below
	// ****************
	var win = $(window);
	
	// ****************
	// * Navigation
	// * This is where you may want to add JS that involves navigation (e.g. menus sliding out, go to url, etc.)
	// ****************
	
	// **
	// * Bind a function to window reisizing
	// **
	win.on('resize', onWindowResize);
	onWindowResize(); // call the function on page load
	
	
	
	
	
	
	// ****************
	// * Custom Functions
	// * Try to modularize your code as much as possible by creating little functins
	// * that can be used in multiple places
	// ****************
	
	
	// **
	// * Function to be called when the window was resized;
	// * params:
	// * event - (object) the event object that is always passed in during an event
	// **
	function onWindowResize(event) {
		var newWidth = window.outerWidth;
		var newHeight = window.outerHeight;
		
		// Now do something with these new values
		toggleDesktop(newWidth > 700);
	}
	
	// **
	// * Toggle the class 'desktop-mode' on the HTML element. This allows you to have different styles for mobile 
	// * & desktop without having a million media queries.
	// * params:
	// * bool - (boolean) determines whether or not the HTML elemnt will have class 'desktop-mode'
	// **
  function toggleDesktop(bool) {
		$('html').toggleClass('desktop-mode', bool);
	 }
	
	
});
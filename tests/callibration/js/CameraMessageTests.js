/*
Copyright 2010 University of Toronto

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one of these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
*/

/*global jQuery*/
/*global fluid*/
/*global jqUnit*/
/*global expect*/
/*global decapod*/

(function ($) {
	
	var component;
	
	var setup = function () {
		component = decapod.message("dc-message");
	}
	
	/**
	 * Returns the text of the passed selector
	 * 
	 * @param {Object} component
	 * @param {Object} selector, a selector for the element who's text is returned
	 */
	var getText = function (component, selector) {
		return component.locate(selector).text();
	};
	
	/**
	 * Returns the url of the passed selector (only works for links)
	 * 
	 * @param {Object} component
	 * @param {Object} selector, a selector for the element who's url is returned
	 */
	var getURL = function (component, selector) {
		return component.locate(selector).attr("href");
	}
	
	/**
	 * Asserts the error state for a given error
	 * 
	 * @param {Object} component
	 * @param {Object} error, the error that should be displayed
	 */
	var assertErrorStrings = function (component, error) {
		var str = component.options.strings;
		var url = component.options.urls;
		
		jqunit.assertEquals("The " + error + " message is set", str[error], getText(component, "message"));
		jqunit.assertEquals("The supported cameras message is set", str.supportedCamerasMessage, getText(component, "supportedCamerasMessage"));
		jqunit.assertEquals("The supported cameras link text is set", str.supportedCamerasLink, getText(component, "supportedCamerasLink"));
		jqunit.assertEquals("The supported cameras link url is set", url.supportedCamerasLink, getURL(component, "supportedCamerasLink"));
		jqunit.assertEquals("The retry link text is set", str.retryLink, getText(component, "retryLink"));
		jqunit.assertEquals("The retry link url is set", url.retryLink, getText(component, "retryLink"));
		jqunit.assertEquals("The skip link text is set", str.skipLink, getText(component, "skipLink"));
		jqunit.assertEquals("The skip link url is set", url.skipLink, getURL(component, "skipLink"));
		jqunit.assertEquals("The warning message is set", str.skipWarningError, getText(component, "warning"));
	}
	
	$(document).ready(function () {
		var messageTests = new jqUnit.TestCase("Message Tests", setup);
		
		messageTests.test("Success Message", function () {
			// assert success message
			// assert continue text
			// assert continue url
			// assert skip text
			// assert skip url
			// assert warning message
			// assert no supported cameras message 
			// assert no supported cameras link
		});
		
		messageTests.test("One Camera and Incompatible Error Message", function () {
			var error = "";
			
			component.errorMessage(error);
            assertErrorStrings(component, error);
        });
		
		messageTests.test("One Camera Connected and Incompatible Error Message", function () {
            var error = "";
            
            component.errorMessage(error);
            assertErrorStrings(component, error);
        });
		
		messageTests.test("One Camera Compatible One Not Error Message", function () {
            var error = "";
            
            component.errorMessage(error);
            assertErrorStrings(component, error);
        });
        
		messageTests.test("One Camera Connected and Compatible Error Message", function () {
            var error = "";
            
            component.errorMessage(error);
            assertErrorStrings(component, error);
        });
		
		messageTests.test("Cameras Not Matching and Both Incompatible Error Message", function () {
            var error = "";
            
            component.errorMessage(error);
            assertErrorStrings(component, error);
        });
		
		messageTests.test("Cameras Not Matching and Both Compatible Error Message", function () {
            var error = "";
            
            component.errorMessage(error);
            assertErrorStrings(component, error);
        });
		
		messageTests.test("Both Cameras are Incompatible Error Message", function () {
            var error = "";
            
            component.errorMessage(error);
            assertErrorStrings(component, error);
        });
		
		messageTests.test("No Cameras Connected Error Message", function () {
            var error = "";
            
            component.errorMessage(error);
            assertErrorStrings(component, error);
        });
	})
})(jQuery);

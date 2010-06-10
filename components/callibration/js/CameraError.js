/*
Copyright 2009 University of Toronto

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one of these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
*/

/*global jQuery*/
/*global fluid*/
/*global decapod*/

var decapod = decapod || {};

(function ($) {
	
	/**
	 * Creates a selector map
	 * 
	 * @param {Object} selectors, an object literal of the selectors
	 */
	var generateCutpoints = function (selectors) {
		var cutpoints = [];
		for (var key in selectors) {
			cutpoints.push({
				id: key,
				selector: selectors[key]
			});
		}
		return cutpoints;
	};
	
	var generateTree = function (opts) {
		var str = opts.strings;
		var url = opts.urls;
		return {
			children: [
			    {
					ID: "message",
					value: str.message
				},
				{
					ID: "requirement",
					value: str.requirement
				},
				{
					ID: "warning",
					value: str.warning
				},
				{
					ID: "requirementLink",
					linktext: str.requirementLink,
					target: url.requirementLink
				},
				{
					ID: "retryLink",
					linktext: str.retryLink,
					target: url.retryLink
				},
				{
					ID: "skipLink",
					linktext: str.skipLink,
					target: url.skipLink
				}
			]
		};
	};
	
	var render = function (that, container) {
		var tree = generateTree(that.options);
        var opts = {
            cutpoints: generateCutpoints(that.options.selectors)
        };
		
		if (that.templates) {
			fluid.reRender(that.templates, container, tree, opts);
		} else {
			that.templates = fluid.render(that, container, tree, opts);
		}
	};
	
	var bindEvents = function (that) {
		// Add a click event that calls cameraChecker to retest the cameras
		
		that.locate("retryLink").click(function () {
			
		});
	};
	
	var setup = function (that) {
		render(that);
	};
	
	/**
	 * 
	 * 
	 * @param {Object} container
	 * @param {Object} options
	 */
    decapod.cameraError = function (container, options) {
        var that = fluid.initView("decapod.cameraError", container, options);
		
		setup();
		
        return that;
    };
    
    fluid.defaults("decapod.cameraError", {
        
        selectors: {
            message: ".dc-cameraError-message",
            requirement: ".dc-cameraError-requirement",
            requirementLink: ".dc-cameraError-requirementLink",
            retryLink: ".dc-cameraError-retryLink",
            skipLink: ".dc-cameraError-skipLink",
            warning: ".dc-cameraError-warning"
		},
        
        styles: {
            
		},
		
		strings: {
			message: "It seems like no cameras are connected.",
            requirement: "Decapod requires two matching, ",
            requirementLink: "supported cameras",
            retryLink: "Try again",
            skipLink: "Skip camera setup",
            warning: "(You won't be able to capture)"
		},
        
        events: {
			afterRender: null
		},
		
		urls: {
			retry: "#_",
			requirementLink: "#_",
			skipLink: "#_"
		}
    });
    
})(jQuery);

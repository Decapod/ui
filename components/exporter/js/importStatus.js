/*
Copyright 2012 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one of these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
*/

// Declare dependencies
/*global window, decapod:true, fluid, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {

    fluid.registerNamespace("decapod.importStatus");
    
    decapod.importStatus.setNumValidFiles = function (that, numValidFiles) {
    	that.totalNumFiles -= that.numValidFiles;
    	that.numValidFiles = numValidFiles;
    	that.totalNumFiles += numValidFiles;
    };
    
    decapod.importStatus.addError = function (that, error) {
    	that.numInvalidFiles += 1;
    	that.errors[error] += 1;
    	that.totalNumFiles += 1;
    };
    
    decapod.importStatus.reset = function (that) {
    	var errorNums = that.options.errorNums
        that.totalNumFiles = 0;
        that.numValidFiles = 0;
        that.numInvalidFiles = 0;
        
        for (var i = 0; i < errorNums.length; i++ ) {
            that.errors[errorNums[i]] = 0;
        }
    };
    
    decapod.importStatus.statusMessages = function (that, values) {
    	var strings = that.options.strings;
    	var messages = [];
    	values = values || {};
    	values["totalNumFiles"] = that.totalNumFiles;
    	values["numValidFiles"] = that.numValidFiles;
    	values["numInvalidFiles"] = that.numInvalidFiles;
    	fluid.merge("replace", values, that.errors);
    	
    	messages.push(fluid.stringTemplate(strings.total, values));
    	for (error in that.errors) {
    		var numErrors = that.errors[error];
    		if (numErrors > 0 ) {
    			messages.push(fluid.stringTemplate(strings[error], values))
    		}
    	}
    	
    	return messages;
    };
    
    decapod.importStatus.renderStatuses = function (that) {
    	that.renderer.model.statuses = that.statusMessages()
    	that.renderer.refreshView();
    };
    
    decapod.importStatus.finalInit = function (that) {
    	var errorNums = that.options.errorNums
    	that.errors = {};
        that.reset();
    };
    
    fluid.defaults("decapod.importStatus", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        finalInitFunction: "decapod.importStatus.finalInit",
        components: {
        	renderer: {
        		type: "decapod.importStatus.renderer",
        		container: "{importStatus}.options.selectors.messageContainer",
        		options: {
        			renderOnInit: false
        		}
        	}
        },
        invokers: {
        	setNumValidFiles: "decapod.importStatus.setNumValidFiles",
        	addError: "decapod.importStatus.addError",
        	reset: "decapod.importStatus.reset",
        	statusMessages: "decapod.importStatus.statusMessages",
        	renderStatuses: "decapod.importStatus.renderStatuses"
        },
        selectors: {
        	messageContainer: ".dc-importStatus-messageContainer"
        },
        errorNums: [-100, -110, -120, -130],
        strings: {
	        "total": "%totalNumFiles files found.",
	        "-100": "%-100 files exceeded the queue limit",
	        "-110": "%-110 files exceeded the size limit",
	        "-120": "%-120 files were empty (0 bytes)",
	        "-130": "%-130 files had an invalid file type"
        }
    });
    
    fluid.registerNamespace("decapod.importStatus.renderer");
    
    decapod.importStatus.renderer.produceTree = function (that) {
    	return {
	        expander: {
	            type: "fluid.renderer.repeat",
	            repeatID: "statusMessages:",
	            controlledBy: "statuses",
	            pathAs: "statusPath",
	            tree: {
	                value: "${{statusPath}}"
	            }
	        }
    	};
    };
    
    fluid.defaults("decapod.importStatus.renderer", {
    	gradeNames: ["fluid.rendererComponent", "autoInit"],
    	selectors: {
    		statusMessages: ".dc-importStatus-renderer-statusMessage" 
    	},
    	repeatingSelectors: ["statusMessages"],
    	model: {
    		statuses: []
    	},
    	produceTree: "decapod.importStatus.renderer.produceTree",
        renderOnInit: true
    });
    
})(jQuery);

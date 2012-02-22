/*
Copyright 2012 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one of these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
*/

// Declare dependencies
/*global window, decapod:true, expect, fluid, jQuery, jqUnit*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {
    var CONTAINER = ".dc-importStatus";
    var RENDER_CONTAINER = ".dc-importStatus-renderer";
    
    var PROTO_TREE = {
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
    
    $(document).ready(function () {
        
        var assertReset = function (importStatus) {
        	jqUnit.assertEquals("The totalNumFiles should be reset", 0, importStatus.totalNumFiles);
        	jqUnit.assertEquals("The numValidFiles should be reset", 0, importStatus.numValidFiles);
        	jqUnit.assertEquals("The numInvalidFiles should be reset", 0, importStatus.numInvalidFiles);
        	
        	for (error in importStatus.errors) {
        		jqUnit.assertEquals("The count for error " + error + " should be reset", 0, importStatus.errors[error]);
        	}
        };
        
        var tests = jqUnit.testCase("Decapod Import Status");
        
        tests.test("Init importStatus tests", function () {
            var importStatus = decapod.importStatus(CONTAINER);
            jqUnit.assertTrue("The importStatus component should have initialized", importStatus);
            jqUnit.assertEquals("Initial number of valid files found", 0, importStatus.numValidFiles);
            jqUnit.assertEquals("Initial number of invalid files found", 0, importStatus.numInvalidFiles);
            for (error in importStatus.errors) {
            	jqUnit.assertEquals("The initial number of errors of type " + error, 0, importStatus.errors[error]);
            }
            jqUnit.assertEquals("Initial total number of files found", 0, importStatus.totalNumFiles);
        });
        
        tests.test("setNumValidFiles", function () {
        	var importStatus = decapod.importStatus(CONTAINER);
        	var numValidFiles = 5;
        	var mockThat = {
        		totalNumFiles: 0,
        		numValidFiles: 0
        	};
        	
        	decapod.importStatus.setNumValidFiles(mockThat, numValidFiles);
        	jqUnit.assertEquals("numValidFiles is set - global function", numValidFiles, mockThat.numValidFiles);
        	jqUnit.assertEquals("The totalNumFiles should be updated - through the component", numValidFiles, mockThat.totalNumFiles);
        	
        	importStatus.setNumValidFiles(numValidFiles);
        	jqUnit.assertEquals("numValidFiles is set - through the component", numValidFiles, importStatus.numValidFiles);
        	jqUnit.assertEquals("The totalNumFiles should be updated - through the component", numValidFiles, importStatus.numValidFiles);
        });
        
        tests.test("addError", function () {
        	var importStatus = decapod.importStatus(CONTAINER);
        	var mockThat = {
        		totalNumFiles: 0,
        		numInvalidFiles: 0,
        		errors: {
        			"-100": 0,
        			"-110": 0,
        			"-120": 0,
        			"-130": 0
        		}
        	};
        	for (error in mockThat.errors) {
        		var eNum = parseInt(error, 10);
        		decapod.importStatus.addError(mockThat, eNum);
        		importStatus.addError(eNum)
        		
        		jqUnit.assertEquals("A " + eNum + " error should be added - global function", 1, mockThat.errors[eNum]);
                jqUnit.assertEquals("A " + eNum + " error should be added - through the component", 1, importStatus.errors[eNum]);
        	}
        	jqUnit.assertEquals("numInvalidFiles is updated - global function", 4, mockThat.numInvalidFiles);
        	jqUnit.assertEquals("numInvalidFiles is updated - through the component", 4, importStatus.numInvalidFiles);
        	
            jqUnit.assertEquals("numValidFiles is set - through the component", 4, importStatus.totalNumFiles);
            jqUnit.assertEquals("The totalNumFiles should be updated - through the component", 4, importStatus.totalNumFiles);
        });
        
        tests.test("decapod.importStatus.reset", function () {
        	var mockThat = {
        		options: {
        			errorNums: [-100, -110, -120, -130]
        		},
                totalNumFiles: 11,
                numInvalidFiles: 6,
                numValidFiles: 5,
                errors: {
                    "-100": 3,
                    "-110": 2,
                    "-120": 1,
                    "-130": 0
                }
        	};
        	
        	decapod.importStatus.reset(mockThat);
        	assertReset(mockThat);
        });
        
        tests.test("reset", function () {
        	var importStatus = decapod.importStatus(CONTAINER);
        	importStatus.setNumValidFiles(10);
        	for (error in importStatus.errors) {
        		importStatus.addError(error);
        	}
        	importStatus.reset();
        	assertReset(importStatus);
        });
        
        tests.test("decapod.importStatus.statusMessages", function () {
           var mockThat = {
                options: {
                    errorNums: [-100, -110, -120, -130],
	                strings: {
	                    "total": "%totalNumFiles files found.",
	                    "-100": "%-100 files exceeded the queue limit",
	                    "-110": "%-110 files exceeded the size limit (%sizeLimit)",
	                    "-120": "%-120 files were empty (0 bytes)",
	                    "-130": "%-130 files had an invalid file type"
	                }
                },
                totalNumFiles: 12,
                numInvalidFiles: 7,
                numValidFiles: 5,
                errors: {
                    "-100": 3,
                    "-110": 2,
                    "-120": 1,
                    "-130": 1
                }
            };
            var expectedMessages = [
                "12 files found.",
                "3 files exceeded the queue limit",
                "2 files exceeded the size limit (400MB)",
                "1 files were empty (0 bytes)",
                "1 files had an invalid file type"
            ];
            
            var messages = decapod.importStatus.statusMessages(mockThat, {sizeLimit: "400MB"});
            jqUnit.assertDeepEq("The status messages should have been generated", expectedMessages, messages);
        });
        
        tests.test("statusMessages", function () {
        	var importStatus = decapod.importStatus(CONTAINER);
            importStatus.setNumValidFiles(10);
            for (error in importStatus.errors) {
                importStatus.addError(error);
            }
            var expectedMessages = [
                "14 files found.",
                "1 files exceeded the queue limit",
                "1 files exceeded the size limit",
                "1 files were empty (0 bytes)",
                "1 files had an invalid file type"
            ];
            
            var messages = importStatus.statusMessages();
            jqUnit.assertDeepEq("The status messages should have been generated", expectedMessages, messages);
        });
        
        tests.test("renderStatuses - 0 files", function () {
        	var importStatus = decapod.importStatus(CONTAINER);
        	var expectedMessage = "0 files found.";
        	importStatus.renderStatuses();
        	var messages = importStatus.renderer.locate("statusMessages");
        	jqUnit.assertEquals("Only the 1 status should be rendered", 1, messages.length);
        	jqUnit.assertEquals("The total status should be rendered", expectedMessage, messages.text());
        });
        
        tests.test("renderStatuses - some errors", function () {
            var importStatus = decapod.importStatus(CONTAINER);
            var expectedMessages = [
                "2 files found.",
                "1 files exceeded the queue limit",
                "1 files exceeded the size limit"
            ];
            importStatus.addError(-100);
            importStatus.addError(-110);
            importStatus.renderStatuses();
            var messages = importStatus.renderer.locate("statusMessages");
            jqUnit.assertEquals("The statuses should be rendered", 3, messages.length);
            messages.each(function (idx, message) {
            	jqUnit.assertEquals("The message should be rendered", expectedMessages[idx], $(message).text());
            });
        });
        
        tests.test("renderStatuses - all errors", function () {
            var importStatus = decapod.importStatus(CONTAINER);
            var expectedMessages = [
                "4 files found.",
                "1 files exceeded the queue limit",
                "1 files exceeded the size limit",
                "1 files were empty (0 bytes)",
                "1 files had an invalid file type"
            ];
            importStatus.addError(-100);
            importStatus.addError(-110);
            importStatus.addError(-120);
            importStatus.addError(-130);
            importStatus.renderStatuses();
            var messages = importStatus.renderer.locate("statusMessages");
            jqUnit.assertEquals("The statuses should be rendered", 5, messages.length);
            messages.each(function (idx, message) {
                jqUnit.assertEquals("The message should be rendered", expectedMessages[idx], $(message).text());
            });
        });
        
        tests.test("Init importStatus.renderer tests", function () {
        	var renderer = decapod.importStatus.renderer(RENDER_CONTAINER);
        	jqUnit.assertTrue("The importStatus.renderer component should have initialized", renderer);
        });
        
        tests.test("decapod.importStatus.renderer.produceTree - empty model", function () {
        	var mockThat = {
		        selectors: {
		            statusMessages: ".dc-importStatus-renderer-statusMessage" 
		        },
		        repeatingSelectors: ["statusMessages"],
		        model: {
		            statuses: []
		        }
        	};

        	var producedTree = decapod.importStatus.renderer.produceTree(mockThat);
        	jqUnit.assertDeepEq("The proto tree should be produced", PROTO_TREE, producedTree);
        });
        
        tests.test("render - no statuses", function () {
        	var renderer = decapod.importStatus.renderer(RENDER_CONTAINER);
        	jqUnit.assertEquals("There should be no statuses rendered", 0, renderer.locate("statusMessages").length);
        });
        
        tests.test("renderer - statuses", function () {
        	var statuses = ["status 1", "status 2"];
        	
        	var renderer = decapod.importStatus.renderer(RENDER_CONTAINER, {model: {statuses: statuses}});
        	jqUnit.assertEquals("The statuses should be rendered", statuses.length, renderer.locate("statusMessages").length);
        	for (var i = 0; i < statuses.length; i++) {
        		jqUnit.assertEquals("The status message should be rendered", statuses[i], renderer.locate("statusMessages").eq(i).text());
        	}
        });
        
      
    });
})(jQuery);

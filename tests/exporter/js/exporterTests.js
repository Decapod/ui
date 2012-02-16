/*
Copyright 2012 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one of these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
*/

// Declare dependencies
/*global window, decapod:true, expect, fluid, jQuery, jqUnit, start*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {
	var CONTAINER = ".dc-exporter"
    $(document).ready(function () {
        
        var tests = jqUnit.testCase("Decapod Export");
        
        tests.test("Init tests", function () {
            var exporter = decapod.exporter(CONTAINER);
            jqUnit.assertTrue("The component should have initialized", exporter);
        });
        
        tests.test("Add error", function () {
        	var exporter = decapod.exporter(CONTAINER);
        	
        	exporter.uploader.events.onQueueError.fire({}, -100);
        	jqUnit.assertEquals("The error should be added", 1, exporter.importStatus.errors["-100"]);
        	jqUnit.assertEquals("The total number of files should be updated", 1, exporter.importStatus.totalNumFiles);
        	jqUnit.assertEquals("The number of invalid files should be updated", 1, exporter.importStatus.numInvalidFiles);
        });
        
        tests.test("Add validFiles", function () {
        	
        });
        
        tests.test("Render status messages", function () {
        	
        });
    });
})(jQuery);

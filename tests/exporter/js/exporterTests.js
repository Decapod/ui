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
    var CONTAINER = ".dc-exporter";
    var STATUS_TOGGLE_CONTAINER = ".dc-exporterStatusToggle";
    $(document).ready(function () {
        
        var exporterTests = jqUnit.testCase("Decapod Export");
        
        exporterTests.test("Init tests", function () {
            var exporter = decapod.exporter(CONTAINER);
            jqUnit.assertTrue("The component should have initialized", exporter);
            jqUnit.assertTrue("The instructions are shown", exporter.locate("importMessages").hasClass(exporter.statusToggle.options.styles.showInstructions));
        });
        
        exporterTests.test("Add error", function () {
            var exporter = decapod.exporter(CONTAINER);
        
            exporter.uploader.events.onQueueError.fire({}, -100);
            jqUnit.assertEquals("The error should be added", 1, exporter.importStatus.errors["-100"]);
            jqUnit.assertEquals("The total number of files should be updated", 1, exporter.importStatus.totalNumFiles);
            jqUnit.assertEquals("The number of invalid files should be updated", 1, exporter.importStatus.numInvalidFiles);
        });
        
        exporterTests.test("Add validFiles", function () {
            var numFiles = 10;
            var exporter = decapod.exporter(CONTAINER);
            
            exporter.uploader.events.afterFileDialog.fire(numFiles);
            jqUnit.assertEquals("The total number of files should be updated", numFiles, exporter.importStatus.totalNumFiles);
            jqUnit.assertEquals("The number of valid files should be updated", numFiles, exporter.importStatus.numValidFiles);
        });
        
        exporterTests.test("Render status messages", function () {
            var exporter = decapod.exporter(CONTAINER);
        
            exporter.uploader.events.onQueueError.fire({}, -100);
            exporter.uploader.events.afterFileDialog.fire(10);
            jqUnit.assertEquals("The error should be added", 1, exporter.importStatus.errors["-100"]);
            jqUnit.assertEquals("The total number of files should be updated", 11, exporter.importStatus.totalNumFiles);
            jqUnit.assertEquals("The number of invalid files should be updated", 1, exporter.importStatus.numInvalidFiles);
            jqUnit.assertEquals("The number of valid files should be updated", 10, exporter.importStatus.numValidFiles);
            var renderedStatuses = exporter.importStatus.renderer.locate("statusMessages");
            jqUnit.assertEquals("The statuses should have been rendered", 2, renderedStatuses.length);
            jqUnit.assertEquals("The total files message should be rendered", "11 files found.", renderedStatuses.eq(0).text());
            jqUnit.assertEquals("The total files message should be rendered", "1 files exceeded the queue limit", renderedStatuses.eq(1).text());
            jqUnit.assertTrue("The status messages should be shown", exporter.locate("importMessages").hasClass(exporter.statusToggle.options.styles.showStatus));
        });
        
        var exporterStatusToggleTests = jqUnit.testCase("Decapod Exporter Status Toggle Tests");
        
        exporterStatusToggleTests.test("Init Tests", function () {
            var that = decapod.exporter.statusToggle(STATUS_TOGGLE_CONTAINER);
            var styles = that.options.styles;
            jqUnit.assertTrue("The component should have initialized", that);
            jqUnit.assertTrue("The showInstructions style should be applied", that.container.hasClass(styles.showInstructions));
            jqUnit.assertTrue("The status style should be applied", that.locate("status").hasClass(styles.status));
            jqUnit.assertTrue("The instructions style should be applied", that.locate("instructions").hasClass(styles.instructions));
        });
        
        exporterStatusToggleTests.test("Show Status On Init", function () {
            var that = decapod.exporter.statusToggle(STATUS_TOGGLE_CONTAINER, {
                styleOnInit: "showStatus"
            });
            jqUnit.assertTrue("The showStatus style should be applied", that.container.hasClass(that.options.styles.showStatus));
        });
        
        exporterStatusToggleTests.test("decapod.exporter.statusToggle.setContainerStyle", function () {
            var testStyle = "testStyle";
            var mockThat = {
                options: {
                    styles: {
                        test: testStyle
                    }
                },
                container: $(STATUS_TOGGLE_CONTAINER)
            };
        
            decapod.exporter.statusToggle.setContainerStyle(mockThat, "test");
            jqUnit.assertTrue("The style has been applied", mockThat.container.hasClass(testStyle));
        });
        
        exporterStatusToggleTests.test("setContainerStyle", function () {
            var testStyle = "testStyle";
            var that = decapod.exporter.statusToggle(STATUS_TOGGLE_CONTAINER, {
                styles: {
                    test: testStyle
                }
            });
            that.setContainerStyle("test");
            jqUnit.assertTrue("The test style should be applied", that.container.hasClass(testStyle));
        });
        
        exporterStatusToggleTests.test("showStatus", function () {
            var that = decapod.exporter.statusToggle(STATUS_TOGGLE_CONTAINER);
            that.showStatus();
            jqUnit.assertTrue("The showStatus style should be applied", that.container.hasClass(that.options.styles.showStatus));
            jqUnit.assertFalse("The showInstructions style should not be applied", that.container.hasClass(that.options.styles.showInstructions));
        });
        
        exporterStatusToggleTests.test("showInstructions", function () {
            var that = decapod.exporter.statusToggle(STATUS_TOGGLE_CONTAINER, {
                styleOnInit: "showStatus"
            });
            that.showInstructions();
            jqUnit.assertTrue("The showInstructions style should be applied", that.container.hasClass(that.options.styles.showInstructions));
            jqUnit.assertFalse("The showStatus style should not be applied", that.container.hasClass(that.options.styles.showStatus));
        });
    });
})(jQuery);

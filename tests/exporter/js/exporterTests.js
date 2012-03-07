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
    $(document).ready(function () {
        
        var eventBinderTests = jqUnit.testCase("Decapod Event Binder");
        
        eventBinderTests.test("Init tests", function () {
            var eventBinder = decapod.exporter.eventBinder();
            jqUnit.assertTrue("The component should have initialized", eventBinder);
        });
        
        var exporterTests = jqUnit.testCase("Decapod Export");
        
        exporterTests.test("Init tests", function () {
            var exporter = decapod.exporter(CONTAINER);
            jqUnit.assertTrue("The component should have initialized", exporter);
            jqUnit.isVisible("The instructions are shown", exporter.locate("instructions"));
            jqUnit.notVisible("The status messages are not show", exporter.locate("importStatusContainer"));
        });
        
        exporterTests.test("Add error", function () {
            var exporter = decapod.exporter(CONTAINER);
            
            exporter.uploader.events.onFileError.addListener(function () {
                jqUnit.assertEquals("The error should be added", 1, exporter.importStatus.errors["-100"]);
                jqUnit.assertEquals("The total number of files should be updated", 1, exporter.importStatus.totalNumFiles);
                jqUnit.assertEquals("The number of invalid files should be updated", 1, exporter.importStatus.numInvalidFiles);
            });
            exporter.uploader.events.onQueueError.fire({}, -100);
            
        });
        
        exporterTests.test("Add validFiles", function () {
            var numFiles = 10;
            var exporter = decapod.exporter(CONTAINER);
            
            exporter.uploader.events.afterFileDialog.fire(numFiles);
            jqUnit.assertEquals("The total number of files should be updated", numFiles, exporter.importStatus.totalNumFiles);
            jqUnit.assertEquals("The number of valid files should be updated", numFiles, exporter.importStatus.numValidFiles);
        });
        
        exporterTests.asyncTest("Render status messages", function () {
            var exporter = decapod.exporter(CONTAINER);
            var assertVisibility = function () {
                jqUnit.notVisible("The instructions should be hidden", exporter.locate("instructions"));
                jqUnit.isVisible("The status messages should be shown", exporter.locate("importStatusContainer"));
                start();
            };
            exporter.statusToggle.events.afterModelChanged.addListener(assertVisibility);
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
        });
        
        // TODO: Test what type of upload should be generated
        exporterTests.asyncTest("Start upload", function () {
            jqUnit.expect(1);
            var exporter = decapod.exporter(CONTAINER);
            
            exporter.uploader.events.onUploadStart.addListener(function () {
                jqUnit.assertTrue("The onUploadStart event from the uploader should have fired", true);
                start();
            });
            // hack to prevent the uploader from actually trying to upload anything.
            // this allows for the testing of just the event without errors being thrown for the empty queue
            exporter.uploader.strategy.remote.uploadNextFile = function () {};
            exporter.events.onExportStart.fire();
        });
        
        var testOnExportStartTrigger = function (subComponent) {
            var triggerEvent = function (pdfExporter) {
                pdfExporter.locate("exportControl").click();
            };
            var opts = {
                listeners: {
                    onExportStart: function () {
                        jqUnit.assertTrue("The onExportStart event fired", true);
                        start();
                    }
                },
                components: {}
            };
            
            opts.components[subComponent] = {
                options: {
                    events: {
                        afterControls: {
                            event: "afterControlsRendered"
                        }
                    },
                    listeners: {
                        afterControls: {
                            listener: triggerEvent,
                            priority: "last"
                        }
                    }
                }
            };
            var exporter = decapod.exporter(CONTAINER, opts);
        };
        
        exporterTests.asyncTest("imagePDF trigger onExportStart", function () {
            testOnExportStartTrigger("imagePDF");
        });
        exporterTests.asyncTest("ocrPDF trigger onExportStart", function () {
            testOnExportStartTrigger("ocrPDF");
        });
        exporterTests.asyncTest("tracedPDF trigger onExportStart", function () {
            testOnExportStartTrigger("tracedPDF");
        });
    });
})(jQuery);

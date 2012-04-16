/*
Copyright 2012 OCAD University 

Licensed under the Apache License, Version 2.0 (the "License"); 
you may not use this file except in compliance with the License. 
You may obtain a copy of the License at 

   http://www.apache.org/licenses/LICENSE-2.0 

Unless required by applicable law or agreed to in writing, software 
distributed under the License is distributed on an "AS IS" BASIS, 
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
See the License for the specific language governing permissions and 
limitations under the License.
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
        
        eventBinderTests.asyncTest("onReady", function () {
            jqUnit.expect(1);
            var testEvent = function () {
                jqUnit.assertTrue("The onReady event should have fired", true);
                start();
            };
            decapod.exporter.eventBinder({
                listeners: {
                    onReady: testEvent
                }
            });
        });
        
        var serverResetTests = jqUnit.testCase("Decapod Server Reset");
        
        serverResetTests.test("Init tests", function () {
            var serverReset = decapod.exporter.serverReset();
            jqUnit.assertTrue("The component should have initialized", serverReset);
        });
        
        serverResetTests.test("Delete tests", function () {
            var URL = "http://localhost/testurl";
            fluid.registerNamespace("decapod.tests.serverResetTests.mockDataSource");
            
            decapod.tests.serverResetTests.mockDataSource.del = function (that) {
                jqUnit.assertTrue("The delete function should have fired", true);
                jqUnit.assertEquals("The correct URL should have been passed to the datasource", URL, that.options.url);
            };
            
            fluid.defaults("decpod.tests.serverResetTests.mockDataSource", {
                gradeNames: ["fluid.littleComponent", "autoInit"],
                invokers: {
                    "delete": {
                        funcName: "decapod.tests.serverResetTests.mockDataSource.del",
                        args: ["{mockDataSource}"]
                    }
                }
            });
            var serverReset = decapod.exporter.serverReset({
                components: {
                    dataSource: {
                        type: "decpod.tests.serverResetTests.mockDataSource",
                        options: {
                            url: URL
                        }
                    }
                }
            });
        });
        
        var exporterTests = jqUnit.testCase("Decapod Export");
        
        exporterTests.test("Init tests", function () {
            var exporter = decapod.exporter(CONTAINER);
            jqUnit.assertTrue("The component should have initialized", exporter);
            jqUnit.isVisible("The instructions are shown", exporter.locate("instructions"));
            jqUnit.notVisible("The status messages are not show", exporter.locate("importStatusContainer"));
        });
        
        exporterTests.asyncTest("onReady", function () {
            jqUnit.expect(1);
            var testEvent = function () {
                jqUnit.assertTrue("The onReady event should have fired", true);
                start();
            };
            decapod.exporter(CONTAINER, {
                listeners: {
                    onReady: testEvent
                }
            });
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
        
        exporterTests.asyncTest("startImport", function () {
            jqUnit.expect(3);
            var exporter = decapod.exporter(CONTAINER);
            var exportType = exporter.imagePDF;
            
            exporter.events.onImportStart.addListener(function () {
                jqUnit.assertTrue("The onImportStart event should have fired", true);
                jqUnit.assertDeepEq("The exportType should have been set", exportType, exporter.exportType);
            });
            
            exporter.uploader.events.onUploadStart.addListener(function () {
                jqUnit.assertTrue("The onUploadStart event from the uploader should have fired", true);
                start();
            });
            // hack to prevent the uploader from actually trying to upload anything.
            // this allows for the testing of just the event without errors being thrown for the empty queue
            exporter.uploader.strategy.remote.uploadNextFile = function () {};
            exporter.startImport(exportType);
        });
        
        exporterTests.asyncTest("startExport", function () {
            jqUnit.expect(4);
            
            var exporter = decapod.exporter(CONTAINER);
            var exportType = exporter.imagePDF;
            exporter.exportType = exportType;
            
            exporter.events.onExportStart.addListener(function () {
                jqUnit.assertTrue("The onExportStart event should have fired", true);
                jqUnit.assertDeepEq("The exportType should have been set", exportType, exporter.exportType);
            });
            
            exporter.events.afterExportComplete.addListener(function () {
                jqUnit.assertTrue("The afterExportComplete event should have fired", true);
                jqUnit.assertNull("The exportType should be reset to null", exporter.exportType);
                start();
            });
            
            exporter.startExport();
        });
        
        exporterTests.asyncTest("validateQueue", function () {
            jqUnit.expect(1);
            
            var exporter = decapod.exporter(CONTAINER);
            exporter.events.afterQueueReady.addListener(function () {
                jqUnit.assertTrue("The afterQueueReady event should have fired", true);
                start();
            });
            
            exporter.validateQueue(); // should do nothing
            exporter.importStatus.numValidFiles = 1;
            exporter.validateQueue();
        });
        
        exporterTests.asyncTest("afterQueueReady", function () {
            jqUnit.expect(3);
            
            var pdfExporters = ["imagePDF", "ocrPDF", "tracedPDF"];
            var triggerEvent = function (that) {
                that.events.afterQueueReady.fire();
            };
            var testEvent = function (that) {
                $.each(pdfExporters, function (idx, pdfExporter) {
                    var decorators = fluid.renderer.getDecoratorComponents(that[pdfExporter].exportControls);
                    for (var decorator in decorators) {
                        jqUnit.assertTrue("The start export button for, " + pdfExporter + ", is rendered", decorator.indexOf("trigger") > -1);
                    };
                });
                start();
            }
            decapod.exporter(CONTAINER, {
                listeners: {
                    afterQueueReady: {
                        listener: testEvent,
                        priority: "last",
                        args: "{exporter}"
                    },
                    onReady: {
                        listener: triggerEvent,
                        priority: "last",
                        args: "{exporter}"
                    }
                }
            });
        })

        // TODO: Cleanup all the if statements
        var testOnExportStartTrigger = function (subComponent) {
            jqUnit.expect(3);
            var triggerEvent = function (pdfExporter, exporter) {
                pdfExporter.exportControls.events.afterRender.addListener(function () {
                    var decorators = fluid.renderer.getDecoratorComponents(pdfExporter.exportControls);
                    var trigger, progress, download = null;
                    for (var key in decorators) {
                        if (key.indexOf("trigger") > -1) {
                            trigger = decorators[key];
                        }
                        if (key.indexOf("progress") > -1) {
                            progress = decorators[key];
                        }
                        if (key.indexOf("download") > -1) {
                            download = decorators[key];
                        }
                    }
                    
                    if (trigger) {
                        trigger.locate("trigger").click();
                    }
                    
                    if (progress) {
                        jqUnit.assertTrue("Progress Displayed", progress);
                        // trigger the uploader's afterUploadeComplete event
                        exporter.uploader.events.afterUploadComplete.fire();
                    }
                    
                    if (download) {
                        var downloadHREF = download.locate("download").attr("href").replace($(location).attr('href'), '');
                        jqUnit.assertEquals("The download href should be set", download.model.downloadURL, downloadHREF);
                        start();
                    }
                });
                exporter.events.afterQueueReady.fire();
            };
            
            var opts = {
                listeners: {
                    onExportStart: function () {
                        jqUnit.assertTrue("The onExportStart event fired", true);
                    }
                },
                components: {}
            };
            
            opts.components[subComponent] = {
                options: {
                    listeners: {
                        onReady: {
                            listener: triggerEvent,
                            args: ["{pdfExporter}", "{exporter}"],
                            priority: "last"
                        }
                    }
                }
            };
            var exporter = decapod.exporter(CONTAINER, opts);
            // hack to prevent the uploader from actually trying to upload anything.
            // this allows for the testing of just the event without errors being thrown for the empty queue
            exporter.uploader.strategy.remote.uploadNextFile = function () {};
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

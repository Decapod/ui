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
        
        eventBinderTests.asyncTest("Init tests", function () {
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
            decapod.exporter.serverReset({
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
        
        exporterTests.asyncTest("Init tests", function () {
            decapod.exporter(CONTAINER, {
                listeners: {
                    onReady: {
                        listener: function (that) {
                            var str = that.options.strings;
                            jqUnit.assertTrue("The component should have initialized", that);
                            jqUnit.isVisible("The instructions are shown", that.locate("instructions"));
                            jqUnit.notVisible("The status messages are not show", that.locate("importStatusContainer"));
                            jqUnit.assertEquals("The title text should be rendered", str.title, that.locate("title").text());
                            jqUnit.assertEquals("The instructions text should be rendered", str.instructions, that.locate("instructions").text());
                            jqUnit.assertEquals("The uploadClear text should be rendered", str.uploadClear, that.locate("uploadClear").text());
                            jqUnit.assertEquals("The formats text should be rendered", str.formats, that.locate("formats").text());
                            jqUnit.assertEquals("The groupName text should be rendered", str.groupName, that.locate("groupName").text());
                            start();
                        },
                        args: ["{exporter}"]
                    }
                }
            });
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
        
        exporterTests.asyncTest("Add error", function () {
            decapod.exporter(CONTAINER, {
                listeners: {
                    onReady: {
                        listener: function (that) {
                            that.uploader.events.onFileError.addListener(function () {
                                jqUnit.assertEquals("The error should be added", 1, that.importStatus.errors["-100"]);
                                jqUnit.assertEquals("The total number of files should be updated", 1, that.importStatus.totalNumFiles);
                                jqUnit.assertEquals("The number of invalid files should be updated", 1, that.importStatus.numInvalidFiles);
                                start();
                            });
                            that.uploader.events.onQueueError.fire({}, -100);
                        },
                        args: ["{exporter}"]
                    }
                }
            });
            
        });
        
        exporterTests.asyncTest("Add validFiles", function () {
            jqUnit.expect(2);
            var numFiles = 10;
            decapod.exporter(CONTAINER, {
                listeners: {
                    onReady: {
                        listener: function (that) {
                            that.importStatus.renderer.events.afterRender.addListener(function () {
                                jqUnit.assertEquals("The total number of files should be updated", numFiles, that.importStatus.totalNumFiles);
                                jqUnit.assertEquals("The number of valid files should be updated", numFiles, that.importStatus.numValidFiles);
                                start();
                            });
                            that.uploader.events.afterFileDialog.fire(numFiles);
                        },
                        args: ["{exporter}"]
                    }
                }
            });
        });

        exporterTests.asyncTest("Render status messages", function () {
            jqUnit.expect(9);
            var assertions = function (that) {
                var renderedStatuses = that.importStatus.renderer.locate("statusMessages");
                jqUnit.notVisible("The instructions should be hidden", that.locate("instructions"));
                jqUnit.isVisible("The status messages should be shown", that.locate("importStatusContainer"));
                jqUnit.assertEquals("The error should be added", 1, that.importStatus.errors["-100"]);
                jqUnit.assertEquals("The total number of files should be updated", 11, that.importStatus.totalNumFiles);
                jqUnit.assertEquals("The number of invalid files should be updated", 1, that.importStatus.numInvalidFiles);
                jqUnit.assertEquals("The number of valid files should be updated", 10, that.importStatus.numValidFiles);
                jqUnit.assertEquals("The statuses should have been rendered", 2, renderedStatuses.length);
                jqUnit.assertEquals("The total files message should be rendered", "11 files found.", renderedStatuses.eq(0).text());
                jqUnit.assertEquals("The total files message should be rendered", "1 files exceeded the queue limit", renderedStatuses.eq(1).text());
                start();
            };
            var testCondition = function (that) {
                that.statusToggle.events.afterModelChanged.addListener(function () {
                    assertions(that);
                });
                that.uploader.events.onQueueError.fire({}, -100);
                that.uploader.events.afterFileDialog.fire(10);
            };
            decapod.exporter(CONTAINER, {
                listeners: {
                    onReady: {
                        listener: testCondition,
                        args: ["{exporter}"]
                    }
                }
            });
        });
        
        exporterTests.asyncTest("startImport", function () {
            jqUnit.expect(3);
            var tests = function (that) {
                var exportType = that.imagePDF;
                that.events.onImportStart.addListener(function () {
                    jqUnit.assertTrue("The onImportStart event should have fired", true);
                    jqUnit.assertDeepEq("The exportType should have been set", exportType, that.exportType);
                });
                
                that.uploader.events.onUploadStart.addListener(function () {
                    jqUnit.assertTrue("The onUploadStart event from the uploader should have fired", true);
                    start();
                });
                // hack to prevent the uploader from actually trying to upload anything.
                // this allows for the testing of just the event without errors being thrown for the empty queue
                that.uploader.strategy.remote.uploadNextFile = function () {};
                that.startImport(exportType);
            };
            decapod.exporter(CONTAINER, {
                listeners: {
                    onReady: {
                        listener: tests,
                        args: ["{exporter}"]
                    }
                }
            });
        });

        exporterTests.asyncTest("startExport", function () {
            jqUnit.expect(4);
            var tests = function (that) {
                var exportType = that.imagePDF;
                that.exportType = exportType;
            
                that.events.onExportStart.addListener(function () {
                    jqUnit.assertTrue("The onExportStart event should have fired", true);
                    jqUnit.assertDeepEq("The exportType should have been set", exportType, that.exportType);
                });
            
                that.events.afterExportComplete.addListener(function () {
                    jqUnit.assertTrue("The afterExportComplete event should have fired", true);
                    jqUnit.assertNull("The exportType should be reset to null", that.exportType);
                    start();
                });
            
                that.startExport();
            };
            decapod.exporter(CONTAINER, {
                listeners: {
                    onReady: {
                        listener: tests,
                        args: ["{exporter}"]
                    }
                }
            });
        });
        
        exporterTests.asyncTest("validateQueue", function () {
            jqUnit.expect(1);
            var tests = function (that) {
                that.events.afterQueueReady.addListener(function () {
                    jqUnit.assertTrue("The afterQueueReady event should have fired", true);
                    start();
                });
            
                that.validateQueue(); // should do nothing
                that.importStatus.numValidFiles = 1;
                that.validateQueue();
            };
            decapod.exporter(CONTAINER, {
                listeners: {
                    onReady: {
                        listener: tests,
                        args: ["{exporter}"]
                    }
                }
            });
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
                    }
                });
                start();
            };
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
        });

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

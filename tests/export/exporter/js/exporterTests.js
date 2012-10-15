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
        
        /********************
         * serverResetTests *
         ********************/
        
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
        
        /*****************
         * exporterTests *
         *****************/
        
        var exporterTests = jqUnit.testCase("Decapod Export");
        
        // assertions
        var assertShowInstructions = function (that) {
            jqUnit.isVisible("The instructions should be visible", that.locate("instructions"));
            jqUnit.notVisible("The status container should not be visible", that.locate("importStatusContainer"));
        };
        
        var assertShowStatus = function (that) {
            jqUnit.notVisible("The instructions should not be visible", that.locate("instructions"));
            jqUnit.isVisible("The status container should be visible", that.locate("importStatusContainer"));
        };
        
        exporterTests.asyncTest("Init tests", function () {
            jqUnit.expect(9);
            decapod.exporter(CONTAINER, {
                listeners: {
                    afterExportersRendered: {
                        listener: function (that) {
                            var str = that.options.strings;
                            jqUnit.assertTrue("The component should have initialized", that);
                            assertShowInstructions(that);
                            jqUnit.assertEquals("The title text should be rendered", str.title, that.locate("title").text());
                            jqUnit.assertEquals("The instructions text should be rendered", str.instructions, that.locate("instructions").text());
                            jqUnit.assertEquals("The uploadClear text should be rendered", str.uploadClear, that.locate("uploadClear").text());
                            jqUnit.assertEquals("The formats text should be rendered", str.formats, that.locate("formats").text());
                            jqUnit.assertFalse("The accordion should be enabled", that.accordion.container.accordion("option", "disabled"));
                        },
                        args: ["{exporter}"],
                        priority: "last"
                    },
                    onReady: {
                        listener: function () {
                            jqUnit.assertTrue("The onReady event should have fired", true);
                            start();
                        },
                        priority: "last"
                    }
                }
            });
        });
        
        exporterTests.asyncTest("Add error", function () {
            decapod.exporter(CONTAINER, {
                listeners: {
                    onReady: {
                        listener: function (that) {
                            that.uploader.events.onFileError.addListener(function () {
                                jqUnit.assertEquals("The error should be added", 1, that.importStatus.model.errors["-100"]);
                                jqUnit.assertEquals("The total number of files should be updated", 1, that.importStatus.totalNumFiles());
                                jqUnit.assertEquals("The number of errors should be updated", 1, that.importStatus.totalNumErrors());
                                start();
                            });
                            that.uploader.events.onFileError.fire({}, -100);
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
                                jqUnit.assertEquals("The total number of files should be updated", numFiles, that.importStatus.totalNumFiles());
                                jqUnit.assertEquals("The number of valid files should be updated", numFiles, that.importStatus.model.valid);
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
                assertShowStatus(that);
                jqUnit.assertEquals("The error should be added", 1, that.importStatus.model.errors["-100"]);
                jqUnit.assertEquals("The total number of files should be updated", 11, that.importStatus.totalNumFiles());
                jqUnit.assertEquals("The number of invalid files should be updated", 1, that.importStatus.totalNumErrors());
                jqUnit.assertEquals("The number of valid files should be updated", 10, that.importStatus.model.valid);
                jqUnit.assertEquals("The statuses should have been rendered", 2, renderedStatuses.length);
                jqUnit.assertEquals("The total files message should be rendered", "11 files found.", renderedStatuses.eq(0).text());
                jqUnit.assertEquals("The total files message should be rendered", "1 files exceeded the queue limit", renderedStatuses.eq(1).text());
                start();
            };
            var testCondition = function (that) {
                that.uploader.events.afterFilesSelected.addListener(function () {
                    assertions(that);
                });
                that.uploader.events.onFileError.fire({}, -100);
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
        
        exporterTests.asyncTest("Disabled browse button", function () {
            jqUnit.expect(1);
            decapod.exporter(CONTAINER, {
                listeners: {
                    onReady: {
                        listener: function (that) {
                            that.uploader.events.afterFileDialog.addListener(function () {
                                var browseBttn = that.uploader.locate("browseButton");
                                jqUnit.assertTrue("The browsebutton should have the dim class applied", browseBttn.hasClass(that.uploader.options.styles.dim));
                                start();
                            }, "test", null, "last");
                            that.uploader.events.afterFileDialog.fire(2);
                        },
                        args: ["{exporter}"]
                    }
                }
            });
        });
        
        exporterTests.asyncTest("startImport", function () {
            jqUnit.expect(18);
            var tests = function (that) {
                var decorators = fluid.renderer.getDecoratorComponents(that.pdfExporters, that.instantiator);
                var exportType = decapod.testUtils.componentFromDecorator("formats", decorators); // sets the export type to one of the pdfExporters that is instantiated through the renderer
                that.events.onImportStart.addListener(function () {
                    jqUnit.assertTrue("The onImportStart event should have fired", true);
                    jqUnit.assertDeepEq("The exportType should have been set", exportType, that.exportType);
                    jqUnit.assertTrue("The accordion should be disabled", that.accordion.container.accordion("option", "disabled"));
                    var decorators = fluid.renderer.getDecoratorComponents(that.pdfExporters, that.instantiator);
                    $.each(decorators, function (idx, decorator) {
                        decapod.testUtils.exportType.assertExportOptionsState(decorator.exportOptions, "disabled");
                    });
                }, "test", null, "last");
                
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
                    afterExportersRendered: {
                        listener: tests,
                        args: ["{exporter}"],
                        priority: "last"
                    }
                },
                components: {
                    instantiator: "{instantiator}"
                }
            });
        });

        exporterTests.asyncTest("startExport", function () {
            jqUnit.expect(3);
            var tests = function (that) {
                var decorators = fluid.renderer.getDecoratorComponents(that.pdfExporters, that.instantiator);
                var exportType = decapod.testUtils.componentFromDecorator("formats", decorators); // sets the export type to one of the pdfExporters that is instantiated through the renderer
                that.exportType = exportType;
            
                that.events.onExportStart.addListener(function () {
                    jqUnit.assertTrue("The onExportStart event should have fired", true);
                    jqUnit.assertDeepEq("The exportType should have been set", exportType, that.exportType);
                    jqUnit.assertTrue("The busy style should be added", that.container.hasClass(that.options.styles.busy));
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
                },
                components: {
                    instantiator: "{instantiator}"
                }
            });
        });
        
        exporterTests.asyncTest("afterExportComplete", function () {
            jqUnit.expect(1);
            var trigger = function (that) {
                that.container.addClass(that.options.styles.busy);
                that.events.afterExportComplete.fire();
            };
            var assertComplete = function (that) {
                jqUnit.assertFalse("The busy style should be removed", that.container.hasClass(that.options.styles.busy));
                start();
            };
            decapod.exporter(CONTAINER, {
                listeners: {
                    onReady: {
                        listener: trigger,
                        args: ["{exporter}"]
                    },
                    afterExportComplete: {
                        listener: assertComplete,
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
                that.importStatus.model.valid = 1;
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
        
        exporterTests.asyncTest("disableImport", function () {
            jqUnit.expect(2);
            var tests = function (that) {
                var uploader = that.uploader;
                var browseButton = uploader.locate("browseButton");
                that.disableImport(); 
                jqUnit.assertTrue("The dim style should be added to the browseButton", browseButton.hasClass(uploader.options.styles.dim));
                jqUnit.assertTrue("The multifile upload input should be disabled", $("input", browseButton).prop("disabled"));
                start();
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
        
        exporterTests.asyncTest("showInstructions", function () {
            jqUnit.expect(2);
            var tests = function (that) {
                that.locate("instructions").hide();
                that.locate("importStatusContainer").show();
                that.showInstructions();
                assertShowInstructions(that);
                start();
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
        
        exporterTests.asyncTest("showStatus", function () {
            jqUnit.expect(2);
            var tests = function (that) {
                that.locate("instructions").show();
                that.locate("importStatusContainer").hide();
                that.showStatus();
                assertShowStatus(that);
                start();
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
            jqUnit.expect(6);
            
            var triggerEvent = function (that) {
                that.events.afterQueueReady.fire();
            };
            var testEvent = function (that) {
                var pdfExporters = fluid.renderer.getDecoratorComponents(that.pdfExporters, that.instantiator);
                var imageExporters = fluid.renderer.getDecoratorComponents(that.imageExporters, that.instantiator);
                
                $.each(pdfExporters, function (idx, pdfExporter) {
                    var controls = fluid.renderer.getDecoratorComponents(pdfExporter.exportControls, that.instantiator);
                    jqUnit.assertTrue("The start export button for the PDF Exporter '" + idx + "', is rendered", decapod.testUtils.componentFromDecorator("trigger", controls));
                });
                
                $.each(imageExporters, function (idx, imageExporter) {
                    var controls = fluid.renderer.getDecoratorComponents(imageExporter.exportControls, that.instantiator);
                    jqUnit.assertTrue("The start export button for the Image Exporter '" + idx + "', is rendered", decapod.testUtils.componentFromDecorator("trigger", controls));
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
                    afterExportersRendered: {
                        listener: triggerEvent,
                        priority: "last"
                    }
                },
                components: {
                    instantiator: "{instantiator}"
                }
            });
        });

        // TODO: Cleanup all the if statements
        var testOnExportStartTrigger = function (subComponent, exportGroup) {
            jqUnit.expect(3);
            var exportFormat;
            var assertions = function (exportControls, exporter) {
                var decorators = fluid.renderer.getDecoratorComponents(exportControls, exporter.instantiator);
                var progress = decapod.testUtils.componentFromDecorator("progress", decorators);
                var complete = decapod.testUtils.componentFromDecorator("complete", decorators);
                
                if (progress) {
                    jqUnit.assertTrue("Progress Displayed", progress);
                    // set the current exportType
                    exporter.exportType = exportFormat;
                    // trigger the uploader's afterUploadeComplete event
                    exporter.uploader.events.afterUploadComplete.fire();
                }
                
                if (complete) {
                    var downloadHREF = complete.locate("download").attr("href").replace($(location).attr('href'), '');
                    jqUnit.assertEquals("The download href should be set", complete.model.downloadURL, downloadHREF);
                    start();
                }
            };
            var setup = function (exporter) {
                // remove the initial afterRender event listener to prevent any possible misfires when listening for the individual afterRender event below.
                exporter.events.afterExportersRendered.removeListener("initial"); 
                var decorators = fluid.renderer.getDecoratorComponents(exporter[exportGroup], exporter.instantiator);
                exportFormat = decapod.testUtils.componentFromDecorator(subComponent, decorators);
                
                exportFormat.exportControls.events.afterRender.addListener(function (exportControls) {
                    assertions(exportControls, exporter);
                });
                
                // enables the trigger button
                exporter.events.afterQueueReady.fire();
            };
            var triggerEvent = function (exporter) {
                var decorators = fluid.renderer.getDecoratorComponents(exportFormat.exportControls, exporter.instantiator);
                var trigger = decapod.testUtils.componentFromDecorator("trigger", decorators);
                trigger.locate("trigger").click();
            };
            
            var exporter = decapod.exporter(CONTAINER, {
                listeners: {
                    onExportStart: function () {
                        jqUnit.assertTrue("The onExportStart event fired", true);
                    },
                    afterQueueReady: {
                        listener: triggerEvent,
                        args: ["{exporter}"],
                        priority: "last"
                    },
                    "afterExportersRendered.initial": {
                        listener: setup,
                        priority: "last"
                    }
                },
                components: {
                    instantiator: "{instantiator}"
                }
            });
            // hack to prevent the uploader from actually trying to upload anything.
            // this allows for the testing of just the event without errors being thrown for the empty queue
            exporter.uploader.strategy.remote.uploadNextFile = function () {};
        };
        
        // Since the test environment has to be reset, need to run the tests on each format seperately
        exporterTests.asyncTest("PDF format-0 trigger onExportStart", function () {
            testOnExportStartTrigger("format-0", "pdfExporters");
        });
        exporterTests.asyncTest("PDF format-1 trigger onExportStart", function () {
            testOnExportStartTrigger("format-1", "pdfExporters");
        });
        exporterTests.asyncTest("PDF format-2 trigger onExportStart", function () {
            testOnExportStartTrigger("format-2", "pdfExporters");
        });
        exporterTests.asyncTest("PDF format-3 trigger onExportStart", function () {
            testOnExportStartTrigger("format-3", "pdfExporters");
        });
        
        exporterTests.asyncTest("Image format-1-0 trigger onExportStart", function () {
            testOnExportStartTrigger("format-1-0", "imageExporters");
        });
        exporterTests.asyncTest("Image format-1-1 trigger onExportStart", function () {
            testOnExportStartTrigger("format-1-1", "imageExporters");
        });
    });
})(jQuery);
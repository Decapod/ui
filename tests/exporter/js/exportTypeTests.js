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
    var TYPE_CONTAINER = ".dc-exportType";
    var PDF_OPTS_CONTAINER = ".dc-exportType-pdfOptions";
    var CONTROLS_CONTAINER = ".dc-exportType-controls";
    var TRIGGER_CONTAINER = ".dc-exportType-controls-trigger";
    var PROGRESS_CONTAINER = ".dc-exportType-controls-progress";
    var DOWNLOAD_CONTAINER = ".dc-exportType-controls-download";
    var PDF_EXPORTER_CONTAINER = ".dc-pdfExporter";
    var generateComponent = function (component, container, templateURL, options) {
        var opts = {
            resources: {
                template: {
                    url: templateURL
                }
            }
        };
        
        fluid.merge("replace", opts, options || {});
        return fluid.invokeGlobalFunction(component, [container, opts]);
    };
    
    var createExportType = function (container, options) {
        return generateComponent("decapod.exportType", container, "../../../components/exporter/html/exportTypeTemplate.html", options);
    };
    
    var createPDFOptions = function (container, options) {
        return generateComponent("decapod.exportType.pdfOptions", container, "../../../components/exporter/html/pdfOptionsTemplate.html", options);
    };
    
    var createControls = function (container, options) {
        var opts = {
            resources: {
                controls: {
                    url: "../../../components/exporter/html/exportControlsTemplate.html",
                    forceCache: true
                },
                trigger: {
                    url: "../../../components/exporter/html/exportControlsTriggerTemplate.html",
                    forceCache: true
                },
                progress: {
                    url: "../../../components/exporter/html/exportControlsProgressTemplate.html",
                    forceCache: true
                },
                download: {
                    url: "../../../components/exporter/html/exportControlsDownloadTemplate.html",
                    forceCache: true
                }
            }
        };
        
        fluid.merge("replace", opts, options || {});
        return fluid.invokeGlobalFunction("decapod.exportType.controls", [container, opts]);
    };
    
    var createBaseRenderer = function (container, options) {
        return generateComponent("decapod.exportType.controls.baseRenderer", container, "../../../components/exporter/html/exportControlsTemplate.html", options);
    };
    
    var createPDFExporter = function (container, options) {
        return generateComponent("decapod.pdfExporter", container, "../../../components/exporter/html/pdfExporterTemplate.html", options);
    };
    
    var createTrigger = function (container, options) {
        return generateComponent("decapod.exportType.controls.trigger", container, "../../../components/exporter/html/exportControlsTriggerTemplate.html", options);
    };
    
    var createProgress = function (container, options) {
        return generateComponent("decapod.exportType.controls.progress", container, "../../../components/exporter/html/exportControlsProgressTemplate.html", options);
    };
    
    var createDownload = function (container, options) {
        return generateComponent("decapod.exportType.controls.download", container, "../../../components/exporter/html/exportControlsDownloadTemplate.html", options);
    };
    
    var assertExportTypeRender = function (that) {
        var str = that.options.strings;
        jqUnit.assertEquals("The format name should have been rendered", str.name, that.locate("name").text());
        jqUnit.assertEquals("The description should be rendered", str.description, that.locate("description").text());
    };
    
    var assertPDFOptionsRender = function (that) {
        var str = that.options.strings;
        jqUnit.assertEquals("The resolution label should be rendered", str.documentResolutionLabel, that.locate("documentResolutionLabel").text());
        jqUnit.assertEquals("The resolution should be set", that.model.dpi, that.locate("documentResolution").val());
        jqUnit.assertEquals("The dimensions label should be rendered", str.documentDimensionsLabel, that.locate("documentDimensionsLabel").text());
        jqUnit.assertEquals("The dimensions text should be rendered", str.documentDimensions, that.locate("documentDimensions").text());
    };
    
    var assertTriggerRender = function (that) {
        var str = that.options.strings;
        var trigger = that.locate("trigger");
        jqUnit.assertEquals("The export button should be rendered", str.trigger, trigger.text());
        jqUnit.isVisible("The export control should be visible", trigger);
    };
    
    var assertProgressRender = function (that) {
        var str = that.options.strings;
        jqUnit.assertEquals("The progress text should be rendered", str.message, that.locate("message").text());
    };
    
    var assertDownloadRender = function (that) {
        var str = that.options.strings;
        var downloadHREF = that.locate("download").attr("href").replace($(location).attr('href'), '');
        jqUnit.assertEquals("The download text should be rendered", str.download, that.locate("download").text());
        jqUnit.assertEquals("The download url should be set", that.model.downloadURL, downloadHREF);
        jqUnit.assertEquals("The restart text should be set", str.restart, that.locate("restart").text());
    };
    
    var assertExportControlsRender = function (that) {
        assertTriggerRender(that.trigger);
        assertProgressRender(that.progress);
        assertDownloadRender(that.download);
        
        jqUnit.notVisible("The progress message should be hidden", that.progress.container);
        jqUnit.notVisible("The download controls should be hidden", that.download.container);
    };
    
    var assertShowTriggerControls = function (that) {
        jqUnit.assertFalse("The progress shouldn't have initialized", that["**-renderer-progressContainer-0"]);
        jqUnit.assertFalse("The download shouldn't have initialized", that["**-renderer-downloadContainer-0"]);
        assertTriggerRender(that["**-renderer-triggerContainer-0"]);
    };
    
    var assertShowProgressControls = function (that) {
        jqUnit.assertFalse("The trigger shouldn't have initialized", that["**-renderer-triggerContainer-0"]);
        jqUnit.assertFalse("The download shouldn't have initialized", that["**-renderer-downloadContainer-0"]);
        assertProgressRender(that["**-renderer-progressContainer-0"]);
    };
    
    var assertShowDownloadControls = function (that) {
        jqUnit.assertFalse("The trigger shouldn't have initialized", that["**-renderer-triggerContainer-0"]);
        jqUnit.assertFalse("The progress shouldn't have initialized", that["**-renderer-progressContainer-0"]);
        assertDownloadRender(that["**-renderer-downloadContainer-0"]);
    };
    
    $(document).ready(function () {
        
        /*******************
         * exportTypeTests *
         *******************/
        
        var exportTypeTests = jqUnit.testCase("Decapod Export Type");
        
        exportTypeTests.test("Init tests", function () {
            var that = createExportType(TYPE_CONTAINER);
            jqUnit.assertTrue("The component should have initialized", that);
        });
        
        exportTypeTests.asyncTest("Fetch Resources", function () {
            jqUnit.expect(1);
            var assertFetchResources = function (resourceSpec) {
                jqUnit.assertTrue("The resourceText is filled out", resourceSpec.template.resourceText);
                start();
            };
            createExportType(TYPE_CONTAINER, {
                listeners: {
                    afterFetchResources: assertFetchResources
                }
            });
        });
        
        exportTypeTests.asyncTest("Rendering", function () {
            var assertRender = function (that) {
                assertExportTypeRender(that);
                start();
            };
            var that = createExportType(TYPE_CONTAINER, {
                listeners: {
                    afterRender: assertRender
                }
            });
        });
        
        /*******************
         * pdfOptionsTests *
         *******************/
        
        var pdfOptionsTests = jqUnit.testCase("Decapod Export Type PDF Options");
        
        pdfOptionsTests.test("Init tests", function () {
            var that = createPDFOptions(PDF_OPTS_CONTAINER);
            jqUnit.assertTrue("The component should have initialized", that);
        });
        
        pdfOptionsTests.asyncTest("Fetch Resources", function () {
            jqUnit.expect(1);
            var assertFetchResources = function (resourceSpec) {
                jqUnit.assertTrue("The resourceText is filled out", resourceSpec.template.resourceText);
                start();
            };
            createPDFOptions(PDF_OPTS_CONTAINER, {
                listeners: {
                    afterFetchResources: assertFetchResources
                }
            });
        });
        
        pdfOptionsTests.asyncTest("Rendering", function () {
            jqUnit.expect(4);
            var assertRender = function (that) {
                assertPDFOptionsRender(that);
                start();
            };
            
            createPDFOptions(PDF_OPTS_CONTAINER, {
                listeners: {
                    afterRender: assertRender
                }
            });
        });
        
        pdfOptionsTests.asyncTest("Model Change", function () {
            jqUnit.expect(2);
            var dpi = 200;
            var changeVal = function (that) {
                that.applier.requestChange("dpi", dpi);
            };
            var assertModelChange = function (newModel, that) {
                jqUnit.assertEquals("The model should be updated with the new dpi", dpi, newModel.dpi);
                jqUnit.assertEquals("The components model should be update with the new dpi", dpi, that.model.dpi);
                start();
            };
            createPDFOptions(PDF_OPTS_CONTAINER, {
                events: {
                    testModel: {
                        event: "afterModelChanged"
                    }
                },
                listeners: {
                    afterRender: changeVal,
                    testModel: assertModelChange
                }
            });
        });
        
        /*****************
         * controlsTests *
         *****************/
        
        var controlsTests = jqUnit.testCase("Decapod Export Type Controls");
        
        controlsTests.asyncTest("Init tests", function () {
            var that = createControls(CONTROLS_CONTAINER, {
                listeners: {
                    afterFetchResources: {
                        listener: function () {
                            jqUnit.assertTrue("The component should have initialized", true);
                            start();
                        },
                        priority: "last"
                    }
                }
            });
        });
        
        controlsTests.asyncTest("Fetch Resources", function () {
            jqUnit.expect(4);
            var assertFetchResources = function (resourceSpec) {
                $.each(resourceSpec, function (idx, spec) {
                    jqUnit.assertTrue("The resourceText is filled out", spec.resourceText);
                });
                start();
            };
            createControls(CONTROLS_CONTAINER, {
                listeners: {
                    afterFetchResources: assertFetchResources
                }
            });
        });
        
        controlsTests.asyncTest("Initial Rendering", function () {
            jqUnit.expect(4);
            var assertRender = function (that) {
                assertShowTriggerControls(that);
                start();
            };
            createControls(CONTROLS_CONTAINER, {
                listeners: {
                    afterRender: {
                        listener: assertRender,
                        priority: "last"
                    }
                }
            });
        });
        
        controlsTests.asyncTest("Change Model - show progress", function () {
            jqUnit.expect(4);
            var model = {
                showExportStart: false,
                showExportProgress: true,
                showExportDownload: false
            };
            var assertRender = function (that) {
                assertShowProgressControls(that);
                start();
            };
            var assertModel = function (newModel) {
                jqUnit.assertDeepEq("The model should be updated", model, newModel);
            };
            var that = createControls(CONTROLS_CONTAINER, {
                listeners: {
                    afterRender: function (that) {
                        if (that["**-renderer-triggerContainer-0"]) {
                            that.events.afterModelChanged.addListener(assertModel);
                            that.updateModel(model);
                        } else {
                            assertRender(that);
                        }
                    }
                }
            });
            
        });
        
        controlsTests.asyncTest("Change Model - show download", function () {
            jqUnit.expect(6);
            var model = {
                showExportStart: false,
                showExportProgress: false,
                showExportDownload: true
            };
            var assertRender = function (that) {
                assertShowDownloadControls(that);
                start();
            };
            var assertModel = function (newModel) {
                jqUnit.assertDeepEq("The model should be updated", model, newModel);
            };
            var that = createControls(CONTROLS_CONTAINER, {
                listeners: {
                    afterRender: function (that) {
                        if (that["**-renderer-triggerContainer-0"]) {
                            that.events.afterModelChanged.addListener(assertModel);
                            that.updateModel(model);
                        } else {
                            assertRender(that);
                        }
                    }
                }
            });
            
        });
        

        controlsTests.asyncTest("Export Control Click", function () {
            jqUnit.expect(4);
            var fireClick = function (that) {
                var trigger = that["**-renderer-triggerContainer-0"];
                
                // since this will be triggered after the click, 
                // this prevents it from being called when the 
                // trigger subcomponent isn't available
                if (trigger) {
                    trigger.locate("trigger").click();
                }
            };
            var assertClick = function (that) {
                jqUnit.assertTrue("The onExportTrigger event should have fired", true);
                assertShowProgressControls(that);
                start();
            };
            createControls(CONTROLS_CONTAINER, {
                events: {
                    testClick: {
                        event: "onExportTrigger"
                    }
                },
                listeners: {
                    afterRender: fireClick,
                    testClick: {
                        listener: assertClick,
                        priority: "last"
                    }
                }
            });
        });
        
        /********************************
         * controlsTests - BaseRenderer *
         ********************************/

        controlsTests.test("BaseRenderer - init", function () {
            var that = createBaseRenderer(CONTROLS_CONTAINER);
            jqUnit.assertTrue("The component shoudl have initialized", that);
        });
        
        controlsTests.asyncTest("BaseRenderer - Fetch Resources", function () {
            jqUnit.expect(1);
            var assertFetchResources = function (resourceSpec) {
                jqUnit.assertTrue("The resourceText is filled out", resourceSpec.template.resourceText);
                start();
            };
            createBaseRenderer(CONTROLS_CONTAINER, {
                listeners: {
                    afterFetchResources: assertFetchResources
                }
            });
        });
        
        /***************************
         * controlsTests - Trigger *
         ***************************/
        
        controlsTests.test("Trigger - init", function () {
            var that = createTrigger(TRIGGER_CONTAINER);
            jqUnit.assertTrue("The component should have initialized", that);
        });
        
        controlsTests.asyncTest("Trigger - Fetch Resources", function () {
            jqUnit.expect(1);
            var assertFetchResources = function (resourceSpec) {
                jqUnit.assertTrue("The resourceText is filled out", resourceSpec.template.resourceText);
                start();
            };
            createTrigger(TRIGGER_CONTAINER, {
                listeners: {
                    afterFetchResources: assertFetchResources
                }
            });
        });
        
        controlsTests.asyncTest("Trigger - Rendering", function () {
            jqUnit.expect(2);
            var assertRendering = function (that) {
                assertTriggerRender(that);
                start();
            };
            createTrigger(TRIGGER_CONTAINER, {
                listeners: {
                    afterRender: {
                        listener: assertRendering,
                        priority: "last"
                    }
                }
            });
        });
        
        controlsTests.asyncTest("Trigger - afterTriggered", function () {
            jqUnit.expect(1);
            var clickTrigger = function (that) {
                var trigger = that.locate("trigger");
                trigger.click();
            };
            var assertEvent = function (that) {
                jqUnit.assertTrue("The afterTriggered event should have been fired", true);
                start();
            };
            createTrigger(TRIGGER_CONTAINER, {
                events: {
                    triggered: {
                        event: "afterTriggered"
                    }
                },
                listeners: {
                    afterRender: {
                        listener: clickTrigger,
                        priority: "last"
                    },
                    triggered: {
                        listener: assertEvent
                    }
                }
            });
        });
        
        /****************************
         * controlsTests - Progress *
         ****************************/
        
        controlsTests.test("Progress - init", function () {
            var that = createProgress(PROGRESS_CONTAINER);
            jqUnit.assertTrue("The component should have initialized", that);
        });
        
        controlsTests.asyncTest("Progress - Fetch Resources", function () {
            jqUnit.expect(1);
            var assertFetchResources = function (resourceSpec) {
                jqUnit.assertTrue("The resourceText is filled out", resourceSpec.template.resourceText);
                start();
            };
            createProgress(PROGRESS_CONTAINER, {
                listeners: {
                    afterFetchResources: assertFetchResources
                }
            });
        });
        
        controlsTests.asyncTest("Progress - Rendering", function () {
            jqUnit.expect(1);
            var assertRendering = function (that) {
                assertProgressRender(that);
                start();
            };
            createProgress(TRIGGER_CONTAINER, {
                listeners: {
                    afterRender: {
                        listener: assertRendering,
                        priority: "last"
                    }
                }
            });
        });
        
        /****************************
         * controlsTests - Download *
         ****************************/
        
        controlsTests.test("Download - init", function () {
            var that = createDownload(DOWNLOAD_CONTAINER);
            jqUnit.assertTrue("The component should have initialized", that);
        });
        
        controlsTests.asyncTest("Download - Fetch Resources", function () {
            jqUnit.expect(1);
            var assertFetchResources = function (resourceSpec) {
                jqUnit.assertTrue("The resourceText is filled out", resourceSpec.template.resourceText);
                start();
            };
            createDownload(DOWNLOAD_CONTAINER, {
                listeners: {
                    afterFetchResources: assertFetchResources
                }
            });
        });
        
        controlsTests.asyncTest("Download - Rendering", function () {
            jqUnit.expect(3);
            var assertRendering = function (that) {
                assertDownloadRender(that);
                start();
            };
            createDownload(DOWNLOAD_CONTAINER, {
                listeners: {
                    afterRender: {
                        listener: assertRendering,
                        priority: "last"
                    }
                }
            });
        });
        
        /********************
         * pdfExporterTests *
         ********************/
        
//        var pdfExporterTests = jqUnit.testCase("Decapod PDF Exporter");
//        
//        pdfExporterTests.test("Init tests", function () {
//            var that = createPDFExporter(PDF_EXPORTER_CONTAINER);
//            jqUnit.assertTrue("The component should have initialized", that);
//        });
//        
//        pdfExporterTests.asyncTest("Fetch Resources", function () {
//            jqUnit.expect(1);
//            var assertFetchResources = function (resourceSpec) {
//                jqUnit.assertTrue("The resourceText is filled out", resourceSpec.template.resourceText);
//                start();
//            };
//            createPDFExporter(PDF_EXPORTER_CONTAINER, {
//                listeners: {
//                    afterFetchResources: assertFetchResources
//                }
//            });
//        });
//        
//        pdfExporterTests.asyncTest("Rendering", function () {
//            var assertRendering = function (that) {
//                assertExportControlsRender(that);
//                start();
//            };
//            createPDFExporter(PDF_EXPORTER_CONTAINER, {
//                listeners: {
//                    afterOptionsRendered: assertPDFOptionsRender,
//                    afterExportTypeRendered: assertExportTypeRender,
//                    afterControlsRendered: {
//                        listener: assertRendering,
//                        priority: "last"
//                    }
//                }
//            });
//        });
//
//        pdfExporterTests.asyncTest("onExportStart event", function () {
//            jqUnit.expect(5);
//            var assertEvent = function (that) {
//                jqUnit.assertTrue("The onExportStart event should have fired", true);
//                assertShowProgressControls(that);
//                start();
//            };
//            createPDFExporter(PDF_EXPORTER_CONTAINER, {
//                listeners: {
//                    onExportStart: {
//                        listener: assertEvent,
//                        priority: "last"
//                    },
//                    afterControlsRendered: {
//                        listener: "{pdfExporter}.events.onExportStart.fire",
//                        priority: "last"
//                    }
//                }
//            });
//        });
//        
//        pdfExporterTests.asyncTest("afterExportComplete", function () {
//            jqUnit.expect(5);
//            var assertEvent = function (that) {
//                jqUnit.assertTrue("The afterExportCompleteEvent should have fired", true);
//                assertShowFinishControls(that);
//                start();
//            };
//            createPDFExporter(PDF_EXPORTER_CONTAINER, {
//                listeners: {
//                    afterExportComplete: {
//                        listener: assertEvent,
//                        priority: "last"
//                    },
//                    afterControlsRendered: {
//                        listener: "{pdfExporter}.events.afterExportComplete.fire",
//                        priority: "last"
//                    }
//                }
//            });
//        });
    });
})(jQuery);

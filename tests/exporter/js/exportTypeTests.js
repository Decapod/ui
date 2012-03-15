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
        return generateComponent("decapod.exportType.controls", container, "../../../components/exporter/html/exportControlsTemplate.html", options);
    };
    
    var createPDFExporter = function (container, options) {
        return generateComponent("decapod.pdfExporter", container, "../../../components/exporter/html/pdfExporterTemplate.html", options);
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
    
    var assertExportControlsRender = function (that) {
        var str = that.options.strings;
        var downloadHREF = that.locate("download").attr("href").replace($(location).attr('href'), '');
        jqUnit.assertEquals("The export button should be rendered", str.exportControl, that.locate("exportControl").text());
        jqUnit.assertEquals("The progress text should be rendered", str.progressMessage, that.locate("progressMessage").text());
        jqUnit.assertEquals("The download text should be rendered", str.download, that.locate("download").text());
        jqUnit.assertEquals("The download url should be set", that.model.downloadURL, downloadHREF);
        jqUnit.assertEquals("The restart text should be set", str.restart, that.locate("restart").text());
        
        jqUnit.isVisible("The export control should be visible", that.locate("exportControl"));
        jqUnit.notVisible("The progress message should be hidden", that.locate("progressMessage"));
        jqUnit.notVisible("The download link should be hidden", that.locate("download"));
        jqUnit.notVisible("The restart link should be hidden", that.locate("restart"));
    };
    
    var assertShowProgressControls = function (that) {
        jqUnit.notVisible("The export control should be hidden", that.locate("exportControl"));
        jqUnit.isVisible("The progress message should be visible", that.locate("progressMessage"));
        jqUnit.notVisible("The download link should be hidden", that.locate("download"));
        jqUnit.notVisible("The restart link should be hidden", that.locate("restart"));
    };
    
    var assertShowFinishControls = function (that) {
        jqUnit.notVisible("The export control should be hidden", that.locate("exportControl"));
        jqUnit.notVisible("The progress message should be visible", that.locate("progressMessage"));
        jqUnit.isVisible("The download link should be hidden", that.locate("download"));
        jqUnit.isVisible("The restart link should be hidden", that.locate("restart"));
    };
    
    $(document).ready(function () {
        
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
        
        exportTypeTests.test("Rendering", function () {
            var that = createExportType(TYPE_CONTAINER);
            assertExportTypeRender(that);
        });
        
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
        
        var controlsTests = jqUnit.testCase("Decapod Export Type Controls");
        
        controlsTests.test("Init tests", function () {
            var that = createControls(CONTROLS_CONTAINER);
            jqUnit.assertTrue("The component should have initialized", that);
        });
        
        controlsTests.asyncTest("Fetch Resources", function () {
            jqUnit.expect(1);
            var assertFetchResources = function (resourceSpec) {
                jqUnit.assertTrue("The resourceText is filled out", resourceSpec.template.resourceText);
                start();
            };
            createControls(CONTROLS_CONTAINER, {
                listeners: {
                    afterFetchResources: assertFetchResources
                }
            });
        });
        
        controlsTests.asyncTest("Rendering", function () {
            jqUnit.expect(9);
            var assertRendering = function (that) {
                assertExportControlsRender(that);
                start();
            };
            createControls(CONTROLS_CONTAINER, {
                listeners: {
                    afterRender: {
                        listener: assertRendering,
                        priority: "last"
                    }
                }
            });
        });
        
        controlsTests.asyncTest("showStartControls", function () {
            jqUnit.expect(4);
            var assertRendering = function (that) {
                that.showStartControls();
                
                jqUnit.isVisible("The export control should be visible", that.locate("exportControl"));
                jqUnit.notVisible("The progress message should be hidden", that.locate("progressMessage"));
                jqUnit.notVisible("The download link should be hidden", that.locate("download"));
                jqUnit.notVisible("The restart link should be hidden", that.locate("restart"));
                start();
            };
            createControls(CONTROLS_CONTAINER, {
                listeners: {
                    afterRender: {
                        listener: assertRendering,
                        priority: "last"
                    }
                }
            });
        });
        
        controlsTests.asyncTest("showProgressControls", function () {
            jqUnit.expect(4);
            var assertRendering = function (that) {
                that.showProgressControls();
                
                assertShowProgressControls(that);
                start();
            };
            createControls(CONTROLS_CONTAINER, {
                listeners: {
                    afterRender: {
                        listener: assertRendering,
                        priority: "last"
                    }
                }
            });
        });
        
        controlsTests.asyncTest("showFinishControls", function () {
            jqUnit.expect(4);
            var assertRendering = function (that) {
                that.showFinishControls();
                assertShowFinishControls(that);
                start();
            };
            createControls(CONTROLS_CONTAINER, {
                listeners: {
                    afterRender: {
                        listener: assertRendering,
                        priority: "last"
                    }
                }
            });
        });
        
        controlsTests.asyncTest("Export Control Click", function () {
            jqUnit.expect(5);
            var fireClick = function (that) {
                that.locate("exportControl").click();
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
                    testClick: assertClick
                }
            });
        });
        
        var pdfExporterTests = jqUnit.testCase("Decapod PDF Exporter");
        
        pdfExporterTests.test("Init tests", function () {
            var that = createPDFExporter(PDF_EXPORTER_CONTAINER);
            jqUnit.assertTrue("The component should have initialized", that);
        });
        
        pdfExporterTests.asyncTest("Fetch Resources", function () {
            jqUnit.expect(1);
            var assertFetchResources = function (resourceSpec) {
                jqUnit.assertTrue("The resourceText is filled out", resourceSpec.template.resourceText);
                start();
            };
            createPDFExporter(CONTROLS_CONTAINER, {
                listeners: {
                    afterFetchResources: assertFetchResources
                }
            });
        });
        
        pdfExporterTests.asyncTest("Rendering", function () {
            var assertRendering = function (that) {
                assertExportControlsRender(that);
                start();
            };
            createPDFExporter(PDF_EXPORTER_CONTAINER, {
                listeners: {
                    afterOptionsRendered: assertPDFOptionsRender,
                    afterExportTypeRendered: assertExportTypeRender,
                    afterControlsRendered: {
                        listener: assertRendering,
                        priority: "last"
                    }
                }
            });
        });

        pdfExporterTests.asyncTest("onExportStart event", function () {
            jqUnit.expect(5);
            var assertEvent = function (that) {
                jqUnit.assertTrue("The onExportStart event should have fired", true);
                assertShowProgressControls(that);
                start();
            };
            createPDFExporter(PDF_EXPORTER_CONTAINER, {
                listeners: {
                    onExportStart: {
                        listener: assertEvent,
                        priority: "last"
                    },
                    afterControlsRendered: {
                        listener: "{pdfExporter}.events.onExportStart.fire",
                        priority: "last"
                    }
                }
            });
        });
        
        pdfExporterTests.asyncTest("afterExportComplete", function () {
            jqUnit.expect(5);
            var assertEvent = function (that) {
                jqUnit.assertTrue("The afterExportCompleteEvent should have fired", true);
                assertShowFinishControls(that);
                start();
            };
            createPDFExporter(PDF_EXPORTER_CONTAINER, {
                listeners: {
                    afterExportComplete: {
                        listener: assertEvent,
                        priority: "last"
                    },
                    afterControlsRendered: {
                        listener: "{pdfExporter}.events.afterExportComplete.fire",
                        priority: "last"
                    }
                }
            });
        });
    });
})(jQuery);

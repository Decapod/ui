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
    var CONTAINER = ".dc-exportType";
    var PDF_OPTS_CONTAINER = ".dc-exportType-pdfOptions";
    var CONTROLS_CONTAINER = ".dc-exportType-controls";
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
    var createPDFOptions = function (container, options) {
        return generateComponent("decapod.exportType.pdfOptions", container, "../../../components/exporter/html/pdfExporter.html", options);
    };
    
    var createControls = function (container, options) {
        return generateComponent("decapod.exportType.controls", container, "../../../components/exporter/html/exportControlsTemplate.html",options);
    };
    
    var assertPDFOptionsRender = function (that) {
        var str = that.options.strings;
        jqUnit.assertEquals("The resolution label should be rendered", str.resolutionLabel, that.locate("resolutionLabel").text());
        jqUnit.assertEquals("The resolution should be set", that.model.dpi, that.locate("resolution").val());
        jqUnit.assertEquals("The dimensions label should be rendered", str.dimensionsLabel, that.locate("dimensionsLabel").text());
        jqUnit.assertEquals("The dimensions text should be rendered", str.dimensions, that.locate("dimensions").text());
    };
    
    $(document).ready(function () {
        
        var exportTypeTests = jqUnit.testCase("Decapod Export Type");
        
        exportTypeTests.test("Init tests", function () {
            var that = decapod.exportType(CONTAINER);
            jqUnit.assertTrue("The component should have initialized", that);
        });
        
        exportTypeTests.test("Rendering", function () {
            var that = decapod.exportType(CONTAINER);
            var str = that.options.strings;
            jqUnit.assertEquals("The format name should have been rendered", str.name, that.locate("name").text());
            jqUnit.assertEquals("The description should be rendered", str.description, that.locate("description").text());
        });
        
        var pdfOptionsTests = jqUnit.testCase("Decapod Export Type PDF Options")
        
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
            createPDFOptions(CONTAINER, {
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
            
            createPDFOptions(CONTAINER, {
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
            var assertModelChange = function (that, newModel) {
                jqUnit.assertEquals("The model should be updated with the new dpi", dpi, newModel.dpi);
                jqUnit.assertEquals("The components model should be update with the new dpi", dpi, that.model.dpi);
                start();
            };
            createPDFOptions(CONTAINER, {
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
            createControls(CONTAINER, {
                listeners: {
                    afterFetchResources: assertFetchResources
                }
            });
        });
        
        controlsTests.asyncTest("Rendering", function () {
            jqUnit.expect(5);
            var assertRendering = function (that) {
                var str = that.options.strings;
                jqUnit.assertEquals("The export button should be rendered", str.exportControl, that.locate("exportControl").text());
                jqUnit.assertEquals("The progress text should be rendered", str.progressMessage, that.locate("progressMessage").text());
                jqUnit.assertEquals("The download text should be rendered", str.download, that.locate("download").text());
                jqUnit.assertEquals("The download url should be set", that.model.downloadURL, that.locate("download").prop("href"));
                jqUnit.assertEquals("The restart text should be set", str.restart, that.locate("restart").text());
                start();
            };
            createControls(CONTROLS_CONTAINER, {
                listeners: {
                    afterRender: assertRendering
                }
            });
        });
        
        controlsTests.asyncTest("Export Control Click", function () {
            jqUnit.expect(1);
            var fireClick = function (that) {
                that.locate("exportControl").click();
            };
            var assertClick = function () {
                jqUnit.assertTrue("The afterExportTriggered event should have fired", true);
                start();
            };
            createControls(CONTROLS_CONTAINER, {
                listeners: {
                    afterRender: fireClick,
                    afterExportTriggered: assertClick
                }
            });
        });
    });
})(jQuery);

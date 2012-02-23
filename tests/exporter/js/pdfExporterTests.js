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
    fluid.registerNamespace("decapod.pdfExporter.test")
    var CONTAINER = ".dc-pdfExporter";
    
    var createPDFExporter = function (container, options) {
        var opts = {
            resources: {
                template: {
                    url: "../../../components/exporter/html/pdfExporter.html"
                }
            }
        };
        
        fluid.merge("replace", opts, options || {});
        
        return decapod.pdfExporter(container, opts);
    };
    
    $(document).ready(function () {
        
        var tests = jqUnit.testCase("Decapod PDF Export");
        
        tests.test("Init tests", function () {
            var that = createPDFExporter(CONTAINER);
            jqUnit.assertTrue("The component should have initialized", that);
        });
        
        tests.asyncTest("Fetch Resources", function () {
            var assertFetchResources = function (resourceSpec) {
                jqUnit.assertTrue("The resourceText is filled out", resourceSpec.template.resourceText);
                start();
            };
            createPDFExporter(CONTAINER, {
                listeners: {
                    afterFetchResources: assertFetchResources
                }
            });
        });
        
        tests.asyncTest("Rendering", function () {
            decapod.pdfExporter.test.assertRender = function (that) {
                jqUnit.assertEquals("The format name should have been rendered", "PDF", that.locate("formatName").text());
                jqUnit.assertEquals("The description should be rendered", "A delectable medley of bits and bytes to satisfy every platform", that.locate("description").text());
                jqUnit.assertEquals("The resolution label should be rendered", "Output Image resolution:", that.locate("resolutionLabel").text());
                jqUnit.assertEquals("The resolution should be set", "300", that.locate("resolution").val());
                jqUnit.assertEquals("The dimensions label should be rendered", "Output dimensions:", that.locate("dimensionsLabel").text());
                jqUnit.assertEquals("The dimensions text should be rendered", "A4(210 x 297mm / 8.3 x 11.7in.)", that.locate("dimensions").text());
                jqUnit.assertEquals("The export button should be rendered", "Start Export", that.locate("exportButton").text());
                start();
            };
            
            createPDFExporter(CONTAINER, {
                events: {
                    testRender: {
                        event: "afterRender"
                    }
                },
                listeners: {
                    testRender: decapod.pdfExporter.test.assertRender
                }
            });
        });
        
        tests.asyncTest("Model Change", function () {
            var dpi = 200;
            var changeVal = function (that) {
                that.applier.requestChange("dpi", dpi);
            };
            var assertModelChange = function (that, newModel) {
                jqUnit.assertEquals("The model should be updated with the new dpi", dpi, newModel.dpi);
                jqUnit.assertEquals("The components model should be update with the new dpi", dpi, that.model.dpi);
                start();
            };
            createPDFExporter(CONTAINER, {
                events: {
                    testRender: {
                        event: "afterRender"
                    },
                    testModel: {
                        event: "afterModelChanged"
                    }
                },
                listeners: {
                    testRender: changeVal,
                    testModel: assertModelChange
                }
            });
        });
    });
})(jQuery);

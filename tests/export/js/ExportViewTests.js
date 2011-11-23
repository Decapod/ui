/*
Copyright 2011 OCAD University

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
    $(document).ready(function () {
        var EV_CONTAINER = ".dc-exportView";
        var RS_CONTAINER = ".dc-renderSelect";
        
        /*********************
         * renderSelectTests *
         *********************/
        
        var renderSelectTests = jqUnit.testCase("Decapod renderSelect");
        
        renderSelectTests.test("Init Tests", function () {
            var defaultModel = {
                selection: "1",
                choices: ["1", "2", "3"],
                names: ["option 1", "option 2", "option 3"]
            }; 
            var renderSelect = decapod.renderSelect(RS_CONTAINER, {model: defaultModel});
            jqUnit.assertTrue("The component should have initialized", renderSelect);
        });
        
        renderSelectTests.asyncTest("Rendering Tests", function () {
            var defaultLabel = "Label";
            var defaultModel = {
                selection: "1",
                choices: ["type1", "type2", "type3"],
                names: ["option 1", "option 2", "option 3"]
            }; 
            var renderSelect = decapod.renderSelect(RS_CONTAINER, {
                listeners: {
                    afterRender: function () {
                        var selOpts = $("option", RS_CONTAINER);
                        var selLabel = $("label", RS_CONTAINER);
                        var model = defaultModel;
                        jqUnit.assertEquals("The correct number of options have been rendered", model.choices.length, selOpts.length);
                        jqUnit.assertEquals("The label is set correctly", defaultLabel, selLabel.text());
                        selOpts.each(function (idx, elm) {
                            jqUnit.assertEquals("The value of the " + idx + " option is set correctly", model.choices[idx], $(elm).val());
                            jqUnit.assertEquals("The text of the " + idx + " option is set correctly", model.names[idx], $(elm).text());
                        });
                        start();
                    }
                },
                model: defaultModel,
                strings: {
                    "label": defaultLabel
                }
            });
            expect((defaultModel.choices.length * 2) + 2);
        });
        
        /*******************
         * exportViewTests *
         *******************/
        
        var exportViewTests = jqUnit.testCase("Decapod ExportView");
        
        exportViewTests.test("Init tests", function () {
            var downloadStr = "Download Export";
            var restartStr = "Restart";
            var exportView = decapod.exportView(EV_CONTAINER, {
                strings: {
                    download: downloadStr,
                    restart: restartStr
                }
            });
            jqUnit.assertTrue("The component should have initialized", exportView);
            $.each(exportView.options.selectors, function (selectorName, selector) {
                jqUnit.assertTrue("The element for the '" + selectorName + "' selector is available", $(selector, EV_CONTAINER).length > 0);
            });
            jqUnit.assertEquals("The text for the download link is set correctly", downloadStr, exportView.locate("downloadLink").text());
            jqUnit.assertEquals("The text for the start over link is set correclty", restartStr, exportView.locate("restartLink").text());
        });
        
        exportViewTests.test("updateStatus", function () {
            var status = "Status Updated";
            var exportView = decapod.exportView(EV_CONTAINER);
            
            exportView.updateStatus(status);
            jqUnit.assertEquals("The status should be update", status, exportView.locate("status").text());
        });
        
        exportViewTests.test("decapod.exportView.showExport", function () {
            var downloadPath = "../path/to/download";
            
            var exportView = decapod.exportView(EV_CONTAINER);
            decapod.exportView.showExport(exportView, downloadPath);
            
            jqUnit.assertEquals("The download path should have been set", downloadPath, exportView.locate("downloadLink").attr("href"));
            jqUnit.assertTrue("The download container should be visible", exportView.locate("download").filter(":visible").length > 0);
        });
        
        exportViewTests.test("showExport", function () {
            var downloadPath = "../path/to/download";
            
            var exportView = decapod.exportView(EV_CONTAINER, {
                model: {
                    downloadSRC: downloadPath
                }
            });
            exportView.showExport();
            
            jqUnit.assertEquals("The download path should have been set", downloadPath, exportView.locate("downloadLink").attr("href"));
            jqUnit.assertTrue("The download container should be visible", exportView.locate("download").filter(":visible").length > 0);
        });
        
        exportViewTests.test("setStartState", function () {
            var exportView = decapod.exportView(EV_CONTAINER, {
                model: {
                    status: "Started"
                }
            });
            exportView.setStartState();
            
            jqUnit.assertEquals("The status message should be updated to reflect the components current status", exportView.model.status, exportView.locate("status").text());
        });
        
        exportViewTests.test("setFinishedState", function () {
            var exportView = decapod.exportView(EV_CONTAINER, {
                model: {
                    status: "Complete"
                }
            });
            exportView.setFinishedState();
            
            jqUnit.assertEquals("The status message should be updated to reflect the components current status", exportView.model.status, exportView.locate("status").text());
            jqUnit.assertTrue("The download container should be visible", exportView.locate("download").filter(":visible").length > 0);
        });
        
        exportViewTests.test("reset", function () {
            var exportView = decapod.exportView(EV_CONTAINER, {
                model: {
                    status: "None"
                }
            });
            
            exportView.reset();
            
            jqUnit.assertEquals("The status message should be updated to reflect the components current status", exportView.model.status, exportView.locate("status").text());
            jqUnit.assertTrue("The download container should not be visible", exportView.locate("download").filter(":hidden").length > 0);
        });
        
        exportViewTests.asyncTest("pollExport", function () {
            expect(1);
            var mockThat = {
                exporter: {
                    fetchExport: function () {}
                },
                pollExport: function () {
                    jqUnit.assertTrue("The pollExport function should be called", true);
                    start();
                },
                poll: true,
                options: {delay: 500}
            };
            
            decapod.exportView.pollExport(mockThat);
        });
    });
})(jQuery);

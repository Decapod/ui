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
/*global decapod:true, fluid, jQuery, jqUnit, start*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {
    // Container Selectors
    var PDF_EXPORTER_CONTAINER = ".dc-pdfExporter";
    
    // Template URLs
    var EXPORT_INFO_TEMPLATE = "../../../components/exporter/html/exportInfoTemplate.html";
    var PDF_EXPORT_OPTIONS_TEMPLATE = "../../../components/exporter/html/pdfExportOptionsTemplate.html";
    var SELECT_TEMPLATE = "../../../components/select/html/selectTemplate.html";
    var OUTPUT_SETTINGS_TEMPLATE = "../../../components/exporter/html/outputSettingsTemplate.html";
    var CONTROLS_TEMPLATE = "../../../components/exporter/html/exportControlsTemplate.html";
    var TRIGGER_TEMPLATE = "../../../components/exporter/html/exportControlsTriggerTemplate.html";
    var PROGRESS_TEMPLATE = "../../../components/exporter/html/exportControlsProgressTemplate.html";
    var COMPLETE_TEMPLATE = "../../../components/exporter/html/exportControlsCompleteTemplate.html";
    var PDF_EXPORTER_TEMPLATE = "../../../components/exporter/html/pdfExporterTemplate.html";

    var createPDFExporter = function (container, options) {
        var opts = {
            resources: {
                pdfExportTemplate: {
                    url: PDF_EXPORTER_TEMPLATE,
                    forceCache: true
                },
                exportInfo: {
                    url: EXPORT_INFO_TEMPLATE,
                    forceCache: true
                },
                pdfExportOptions: {
                    url: PDF_EXPORT_OPTIONS_TEMPLATE,
                    forceCache: true
                },
                select: {
                    url: SELECT_TEMPLATE,
                    forceCache: true
                },
                outputSettings: {
                    url: OUTPUT_SETTINGS_TEMPLATE,
                    forceCache: true
                },
                controls: {
                    url: CONTROLS_TEMPLATE,
                    forceCache: true
                },
                trigger: {
                    url: TRIGGER_TEMPLATE,
                    forceCache: true
                },
                progress: {
                    url: PROGRESS_TEMPLATE,
                    forceCache: true
                },
                complete: {
                    url: COMPLETE_TEMPLATE,
                    forceCache: true
                }
            }
        };
        fluid.merge("replace", opts, options || {});
        return fluid.invokeGlobalFunction("decapod.pdfExporter", [container, opts]);
    };
    
    // Tests
    $(document).ready(function () {

        /********************
         * pdfExporterTests *
         ********************/
        
        var pdfExporterTests = jqUnit.testCase("decapod.pdfExporter");
        
        pdfExporterTests.asyncTest("Init tests", function () {
            jqUnit.expect(1);
            createPDFExporter(PDF_EXPORTER_CONTAINER, {
                listeners: {
                    onReady: {
                        listener: function (that) {
                            jqUnit.assertTrue("The component should have initialized", true);
                            start();
                        },
                        args: ["{pdfExporter}"],
                        priority: "last"
                    }
                }
            });
        });
        
        pdfExporterTests.asyncTest("Fetch Resources", function () {
            jqUnit.expect(9);
            var assertFetchResources = function (resourceSpec) {
                $.each(resourceSpec, function (idx, spec) {
                    jqUnit.assertTrue("The resourceText is filled out", spec.resourceText);
                });
                start();
            };
            createPDFExporter(PDF_EXPORTER_CONTAINER, {
                listeners: {
                    afterFetchResources: {
                        listener: assertFetchResources,
                        priority: "last"
                    }
                }
            });
        });
        
        pdfExporterTests.asyncTest("Rendering", function () {
            var assertRendering = function (that) {
                decapod.testUtils.exportType.assertexportInfoRender(that.exportInfo);
                decapod.testUtils.exportType.assertPDFOptionsRender(that.exportOptions);
                decapod.testUtils.exportType.assertShowTriggerControls(that.exportControls);
                jqUnit.notVisible("The outputSettings container should be hidden", that.exportOptions.locate("outputSettings"));
                start();
            };
            createPDFExporter(PDF_EXPORTER_CONTAINER, {
                listeners: {
                    afterFetchResources: {
                        listener: function (that) {
                            // enssures that the exportControls subcompoent has rendered before trying to test it.
                            that.exportControls.events.afterRender.addListener(function () {
                                assertRendering(that);
                            });
                        },
                        priority: "last",
                        args: ["{pdfExporter}"]
                    }
                }
            });
        });

        pdfExporterTests.asyncTest("onExportStart event", function () {
            jqUnit.expect(4);
            var assertEvent = function (that) {
                jqUnit.assertTrue("The onExportStart event should have fired", true);
                decapod.testUtils.exportType.assertShowProgressControls(that.exportControls);
                start();
            };
            createPDFExporter(PDF_EXPORTER_CONTAINER, {
                listeners: {
                    onExportStart: {
                        listener: assertEvent,
                        priority: "last",
                        args: ["{pdfExporter}"]
                    },
                    afterFetchResources: {
                        listener: "{pdfExporter}.events.onExportStart.fire",
                        priority: "last"
                    }
                }
            });
        });
        
        pdfExporterTests.asyncTest("afterExportComplete", function () {
            jqUnit.expect(6);
            var assertEvent = function (that) {
                jqUnit.assertTrue("The afterExportCompleteEvent should have fired", true);
                decapod.testUtils.exportType.assertShowCompleteControls(that.exportControls);
                start();
            };
            createPDFExporter(PDF_EXPORTER_CONTAINER, {
                listeners: {
                    afterExportComplete: {
                        listener: assertEvent,
                        priority: "last",
                        args: ["{pdfExporter}"]
                    },
                    afterFetchResources: {
                        listener: "{pdfExporter}.events.afterExportComplete",
                        priority: "last"
                    }
                }
            });
        });
        
        pdfExporterTests.asyncTest("afterExportComplete - pollComplete", function () {
            jqUnit.expect(6);
            var assertEvent = function (that) {
                jqUnit.assertTrue("The afterExportCompleteEvent should have fired", true);
                decapod.testUtils.exportType.assertShowCompleteControls(that.exportControls);
                start();
            };
            createPDFExporter(PDF_EXPORTER_CONTAINER, {
                listeners: {
                    afterExportComplete: {
                        listener: assertEvent,
                        priority: "last",
                        args: ["{pdfExporter}"]
                    },
                    onReady: {
                        listener: "{pdfExporter}.exportPoller.events.pollComplete",
                        priority: "last"
                    }
                }
            });
        });
        
        pdfExporterTests.asyncTest("afterExportComplete - dataSource success", function () {
            jqUnit.expect(6);
            var assertEvent = function (that) {
                jqUnit.assertTrue("The afterExportCompleteEvent should have fired", true);
                decapod.testUtils.exportType.assertShowCompleteControls(that.exportControls);
                start();
            };
            createPDFExporter(PDF_EXPORTER_CONTAINER, {
                listeners: {
                    afterExportComplete: {
                        listener: assertEvent,
                        priority: "last",
                        args: ["{pdfExporter}"]
                    },
                    onReady: {
                        listener: "{pdfExporter}.dataSource.events.success",
                        priority: "last",
                        args: ["{pdfExporter}"]
                    }
                }
            });
        });
        
        pdfExporterTests.asyncTest("afterExportComplete - onExportStart", function () {
            jqUnit.expect(7);
            var assertEvent = function (that, response) {
                jqUnit.assertTrue("The afterExportCompleteEvent should have fired", true);
                jqUnit.assertEquals("The decapod.exportControls.complete model should be updated", response.url, that.exportControls["**-renderer-complete-0"].model.downloadURL);
                decapod.testUtils.exportType.assertShowCompleteControls(that.exportControls);
                start();
            };
            createPDFExporter(PDF_EXPORTER_CONTAINER, {
                listeners: {
                    afterExportComplete: {
                        listener: assertEvent,
                        priority: "last",
                        args: ["{pdfExporter}", "{arguments}.0"]
                    },
                    onReady: {
                        listener: "{pdfExporter}.events.onExportStart",
                        priority: "last",
                        args: ["{pdfExporter}"]
                    }
                }
            });
        });
        
        pdfExporterTests.asyncTest("afterRender", function () {
            jqUnit.expect(1);
            var assertEvent = function (that, response) {
                jqUnit.assertTrue("The afterRender event should have fired", true);
                start();
            };
            createPDFExporter(PDF_EXPORTER_CONTAINER, {
                listeners: {
                    afterRender: {
                        listener: assertEvent,
                        priority: "last"
                    }
                }
            });
        });
        
        pdfExporterTests.asyncTest("afterModelChanged", function () {
            jqUnit.expect(2);
            var colourSelection = "grey";
            var trigger = function (that) {
                that.exportOptions.colour.applier.requestChange("selection", colourSelection);
            };
            var assertModelChange = function (newModel, that) {
                jqUnit.assertEquals("The model should be updated with the new colour selection", colourSelection, newModel.exportOptions.colour.selection);
                jqUnit.assertEquals("The components model should be update with the new colour selection", colourSelection, that.model.exportOptions.colour.selection);
                start();
            };
            createPDFExporter(PDF_EXPORTER_CONTAINER, {
                listeners: {
                    afterModelChanged: {
                        listener: assertModelChange,
                        args: ["{arguments}.0", "{pdfExporter}"]
                    },
                    afterRender: {
                        listener: trigger,
                        priority: "last"
                    }
                }
            });
        });
        
        pdfExporterTests.asyncTest("showOutputSettings", function () {
            jqUnit.expect(1);
            var outputSelection = "custom";
            var trigger = function (that) {
                that.exportOptions.applier.requestChange("output.selection", outputSelection);
            };
            var assertModelChange = function (that) {
                jqUnit.isVisible("The outputSettings container should be visible", that.locate("outputSettings"));
                start();
            };
            createPDFExporter(PDF_EXPORTER_CONTAINER, {
                listeners: {
                    afterModelChanged: {
                        listener: assertModelChange,
                        args: ["{exportOptions}"],
                        priority: "last"
                    },
                    afterRender: {
                        listener: trigger,
                        priority: "last"
                    }
                }
            });
        });
    });
})(jQuery);

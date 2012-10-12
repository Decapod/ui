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
    var DETAILED_PROGRESS_TEMPLATE = "../../../components/exporter/html/exportControlsDetailedProgressTemplate.html";
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
                    url: DETAILED_PROGRESS_TEMPLATE,
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
            jqUnit.expect(2);
            var expected = {
                width: 21,
                height: 29.7,
                dpi: 200
            };
            createPDFExporter(PDF_EXPORTER_CONTAINER, {
                listeners: {
                    onReady: {
                        listener: function (that) {
                            jqUnit.assertTrue("The component should have initialized", true);
                            jqUnit.assertDeepEq("The assembledExportOptions property is set", expected, that.assembledExportOptions);
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
                    afterRender: {
                        listener: assertRendering,
                        priority: "last",
                        args: ["{pdfExporter}"]
                    }
                }
            });
        });

        pdfExporterTests.asyncTest("onExportStart event", function () {
            jqUnit.expect(5);
            var assertEvent = function (that) {
                jqUnit.assertTrue("The onExportStart event should have fired", true);
                decapod.testUtils.exportType.assertShowDetailedProgressControls(that.exportControls);
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
        
        pdfExporterTests.asyncTest("onExportStatusUpdate", function () {
            jqUnit.expect(3);
            var assertEvent = function (that, response) {
                jqUnit.assertTrue("The onExportStatusUpdate event should have fired", true);
                decapod.testUtils.exportType.assertFluidProgressState(that.exportControls["**-renderer-progress-0"].progress, 0, "Creating export... Step 1 of 2.");
                start();
            };
            createPDFExporter(PDF_EXPORTER_CONTAINER, {
                listeners: {
                    onExportStatusUpdate: {
                        listener: assertEvent,
                        args: ["{pdfExporter}", "{arguments}.0"],
                        priority: "last"
                    },
                    onExportStart: {
                        listener: "{pdfExporter}.events.onExportStatusUpdate.fire",
                        priority: "last",
                        args: [{status: "in progress", stage: "books2pages"}]
                    },
                    afterFetchResources: {
                        listener: "{pdfExporter}.events.onExportStart.fire",
                        priority: "last"
                    }
                }
            });
        });
        
        pdfExporterTests.asyncTest("afterPollComplete", function () {
            jqUnit.expect(1);
            var assertEvent = function (that) {
                jqUnit.assertTrue("The afterPollComplete should have fired", true);
                start();
            };
            createPDFExporter(PDF_EXPORTER_CONTAINER, {
                listeners: {
                    afterPollComplete: {
                        listener: assertEvent,
                        priority: "last"
                    },
                    onReady: {
                        listener: "{pdfExporter}.exportPoller.events.pollComplete",
                        priority: "last"
                    }
                }
            });
        });
        
        pdfExporterTests.asyncTest("afterPollComplete - dataSource success", function () {
            jqUnit.expect(1);
            var assertEvent = function (that) {
                jqUnit.assertTrue("The afterPollComplete should have fired", true);
                start();
            };
            createPDFExporter(PDF_EXPORTER_CONTAINER, {
                listeners: {
                    afterPollComplete: {
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
        
        pdfExporterTests.asyncTest("afterExportComplete - onExportStart", function () {
            jqUnit.expect(10);
            var assertPollComplete = function (that) {
                jqUnit.assertTrue("The afterPollComplete should have fired", true);
                var decorators = fluid.renderer.getDecoratorComponents(that.exportControls, that.instantiator);
                var progress = decapod.testUtils.componentFromDecorator("progress", decorators);
                decapod.testUtils.exportType.assertFluidProgressState(progress.progress, 100, progress.options.strings.completeProgressMessage);
            };
            var assertExportComplete = function (that, response) {
                jqUnit.assertTrue("The afterExportCompleteEvent should have fired", true);
                jqUnit.assertEquals("The decapod.exportControls.complete model should be updated", response.url, that.exportControls["**-renderer-complete-0"].model.downloadURL);
                decapod.testUtils.exportType.assertShowCompleteControls(that.exportControls);
                start();
            };
            createPDFExporter(PDF_EXPORTER_CONTAINER, {
                components: {
                    instantiator: "{instantiator}"
                },
                listeners: {
                    afterPollComplete: {
                        listener: assertPollComplete,
                        priority: "last",
                        args: ["{pdfExporter}"]
                    },
                    afterExportComplete: {
                        listener: assertExportComplete,
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
            jqUnit.expect(3);
            var outputSelection = "a5";
            var expected = {
                width: 14.8,
                height: 21,
                dpi: 200
            };
            var trigger = function (that) {
                that.exportOptions.output.applier.requestChange("selection", outputSelection);
            };
            var assertModelChange = function (newModel, that) {
                jqUnit.assertEquals("The model should be updated with the new output selection", outputSelection, newModel.exportOptions.output.selection);
                jqUnit.assertEquals("The components model should be update with the new output selection", outputSelection, that.model.exportOptions.output.selection);
                jqUnit.assertDeepEq("The assembledExportOptions property is set", expected, that.assembledExportOptions);
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
        
        pdfExporterTests.test("decapod.pdfExporter.convertDimensionSetting", function () {
            var setting = {value: 210, name: "width", unit: "mm", attrs: {type: "number", min: 1, max: 30}};
            var expected = {width: 21};
            jqUnit.assertDeepEq("The dimension setting should be converted", expected, decapod.pdfExporter.convertDimensionSetting(setting));
        });
        
        pdfExporterTests.test("decapod.pdfExporter.convertResolutionSetting", function () {
            var setting = {value: 200, name: "resolution", unit: "dpi", attrs: {type: "number", min: 50, max: 600}};
            var expected = {dpi: 200};
            jqUnit.assertDeepEq("The dimension setting should be converted", expected, decapod.pdfExporter.convertResolutionSetting(setting));
        });
        
        pdfExporterTests.asyncTest("mapExportOptions", function () {
            jqUnit.expect(2);
            var expectedCustom = {
                width: 21,
                height: 29.7,
                dpi: "200"
            };
            var trigger = function (that) {
                jqUnit.assertDeepEq("The export options should be mapped correctly", that.options.exportOptionsMap.a4, that.mapExportOptions("a4"));
                jqUnit.assertDeepEq("The custom export options should be mapped correctly", expectedCustom, that.mapExportOptions("custom"));
                start();
            };
            createPDFExporter(PDF_EXPORTER_CONTAINER, {
                listeners: {
                    afterRender: {
                        listener: trigger,
                        priority: "last"
                    }
                }
            });
        });
        
        pdfExporterTests.asyncTest("assembleExportOptions", function () {
            jqUnit.expect(2);
            var expected = {
                width: 21,
                height: 29.7,
                dpi: 200
            };
            var trigger = function (that) {
                jqUnit.assertDeepEq("The export options should be mapped correctly", expected, that.assembleExportOptions());
                jqUnit.assertDeepEq("The export options should be mapped correctly", expected, that.assembledExportOptions);
                start();
            };
            createPDFExporter(PDF_EXPORTER_CONTAINER, {
                listeners: {
                    afterRender: {
                        listener: trigger,
                        priority: "last"
                    }
                }
            });
        });
        
        pdfExporterTests.asyncTest("assembleCustomSettings", function () {
            jqUnit.expect(1);
            var expected = {
                width: 21,
                height: 29.7,
                dpi: "200"
            };
            var trigger = function (that) {
                jqUnit.assertDeepEq("The custom settings should be assembled", expected, that.assembleCustomSettings(that.options.exportOptionsMap.custom));
                start();
            };
            createPDFExporter(PDF_EXPORTER_CONTAINER, {
                listeners: {
                    afterRender: {
                        listener: trigger,
                        priority: "last"
                    }
                }
            });
        });
        
        pdfExporterTests.asyncTest("valid custom setting", function () {
            jqUnit.expect(4);
            var newWidth = "200";
            var expected = {
                width: 20,
                height: 29.7,
                dpi: "200"
            };
            var trigger = function (that) {
                that.exportOptions.outputSettings.applier.requestChange("settings.0.value", newWidth);
            };
            var assertModelChange = function (newModel, that) {
                jqUnit.assertEquals("The model should be updated with the new output selection", newWidth, newModel.exportOptions.outputSettings.settings[0].value);
                jqUnit.assertEquals("The components model should be update with the new output selection", newWidth, that.model.exportOptions.outputSettings.settings[0].value);
                jqUnit.assertDeepEq("The assembledExportOptions property is set", expected, that.assembledExportOptions);
                jqUnit.isVisible("The export trigger should be visible", $(".dc-exportControls-trigger-exportControl", that.container));
                start();
            };
            createPDFExporter(PDF_EXPORTER_CONTAINER, {
                model: {
                    exportOptions: {
                        output: {selection: "custom"}
                    }
                },
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
        
        pdfExporterTests.asyncTest("invalid custom setting", function () {
            jqUnit.expect(3);
            var newWidth = "2000";
            var expected = "210";
            var assertValidationError = function (that, trigger) {
                jqUnit.assertEquals("The components model should not be update with the new output selection", expected, that.model.exportOptions.outputSettings.settings[0].value);
                jqUnit.assertTrue("The export trigger should be disabled", trigger.locate("trigger").is(":disabled"));
                jqUnit.assertFalse("isInputValid should be false", that.isInputValid);
                start();
            };
            var trigger = function (that) {
                that.events.onValidationError.addListener(function () {
                    var decorators = fluid.renderer.getDecoratorComponents(that.exportControls, that.instantiator);
                    var trigger = decapod.testUtils.componentFromDecorator("trigger", decorators);
                    assertValidationError(that, trigger);
                }, "test", null, "last");
                that.exportOptions.outputSettings.applier.requestChange("settings.0.value", newWidth);
            };
            var assertModelChange = function () {
                jqUnit.assertFalse("The afterModelChanged event should not have fired.", true);
            };
            createPDFExporter(PDF_EXPORTER_CONTAINER, {
                model: {
                    exportOptions: {
                        output: {selection: "custom"}
                    }
                },
                components: {
                    instantiator: "{instantiator}"
                },
                listeners: {
                    afterModelChanged: {
                        listener: assertModelChange
                    },
                    afterRender: {
                        listener: trigger,
                        priority: "last"
                    }
                }
            });
        });
        
        pdfExporterTests.asyncTest("corrected invalid custom setting", function () {
            jqUnit.expect(4);
            var newWidth = "2000";
            var correctedWidth = "200";
            var triggerError = function (that) {
                that.exportOptions.outputSettings.applier.requestChange("settings.0.value", newWidth);
            };
            var triggerCorrection = function (that) {
                that.exportOptions.outputSettings.applier.requestChange("settings.0.value", correctedWidth);
            };
            var assertCorrection = function (that) {
                jqUnit.assertTrue("The onCorrection event should fire", true);
                var decorators = fluid.renderer.getDecoratorComponents(that.exportControls, that.instantiator);
                var trigger = decapod.testUtils.componentFromDecorator("trigger", decorators);
                jqUnit.assertTrue("The export trigger should be enabled", trigger.locate("trigger").is(":enabled"));
                jqUnit.assertTrue("isInputValid should be true", that.isInputValid);
                start();
            };
            var assertModelChange = function () {
                jqUnit.assertTrue("The afterModelChanged event should fire.", true);
            };
            createPDFExporter(PDF_EXPORTER_CONTAINER, {
                model: {
                    exportOptions: {
                        output: {selection: "custom"}
                    }
                },
                components: {
                    instantiator: "{instantiator}"
                },
                listeners: {
                    afterModelChanged: {
                        listener: assertModelChange
                    },
                    afterRender: {
                        listener: triggerError,
                        priority: "last"
                    },
                    onValidationError: {
                        listener: triggerCorrection,
                        args: ["{pdfExporter}"],
                        priority: "last"
                    },
                    onCorrection: {
                        listener: assertCorrection,
                        args: ["{pdfExporter}"],
                        priority: "last"
                    }
                }
            });
        });
        
        pdfExporterTests.asyncTest("corrected invalid custom setting - change output type", function () {
            jqUnit.expect(3);
            var newWidth = "2000";
            var triggerError = function (that) {
                that.exportOptions.outputSettings.applier.requestChange("settings.0.value", newWidth);
            };
            var triggerCorrection = function (that) {
                that.exportOptions.output.applier.requestChange("selection", "a4");
            };
            var assertModelChange = function (that) {
                jqUnit.assertTrue("The afterModelChanged event should fire.", true);
                var decorators = fluid.renderer.getDecoratorComponents(that.exportControls, that.instantiator);
                var trigger = decapod.testUtils.componentFromDecorator("trigger", decorators);
                jqUnit.assertTrue("The export trigger should be enabled", trigger.locate("trigger").is(":enabled"));
                jqUnit.assertTrue("isInputValid should be true", that.isInputValid);
                start();
            };
            createPDFExporter(PDF_EXPORTER_CONTAINER, {
                model: {
                    exportOptions: {
                        output: {selection: "custom"}
                    }
                },
                components: {
                    instantiator: "{instantiator}"
                },
                listeners: {
                    afterModelChanged: {
                        listener: assertModelChange,
                        args: ["{pdfExporter}"],
                        priority: "last"
                    },
                    afterRender: {
                        listener: triggerError,
                        priority: "last"
                    },
                    onValidationError: {
                        listener: triggerCorrection,
                        args: ["{pdfExporter}"],
                        priority: "last"
                    }
                }
            });
        });
        
        pdfExporterTests.asyncTest("invalid custom setting - change output type", function () {
            jqUnit.expect(3);
            var triggerError = function (that) {
                // puts the custom setting into an error state
                that.exportOptions.outputSettings.status = [false, false, false];
                that.exportOptions.output.applier.requestChange("selection", "custom");
            };
            var assertModelChange = function (that) {
                jqUnit.assertTrue("The afterModelChanged event should fire.", true);
                var decorators = fluid.renderer.getDecoratorComponents(that.exportControls, that.instantiator);
                var trigger = decapod.testUtils.componentFromDecorator("trigger", decorators);
                jqUnit.assertTrue("The export trigger should be disabled", trigger.locate("trigger").is(":disabled"));
                jqUnit.assertFalse("isInputValid should be false", that.isInputValid);
                start();
            };
            createPDFExporter(PDF_EXPORTER_CONTAINER, {
                model: {
                    exportOptions: {
                        output: {selection: "a4"}
                    }
                },
                components: {
                    instantiator: "{instantiator}"
                },
                listeners: {
                    afterModelChanged: {
                        listener: assertModelChange,
                        args: ["{pdfExporter}"],
                        priority: "last"
                    },
                    afterRender: {
                        listener: triggerError,
                        priority: "last"
                    }
                }
            });
        });
    });
})(jQuery);

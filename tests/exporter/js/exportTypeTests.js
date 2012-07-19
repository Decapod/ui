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
    var INFO_CONTAINER = ".dc-exportInfo";
    var PDF_EXPORT_OPTIONS_CONTAINER = ".dc-pdfExportOptions";
    var OUTPUT_SETTINGS_CONTAINER = ".dc-outputSettings";
    var CONTROLS_CONTAINER = ".dc-exportControls";
    var TRIGGER_CONTAINER = ".dc-exportControls-trigger";
    var PROGRESS_CONTAINER = ".dc-exportControls-progress";
    var COMPLETE_CONTAINER = ".dc-exportControls-complete";
    
    // Template URLs
    var EXPORT_INFO_TEMPLATE = "../../../components/exporter/html/exportInfoTemplate.html";
    var PDF_EXPORT_OPTIONS_TEMPLATE = "../../../components/exporter/html/pdfExportOptionsTemplate.html";
    var OUTPUT_SETTINGS_TEMPLATE = "../../../components/exporter/html/outputSettingsTemplate.html";
    var CONTROLS_TEMPLATE = "../../../components/exporter/html/exportControlsTemplate.html";
    var TRIGGER_TEMPLATE = "../../../components/exporter/html/exportControlsTriggerTemplate.html";
    var PROGRESS_TEMPLATE = "../../../components/exporter/html/exportControlsProgressTemplate.html";
    var COMPLETE_TEMPLATE = "../../../components/exporter/html/exportControlsCompleteTemplate.html";
    var SELECT_TEMPLATE = "../../../components/select/html/selectTemplate.html";
    
    // Convenience Functions: component creators
    var generateCompositeComponent = function (component, container, resources, options) {
        var opts = {
            resources: resources
        };
        
        fluid.merge("replace", opts, options || {});
        return fluid.invokeGlobalFunction(component, [container, opts]);
    };
    var generateComponent = function (component, container, templateURL, options) {
        var resources = {
            template: {
                url: templateURL
            }
        };
        return generateCompositeComponent(component, container, resources, options);
    };
    
    var createExportInfo = function (container, options) {
        return generateComponent("decapod.exportInfo", container, EXPORT_INFO_TEMPLATE, options);
    };
    
    var createPDFExportOptions = function (container, options) {
        return generateComponent("decapod.pdfExportOptions", container, PDF_EXPORT_OPTIONS_TEMPLATE, options);
    };
    
    var createControls = function (container, options) {
        var resources = {
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
        };
        return generateCompositeComponent("decapod.exportControls", container, resources, options);
    };
    
    var createTrigger = function (container, options) {
        return generateComponent("decapod.exportControls.trigger", container, TRIGGER_TEMPLATE, options);
    };
    
    var createProgress = function (container, options) {
        return generateComponent("decapod.exportControls.progress", container, PROGRESS_TEMPLATE, options);
    };
    
    var createComplete = function (container, options) {
        return generateComponent("decapod.exportControls.complete", container, COMPLETE_TEMPLATE, options);
    };
    
    var createOutputSettings = function (container, options) {
        return generateComponent("decapod.outputSettings", container, OUTPUT_SETTINGS_TEMPLATE, options);
    };

    // Tests
    $(document).ready(function () {

        /*********************
         * exportPollerTests *
         *********************/
        
        var exportPollerTests = jqUnit.testCase("decapod.exportPoller");
        
        var completeResponse = {
            status: "complete",
            url: "../../../mock-book/images/pdf/mockBook.pdf"
        };
        
        var inProgressResponse = {
            status: "in progress"
        };
         
        exportPollerTests.test("Init tests", function () {
            var that = decapod.exportPoller();
            jqUnit.assertTrue("The component should have initialized", that);
        });
        
        exportPollerTests.asyncTest("Poll", function () {
            jqUnit.expect(1);
            var that = decapod.exportPoller();
            that.events.onPoll.addListener(function () {
                jqUnit.assertTrue("The onPoll event should have fired", true);
                start();
            });
            that.poll();
        });
        
        exportPollerTests.test("isComplete", function () {
            var that = decapod.exportPoller();
            
            jqUnit.assertTrue("isComplete should return true", that.isComplete(completeResponse));
            jqUnit.assertFalse("isComplete should return false", that.isComplete(inProgressResponse));
        });
        
        exportPollerTests.asyncTest("handleResponse", function () {
            jqUnit.expect(4);
            var that = decapod.exportPoller({delay: 10});
            that.events.onPoll.addListener(function () {
                jqUnit.assertTrue("The onPoll event should have fired", true);
                jqUnit.assertDeepEq("The response should be set", inProgressResponse, that.response);
            });
            that.events.pollComplete.addListener(function () {
                jqUnit.assertTrue("The pollComplete event should have fired", true);
                jqUnit.assertDeepEq("The response should be set", completeResponse, that.response);
                start();
            });
            that.handleResponse(inProgressResponse);
        });
        
        exportPollerTests.asyncTest("Datasource Integration - onPoll", function () {
            jqUnit.expect(1);
            var testEvent = function () {
                jqUnit.assertTrue("The datasource success event should have fired", true);
                start();
            };
            var that = decapod.exportPoller();
            that.dataSource.events.success.addListener(testEvent);
            that.events.onPoll.fire();
            
        });
        
        exportPollerTests.asyncTest("Datasource Integration - success", function () {
            jqUnit.expect(2);
            var testResponseHandler = function (response) {
                jqUnit.assertTrue("The datasource triggered the handleResponse invoker", true);
                jqUnit.assertDeepEq("A response is returned", completeResponse, response);
                start();
            };
            var that = decapod.exportPoller();
            that.handleResponse = testResponseHandler;
            that.dataSource.events.success.fire(completeResponse);
        });
        
        /*******************
         * exportInfoTests *
         *******************/
        
        var exportInfoTests = jqUnit.testCase("decapod.exportInfo");
        
        exportInfoTests.test("Init tests", function () {
            var that = createExportInfo(INFO_CONTAINER);
            jqUnit.assertTrue("The component should have initialized", that);
        });
        
        exportInfoTests.asyncTest("Fetch Resources", function () {
            jqUnit.expect(1);
            var assertFetchResources = function (resourceSpec) {
                jqUnit.assertTrue("The resourceText is filled out", resourceSpec.template.resourceText);
                start();
            };
            createExportInfo(INFO_CONTAINER, {
                listeners: {
                    afterFetchResources: assertFetchResources
                }
            });
        });
        
        exportInfoTests.asyncTest("Rendering", function () {
            var assertRender = function (that) {
                decapod.testUtils.exportType.assertexportInfoRender(that);
                start();
            };
            createExportInfo(INFO_CONTAINER, {
                listeners: {
                    afterRender: assertRender
                }
            });
        });
        
        /***********************
         * outputSettingsTests *
         ***********************/
        
        var outputSettingsTests = jqUnit.testCase("decapod.pdfExportOptions.outputSettingsTests");
        
        var defaultOutputSettingsModel = {
            settings: [
                {value: "210", name: "width", unit: "mm", attrs: {type: "number", min: "1", max: "30"}},
                {value: "297", name: "height", unit: "mm", attrs: {type: "number", min: "1", max: "30"}},
                {value: "200", name: "resolution", unit: "dpi", attrs: {type: "number", min: "1", max: "600"}}
            ]
        };
        
        outputSettingsTests.asyncTest("Init tests", function () {
            jqUnit.expect(19);
            var assertInit = function (that) {
                jqUnit.assertTrue("The component should have initialized", that);
                decapod.testUtils.exportType.assertOutputSettingsRender(that);
                start();
            };
            createOutputSettings(OUTPUT_SETTINGS_CONTAINER, {
                model: defaultOutputSettingsModel,
                listeners: {
                    afterRender: assertInit
                }
            });
        });
        
        outputSettingsTests.asyncTest("Fetch Resources", function () {
            jqUnit.expect(1);
            var assertFetch = function (resourceSpec) {
                jqUnit.assertTrue("The resourceText is filled out", resourceSpec.template.resourceText);
            };
            createOutputSettings(OUTPUT_SETTINGS_CONTAINER, {
                model: defaultOutputSettingsModel,
                listeners: {
                    afterFetchResources: {
                        listener: assertFetch,
                        priority: "last"
                    },
                    afterRender: function () {start();}
                }
            });
        });
        
        outputSettingsTests.asyncTest("Model Change", function () {
            jqUnit.expect();
            var newWidth = "222";
            var triggerEvent = function (that) {
                that.applier.requestChange("output.settings.0.value", newWidth);
            };
            var assertChange = function (newModel, that) {
                jqUnit.assertEquals("The model should be updated with the new width", newWidth, newModel.output.settings[0].value);
                jqUnit.assertEquals("The components model should be update with the new width", newWidth, newModel.output.settings[0].value);
                start();
            };
            createOutputSettings(OUTPUT_SETTINGS_CONTAINER, {
                model: defaultOutputSettingsModel,
                listeners: {
                    afterModelChanged: {
                        listener: assertChange,
                        priority: "last"
                    },
                    afterRender: triggerEvent
                }
            });
        });
        
        /*************************
         * pdfExportOptionsTests *
         *************************/
        
        var pdfExportOptionsTests = jqUnit.testCase("decapod.pdfExportOptions");
        
        var defaultPDFExportOptionsModel = {
            output: {selection: "a4", choices: ["a4", "a5", "letter", "custom"], names: ["A4 (210x297 mm)", "A5 (148x210 mm)", "Letter (216x279mm)", "Custom"]},
            outputSettings: {
                settings: [
                    {value: "210", name: "width", unit: "mm", attrs: {type: "number", min: "1", max: "30"}},
                    {value: "297", name: "height", unit: "mm", attrs: {type: "number", min: "1", max: "30"}},
                    {value: "200", name: "resolution", unit: "dpi", attrs: {type: "number", min: "1", max: "600"}}
                ]
            }
        };
        
        pdfExportOptionsTests.asyncTest("Init tests", function () {
            jqUnit.expect(4);
            var assertInit = function (that) {
                jqUnit.assertTrue("The component should have initialized", that);
                jqUnit.assertDeepEq("The output model should be set", that.model.output, that.output.model);
                jqUnit.assertDeepEq("The output settings model should be set", that.model.outputSettings, that.outputSettings.model);
                jqUnit.assertEquals("The output label string should be set", that.options.strings.outputLabel, that.output.options.strings.label);
                start();
            };
            createPDFExportOptions(PDF_EXPORT_OPTIONS_CONTAINER, {
                model: defaultPDFExportOptionsModel,
                listeners: {
                    afterRender: assertInit
                },
                resources: {
                    template: {
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
                    }
                }
            });
        });
        
        pdfExportOptionsTests.asyncTest("Fetch Resources", function () {
            jqUnit.expect(1);
            var assertFetchResources = function (resourceSpec) {
                jqUnit.assertTrue("The resourceText is filled out", resourceSpec.template.resourceText);
            };
            createPDFExportOptions(PDF_EXPORT_OPTIONS_CONTAINER, {
                model: defaultPDFExportOptionsModel,
                listeners: {
                    afterFetchResources: assertFetchResources,
                    afterRender: function () {start();}
                },
                resources: {
                    template: {
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
                    }
                }
            });
        });
        
        pdfExportOptionsTests.asyncTest("Rendering", function () {
            jqUnit.expect(28);
            var assertRender = function (that) {
                decapod.testUtils.exportType.assertPDFOptionsRender(that);
                start();
            };
            
            createPDFExportOptions(PDF_EXPORT_OPTIONS_CONTAINER, {
                model: defaultPDFExportOptionsModel,
                listeners: {
                    afterRender: assertRender
                },
                resources: {
                    template: {
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
                    }
                }
            });
        });
        
        pdfExportOptionsTests.asyncTest("hide", function () {
            jqUnit.expect(1);
            var testHide = function (that) {
                var sel = "outputSettings";
                var elm = that.locate(sel);
                elm.show();
                that.hide(sel);
                jqUnit.notVisible("The element should not be visible", elm);
                start();
            };
            createPDFExportOptions(PDF_EXPORT_OPTIONS_CONTAINER, {
                model: defaultPDFExportOptionsModel,
                listeners: {
                    afterRender: testHide
                },
                resources: {
                    template: {
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
                    }
                }
            });
        });
        
        pdfExportOptionsTests.asyncTest("show", function () {
            jqUnit.expect(1);
            var testHide = function (that) {
                var sel = "outputSettings";
                var elm = that.locate(sel);
                elm.hide();
                that.show(sel);
                jqUnit.isVisible("The element should be visible", elm);
                start();
            };
            createPDFExportOptions(PDF_EXPORT_OPTIONS_CONTAINER, {
                model: defaultPDFExportOptionsModel,
                listeners: {
                    afterRender: testHide
                },
                resources: {
                    template: {
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
                    }
                }
            });
        });
        
        pdfExportOptionsTests.asyncTest("showIfModelValue - true", function () {
            jqUnit.expect(1);
            var testHide = function (that) {
                var sel = "outputSettings";
                var elm = that.locate(sel);
                elm.hide();
                that.showIfModelValue(sel, "output.selection", "a4");
                jqUnit.isVisible("The element should be visible", elm);
                start();
            };
            createPDFExportOptions(PDF_EXPORT_OPTIONS_CONTAINER, {
                model: defaultPDFExportOptionsModel,
                listeners: {
                    afterRender: testHide
                },
                resources: {
                    template: {
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
                    }
                }
            });
        });
        
        pdfExportOptionsTests.asyncTest("showIfModelValue - false", function () {
            jqUnit.expect(1);
            var testHide = function (that) {
                var sel = "outputSettings";
                var elm = that.locate(sel);
                elm.show();
                that.showIfModelValue(sel, "output.selection", "a5");
                jqUnit.notVisible("The element should not be visible", elm);
                start();
            };
            createPDFExportOptions(PDF_EXPORT_OPTIONS_CONTAINER, {
                model: defaultPDFExportOptionsModel,
                listeners: {
                    afterRender: testHide
                },
                resources: {
                    template: {
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
                    }
                }
            });
        });

        pdfExportOptionsTests.asyncTest("Model Change - output", function () {
            jqUnit.expect(2);
            var outputSelection = "a5";
            var changeVal = function (that) {
                that.output.applier.requestChange("selection", outputSelection);
            };
            var assertModelChange = function (newModel, that) {
                jqUnit.assertEquals("The model should be updated with the new output selection", outputSelection, newModel.output.selection);
                jqUnit.assertEquals("The components model should be update with the new output selection", outputSelection, that.model.output.selection);
                start();
            };
            createPDFExportOptions(PDF_EXPORT_OPTIONS_CONTAINER, {
                model: defaultPDFExportOptionsModel,
                listeners: {
                    afterRender: changeVal,
                    afterModelChanged: {
                        listener: assertModelChange,
                        args: ["{arguments}.0", "{pdfExportOptions}"]
                    }
                },
                resources: {
                    template: {
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
                    }
                }
            });
        });
        
        pdfExportOptionsTests.asyncTest("Model Change - outputSettings", function () {
            jqUnit.expect(2);
            var newWidth = "222";
            var changeVal = function (that) {
                that.outputSettings.applier.requestChange("settings.0.value", newWidth);
            };
            var assertModelChange = function (newModel, that) {
                jqUnit.assertEquals("The model should be updated with the new width", newWidth, newModel.outputSettings.settings[0].value);
                jqUnit.assertEquals("The components model should be update with the new width", newWidth, that.model.outputSettings.settings[0].value);
                start();
            };
            createPDFExportOptions(PDF_EXPORT_OPTIONS_CONTAINER, {
                model: defaultPDFExportOptionsModel,
                listeners: {
                    afterRender: changeVal,
                    afterModelChanged: {
                        listener: assertModelChange,
                        args: ["{arguments}.0", "{pdfExportOptions}"]
                    }
                },
                resources: {
                    template: {
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
                    }
                }
            });
        });
        
        /****************
         * triggerTests *
         ****************/
        
        var triggerTests = jqUnit.testCase("decapod.exportControls.trigger");
        
        triggerTests.test("init", function () {
            var that = createTrigger(TRIGGER_CONTAINER);
            jqUnit.assertTrue("The component should have initialized", that);
        });
        
        triggerTests.asyncTest("Fetch Resources", function () {
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
        
        triggerTests.asyncTest("Rendering", function () {
            jqUnit.expect(2);
            var assertRendering = function (that) {
                decapod.testUtils.exportType.assertTriggerRender(that);
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
        
        triggerTests.asyncTest("updateModel", function () {
            jqUnit.expect(6);
            var setup = function (that) {
                that.updateModel(true);
            };
            var assertRendering = function (that) {
                decapod.testUtils.exportType.assertTriggerRender(that);
                jqUnit.assertTrue("The trigger should be disabled", that.locate("trigger").prop("disabled"));
                start();
            };
            var assertModelChanged = function (that, newModel) {
                that.events.afterRender.removeListener("initial");
                that.events.afterRender.addListener(assertRendering);
                jqUnit.assertTrue("The afterModelChanged event should have fired", true);
                jqUnit.assertDeepEq("The new Model should be updated", {disabled: true}, newModel);
                jqUnit.assertTrue("The model's disabled value should be set to true", that.model.disabled);
            };
            createTrigger(TRIGGER_CONTAINER, {
                listeners: {
                    afterModelChanged: {
                        listener: assertModelChanged,
                        args: ["{trigger}", "{arguments}.0"],
                        priority: "first"
                    },
                    "afterRender.initial": {
                        listener: setup,
                        args: ["{trigger}"],
                        priority: "last"
                    }
                }
            });
        });
        
        triggerTests.asyncTest("afterTriggered", function () {
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
        
        /*****************
         * progressTests *
         *****************/
        
        var progressTests = jqUnit.testCase("decapod.exportControls.progress");
        
        progressTests.test("init", function () {
            var that = createProgress(PROGRESS_CONTAINER);
            jqUnit.assertTrue("The component should have initialized", that);
        });
        
        progressTests.asyncTest("Fetch Resources", function () {
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
        
        progressTests.asyncTest("Rendering", function () {
            jqUnit.expect(1);
            var assertRendering = function (that) {
                decapod.testUtils.exportType.assertProgressRender(that);
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
        
        /*****************
         * completeTests *
         *****************/
        
        var completeTests = jqUnit.testCase("decapod.exportControls.complete");
        
        completeTests.test("init", function () {
            var that = createComplete(COMPLETE_CONTAINER);
            jqUnit.assertTrue("The component should have initialized", that);
        });
        
        completeTests.asyncTest("Fetch Resources", function () {
            jqUnit.expect(1);
            var assertFetchResources = function (resourceSpec) {
                jqUnit.assertTrue("The resourceText is filled out", resourceSpec.template.resourceText);
                start();
            };
            createComplete(COMPLETE_CONTAINER, {
                listeners: {
                    afterFetchResources: assertFetchResources
                }
            });
        });
        
        completeTests.asyncTest("Rendering", function () {
            jqUnit.expect(3);
            var assertRendering = function (that) {
                decapod.testUtils.exportType.assertCompleteRender(that);
                start();
            };
            createComplete(COMPLETE_CONTAINER, {
                listeners: {
                    afterRender: {
                        listener: assertRendering,
                        priority: "last"
                    }
                }
            });
        });
        
        completeTests.asyncTest("modelUpdate", function () {
            jqUnit.expect(3);
            var newURL = "http://new.url";
            var that = createComplete(COMPLETE_CONTAINER);
            that.events.afterModelChanged.addListener(function (newModel) {
                jqUnit.assertTrue("The afterModelChanged event should have fired", true);
                jqUnit.assertDeepEq("The newModel should be returned", {downloadURL: newURL}, newModel);
                jqUnit.assertEquals("The model should be updated with the new url", newURL, that.model.downloadURL);
                start();
            });
            that.updateModel(newURL);
        });
        
        /*****************
         * controlsTests *
         *****************/
        
        var controlsTests = jqUnit.testCase("decapod.exportControls");
        
        controlsTests.asyncTest("Init tests", function () {
            createControls(CONTROLS_CONTAINER, {
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
                decapod.testUtils.exportType.assertShowTriggerControls(that);
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
                showExportComplete: false
            };
            var assertRender = function (that) {
                decapod.testUtils.exportType.assertShowProgressControls(that);
                start();
            };
            var assertModel = function (newModel) {
                jqUnit.assertDeepEq("The model should be updated", model, newModel);
            };
            createControls(CONTROLS_CONTAINER, {
                listeners: {
                    afterRender: function (that) {
                        if (that["**-renderer-trigger-0"]) {
                            that.events.afterModelChanged.addListener(assertModel);
                            that.updateModel(model);
                        } else {
                            assertRender(that);
                        }
                    }
                }
            });
            
        });
        
        controlsTests.asyncTest("Change Model - show complete", function () {
            jqUnit.expect(6);
            var model = {
                showExportStart: false,
                showExportProgress: false,
                showExportComplete: true
            };
            var assertRender = function (that) {
                decapod.testUtils.exportType.assertShowCompleteControls(that);
                start();
            };
            var assertModel = function (newModel) {
                jqUnit.assertDeepEq("The model should be updated", model, newModel);
            };
            createControls(CONTROLS_CONTAINER, {
                listeners: {
                    afterRender: function (that) {
                        if (that["**-renderer-trigger-0"]) {
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
                var trigger = that["**-renderer-trigger-0"];
                
                // since this will be triggered after the click, 
                // this prevents it from being called when the 
                // trigger subcomponent isn't available
                if (trigger) {
                    trigger.locate("trigger").click();
                }
            };
            var assertClick = function (that) {
                jqUnit.assertTrue("The onExportTrigger event should have fired", true);
                decapod.testUtils.exportType.assertShowProgressControls(that);
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
    });
})(jQuery);

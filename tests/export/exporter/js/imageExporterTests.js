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
    var IMAGE_EXPORTER_CONTAINER = ".dc-imageExporter";
    
    // Template URLs
    var EXPORT_INFO_TEMPLATE = "../../../../export/components/exporter/html/exportInfoTemplate.html";
    var CONTROLS_TEMPLATE = "../../../../export/components/exporter/html/exportControlsTemplate.html";
    var TRIGGER_TEMPLATE = "../../../../export/components/exporter/html/exportControlsTriggerTemplate.html";
    var PROGRESS_TEMPLATE = "../../../../export/components/exporter/html/exportControlsProgressTemplate.html";
    var COMPLETE_TEMPLATE = "../../../../export/components/exporter/html/exportControlsCompleteTemplate.html";
    var IMAGE_EXPORTER_TEMPLATE = "../../../../export/components/exporter/html/imageExporterTemplate.html";

    var createImageExporter = function (container, options) {
        var opts = {
            resources: {
                imageExporterTemplate: {
                    url: IMAGE_EXPORTER_TEMPLATE,
                    forceCache: true
                },
                exportInfo: {
                    url: EXPORT_INFO_TEMPLATE,
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
        return fluid.invokeGlobalFunction("decapod.imageExporter", [container, opts]);
    };
    
    // Tests
    $(document).ready(function () {

        /********************
         * imageExporterTests *
         ********************/
        
        var imageExporterTests = jqUnit.testCase("decapod.imageExporter");
        
        imageExporterTests.asyncTest("Init tests", function () {
            jqUnit.expect(1);
            createImageExporter(IMAGE_EXPORTER_CONTAINER, {
                listeners: {
                    onReady: {
                        listener: function (that) {
                            jqUnit.assertTrue("The component should have initialized", true);
                            start();
                        },
                        args: ["{imageExporter}"],
                        priority: "last"
                    }
                }
            });
        });
        
        imageExporterTests.asyncTest("Fetch Resources", function () {
            jqUnit.expect(6);
            var assertFetchResources = function (resourceSpec) {
                $.each(resourceSpec, function (idx, spec) {
                    jqUnit.assertTrue("The resourceText is filled out for url: " + spec.url, spec.resourceText);
                });
                start();
            };
            createImageExporter(IMAGE_EXPORTER_CONTAINER, {
                listeners: {
                    afterFetchResources: {
                        listener: assertFetchResources,
                        priority: "last"
                    }
                }
            });
        });
        
        imageExporterTests.asyncTest("Rendering", function () {
            var expectedStrings = {
                name: "test name",
                description: "test description"
            };
            var assertRendering = function (that) {
                decapod.testUtils.exportType.assertexportInfoRender(that.exportInfo, expectedStrings.name, expectedStrings.description);
                decapod.testUtils.exportType.assertShowTriggerControls(that.exportControls);
                start();
            };
            createImageExporter(IMAGE_EXPORTER_CONTAINER, {
                strings: expectedStrings,
                listeners: {
                    afterRender: {
                        listener: assertRendering,
                        priority: "last",
                        args: ["{imageExporter}"]
                    }
                }
            });
        });

        imageExporterTests.asyncTest("onExportStart event", function () {
            jqUnit.expect(5);
            var assertEvent = function (that) {
                jqUnit.assertTrue("The onExportStart event should have fired", true);
                decapod.testUtils.exportType.assertShowProgressControls(that.exportControls);
                start();
            };
            createImageExporter(IMAGE_EXPORTER_CONTAINER, {
                listeners: {
                    onExportStart: {
                        listener: assertEvent,
                        priority: "last",
                        args: ["{imageExporter}"]
                    },
                    afterFetchResources: {
                        listener: "{imageExporter}.events.onExportStart.fire",
                        priority: "last"
                    }
                }
            });
        });
        
        imageExporterTests.asyncTest("afterExportComplete", function () {
            jqUnit.expect(6);
            var assertEvent = function (that) {
                jqUnit.assertTrue("The afterExportCompleteEvent should have fired", true);
                decapod.testUtils.exportType.assertShowCompleteControls(that.exportControls);
                start();
            };
            createImageExporter(IMAGE_EXPORTER_CONTAINER, {
                listeners: {
                    afterExportComplete: {
                        listener: assertEvent,
                        priority: "last",
                        args: ["{imageExporter}"]
                    },
                    afterFetchResources: {
                        listener: "{imageExporter}.events.afterExportComplete",
                        priority: "last"
                    }
                }
            });
        });
        
        imageExporterTests.asyncTest("afterExportComplete - pollComplete", function () {
            jqUnit.expect(6);
            var assertEvent = function (that) {
                jqUnit.assertTrue("The afterExportCompleteEvent should have fired", true);
                decapod.testUtils.exportType.assertShowCompleteControls(that.exportControls);
                start();
            };
            createImageExporter(IMAGE_EXPORTER_CONTAINER, {
                listeners: {
                    afterExportComplete: {
                        listener: assertEvent,
                        priority: "last",
                        args: ["{imageExporter}"]
                    },
                    onReady: {
                        listener: "{imageExporter}.exportPoller.events.pollComplete",
                        priority: "last"
                    }
                }
            });
        });
        
        imageExporterTests.asyncTest("afterExportComplete - dataSource success", function () {
            jqUnit.expect(6);
            var assertEvent = function (that) {
                jqUnit.assertTrue("The afterExportCompleteEvent should have fired", true);
                decapod.testUtils.exportType.assertShowCompleteControls(that.exportControls);
                start();
            };
            createImageExporter(IMAGE_EXPORTER_CONTAINER, {
                listeners: {
                    afterExportComplete: {
                        listener: assertEvent,
                        priority: "last",
                        args: ["{imageExporter}"]
                    },
                    onReady: {
                        listener: "{imageExporter}.dataSource.events.success",
                        priority: "last",
                        args: ["{imageExporter}"]
                    }
                }
            });
        });
        
        imageExporterTests.asyncTest("afterExportComplete - onExportStart", function () {
            jqUnit.expect(7);
            var assertEvent = function (that, response) {
                jqUnit.assertTrue("The afterExportCompleteEvent should have fired", true);
                jqUnit.assertEquals("The decapod.exportControls.complete model should be updated", response.url, that.exportControls["**-renderer-complete-0"].model.downloadURL);
                decapod.testUtils.exportType.assertShowCompleteControls(that.exportControls);
                start();
            };
            createImageExporter(IMAGE_EXPORTER_CONTAINER, {
                listeners: {
                    afterExportComplete: {
                        listener: assertEvent,
                        priority: "last",
                        args: ["{imageExporter}", "{arguments}.0"]
                    },
                    onReady: {
                        listener: "{imageExporter}.events.onExportStart",
                        priority: "last",
                        args: ["{imageExporter}"]
                    }
                }
            });
        });
        
        imageExporterTests.asyncTest("afterRender", function () {
            jqUnit.expect(1);
            var assertEvent = function (that, response) {
                jqUnit.assertTrue("The afterRender event should have fired", true);
                start();
            };
            createImageExporter(IMAGE_EXPORTER_CONTAINER, {
                listeners: {
                    afterRender: {
                        listener: assertEvent,
                        priority: "last"
                    }
                }
            });
        });
    });
})(jQuery);

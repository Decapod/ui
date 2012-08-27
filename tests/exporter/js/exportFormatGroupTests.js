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
    var CONTAINER = ".dc-exportFormatGroup";
    
    // Template URLs
    var EXPORT_FORMAT_GROUP_TEMPLATE = "../../../components/exporter/html/exportFormatGroupTemplate.html";

    var createExportFormatGroup = function (options) {
        var opts = {
            resources: {
                exportFormatGroupTemplate: {
                    url: EXPORT_FORMAT_GROUP_TEMPLATE,
                    forceCache: true
                }
            }
        };
        fluid.merge("replace", opts, options || {});
        return fluid.invokeGlobalFunction("decapod.exportFormatGroup", [CONTAINER, opts]);
    };
    
    // Tests
    $(document).ready(function () {

        /**************************
         * exportFormatGroupTests *
         **************************/
        
        var exportFormatGroupTests = jqUnit.testCase("decapod.exportFormatGroup");
        
        exportFormatGroupTests.asyncTest("Init tests", function () {
            jqUnit.expect(1);
            createExportFormatGroup({
                listeners: {
                    onReady: {
                        listener: function (that) {
                            jqUnit.assertTrue("The component should have initialized", true);
                            start();
                        },
                        priority: "last"
                    }
                }
            });
        });
        
        exportFormatGroupTests.asyncTest("Fetch Resources", function () {
            jqUnit.expect(1);
            var assertFetchResources = function (resourceSpec) {
                $.each(resourceSpec, function (idx, spec) {
                    jqUnit.assertTrue("The resourceText is filled out for url: " + spec.url, spec.resourceText);
                });
                start();
            };
            createExportFormatGroup({
                listeners: {
                    afterFetchResources: {
                        listener: assertFetchResources,
                        priority: "last"
                    }
                }
            });
        });
        
        fluid.defaults("decapod.tests.view", {
            gradeNames: ["fluid.viewComponent", "autoInit"]
        });
        
        exportFormatGroupTests.asyncTest("Rendering", function () {
            jqUnit.expect(3);

            var assertRendering = function (that) {
                jqUnit.assertTrue("The afterRender event should have fired", true);
                jqUnit.assertEquals("The name should be rendered", that.options.strings.name, that.locate("name").text());
                var decorators = fluid.renderer.getDecoratorComponents(that, that.instantiator);
                $.each(decorators, function (idx, decorator) {
                    jqUnit.assertTrue("The subcomponent should have initialized", true); 
                });
                start();
            };
            createExportFormatGroup({
                components: {
                    instantiator: "{instantiator}"
                },
                listeners: {
                    afterRender: {
                        listener: assertRendering,
                        priority: "last"
                    }
                },
                model: {
                    formats: ["decapod.tests.view"]
                }
            });
        });
    });

})(jQuery);

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
/*global window, decapod:true, expect, fluid, jQuery, jqUnit, start*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {
    var CONTAINER = ".dc-select";
    var TEST_MODEL = {
        selection: "2",
        choices: ["1", "2", "3"],
        names: ["one", "two", "three"]
    };
    var RESOURCES = {
        template: {
            url: "../../../../export/components/select/html/selectTemplate.html"
        }
    };
    
    $(document).ready(function () {
        
        var tests = jqUnit.testCase("Decapod Select");
        
        tests.asyncTest("Init tests", function () {
            jqUnit.expect(10);
            var assertOnReady = function () {
                jqUnit.assertTrue("The onReady event should have fired", true);
            };
            var assertInit = function (that) {
                jqUnit.assertTrue("The component should have initialized", that);
                decapod.testUtils.exportType.assertSelectRender(that);
                start();
            };
            decapod.select(CONTAINER, {
                model: TEST_MODEL,
                listeners: {
                    onReady: assertOnReady,
                    afterRender: assertInit
                },
                resources: RESOURCES
            });
        });
        
        tests.asyncTest("afterFetchResources", function () {
            var testEvent = function (resourceSpec, that) {
                jqUnit.assertTrue("The afterFetchResources event fires with resource text provided", resourceSpec);
                jqUnit.assertTrue("The resourceText is set", that.options.resources.template.resourceText);
            };
            decapod.select(CONTAINER, {
                model: TEST_MODEL,
                listeners: {
                    afterFetchResources: {
                        listener: testEvent,
                        args: ["{arguments}.0", "{select}"]
                    },
                    afterRender: function () {start();}
                },
                resources: RESOURCES
            });
        });
        
        tests.asyncTest("afterSelectionChanged", function () {
            jqUnit.expect(3);
            var newSelect = "3";
            var oldSelect = TEST_MODEL.selection;
            var testEvent = function (newSelection, oldSelection, that) {
                jqUnit.assertEquals("The new selection matches the model", that.model.selection, newSelection);
                jqUnit.assertEquals("The new selection is updated", newSelect, newSelection);
                jqUnit.assertEquals("The old selection is the old selected value", oldSelect, oldSelection);
                start();
            };
            decapod.select(CONTAINER, {
                model: TEST_MODEL,
                listeners: {
                    afterSelectionChanged: {
                        listener: testEvent,
                        args: ["{arguments}.0", "{arguments}.1", "{select}"]
                    },
                    afterRender: function (that) {
                        that.applier.requestChange("selection", newSelect);
                    }
                },
                resources: RESOURCES
            });
        });
        
        tests.asyncTest("disable", function () {
            jqUnit.expect(1);
            var testEvent = function (that) {
                that.disable();
                jqUnit.assertTrue("The select box should be disabled", that.locate("choices").is(":disabled"));
                start();
            };
            decapod.select(CONTAINER, {
                model: TEST_MODEL,
                listeners: {
                    afterRender: testEvent
                },
                resources: RESOURCES
            });
        });
        
        tests.asyncTest("enable", function () {
            jqUnit.expect(1);
            var testEvent = function (that) {
                that.locate("choices").prop("disable", true);
                that.enable();
                jqUnit.assertFalse("The select box should not be disabled", that.locate("choices").is(":disabled"));
                start();
            };
            decapod.select(CONTAINER, {
                model: TEST_MODEL,
                listeners: {
                    afterRender: testEvent
                },
                resources: RESOURCES
            });
        });
        
        tests.asyncTest("isEnabled", function () {
            jqUnit.expect(2);
            var testEvent = function (that) {
                jqUnit.assertTrue("The select box should be enabled", that.isEnabled());
                that.locate("choices").prop("disabled", true);
                jqUnit.assertFalse("The select box should be disabled", that.isEnabled());
                start();
            };
            decapod.select(CONTAINER, {
                model: TEST_MODEL,
                listeners: {
                    afterRender: testEvent
                },
                resources: RESOURCES
            });
        });
        
    });
})(jQuery);

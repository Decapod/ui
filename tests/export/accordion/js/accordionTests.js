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
    var CONTAINER = ".dc-accordion";
    $(document).ready(function () {
        
        var tests = jqUnit.testCase("Decapod Accordion");
        
        tests.asyncTest("Init tests", function () {
            jqUnit.expect(1);
            var testEvent = function () {
                jqUnit.assertTrue("The component should have initialized", true);
                start();
            };
            decapod.accordion(CONTAINER, {
                listeners: {
                    onReady: testEvent
                }
            });
        });
        
        tests.test("method", function () {
            var that = decapod.accordion(CONTAINER);
            jqUnit.assertEquals("The direct and wrapped method calls should return the same value", that.container.accordion("option", "disabled"), that.method("option", "disabled"));
        });
        
        tests.test("disable", function () {
            var that = decapod.accordion(CONTAINER);
            that.disable();
            jqUnit.assertTrue("The accordion should be disabled", that.container.accordion("option", "disabled"));
        });
        
        tests.test("enable", function () {
            var that = decapod.accordion(CONTAINER);
            that.container.accordion("options", "disabled", true);
            that.enable();
            jqUnit.assertFalse("The accordion should be enabled", that.container.accordion("option", "disabled"));
        });
    });
})(jQuery);

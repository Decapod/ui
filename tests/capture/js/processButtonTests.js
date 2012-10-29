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
/*global setTimeout, decapod:true, fluid, jQuery, jqUnit, start*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {
    $(document).ready(function () {

        /*************************
         * processButtonTests *
         *************************/
        
        var processButtonTests = jqUnit.testCase("decapod.processButton");
        
        processButtonTests.test("Init", function () {
            jqUnit.expect(3);
            var that = decapod.processButton(".dc-mainPane");
            jqUnit.assertTrue("The component should have initialized", that);
            jqUnit.assertEquals("The role attribue of the process button is set properly", that.locate("button").attr("role"), "button");
            jqUnit.assertEquals("The initial dataSource method should have been set to GET", that.options.dataSourceConfig.method, "get");
        });
        
        processButtonTests.asyncTest("onReady", function () {
            jqUnit.expect(1);
            var assertOnReady = function () {
                jqUnit.assertTrue("The onReady event should have fired", true);
                start();
            };
            decapod.processButton(".dc-mainPane", {
                listeners: {
                    onReady: assertOnReady
                }
            });
        });

        processButtonTests.asyncTest("onProcess", function () {
            jqUnit.expect(3);
            
            var that = decapod.processButton(".dc-mainPane", {
                listeners: {
                    onProcess: {
                        listener: function (that) {
                            jqUnit.assertTrue("The onProcess event should have fired.", true);
                            
                            var button = that.locate("button");
                            jqUnit.assertTrue("The process button should have been disabled.", button.attr("disabled"));
                            jqUnit.assertEquals("The process state should have been set.", button.html(), that.options.strings.inProcess);
                            start();
                        },
                        args: ["{processButton}"]
                    }
                }
            });
            
            var button = that.locate("button");
            originalButtonHTML = button.html();
            button.click();
        });
        
        processButtonTests.asyncTest("onProcessSuccess", function () {
            jqUnit.expect(4);
            
            var originalButtonHTML = "I'm a Button";
            var inProcessHTML = "in Process";
            
            var that = decapod.processButton(".dc-mainPane", {
                dataSourceConfig: {
                    method: "post"
                },
                strings: {
                    inProcess: inProcessHTML
                },
                listeners: {
                    onProcessSuccess: {
                        listener: function (that, response) {
                            jqUnit.assertTrue("The onProcessSuccess event should have fired.", true);

                            var button = that.locate("button");
                            jqUnit.assertFalse("The process button should have been enabled.", button.attr("disabled"));
                            jqUnit.assertNotEquals("The in process state should have been removed.", button.html(), inProcessHTML);
                            jqUnit.assertEquals("The original html should have been placed back.", button.html(), originalButtonHTML);
                            start();
                        },
                        args: ["{processButton}", "{arguments}.0"]
                    }
                }
            });
            
            var button = that.locate("button");
            button.html(originalButtonHTML);
            button.click();
        });
        
        var verifyDisable = function (container, disableFunc) {
            jqUnit.expect(4);
            
            var that = decapod.processButton(container);
            var button = that.locate("button");
            
            jqUnit.assertFalse("The process button is initially enabled.", button.attr("disabled"));
            jqUnit.assertFalse("The disabled style is not in place initially.", button.hasClass(that.options.styles.disabled));
            
            disableFunc(that);
            
            jqUnit.assertTrue("The process button should have been disabled.", button.attr("disabled"));
            jqUnit.assertTrue("The disabled style should have been applied.", button.hasClass(that.options.styles.disabled));
        };
        
        processButtonTests.test("model change on disabled", function () {
            var disable = function (that) {
                that.applier.requestChange("disabled", true);
            };
            
            verifyDisable(".dc-mainPane", disable);
        });
        
        processButtonTests.test("updateModel on disabled", function () {
            var disable = function (that) {
                that.updateModel({"disabled": true});
            };
            
            verifyDisable(".dc-mainPane", disable);
        });
        
    });
})(jQuery);

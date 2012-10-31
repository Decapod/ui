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

        /***************
         * buttonTests *
         ***************/
        
        var CONTAINER = ".dc-capturer-button";
        
        var assertDisabled = function (that) {
            jqUnit.assertTrue("The afterDisabled event should have fired", true);
            jqUnit.assertTrue("The disabled style should have been applied", $(CONTAINER).hasClass(that.options.styles.disabled));
            jqUnit.assertTrue("The aria-disabled attribute should have been applied", $(CONTAINER).attr("aria-disabled"));
            jqUnit.assertTrue("The disabled attribute should have been applied", $(CONTAINER).attr("disabled"));
        };
        
        var assertEnabled = function (that) {
            jqUnit.assertTrue("The afterEnabled event should have fired", true);
            jqUnit.assertFalse("The disabled style should have not been applied", $(CONTAINER).hasClass(that.options.styles.disabled));
            jqUnit.assertFalse("The aria-disabled attribute should have not been applied", $(CONTAINER).attr("aria-disabled"));
            jqUnit.assertFalse("The disabled attribute should have not been applied", $(CONTAINER).attr("disabled"));
        };
        
        var processButtonTests = jqUnit.testCase("decapod.button");
        
        processButtonTests.test("Init", function () {
            jqUnit.expect(3);
            var that = decapod.button(CONTAINER);
            jqUnit.assertTrue("The component should have initialized", that);
            jqUnit.assertEquals("The role attribue of the process button is set properly", $(CONTAINER).attr("role"), "button");
            jqUnit.assertEquals("The initial button text should have been set", $(CONTAINER).text(), that.options.strings.label);
        });
       
        processButtonTests.asyncTest("Init with enabled state", function () {
            var assertAfterEnabled = function (that) {
                assertEnabled(that);
                start();
            };
            decapod.button(CONTAINER, {
                listeners: {
                    afterEnabled: {
                        listener: assertAfterEnabled,
                        args: ["{button}"]
                    }
                },
                model: {
                    "state": "enabled"
                }
            });
        });

        processButtonTests.asyncTest("Init with disabled state", function () {
            var assertAfterDisabled = function (that) {
                assertDisabled(that);
                start();
            };
            decapod.button(CONTAINER, {
                listeners: {
                    afterDisabled: {
                        listener: assertAfterDisabled,
                        args: ["{button}"]
                    }
                },
                model: {
                    "state": "disabled"
                }
            });
        });

        processButtonTests.asyncTest("onClick with enabled state", function () {
            var assertOnClick = function (that) {
                jqUnit.assertTrue("The onClick event should have been fired", true);
                start();
            };
            decapod.button(CONTAINER, {
                model: {
                    "state": "enabled"
                },
                listeners: {
                    onClick: assertOnClick,
                    afterEnabled: function () {
                        $(CONTAINER).click();
                    }
                }
            });
        });

        processButtonTests.test("onClick with disabled state", function () {
            var onClickFired = false;
            var assertOnClick = function (that) {
                onClickFired = true;
            };
            decapod.button(CONTAINER, {
                model: {
                    "state": "disabled"
                },
                listeners: {
                    onClick: assertOnClick
                }
            });
           
            $(CONTAINER).click();
            jqUnit.assertFalse("The onClick event should have not been fired", onClickFired);
        });

        processButtonTests.asyncTest("setState", function () {
            var assertAfterDisabled = function (that) {
                assertDisabled(that);
                start();
            };
            var that = decapod.button(CONTAINER, {
                listeners: {
                    afterDisabled: {
                        listener: assertAfterDisabled,
                        args: ["{button}"]
                    }
                },
                model: {
                    "state": "enabled"
                }
            });
            
            that.setState("disabled");
        });

    });
})(jQuery);

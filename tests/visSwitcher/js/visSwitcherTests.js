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
/*global window, decapod:true, fluid, jQuery, jqUnit, start*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {
    var CONTAINER = ".dc-visSwitcher";
    var createVisSwitcher = function (container, options) {
        var opts = {
            selectors: {
                elmOne: ".elmOne",
                elmTwo: ".elmTwo"
            },
            model: {
                elmOne: true,
                elmTwo: false
            }
        };
        fluid.merge("replace", opts, options);
        return decapod.visSwitcher(container, opts);
    };

    $(document).ready(function () {
        var tests = jqUnit.testCase("Decapod Visibility Switcher");
        
        tests.test("Init tests", function () {
            var that = createVisSwitcher(CONTAINER);
            jqUnit.assertTrue("The component should have initialized", that);
            jqUnit.assertDeepEq("The default model should be set",  {elmOne: true, elmTwo: false}, that.model);
            jqUnit.isVisible("elmOne should be visible", that.locate("elmOne"));
            jqUnit.notVisible("elmTwo should be hidden", that.locate("elmTwo"));
        });
        
        tests.test("decapod.visSwitcher.hideElement", function () {
            var elm = $(".visible");
            decapod.visSwitcher.hideElement(elm);
            
            jqUnit.notVisible("The element should be hidden", elm);
        });
        
        tests.test("hideElement", function () {
            var elm = $(".elmOne");
            var that = createVisSwitcher(CONTAINER);
            that.hideElement(elm);
            
            jqUnit.notVisible("The element should be hidden", elm);
        });
        
        tests.test("decapod.visSwitcher.showElement", function () {
            var elm = $(".hidden");
            decapod.visSwitcher.showElement(elm);
            
            jqUnit.isVisible("The element should be visible", elm);
        });
        
        tests.test("showElement", function () {
            var elm = $(".elmTwo");
            elm.hide();
            var that = createVisSwitcher(CONTAINER);
            that.showElement(elm);
            
            jqUnit.isVisible("The element should be visible", elm);
        });
        
        tests.asyncTest("show", function () {
            jqUnit.expect(2);
            var assertVisible = function (that) {
                jqUnit.isVisible("The element should be visible", that.locate("elmTwo"));
                jqUnit.assertDeepEq("The model should be updated", {elmOne: true, elmTwo: true}, that.model);
                start();
            };
            var that = createVisSwitcher(CONTAINER, {
                events: {
                    testModel: {
                        event: "afterModelChanged"
                    }
                },
                listeners: {
                    testModel: assertVisible
                }
            });
            that.show("elmTwo");
        });
        
        tests.test("showOnly", function () {
            jqUnit.expect(3);
            var assertVisible = function (that) {
                jqUnit.isVisible("The element should be visible", that.locate("elmTwo"));
                jqUnit.notVisible("The other element should be hidden", that.locate("elmOne"));
                jqUnit.assertDeepEq("The model should be updated", {elmOne: false, elmTwo: true}, that.model);
                start();
            };
            var that = createVisSwitcher(CONTAINER, {
                events: {
                    testModel: {
                        event: "afterModelChanged"
                    }
                },
                listeners: {
                    testModel: assertVisible
                }
            });
            that.showOnly("elmTwo");
        });
        
        tests.test("showAll", function () {
            jqUnit.expect(3);
            var assertVisible = function (that) {
                jqUnit.isVisible("The first element should be visible", that.locate("elmOne"));
                jqUnit.isVisible("The second element should be visible", that.locate("elmTwo"));
                jqUnit.assertDeepEq("The model should be updated", {elmOne: true, elmTwo: true}, that.model);
                start();
            };
            var that = createVisSwitcher(CONTAINER, {
                events: {
                    testModel: {
                        event: "afterModelChanged"
                    }
                },
                listeners: {
                    testModel: assertVisible
                }
            });
            that.showAll();
        });
        
        tests.test("hide", function () {
            jqUnit.expect(2);
            var assertHidden = function (that) {
                jqUnit.notVisible("The element should be hidden", that.locate("elmOne"));
                jqUnit.assertDeepEq("The model should be updated", {elmOne: false, elmTwo: false}, that.model);
                start();
            };
            var that = createVisSwitcher(CONTAINER, {
                events: {
                    testModel: {
                        event: "afterModelChanged"
                    }
                },
                listeners: {
                    testModel: assertHidden
                }
            });
            that.hide("elmOne");
        });
        
        tests.test("hideAll", function () {
            jqUnit.expect(3);
            var assertVisible = function (that) {
                jqUnit.notVisible("The first element should not be visible", that.locate("elmOne"));
                jqUnit.notVisible("The second element should not be visible", that.locate("elmTwo"));
                jqUnit.assertDeepEq("The model should be updated", {elmOne: false, elmTwo: false}, that.model);
                start();
            };
            var that = createVisSwitcher(CONTAINER, {
                events: {
                    testModel: {
                        event: "afterModelChanged"
                    }
                },
                listeners: {
                    testModel: assertVisible
                }
            });
            that.hideAll();
        });
    });
})(jQuery);

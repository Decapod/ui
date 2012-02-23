/*
Copyright 2012 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one of these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
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
            jqUnit.assertTrue("elmOne should be visible", that.locate("elmOne").is(":visible"));
            jqUnit.assertFalse("elmTwo should be hidden", that.locate("elmTwo").is(":visible"));
        });
        
        tests.test("decapod.visSwitcher.hideElement", function () {
            var elm = $(".visible");
            decapod.visSwitcher.hideElement(elm);
            
            jqUnit.assertFalse("The element should be hidden", elm.is(":visible"));
        });
        
        tests.test("hideElement", function () {
            var elm = $(".elmOne");
            var that = createVisSwitcher(CONTAINER);
            that.hideElement(elm);
            
            jqUnit.assertFalse("The element should be hidden", elm.is(":visible"));
        });
        
        tests.test("decapod.visSwitcher.showElement", function () {
            var elm = $(".hidden");
            decapod.visSwitcher.showElement(elm);
            
            jqUnit.assertTrue("The element should be visible", elm.is(":visible"));
        });
        
        tests.test("showElement", function () {
            var elm = $(".elmTwo");
            elm.hide();
            var that = createVisSwitcher(CONTAINER);
            that.showElement(elm);
            
            jqUnit.assertTrue("The element should be visible", elm.is(":visible"));
        });
        
        tests.asyncTest("show", function () {
            jqUnit.expect(2);
            var assertVisible = function (that) {
                jqUnit.assertTrue("The element should be visible", that.locate("elmTwo").is(":visible"));
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
                jqUnit.assertTrue("The element should be visible", that.locate("elmTwo").is(":visible"));
                jqUnit.assertFalse("The other element should be hidden", that.locate("elmOne").is(":visible"));
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
                jqUnit.assertTrue("The first element should be visible", that.locate("elmTwo").is(":visible"));
                jqUnit.assertTrue("The second element should be visible", that.locate("elmOne").is(":visible"));
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
                jqUnit.assertFalse("The element should be hidden", that.locate("elmOne").is(":visible"));
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
                jqUnit.assertFalse("The first element should not be visible", that.locate("elmTwo").is(":visible"));
                jqUnit.assertFalse("The second element not should be visible", that.locate("elmOne").is(":visible"));
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

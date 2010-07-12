/*
Copyright 2010 University of Toronto

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one of these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
*/

/*global jQuery,fluid,jqUnit,expect,decapod*/

(function ($) {
    
    var component;
    var eventFired = false;
    
    var setup = function () {
        var opts = {
            listeners: {
                afterRender: function () {
                    eventFired = true;
                }
            }, 
            model: {
                left: {
                    id: "1234",
                    rotation: 270
                },
                right: {
                    id: "4321",
                    rotation: 0
                }
            }
        };
        
        component = decapod.cameraSetup(".dc-cameraSetup", opts);
    };
    
    var teardown = function () {
        component = null;
        eventFired = false;
    };
    
    var assertStringRendering = function (component) {
        $.each(component.options.strings, function (stringName, string) {
            jqUnit.assertEquals("The " + stringName + " should be set correctly", string, component.locate(stringName).text());
        });
    };
    
    var assertAriaRole = function (component, selector, role) {
        jqUnit.assertEquals("The " + selector + " should have its aria role set correctly", role, component.locate(selector).attr("role"));
    };
    
    var assertModelSwapped = function (originalModel, newModel) {
        jqUnit.assertDeepEq("The left value in the model should be equal to the original right value", originalModel.right, newModel.left);
        jqUnit.assertDeepEq("The right value in the model should be equal to the original left value", originalModel.left, newModel.right)
    };
    
    $(document).ready(function () {
        var tests = new jqUnit.TestCase("CameraSetup Tests", setup, teardown);
        
        tests.test("Rendering Tests", function () {
            var str = component.options.strings;
            
            assertStringRendering(component);
            
            assertAriaRole(component, "swapButton", "button");
            assertAriaRole(component, "submitButton", "button");
            
            jqUnit.assertTrue("The afterRender event should have fired", eventFired);
        });
        
        tests.test("Swap Pages Test", function () {
            var originalModel = fluid.copy(component.model);
            component.swapCameras();
            assertModelSwapped(originalModel, component.model);
        });
        
        tests.test("Swap Pages, with Moust Click, Test", function () {
            var originalModel = fluid.copy(component.model);
            component.locate("swapButton").click();
            assertModelSwapped(originalModel, component.model);
        });
        
        tests.test("Model after rotation, tests", function () {
            component.leftCameraRotater.rotateCW();
            component.rightCameraRotater.rotateCCW();
            
            jqUnit.assertEquals("The rotation value for the left camera should be updated correctly", 0, component.model.left.rotation);
            jqUnit.assertEquals("The rotation value for the right camera should be updated correctly", 270, component.model.right.rotation);
        });
    });
})(jQuery);

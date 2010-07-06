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
                image: "../sample.jpg",
                rotation: 0
            }
        };
        
        component = decapod.imageRotater(".dc-imageRotater", opts);
    };
    
    var teardown = function () {
        component = null;
        eventFired = false;
    };
    
    var rotationAsserts = function (component, expectedRotation) {
        var style = component.options.styles[expectedRotation];
            
            jqUnit.assertEquals("The model should reflect the rotation", expectedRotation, component.model.rotation);
            jqUnit.assertTrue("The css class, " + style + ", should be added to rotate the image", component.locate("image").hasClass(style));
    };
    
    $(document).ready(function () {
        var tests = new jqUnit.TestCase("ImageRotater Tests", setup, teardown);
        
        tests.test("Rendering Tests", function () {
            var strings = component.options.strings;
            
            $.each(strings, function (key, string) {
                if (key === "image") {
                    var image = component.locate(key);
                    jqUnit.assertEquals("The url for the image should be set", component.model.image, image.attr("src"));
                    jqUnit.assertEquals("The alt text for the image should be set", string, image.attr("alt"));
                } else {
                    var button = component.locate(key);
                    jqUnit.assertEquals("The " + key + " text should be set", string, button.text());
                    jqUnit.assertEquals("The aria role for the " + key + " button should be set", "button", button.attr("role"));
                }
            });
            
            jqUnit.assertTrue("The afterRender event should have fired", eventFired);
        });
        
        tests.test("Clockwise Rotation Tests", function () {
            component.rotateCW();
            rotationAsserts(component, 90);
        });
        
        tests.test("Clockwise Rotation, Mouse Click, Tests", function () {
            component.locate("cwButton").click();
            rotationAsserts(component, 90);
        });
        
        tests.test("Counter Clockwise Rotation Tests", function () {
            component.rotateCCW();
            rotationAsserts(component, 270);
        });
        
        tests.test("Counter Clockwise Rotation, Mouse Click, Tests", function () {
            component.locate("ccwButton").click();
            rotationAsserts(component, 270);
        });
        
        tests.test("Rotate 360 degrees Tests", function () {
            var image = component.locate("image");
            for (var i = 0; i < 4; i++) {
                component.rotateCW();
            }
            
            jqUnit.assertEquals("The model should reflect a complete rotation back to the origin", 0, component.model.rotation);
            
            $.each(component.options.styles, function (key, className) {
                jqUnit.assertFalse("The css class, " + className + ", should not be added to the image", image.hasClass(className));
            });
        });
    });
})(jQuery);
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
                    rotation: 0
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
    
    $(document).ready(function () {
        var tests = new jqUnit.TestCase("CameraSetup Tests", setup, teardown);
        
        tests.test("Rendering Tests", function () {
            // assert rendering of text
            // assert aria roles
            
            jqUnit.assertTrue("The afterRender event should have fired", eventFired);
        });
        
        tests.test("Swap Pages Test", function () {
            component.swapCameras();
            // assert that the order of the pages has changed properly
        });
        
        tests.test("Swap Pages, with Moust Click, Test", function () {
            component.locate("").click();
            // assert that the order of the pages has changed properly after swapping with a mouse click
        });
        
        tests.test("Model after rotation, tests", function () {
            component.leftCameraRotater.rotateCW();
            component.rightCameraRotater.rotateCCW();
            // assert that the updated model that is returned is correct.
        });
    });
})(jQuery);

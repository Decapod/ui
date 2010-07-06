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
                "Canon": [{
                    "model": "G10",
                    "deviceName": "PowerShot G10"
                }, {
                    "model": "G11",
                    "deviceName": "PowerShot G11"
                }, {
                    "model": "550D",
                    "deviceName": "EOS 550D"
                }],
                "Nikon": [{
                    "model": "D90",
                    "deviceName": "D90"
                }, {
                    "model": "D300",
                    "deviceName": "D300"
                }, {
                    "model": "D3S",
                    "deviceName": "D3S"
                }],
                "Sony": [{
                    "model": "DSLR-A500",
                    "deviceName": "α500"
                }, {
                    "model": "DSLR-A290",
                    "deviceName": "α290"
                }, {
                    "model": "NEX-5",
                    "deviceName": "NEX-5"
                }]
            }
        };
        
        component = decapod.supportedCameras(".dc-supportedCameras", opts);
    };
    
    var teardown = function () {
        component = null;
        eventFired = false;
    };
    
    $(document).ready(function () {
        var tests = new jqUnit.TestCase("SupportedCameras Tests", setup, teardown);
        
        tests.test("Rendering Tests", function () {
            var manufacturers = component.locate("manufacturers");
            var manIdx = 0;
            
            jqUnit.assertEquals("The label should be set correctly", component.options.strings.label, component.locate("label").text());
            
            $.each(component.model, function (manufacturer, devices) {
                var cameraMan = manufacturers.eq(manIdx);
                var cameraDev = component.locate("model", cameraMan);
                jqUnit.assertEquals("The manufacturer name should be set correctly", manufacturer, component.locate("manufacturerName", cameraMan).text());
                $.each(devices, function (idx, device) {
                    jqUnit.assertEquals("The camera model should be set correctly", device.deviceName, cameraDev.eq(idx).text());
                });
                manIdx++;
            });
            
            jqUnit.assertTrue("The afterRender event should have fired", eventFired);
        });
        
        tests.test("Hiding with Function Call Tests", function () {
            component.hide();
            jqUnit.notVisible("The component should be hidden", component.container);
            
            component.show();
            jqUnit.isVisible("The component should be visible", component.container);
        });
        
        tests.test("Hiding with Click Event Tests", function () {
            component.locate("closeButton").click();
            jqUnit.notVisible("The component should be hidden", component.container);
            
            component.show();
            jqUnit.isVisible("The component should be visible", component.container);
        });
    });
})(jQuery);

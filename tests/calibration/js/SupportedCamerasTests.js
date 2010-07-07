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
                "status": "oneCameraCompatible",
                "supportedCameras": {
                    "Canon": [{
                        "name": "Canon PowerShot G10",
                        "label": "PowerShot G10"
                    }, {
                        "name": "Canon PowerShot G11",
                        "label": "PowerShot G11"
                    }, {
                        "name": "Canon 550D",
                        "label": "EOS 550D"
                    }],
                    "Nikon": [{
                        "name": "Nikon D90",
                        "label": "D90"
                    }, {
                        "name": "Nikon D300",
                        "label": "D300"
                    }, {
                        "name": "Nikon D3S",
                        "label": "D3S"
                    }],
                    "Sony": [{
                        "name": "Sony DSLR-A500",
                        "label": "α500"
                    }, {
                        "name": "Sony DSLR-A290",
                        "label": "α290"
                    }, {
                        "name": "Sony NEX-5",
                        "label": "NEX-5"
                    }]
                }
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
            
            jqUnit.assertEquals("The componentHeader should be set correctly", component.options.strings.componentHeader, component.locate("componentHeader").text());
            
            $.each(component.model.supportedCameras, function (manufacturer, devices) {
                var cameraMan = manufacturers.eq(manIdx);
                var cameraDev = component.locate("deviceLabel", cameraMan);
                jqUnit.assertEquals("The manufacturer name should be set correctly", manufacturer, component.locate("manufacturerName", cameraMan).text());
                $.each(devices, function (idx, device) {
                    jqUnit.assertEquals("The camera deviceLabel should be set correctly", device.label, cameraDev.eq(idx).text());
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

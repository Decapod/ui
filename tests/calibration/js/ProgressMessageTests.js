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
            }
        };
        
        component = decapod.progressMessage(".dc-progressMessage", opts);
    };
    
    var teardown = function () {
        component = null;
        eventFired = false;
    };
    
    $(document).ready(function () {
        var tests = new jqUnit.TestCase("ProgressMessage Tests", setup, teardown);
        
        tests.test("Rendering Tests", function () {
            var opts = component.options;
            $.each(opts.selectors, function (key) {
                jqUnit.assertEquals("The " + key + " text should be set", opts.strings[key], component.locate(key).text());
            });
            jqUnit.assertTrue("The afterRender event should have fired", eventFired);
        });
    });
})(jQuery);

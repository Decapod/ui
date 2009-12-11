/*
Copyright 2008-2009 University of Toronto

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one of these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
*/

/*global jQuery*/
/*global fluid*/
/*global jqUnit, expect*/

(function ($) {
    $(document).ready(function () {
        
        var tests = jqUnit.testCase("Decapod Capture Tests");

        tests.test("First test case", function () {
            expect(2);
            
            var capture = fluid.capture(".flc-capture");            
            var model = capture.model;
            jqUnit.assertNotNull("Model is not null", model);
            jqUnit.assertEquals("Model length", 0, model.length);            
        });
                
    });
    
})(jQuery);

/*
Copyright 2012 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one of these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
*/

// Declare dependencies
/*global decapod:true, fluid, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {
    
    /*******************
     * Invoker Demands *
     *******************/
    // Due to FLUID-4631, there is a work around implemented in importStatusDemands.js. However, it is only needed for the actual implementation, but not the tests.
    // This demands block puts back in the proper implementation just for the unit tests.
    fluid.demands("decapod.importStatus.addError", ["decapod.test", "decapod.importStatus"], ["{importStatus}", "{arguments}.0"]);
    
})(jQuery);

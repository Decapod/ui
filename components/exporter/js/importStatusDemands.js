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

    fluid.demands("decapod.importStatus.setNumValidFiles", "decapod.importStatus", ["{importStatus}", "{arguments}.0"]);
    fluid.demands("decapod.importStatus.addError", "decapod.importStatus", ["{importStatus}", "{arguments}.0"]);
    fluid.demands("decapod.importStatus.reset", "decapod.importStatus", ["{importStatus}"]);
    fluid.demands("decapod.importStatus.statusMessages", "decapod.importStatus", ["{importStatus}", "{arguments}.0"]);
    fluid.demands("decapod.importStatus.renderStatuses", "decapod.importStatus", ["{importStatus}"]);
    
})(jQuery);

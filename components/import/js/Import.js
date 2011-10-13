/*
Copyright 2011 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one of these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
*/

// Declare dependencies
/*global window, decapod:true, fluid, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {

    fluid.defaults("decapod.import", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        components: {
            progressiveEnhancementChecker: {
                type: "fluid.progressiveCheckerForComponent",
                options: {
                    componentName: "fluid.uploader"
                }
            },
            uploader: {
                type: "fluid.uploader",
                container: ".flc-uploader",
                options: {
                    demo: true
                }
            }
        }
    });
    
})(jQuery);


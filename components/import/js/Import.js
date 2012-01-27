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

    //TODO: "import" is a reserved word
    fluid.defaults("decapod.import", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        finalInitFunction: "decapod.import.finalInit",  //for decapod 0.5a
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
                    queueSettings: {
                        fileTypes: ["image/jpeg", "image/png", "image/tiff"]
                    }
                }
            },
            //for decapod 0.5a
            exportView: {
                type: "decapod.exportView",
                container: "{decapod.import}.container",
                priority: "first"
            }
        }
    });
    
    //for decapod 0.5a
    decapod["import"].finalInit = function (that) {
        that.exportView.locate("status").hide();
    };
    
})(jQuery);


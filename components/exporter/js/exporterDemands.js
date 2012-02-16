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
    
    /************************
     * Sub-componet Demands *
     ************************/
     
    // local
    fluid.demands("decapod.dataSource", ["decapod.fileSystem", "decapod.exporter"], {
        options: {
            url: "" //local url
        }
    });
    
    fluid.demands("fluid.uploader", ["decapod.fileSystem", "decapod.exporter"], {
        options: {
            demo: true
        }
    });
    
    // server
    fluid.demands("decapod.dataSource", ["decapod.exporter"], {
        options: {
            url: "/library/decapod05a/export/pdf/%type"
        }
    });
    
    fluid.demands("fluid.uploader", ["decapod.exporter"], {
        options: {
            queueSettings: {
                uploadURL: "/library/decapod05a/pages/"
            }
        }
    });

    // global
    fluid.demands("onFileError", ["decapod.exporter","fluid.uploader.multiFileUploader"], ["{arguments}.1"]);
    
})(jQuery);

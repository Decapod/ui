/*
Copyright 2011 OCAD University

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

    // Run in demo mode if loaded from the local file system
    fluid.demands("decapod.dataSource", ["decapod.fileSystem", "decapod.imageManagement"], {
        options: {
            url: "../../../mock-book/capturedImages/imagesData.json"
        }
    });
    
    // URL to dataSource when run though a server
    fluid.demands("decapod.dataSource", ["decapod.imageManagement"], {
        options: {
            url: ""//server url
        }
    });
    
    // Setting the container of the list reorderer. Since fluid.reorderList isn't a graded component, the conatiner has to be specified here.
    fluid.demands("fluid.reorderList", "decapod.imageManagement", ["{imageManagement}.dom.thumbnails", "{options}"]);
    
})(jQuery);


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
    
    /*******************
     * Invoker Demands *
     *******************/
    
    fluid.demands("decapod.dataSource.delete", ["decapod.dataSource"], {
        funcName: "decapod.dataSource.method",
        args: ["{dataSource}", "DELETE", "@0", "@1"]
    });
    
    fluid.demands("decapod.dataSource.get.", ["decapod.dataSource"], {
        funcName: "decapod.dataSource.method",
        args: ["{dataSource}", "GET", "@0", "@1"]
    });
    
    fluid.demands("decapod.dataSource.post", ["decapod.dataSource"], {
        funcName: "decapod.dataSource.method",
        args: ["{dataSource}", "POST", "@0", "@1"]
    });
    
    fluid.demands("decapod.dataSource.put", ["decapod.dataSource"], {
        funcName: "decapod.dataSource.method",
        args: ["{dataSource}", "PUT", "@0", "@1"]
    });
    
})(jQuery);


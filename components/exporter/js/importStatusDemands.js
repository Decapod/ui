/*
Copyright 2012 OCAD University 

Licensed under the Apache License, Version 2.0 (the "License"); 
you may not use this file except in compliance with the License. 
You may obtain a copy of the License at 

   http://www.apache.org/licenses/LICENSE-2.0 

Unless required by applicable law or agreed to in writing, software 
distributed under the License is distributed on an "AS IS" BASIS, 
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
See the License for the specific language governing permissions and 
limitations under the License.
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
     // Due to FLUID-4631, have to sort out the arguments here. (See also: exporterDemands.js)
//     fluid.demands("decapod.importStatus.addError", "decapod.importStatus", ["{importStatus}", "{arguments}.0"]);
    fluid.demands("decapod.importStatus.addError", "decapod.importStatus", ["{importStatus}", "{arguments}.1"]);
    fluid.demands("decapod.importStatus.reset", "decapod.importStatus", ["{importStatus}"]);
    fluid.demands("decapod.importStatus.statusMessages", "decapod.importStatus", ["{importStatus}", "{arguments}.0"]);
    fluid.demands("decapod.importStatus.renderStatuses", "decapod.importStatus", ["{importStatus}"]);
    
})(jQuery);

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
/*global setTimeout, window, decapod:true, fluid, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {
    
    /************************************
     * decapod.viewComponentCustomMerge *
     ************************************/
    
    fluid.registerNamespace("decapod.viewComponentCustomMerge");
    
    decapod.viewComponentCustomMerge.extend = function (target, source) {
        target = target || {};
        if (fluid.isArrayable(target) || fluid.isPrimitive(target)) {
            target = source !== undefined ? source : target;
        } else if (!fluid.isPrimitive(source)) {
            for (var key in source) {
                if (target[key] && typeof (target[key]) === "object") {
                    target[key] = decapod.viewComponentCustomMerge.extend(target[key], source[key]);
                } else if (source[key] !== undefined) {
                    target[key] = source[key];
                }
            }
        }
 
        return target;
    };
    
    decapod.viewComponentCustomMerge.mergeModel = function (target, source) {
        return decapod.viewComponentCustomMerge.extend(target, source);
    };
    
    fluid.defaults("decapod.viewComponentCustomMerge", {
        gradeNames: ["fluid.viewComponent"],
        mergePolicy: {
            model: decapod.viewComponentCustomMerge.mergeModel
        }
    });
})(jQuery);
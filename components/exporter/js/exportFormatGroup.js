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
/*global window, decapod:true, fluid, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {

    /*****************************
     * decapod.exportFormatGroup *
     *****************************/
    
    fluid.registerNamespace("decapod.exportFormatGroup");
    
    decapod.exportFormatGroup.produceTree = function (that) {
        return {
            name: that.options.strings.name,
            expander: {
                type: "fluid.renderer.repeat",
                repeatID: "formats:",
                controlledBy: "formats",
                valueAs: "formatType",
                tree: {
                    format: {
                        decorators: {
                            type: "fluid",
                            func: "{formatType}"
                        }
                    }
                }
            }
        };
    };
    
    decapod.exportFormatGroup.finalInit = function (that) {
        decapod.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.exportFormatGroupTemplate.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
            that.refreshView();
        });
        
        that.events.onReady.fire(that);
    };
    
    fluid.defaults("decapod.exportFormatGroup", {
        gradeNames: ["decapod.rendererComponentCustomMerge", "autoInit"],
        finalInitFunction: "decapod.exportFormatGroup.finalInit",
        produceTree: "decapod.exportFormatGroup.produceTree",
        strings: {
            name: "Group Name"
        },
        selectors: {
            name: ".dc-exportFormatGroup-name",
            formats: ".dc-exportFormatGroup-formats",
            format: ".dc-exportFormatGroup-format"
        },
        repeatingSelectors: ["formats"],
        events: {
            afterFetchResources: null,
            onReady: null
        },
        model: {
            formats: [] //of type, ["component1", "component2"]
        },
        resources: {
            exportFormatGroupTemplate: {
                url: "../html/exportFormatGroupTemplate.html",
                forceCache: true
            }
        }
    });

})(jQuery);

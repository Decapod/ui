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

    /******************
     * decapod.select *
     ******************/

    fluid.registerNamespace("decapod.select");
    
    /**
     * Enables the select component.
     * Removes the disabled property from the DOM
     * 
     * @param {object} that, the component
     */
    decapod.select.enable = function (that) {
        that.locate("choices").prop("disabled", false);
    };
    
    /**
     * Disableds the select component.
     * Adds the disabled property to the DOM
     * 
     * @param {object} that, the component
     */
    decapod.select.disable = function (that) {
        that.locate("choices").prop("disabled", true);
    };
    
    /**
     * Returns a boolean representing whether or not the component is enabled.
     * 
     * @param {object} that, the component
     */
    decapod.select.isEnabled = function (that) {
        return !that.locate("choices").is(":disabled");
    };
    
    decapod.select.produceTree = function (that) {
        return {
            label: {
                messagekey: "exporter_select_label"
            },
            choices: {
                "selection": "${selection}",
                "optionlist": "${choices}",
                "optionnames": "${names}"
            }
        };
    };
    
    decapod.select.preInit = function (that) {
        /*
         * Work around for FLUID-4709
         * These methods are overwritten by the framework after initComponent executes.
         * This preInit function guarantees that functions which forward to the overwritten versions are available during the event binding phase.
         */
        that.enable = function () {
            that.enable();
        };
        that.disable = function () {
            that.disable();
        };
        that.isEnabled = function () {
            that.isEnabled();
        };
    };
    
    decapod.select.finalInit = function (that) {
        that.applier.modelChanged.addListener("*", function (newModel, oldModel) {
            that.events.afterSelectionChanged.fire(newModel.selection, oldModel.selection);
        });
        
        fluid.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.template.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
            that.refreshView();
        });
        
        that.events.onReady.fire(that);
    };
    
    /**
     * A simple component for rendering out select boxes
     */
    fluid.defaults("decapod.select", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        preInitFunction: "decapod.select.preInit",
        finalInitFunction: "decapod.select.finalInit",
        parentBundle: "{globalBundle}",
        produceTree: "decapod.select.produceTree",
        selectors: {
            label: ".dc-select-label",
            choices: ".dc-select-choices"
        },
        strings: {
        },
        model: {}, // in the form {selection: "", choices: [], names: []}
        events: {
            afterFetchResources: null,
            afterSelectionChanged: null,
            onReady: null
        },
        invokers: {
            enable: "decapod.select.enable",
            disable: "decapod.select.disable",
            isEnabled: "decapod.select.isEnabled"
        },
        resources: {
            template: {
                url: "../html/selectTemplate.html",
                forceCache: true
            }
        }
    });
})(jQuery);

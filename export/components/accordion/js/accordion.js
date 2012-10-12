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
    
    /*********************
     * decapod.accordion *
     *********************/
    
    fluid.registerNamespace("decapod.accordion");
    
    /**
     * A wrapper to accept any of the accordion method calls.
     * For disable and enable should use the exposed functions.
     * 
     * @param {object} that, the component
     * @param {string} any number of strings representing the method name and arguments for the jQuery UI Accordion.
     */
    decapod.accordion.methodImp = function (that) {
        var arg1 = arguments[1];
        var args = $.isArray(arg1) ? arg1 : [arg1];
        args = args.concat(arguments[2] || []);
        return that.container.accordion.apply(that.container, args);
    };
    
    decapod.accordion.preInit = function (that) {
        /*
         * Work around for FLUID-4709
         * These methods are overwritten by the framework after initComponent executes.
         * This preInit function guarantees that functions which forward to the overwritten versions are available during the event binding phase.
         */
        that.disable = function () {
            that.disable();
        };
        that.enable = function () {
            that.enable();
        };
    };
    
    decapod.accordion.finalInit = function (that) {
        that.container.accordion(that.options);
        that.events.onReady.fire();
    };

    /**
     * A simple wrapper component around the jQuery UI Accordion.
     * This makes is useable through Fluid Infusion's IoC framework.
     */
    fluid.defaults("decapod.accordion", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        preInitFunction: "decapod.accordion.preInit",
        finalInitFunction: "decapod.accordion.finalInit",
        invokers: {
            method: "decapod.accordion.method",
            disable: "decapod.accordion.disable",
            enable: "decapod.accordion.enable"
        },
        events: {
            onReady: null
        }
    });
})(jQuery);

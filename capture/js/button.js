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

    /******************
     * decapod.button *
     ******************/
    
    fluid.registerNamespace("decapod.button");

    decapod.button.setState = function (that, state) {
        that.applier.requestChange("state", state);
    };

    decapod.button.handleState = function (that, state) {
        var button = that.container;
        
        if (state === "disabled") {
            button.addClass(that.options.styles.disabled);
            button.attr({
                "aria-disabled": true,
                "disabled": "disabled"
            });

            button.unbind("click.decapodButton");
            that.events.afterDisabled.fire();
        } else {
            button.removeClass(that.options.styles.disabled);
            button.removeAttr("aria-disabled disabled");

            button.bind("click.decapodButton", that.events.onClick.fire);
            that.events.afterEnabled.fire();
        }
    };
    
    decapod.button.preInit = function (that) {
        /*
         * Work around for FLUID-4709
         * These methods are overwritten by the framework after initComponent executes.
         * This preInit function guarantees that functions which forward to the overwritten versions are available during the event binding phase.
         */
        // Similar to the comment above but specifically a work around for FLUID-4334
        that.setState = function () {
            that.setState();
        };

        that.handleState = function () {
            that.handleState();
        };
    };

    decapod.button.finalInit = function (that) {
        var button = that.container;
        button.attr("role", "button");
        button.text(that.options.strings.label);

        that.applier.modelChanged.addListener("state", function (newModel) {
            that.events.onStateChanged.fire(newModel.state);
        });

        that.handleState(that.model.state);
    };
    
    fluid.defaults("decapod.button", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        preInitFunction: "decapod.button.preInit",
        finalInitFunction: "decapod.button.finalInit",
        model: {
            "state": "enabled"
        },
        strings: {
            label: ""
        },
        styles: {
            disabled: "ds-button-disabled"
        },
        invokers: {
            setState: "decapod.button.setState",
            handleState: "decapod.button.handleState"
        },
        events: {
            onClick: null,
            onStateChanged: null,
            afterEnabled: null,
            afterDisabled: null
        },
        listeners: {
            onStateChanged: {
                listener: "{button}.handleState",
//                listener: function (a) {console.log(a);},
                args: ["{arguments}.0"]
            }
        }
    });
    
})(jQuery);

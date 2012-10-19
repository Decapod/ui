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

    /*****************************
     *  decapod.processButton *
     *****************************/
    
    fluid.registerNamespace("decapod.processButton");

    decapod.processButton.updateModel = function (that, newModel) {
        that.applier.requestChange("", newModel);
    };
    
    decapod.processButton.setInProcessState = function (that) {
        that.options.originalHTML = that.locate("button").html();
        that.applier.requestChange("disabled", true);
        that.locate("button").html(that.options.strings.inProcess);
    };
    
    decapod.processButton.removeInProcessState = function (that) {
        that.applier.requestChange("disabled", false);
        that.locate("button").html(that.options.originalHTML);
    };
    
    decapod.processButton.process = function (that) {
        decapod.processButton.setInProcessState(that);
        that.processSource[that.options.dataSourceConfig.method](that.options.dataSourceConfig.data, that.options.dataSourceConfig.urlTemplateValues);
    };
    
    decapod.processButton.handleSuccess = function (that, response) {
        decapod.processButton.removeInProcessState(that);
        that.events.onProcessSuccess.fire(response);
    };
    
    decapod.processButton.handleError = function (that, xhr, response) {
        decapod.processButton.removeInProcessState(that);
        that.events.onProcessError.fire(xhr, response);
    };
    
    decapod.processButton.preInit = function (that) {
        /*
         * Work around for FLUID-4709
         * These methods are overwritten by the framework after initComponent executes.
         * This preInit function guarantees that functions which forward to the overwritten versions are available during the event binding phase.
         */
        that.updateModel = function (newModel) {
            that.updateModel(newModel);
        };
    };

    decapod.processButton.finalInit = function (that) {
        var button = that.locate("button");
        button.attr("role", "button");
        button.click(function () {
            decapod.processButton.process(that);
            that.events.onProcess.fire();
        });
        
        that.applier.modelChanged.addListener("disabled", function (newModel) {
            if (newModel.disabled) {
                button.addClass(that.options.styles.disabled);
                button.attr("disabled", "disabled");
            } else {
                button.removeClass(that.options.styles.disabled);
                button.removeAttr("disabled");
            }
        });

        that.events.onReady.fire();
    };
    
    fluid.defaults("decapod.processButton", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        finalInitFunction: "decapod.processButton.finalInit",
        components: {
            processSource: {
                type: "decapod.dataSource",
                options: {
                    url: "{processButton}.options.dataSourceConfig.url",
                    listeners: {
                        "success.handler": {
                            listener: "decapod.processButton.handleSuccess",
                            args: ["{processButton}", "{arguments}.0"]
                        },
                        "error.handler": {
                            listener: "decapod.processButton.handleError",
                            args: ["{processButton}", "{arguments}.0", "{arguments}.1"]
                        }
                    }
                }
            }
        },
        dataSourceConfig: {
            url: null,
            method: "get",
            data: null,
            urlTemplateValues: null
        },
        model: {
            disabled: false
        },
        selectors: {
            button: ".dc-capturer-button"
        },
        strings: {
            inProcess: "Processing"
        },
        styles: {
            disabled: "ds-capturer-button-disabled"
        },
        invokers: {
            updateModel: "decapod.processButton.updateModel"
        },
        events: {
            onReady: null,
            onProcess: null,
            onProcessSuccess: null,
            onProcessError: null
        }
    });
})(jQuery);

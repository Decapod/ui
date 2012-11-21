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

    /***************************
     * decapod.captureReviewer *
     ***************************/
    
    fluid.registerNamespace("decapod.captureReviewer");

    decapod.captureReviewer.updateModel = function (that, newModel) {
        that.applier.requestChange("", newModel);
    };
    
    decapod.captureReviewer.setDeleted = function (that) {
        that.applier.requestChange("deleted", true);
    };
    
    decapod.captureReviewer.produceTree = function (that) {
        var isDeleted = !!that.model.deleted;
        return {
            del: {
                decorators: {
                    type: "fluid",
                    func: "decapod.button",
                    options: {
                        strings: {
                            label: that.options.strings.del
                        },
                        model: {
                            state: isDeleted ? "disabled" : "enabled"
                        },
                        listeners: {
                            "onClick.delete": {
                                listener: that.events.onDelete,
                                args: [that.model.captureIndex]
                            }
                        }
                    }
                }
            },
            expander: {
                type: "fluid.renderer.condition",
                condition: isDeleted,
                trueTree: {
                    captureIndex: {
                        messagekey: "deletedIndex",
                        args: [that.model.captureIndex]
                    },
                    deletedMessage: {
                        messagekey: "deletedMessage"
                    }
                },
                falseTree: {
                    captureIndex: {
                        messagekey: "captureIndex",
                        args: [that.model.captureIndex]
                    },
                    capturesContainer: {}, //forces the captureContainer to render (needed so that it will be removed in the trueTree)
                    expander: {
                        type: "fluid.renderer.repeat",
                        repeatID: "captures:",
                        controlledBy: "captures",
                        pathAs: "captureInfo",
                        tree: {
                            captureIMG: {
                                target: "${{captureInfo}}"
                            }
                        }
                    }
                }
            }
        };
    };
    
    decapod.captureReviewer.preInit = function (that) {
        /*
         * Work around for FLUID-4709
         * These methods are overwritten by the framework after initComponent executes.
         * This preInit function guarantees that functions which forward to the overwritten versions are available during the event binding phase.
         */
        // Similar to the comment above but specifically a work around for FLUID-4334
        that.refreshView = function () {
            that.renderer.refreshView();
        };
        
        that.updateModel = function (newModel) {
            that.updateModel(newModel);
        };
        
        that.setDeleted = function () {
            that.setDeleted();
        };
    };

    decapod.captureReviewer.finalInit = function (that) {
        that.applier.modelChanged.addListener("*", that.events.afterModelChanged.fire);
        that.events.onReady.fire();
    };
    
    fluid.defaults("decapod.captureReviewer", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        preInitFunction: "decapod.captureReviewer.preInit",
        finalInitFunction: "decapod.captureReviewer.finalInit",
        produceTree: "decapod.captureReviewer.produceTree",
        selectors: {
            captureIndex: ".dc-captureReviewer-captureIndex",
            deletedMessage: ".dc-captureReviewer-deletedMessage",
            del: ".dc-captureReviewer-del",
            capturesContainer: ".dc-captureReviewer-capturesContainer",
            captures: ".dc-captureReviewer-captures",
            captureIMG: ".dc-captureReviewer-captureIMG"
        },
        repeatingSelectors: ["captures"],
        strings: {
            captureIndex: "Capture #%0",
            deletedIndex: "Deleted Capture #%0",
            deletedMessage: "Press the Camera Button to continue capturing.",
            del: "Delete"
        },
        model: {
            captureIndex: "",
            captures: []
        },
        events: {
            onReady: null,
            onDelete: null,
            afterModelChanged: null
        },
        listeners: {
            "afterModelChanged.refreshView": "{captureReviewer}.refreshView",
            "onDelete.setDeleted": "{captureReviewer}.setDeleted"
        },
        renderOnInit: true,
        invokers: {
            setDeleted: "decapod.captureReviewer.setDeleted",
            updateModel: "decapod.captureReviewer.updateModel"
        }
    });
})(jQuery);

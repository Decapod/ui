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
    
    /************************
     * decapod.exportPoller *
     ************************/
     
    fluid.registerNamespace("decapod.exportPoller");
    
    decapod.exportPoller.poll = function (that) {
        that.events.onPoll.fire();
    };
    
    decapod.exportPoller.isComplete = function (response) {
        return response.status && response.status.toLowerCase() === "complete";
    };
    
    decapod.exportPoller.handleResponse = function (that, response) {
        that.response = response;
        if (that.isComplete(response)) {
            that.events.pollComplete.fire(response);
        } else {
            setTimeout(function () {
                that.poll();
            }, that.options.delay);
        }
    };
    
    decapod.exportPoller.preInit = function (that) {
        /*
         * Work around for FLUID-4709
         * This method is overwritten by the framework after initComponent executes.
         * This preInit function guarantees that functions which forward to the overwritten versions are available during the event binding phase.
         */
        that.handleResponse = function (response) {
            that.handleResponse(response);
        };
    };
     
    fluid.defaults("decapod.exportPoller", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],
        preInitFunction: "decapod.exportPoller.preInit",
        invokers: {
            poll: "decapod.exportPoller.poll",
            isComplete: "decapod.exportPoller.isComplete",
            handleResponse: "decapod.exportPoller.handleResponse"
        },
        events: {
            onPoll: null,
            pollComplete: null
        },
        delay: 5000,
        components: {
            eventBinder: {
                type: "decapod.exportPoller.eventBinder",
                priority: "last",
                options: {
                    listeners: {
                        "{exportPoller}.events.onPoll": "{dataSource}.get"
                    }
                }
            },
            dataSource: {
                type: "decapod.dataSource",
                priority: "first",
                options: {
                    listeners: {
                        "success.handler": "{exportPoller}.handleResponse"
                    }
                }
            }
        }
    });
    
    /**********************
     * decapod.exportInfo *
     **********************/

    fluid.registerNamespace("decapod.exportInfo");

    decapod.exportInfo.produceTree = function (that) {
        return {
            name: {
                messagekey: "name"
            },
            description: {
                messagekey: "description"
            }
        };
    };
    
    decapod.exportInfo.finalInit = function (that) {
        decapod.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.template.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
            that.refreshView();
        });
    };
    
    fluid.defaults("decapod.exportInfo", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        finalInitFunction: "decapod.exportInfo.finalInit",
        produceTree: "decapod.exportInfo.produceTree",
        selectors: {
            name: ".dc-exportInfo-name",
            description: ".dc-exportInfo-description"
        },
        strings: {
            name: "Format type label",
            description: "A delectable medley of bits and bytes to satisfy every platform"
        },
        events: {
            afterFetchResources: null
        },
        resources: {
            template: {
                url: "../html/exportInfoTemplate.html",
                forceCache: true
            }
        }
    });
    
    /****************************
     * decapod.pdfExportOptions *
     ****************************/
    
    fluid.registerNamespace("decapod.pdfExportOptions");
    
    decapod.pdfExportOptions.finalInit = function (that) {
        that.applier.modelChanged.addListener("*", function (newModel, oldModel) {
            that.events.afterModelChanged.fire(newModel, oldModel);
        });
        
        decapod.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.template.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
        });
    };
    
    fluid.defaults("decapod.pdfExportOptions", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        finalInitFunction: "decapod.pdfExportOptions.finalInit",
        produceTree: "decapod.pdfExportOptions.produceTree",
        selectors: {
            colour: ".dc-pdfExportOptions-colour",
            output: ".dc-pdfExportOptions-output",
            outputSettings: ".dc-pdfExportOptions-outputSettings"
        },
        model: {
            colour: {}, // in the form {selection: "", choices: [], names: []}
            output: {}, // in the form {selection: "", choices: [], names: []}
            outputSettings: {
                settings: [] //in the form {value: "", name: "", unit: "", attrs: {}}
            }
        },
        strings: {
            colourLabel: "Colour",
            outputLabel: "Output"
        },
        events: {
            afterFetchResources: null,
            afterModelChanged: null,
            afterColourRender: null,
            afterOutputRender: null,
            afterOutputSettingsRender: null,
            afterRender: {
                events: {
                    colour: "afterColourRender",
                    output: "afterOutputRender",
                    outputSettings: "afterOutputSettingsRender"
                },
                args: ["{pdfExportOptions}"]
            }
        },
        components: {
            colour: {
                type: "decapod.select",
                container: "{pdfExportOptions}.dom.colour",
                createOnEvent: "afterFetchResources",
                options: {
                    model: "{pdfExportOptions}.model.colour",
                    listeners: {
                        "afterRender.afterColourRender": "{pdfExportOptions}.events.afterColourRender"
                    },
                    strings: {
                        label: "{pdfExportOptions}.options.strings.colourLabel"
                    }
                }
            },
            output: {
                type: "decapod.select",
                container: "{pdfExportOptions}.dom.output",
                createOnEvent: "afterFetchResources",
                options: {
                    model: "{pdfExportOptions}.model.output",
                    listeners: {
                        "afterRender.afterOutputRender": "{pdfExportOptions}.events.afterOutputRender"
                    },
                    strings: {
                        label: "{pdfExportOptions}.options.strings.outputLabel"
                    }
                }
            },
            outputSettings: {
                type: "decapod.outputSettings",
                createOnEvent: "afterFetchResources",
                container: "{pdfExportOptions}.dom.outputSettings",
                options: {
                    model: "{pdfExportOptions}.model.outputSettings",
                    listeners: {
                        "afterRender.afterOutputSettingsRender": "{pdfExportOptions}.events.afterOutputSettingsRender"
                    }
                }
            }
        },
        resources: {
            template: {
                url: "../html/pdfExportOptionsTemplate.html",
                forceCache: true
            },
            select: {
                url: "../../select/html/selectTemplate.html",
                forceCache: true
            },
            outputSettings: {
                url: "../html/outputSettingsTemplate.html",
                forceCache: true
            }
        }
    });
    
    /**************************
     * decapod.outputSettings *
     **************************/
    
    fluid.registerNamespace("decapod.outputSettings");
    
    decapod.outputSettings.finalInit = function (that) {
        that.applier.modelChanged.addListener("*", function (newModel, oldModel) {
            that.events.afterModelChanged.fire(newModel, oldModel);
        });
        
        decapod.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.template.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
            that.refreshView();
        });
    };
    
    decapod.outputSettings.produceTree = function (that) {
        return {
            expander: {
                type: "fluid.renderer.repeat",
                repeatID: "settings:",
                controlledBy: "settings",
                pathAs: "setting",
                tree: {
                    label: "${{setting}.name}",
                    val: {
                        value: "${{setting}.value}",
                        decorators: {
                            type: "attrs",
                            attributes: "${{setting}.attrs}"
                        }
                    },
                    unit: "${{setting}.unit}"
                }
            }
        };
    };
    
    fluid.defaults("decapod.outputSettings", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        finalInitFunction: "decapod.outputSettings.finalInit",
        produceTree: "decapod.outputSettings.produceTree",
        selectors: {
            settings: ".dc-outputSettings-settings",
            label: ".dc-outputSettings-label",
            val: ".dc-outputSettings-value",
            unit: ".dc-outputSettings-unit"
        },
        repeatingSelectors: ["settings"],
        model: {
            settings: [] //in the form {value: "", name: "", unit: "", attrs: {}}
        },
        events: {
            afterFetchResources: null,
            afterModelChanged: null
        },
        resources: {
            template: {
                url: "../html/outputSettingsTemplate.html",
                forceCache: true
            }
        }
    });
    
    /**************************
     * decapod.exportControls *
     **************************/
    
    fluid.registerNamespace("decapod.exportControls");

    decapod.exportControls.produceTree = function (that) {
        return {
            expander: [
                {
                    type: "fluid.renderer.condition",
                    condition: that.model.showExportStart,
                    trueTree: {
                        trigger: {
                            decorators: {
                                type: "fluid",
                                func: "decapod.exportControls.trigger"
                            }
                        }
                    }
                },
                {
                    type: "fluid.renderer.condition",
                    condition: that.model.showExportProgress,
                    trueTree: {
                        progress: {
                            decorators: {
                                type: "fluid",
                                func: "decapod.exportControls.progress"
                            }
                        }
                    }
                },
                {
                    type: "fluid.renderer.condition",
                    condition: that.model.showExportComplete,
                    trueTree: {
                        complete: {
                            decorators: {
                                type: "fluid",
                                func: "decapod.exportControls.complete"
                            }
                        }
                    }
                }
            ]
        };
    };
    
    decapod.exportControls.updateModel = function (that, modelPath, value) {
        that.applier.requestChange(modelPath, value);
    };
    
    decapod.exportControls.preInit = function (that) {
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
        
        // work around for FLUID-4192
        that.initialRender = function () {
            setTimeout(that.refreshView, 1);
        };
    };

    decapod.exportControls.finalInit = function (that) {
        that.applier.modelChanged.addListener("*", function (newModel, oldModel) {
            that.events.afterModelChanged.fire(newModel, oldModel);
        });
        
        decapod.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.controls.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
        });
    };
    
    fluid.defaults("decapod.exportControls", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        finalInitFunction: "decapod.exportControls.finalInit",
        preInitFunction: "decapod.exportControls.preInit",
        produceTree: "decapod.exportControls.produceTree",
        selectors: {
            trigger: ".dc-exportControls-trigger",
            progress: ".dc-exportControls-progress",
            complete: ".dc-exportControls-complete"
        },
        strings: {
            trigger: "Start Export",
            progressMessage: "Export Progress",
            download: "Download",
            restart: "Start Over"
        },
        events: {
            afterFetchResources: null,
            afterModelChanged: null,
            onExportTrigger: null,
            onReady: null
        },
        listeners: {
            "afterModelChanged.refreshView": "{exportControls}.refreshView",
            "afterFetchResources.render": "{exportControls}.initialRender",
            "onExportTrigger.updateModel": {
                listener: "{exportControls}.updateModel",
                args: [{
                    showExportStart: false,
                    showExportProgress: true,
                    showExportComplete: false
                }]
            }
        },
        model: {
            showExportStart: true,
            showExportProgress: false,
            showExportComplete: false,
            downloadURL: ""
        },
        invokers: {
            updateModel: "decapod.exportControls.updateModel"
        },
        resources: {
            controls: {
                url: "../html/exportControlsTemplate.html",
                forceCache: true
            },
            trigger: {
                url: "../html/exportControlsTriggerTemplate.html",
                forceCache: true
            },
            progress: {
                url: "../html/exportControlsProgressTemplate.html",
                forceCache: true
            },
            complete: {
                url: "../html/exportControlsCompleteTemplate.html",
                forceCache: true
            }
        }
    });
    
    /**********************************
     * decapod.exportControls.trigger *
     **********************************/
    
    fluid.registerNamespace("decapod.exportControls.trigger");

    decapod.exportControls.trigger.produceTree = function (that) {
        return {
            expander: [
                {
                    type: "fluid.renderer.condition",
                    condition: that.model.disabled,
                    trueTree: {
                        trigger: {
                            messagekey: "trigger",
                            decorators: {
                                type: "attrs",
                                attributes: {
                                    disabled: "disabled"
                                }
                            }
                        }
                    },
                    falseTree: {
                        trigger: {
                            messagekey: "trigger",
                            decorators: [{
                                type: "jQuery",
                                func: "click",
                                args: function () { that.events.afterTriggered.fire(); }
                            }]
                        }
                    }
                }
            ]
        };
    };
    
    decapod.exportControls.trigger.updateModel = function (that, disabled) {
        that.applier.requestChange("disabled", disabled);
    };
    
    decapod.exportControls.trigger.preInit = function (that) {
        /*
         * Work around for FLUID-4709
         * These methods are overwritten by the framework after initComponent executes.
         * This preInit function guarantees that functions which forward to the overwritten versions are available during the event binding phase.
         */
        // Similar to the comment above but specifically a work around for FLUID-4334
        that.refreshView = function () {
            that.renderer.refreshView();
        };
        that.updateModel = function (disabled) {
            that.updateModel(disabled);
        };
    };
    
    decapod.exportControls.trigger.finalInit = function (that) {
        that.applier.modelChanged.addListener("*", function (newModel, oldModel) {
            that.events.afterModelChanged.fire(newModel, oldModel);
        });
        
        decapod.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.template.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
            that.refreshView();
        });
    };
    
    fluid.defaults("decapod.exportControls.trigger", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        preInitFunction: "decapod.exportControls.trigger.preInit",
        finalInitFunction: "decapod.exportControls.trigger.finalInit",
        produceTree: "decapod.exportControls.trigger.produceTree",
        selectors: {
            trigger: ".dc-exportControls-trigger-exportControl"
        },
        strings: {
            trigger: "Start Export"
        },
        events: {
            afterFetchResources: null,
            afterModelChanged: null,
            afterTriggered: null
        },
        listeners: {
            "afterModelChanged.internal": "{trigger}.refreshView"
        },
        model: {
            disabled: false
        },
        invokers: {
            updateModel: "decapod.exportControls.trigger.updateModel"
        },
        resources: {
            template: {
                url: "../html/exportControlsTriggerTemplate.html",
                forceCache: true
            }
        }
    });
    
    /***********************************
     * decapod.exportControls.progress *
     ***********************************/
    
    fluid.registerNamespace("decapod.exportControls.progress");
    
    decapod.exportControls.progress.produceTree = function (that) {
        return {
            message: {
                messagekey: "message"
            }
        };
    };
    
    decapod.exportControls.progress.finalInit = function (that) {
        decapod.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.template.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
            that.refreshView();
        });
    };
    
    fluid.defaults("decapod.exportControls.progress", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        finalInitFunction: "decapod.exportControls.progress.finalInit",
        produceTree: "decapod.exportControls.progress.produceTree",
        selectors: {
            message: ".dc-exportControls-progress-message"
        },
        strings: {
            message: "Export Progress"
        },
        events: {
            afterFetchResources: null
        },
        resources: {
            template: {
                url: "../html/exportControlsProgressTemplate.html",
                forceCache: true
            }
        }
    });
    
    /***********************************
     * decapod.exportControls.complete *
     ***********************************/
    
    fluid.registerNamespace("decapod.exportControls.complete");
    
    decapod.exportControls.complete.updateModel = function (that, url) {
        that.applier.requestChange("downloadURL", url);
    };
    
    decapod.exportControls.complete.produceTree = function (that) {
        return {
            download: {
                linktext: {
                    messagekey: "download"
                },
                target: "${downloadURL}"
            },
            restart: {
                messagekey: "restart"
            }
        };
    };
    
    decapod.exportControls.complete.finalInit = function (that) {
        that.applier.modelChanged.addListener("*", function (newModel, oldModel) {
            that.events.afterModelChanged.fire(newModel, oldModel);
        });
        
        decapod.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.template.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
            that.refreshView();
        });
    };
    
    fluid.defaults("decapod.exportControls.complete", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        finalInitFunction: "decapod.exportControls.complete.finalInit",
        produceTree: "decapod.exportControls.complete.produceTree",
        invokers: {
            updateModel: "decapod.exportControls.complete.updateModel"
        },
        selectors: {
            download: ".dc-exportControls-complete-download",
            restart: ".dc-exportControls-complete-restart"
        },
        strings: {
            download: "Download",
            restart: "Start Over"
        },
        events: {
            afterModelChanged: null,
            afterFetchResources: null
        },
        model: {
            downloadURL: ""
        },
        resources: {
            template: {
                url: "../html/exportControlsCompleteTemplate.html",
                forceCache: true
            }
        }
    });
})(jQuery);

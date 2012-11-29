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
/*global Object, setTimeout, window, decapod:true, fluid, jQuery*/

// JSLint options
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {

    /************************
     * decapod.exportPoller *
     ************************/

    fluid.registerNamespace("decapod.exportPoller");

    /**
     * Fires the onPoll event
     *
     * @param {object} that, the component
     */
    decapod.exportPoller.poll = function (that) {
        that.events.onPoll.fire();
    };

    /**
     * Determines if the response status indicates a completed export
     *
     * @param {object} response, the response object returned from polling the export
     */
    decapod.exportPoller.isComplete = function (response) {
        return response.status && response.status.toLowerCase() === "complete";
    };

    /**
     * Determines if the response status indicates an error occurred with the export
     *
     * @param {object} response, the response object returned from polling the export
     */
    decapod.exportPoller.isError = function (response) {
        return response.status && response.status.toLowerCase() === "error";
    };

    /**
     * Manages the response from a poll.
     * If it is complete the poll complete event is fired.
     * If it is still in progress, another poll will be triggered after the delay set in the options.
     *
     * @param {object} that, the component
     * @param {object} response, the response object returned from polling the export
     */
    decapod.exportPoller.handleResponse = function (that, response) {
        that.response = response;
        that.events.afterPoll.fire(response);
        if (that.isComplete(response)) {
            that.events.pollComplete.fire(response);
        } else if (that.isError(response)) {
            that.events.onError.fire(response);
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

    decapod.exportPoller.finalInit = function (that) {
        that.events.onReady.fire();
    };

    fluid.defaults("decapod.exportPoller", {
        gradeNames : ["fluid.eventedComponent", "autoInit"],
        preInitFunction : "decapod.exportPoller.preInit",
        finalInitFunction : "decapod.exportPoller.finalInit",
        invokers : {
            poll : "decapod.exportPoller.poll",
            isComplete : "decapod.exportPoller.isComplete",
            isError : "decapod.exportPoller.isError",
            handleResponse : "decapod.exportPoller.handleResponse"
        },
        events : {
            afterPoll : null,
            onPoll : null,
            onReady : null,
            onError : null,
            pollComplete : null
        },
        delay : 5000,
        components : {
            eventBinder : {
                type : "decapod.exportPoller.eventBinder",
                priority : "last",
                options : {
                    listeners : {
                        "{exportPoller}.events.onPoll" : "{dataSource}.get"
                    }
                }
            },
            dataSource : {
                type : "decapod.dataSource",
                priority : "first",
                options : {
                    listeners : {
                        "success.handler" : "{exportPoller}.handleResponse"
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
            name : {
                messagekey : "name"
            },
            description : {
                messagekey : "description"
            }
        };
    };

    decapod.exportInfo.finalInit = function (that) {
        decapod.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.template.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
            that.refreshView();
        });

        that.events.onReady.fire(that);
    };

    /**
     * Renders out the information for an export.
     * This includes the name and description.
     */
    fluid.defaults("decapod.exportInfo", {
        gradeNames : ["decapod.rendererComponentCustomMerge", "autoInit"],
        finalInitFunction : "decapod.exportInfo.finalInit",
        produceTree : "decapod.exportInfo.produceTree",
        selectors : {
            name : ".dc-exportInfo-name",
            description : ".dc-exportInfo-description"
        },
        events : {
            afterFetchResources : null,
            onReady : null
        },
        resources : {
            template : {
                url : "../html/exportInfoTemplate.html",
                forceCache : true
            }
        }
    });

    /****************************
     * decapod.pdfExportOptions *
     ****************************/

    fluid.registerNamespace("decapod.pdfExportOptions");

    /**
     * Hides the elements refrenced by the selector
     *
     * @param {object} that, the component
     * @param {string} selector, one of the selectors from the options.
     */
    decapod.pdfExportOptions.hide = function (that, selector) {
        that.locate(selector).hide();
    };

    /**
     * Shows the elements refrenced by the selector
     *
     * @param {object} that, the component
     * @param {string} selector, one of the selectors from the options.
     */
    decapod.pdfExportOptions.show = function (that, selector) {
        that.locate(selector).show();
    };

    /**
     * Will show the selector if the value matches what is stored
     * at the EL Path in the model.
     *
     * @param {object} that, the component
     * @param {string} selector, one of the selectors from the options.
     * @param {string} elPath, an EL Path into the model
     * @param {object} value, some value to compare against the value refrenced by the El Path
     */
    decapod.pdfExportOptions.showIfModelValue = function (that, selector, elPath, value) {
        if (fluid.get(that.model, elPath) === value) {
            that.show(selector);
        } else {
            that.hide(selector);
        }
    };

    /**
     * Fires the onDisable event.
     * Used to disable the options fields
     *
     * @param {object} that, the component
     */
    decapod.pdfExportOptions.disable = function (that) {
        that.events.onDisable.fire(that);
    };

    /**
     * Fires the onEnable event.
     * Used to enable the options fields
     *
     * @param {object} that, the component
     */
    decapod.pdfExportOptions.enable = function (that) {
        that.events.onEnable.fire(that);
    };

    /**
     * Determines if the export options are in a valid state.
     *
     * @param {object} that, the component
     * @param {string} elPath, an EL Path into the model
     * @param {string} representing the name of the customSetting selection
     */
    decapod.pdfExportOptions.isValid = function (that, elPath, customSetting) {
        return fluid.get(that.model, elPath) === customSetting ? that.outputSettings.isValid() : true;
    };

    decapod.pdfExportOptions.preInit = function (that) {
        /*
         * Work around for FLUID-4709
         * These methods are overwritten by the framework after initComponent executes.
         * This preInit function guarantees that functions which forward to the overwritten versions are available during the event binding phase.
         */
        that.hide = function (selector) {
            that.hide(selector);
        };
        that.show = function (selector) {
            that.show(selector);
        };
        that.showIfModelValue = function (selector, elPath, value) {
            that.showIfModelValue(selector, elPath, value);
        };
        that.disable = function () {
            that.disable();
        };
        that.enable = function () {
            that.enable();
        };
    };

    decapod.pdfExportOptions.finalInit = function (that) {
        // creates a property called isValid. Doesn't work for <IE9.
        Object.defineProperty(that, "isValid", {
            get : that.isValidImp
        });

        that.applier.modelChanged.addListener("*", function (newModel, oldModel) {
            that.events.afterModelChanged.fire(newModel, oldModel);
        });

        decapod.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.template.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
        });
    };

    fluid.defaults("decapod.pdfExportOptions", {
        gradeNames : ["decapod.viewComponentCustomMerge", "autoInit"],
        preInitFunction : "decapod.pdfExportOptions.preInit",
        finalInitFunction : "decapod.pdfExportOptions.finalInit",
        produceTree : "decapod.pdfExportOptions.produceTree",
        selectors : {
            output : ".dc-pdfExportOptions-output",
            outputSettings : ".dc-pdfExportOptions-outputSettings"
        },
        model : {
            output : {}, // in the form {selection: "", choices: [], names: []}
            outputSettings : {
                settings : [] //in the form {value: "", name: "", unit: "", attrs: {}}
            }
        },
        events : {
            afterFetchResources : null,
            afterModelChanged : null,
            afterColourRender : null,
            afterOutputRender : null,
            afterOutputSettingsRender : null,
            afterRender : {
                events : {
                    output : "afterOutputRender",
                    outputSettings : "afterOutputSettingsRender"
                },
                args : ["{pdfExportOptions}"]
            },
            onOutputReady : null,
            onOutputSettingsReady : null,
            onReady : {
                events : {
                    output : "onOutputReady",
                    outputSettings : "onOutputSettingsReady"
                },
                args : ["{pdfExportOptions}"]
            },
            onDisable : null,
            onEnable : null
        },
        invokers : {
            hide : "decapod.pdfExportOptions.hide",
            show : "decapod.pdfExportOptions.show",
            showIfModelValue : "decapod.pdfExportOptions.showIfModelValue",
            disable : "decapod.pdfExportOptions.disable",
            enable : "decapod.pdfExportOptions.enable",
            isValidImp : "decapod.pdfExportOptions.isValid"
        },
        components : {
            output : {
                type : "decapod.select",
                container : "{pdfExportOptions}.dom.output",
                createOnEvent : "afterFetchResources",
                options : {
                    model : "{pdfExportOptions}.model.output",
                    listeners : {
                        "onReady.onOutputReady" : "{pdfExportOptions}.events.onOutputReady",
                        "afterRender.afterOutputRender" : "{pdfExportOptions}.events.afterOutputRender",
                        "afterSelectionChanged.parent" : {
                            listener : "{pdfExportOptions}.applier.requestChange",
                            args : ["output.selection", "{arguments}.0"]
                        },
                        "{pdfExportOptions}.events.onDisable" : "{select}.disable",
                        "{pdfExportOptions}.events.onEnable" : "{select}.enable"
                    }
                }
            },
            outputSettings : {
                type : "decapod.outputSettings",
                createOnEvent : "afterFetchResources",
                container : "{pdfExportOptions}.dom.outputSettings",
                options : {
                    model : "{pdfExportOptions}.model.outputSettings",
                    listeners : {
                        "onReady.onOutputSettingsReady" : "{pdfExportOptions}.events.onOutputSettingsReady",
                        "afterRender.afterOutputSettingsRender" : "{pdfExportOptions}.events.afterOutputSettingsRender",
                        "afterModelChanged.parent" : {
                            listener : "{pdfExportOptions}.applier.requestChange",
                            args : ["outputSettings", "{arguments}.0"]
                        },
                        "{pdfExportOptions}.events.onDisable" : "{outputSettings}.disable",
                        "{pdfExportOptions}.events.onEnable" : "{outputSettings}.enable"
                    }
                }
            }
        },
        resources : {
            template : {
                url : "../html/pdfExportOptionsTemplate.html",
                forceCache : true
            },
            select : {
                url : "../../select/html/selectTemplate.html",
                forceCache : true
            },
            outputSettings : {
                url : "../html/outputSettingsTemplate.html",
                forceCache : true
            }
        }
    });

    /**************************
     * decapod.outputSettings *
     **************************/

    fluid.registerNamespace("decapod.outputSettings");

    /**
     * Enables the output settings by removing the "disabled" attribute
     *
     * @param {object} that, the component
     */
    decapod.outputSettings.enable = function (that) {
        var settings = fluid.copy(that.model.settings);
        $.each(settings, function (idx, setting) {
            delete setting.attrs.disabled;
        });
        that.applier.requestChange("settings", settings);
        that.refreshView();
    };

    /**
     * Disables the output settings by adding the "disabled" attribute
     *
     * @param {object} that, the component
     */
    decapod.outputSettings.disable = function (that) {
        var settings = fluid.copy(that.model.settings);
        $.each(settings, function (idx, setting) {
            setting.attrs.disabled = "disabled";
        });
        that.applier.requestChange("settings", settings);
        that.refreshView();
    };

    /**
     * Validates the input, to make sure that it is a number or string representation of a number and within a given bounds.
     *
     * @param {string, number} value, the value of the output setting should be a number or string representation of a number
     * @param {object} changeRequest, the change request object from the change applier
     * @param {object} bounds, the max and min boundary for the value
     * @param {function} failureCallback, a function to run if the value fails validation
     */
    decapod.outputSettings.intValidation = function (value, changeRequest, bounds, failureCallback) {
        var regexp = /\D/i;
        var requestedVal = parseInt(value, 10);
        var isValid = !isNaN(requestedVal) && !regexp.test(value) && requestedVal >= parseInt(bounds.min, 10) && requestedVal <= parseInt(bounds.max, 10);
        if (!isValid && typeof (failureCallback) === "function") {
            failureCallback(changeRequest, bounds);
        }
        return isValid;
    };

    /**
     * Sets up the change applier guards
     *
     * @param {object} that, the component
     */
    decapod.outputSettings.bindValidators = function (that) {
        $.each(that.model.settings, function (idx, setting) {
            var guardPath = "settings." + idx + ".value";
            that.applier.guards.addListener(guardPath, function (model, changeRequest) {
                var excess = fluid.pathUtil.getExcessPath(changeRequest.path, guardPath);
                var value = fluid.get(changeRequest.value, excess);
                return decapod.outputSettings.intValidation(value, changeRequest, setting.attrs, that.events.onValidationError.fire);
            });
        });
    };

    /**
     * Sets the status of the item located at the path specified in the change request
     *
     * @param {object} that, the component
     * @param {object} changeRequest, the change request object from the change applier
     * @param {string} status, a string representing the status of setting in the change request
     */
    decapod.outputSettings.setStatus = function (that, changeRequest, status) {
        changeRequest = fluid.isArrayable(changeRequest) ? changeRequest[0] : changeRequest;
        var index = parseInt(changeRequest.path.split(".")[1], 10);
        if (!isNaN(index)) {
            that.setStatusByIndex(index, status);
        }
    };

    /**
     * Sets the status of the item located at the index
     *
     * @param {object} that, the component
     * @param {number} index, the index of the item to set the status on
     * @param {string} status, a string representing the status of setting in the change request
     */
    decapod.outputSettings.setStatusByIndex = function (that, index, status) {
        status = !!status;
        // forces status to be boolean
        if (that.isValid(index) !== status) {
            var elm = that.locate("settings").eq(index);
            var style = that.options.styles.invalidEntry;
            that.status[index] = status;
            if (status) {
                elm.removeClass(style);
                that.events.onCorrection.fire(index);
            } else {
                elm.addClass(style);
            }
        }
    };

    /**
     * Determines if the outputSettings are in a valid state.
     * It is only valid, when all the items are in a valid state.
     * If an index is provided, it will be based only on that particular item,
     * instead of all of them.
     *
     * @param {object} that, the component
     * @param {number} index, the index of the item to check the status of
     */
    decapod.outputSettings.isValid = function (that, index) {
        if (typeof (index) === "number") {
            return that.status[index];
        }
        var status = true;
        $.each(that.status, function (idx, isValid) {
            status = isValid;
            return status;
        });

        return status;
    };

    decapod.outputSettings.preInit = function (that) {
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

        that.setStatus = function (changeRequest, status) {
            that.setStatus(changeRequest, status);
        };

        that.setStatusByIndex = function (index, status) {
            that.setStatusByIndex(index, status);
        };

        that.isValid = function (index) {
            that.isValid(index);
        };
    };

    decapod.outputSettings.finalInit = function (that) {
        that.applier.modelChanged.addListener("settings", function (newModel, oldModel, changeRequest) {
            that.events.afterModelChanged.fire(newModel, oldModel, changeRequest);
        });

        that.status = [];
        $.each(that.model.settings, function (idx) {
            that.status[idx] = true;
        });

        that.bindValidators();

        decapod.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.template.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
            that.refreshView();
        });

        that.events.onReady.fire(that);
    };

    decapod.outputSettings.produceTree = function (that) {
        return {
            expander : {
                type : "fluid.renderer.repeat",
                repeatID : "settings:",
                controlledBy : "settings",
                pathAs : "setting",
                valueAs : "settingVal",
                tree : {
                    label : "${{setting}.name}",
                    val : {
                        value : "${{setting}.value}",
                        decorators : {
                            type : "attrs",
                            attributes : "${{setting}.attrs}"
                        }
                    },
                    unit : "${{setting}.unit}",
                    errorMessage : {
                        messagekey : "exporter_outputSettings_errorMessage",
                        // Work around for FLUID-4737, passing in the arguments in the array style instead of passing in an object directly
                        args : ["{settingVal}.attrs.min", "{settingVal}.attrs.max"]

                    }
                }
            }
        };
    };

    fluid.defaults("decapod.outputSettings", {
        gradeNames : ["decapod.rendererComponentCustomMerge", "autoInit"],
        preInitFunction : "decapod.outputSettings.preInit",
        finalInitFunction : "decapod.outputSettings.finalInit",
        produceTree : "decapod.outputSettings.produceTree",
        selectors : {
            settings : ".dc-outputSettings-settings",
            label : ".dc-outputSettings-label",
            val : ".dc-outputSettings-value",
            unit : ".dc-outputSettings-unit",
            errorMessage : ".dc-outputSettings-errorMessage"
        },
        repeatingSelectors : ["settings"],
        model : {
            settings : [] //in the form {value: "", name: "", unit: "", attrs: {}}
        },
        styles : {
            invalidEntry : "ds-outputSettings-invalidEntry"
        },
        events : {
            afterFetchResources : null,
            afterModelChanged : null,
            onValidationError : null,
            onCorrection : null,
            onReady : null
        },
        listeners : {
            "onValidationError.setStatus" : {
                listener : "{outputSettings}.setStatus",
                args : ["{arguments}.0", false]
            },
            "afterModelChanged.setStatus" : {
                listener : "{outputSettings}.setStatus",
                args : ["{arguments}.2", true]
            }
        },
        invokers : {
            disable : "decapod.outputSettings.disable",
            enable : "decapod.outputSettings.enable",
            bindValidators : "decapod.outputSettings.bindValidators",
            setStatus : "decapod.outputSettings.setStatus",
            setStatusByIndex : "decapod.outputSettings.setStatusByIndex",
            isValid : "decapod.outputSettings.isValid"
        },
        resources : {
            template : {
                url : "../html/outputSettingsTemplate.html",
                forceCache : true
            }
        }
    });

    /**************************
     * decapod.exportControls *
     **************************/

    fluid.registerNamespace("decapod.exportControls");

    decapod.exportControls.produceTree = function (that) {
        return {
            expander : [{
                type : "fluid.renderer.condition",
                condition : that.model.showExportStart,
                trueTree : {
                    trigger : {
                        decorators : {
                            type : "fluid",
                            func : "decapod.exportControls.trigger"
                        }
                    }
                }
            }, {
                type : "fluid.renderer.condition",
                condition : that.model.showExportError,
                trueTree : {
                    exportError : {
                        decorators : {
                            type : "fluid",
                            func : "decapod.status",
                            options : {
                                model : {
                                    currentStatus : "EXPORT_ERROR",
                                    "EXPORT_ERROR" : {
                                        name : decapod.globalMessages.exporter_imageExportStatus_exportError_name,
                                        description : decapod.globalMessages.exporter_imageExportStatus_exportError_description,
                                        style : "ds-exporter-status-error"
                                    }
                                }
                            }
                        }
                    }
                }
            }, {
                type : "fluid.renderer.condition",
                condition : that.model.showFileError,
                trueTree : {
                    fileError : {
                        decorators : {
                            type : "fluid",
                            func : "decapod.status",
                            options : {
                                model : {
                                    currentStatus : "FILES_IGNORED",
                                    "FILES_IGNORED": {
                                        name : decapod.globalMessages.exporter_imageExportStatus_filesIgnored_name,
                                        description : decapod.globalMessages.exporter_imageExportStatus_filesIgnored_description,
                                        style : "ds-exporter-status-error"
                                    }
                                }
                            }
                        }
                    }
                }
            }, {
                type : "fluid.renderer.condition",
                condition : that.model.showExportProgress,
                trueTree : {
                    progress : {
                        decorators : {
                            type : "fluid",
                            func : "decapod.exportControls.progress"
                        }
                    }
                }
            }, {
                type : "fluid.renderer.condition",
                condition : that.model.showExportComplete,
                trueTree : {
                    complete : {
                        decorators : {
                            type : "fluid",
                            func : "decapod.exportControls.complete"
                        }
                    }
                }
            }]
        };
    };

    /**
     * Requests a change to the model at the provided path, with the given value.
     *
     * @param {object} that, the component
     * @param {string} modelPath, an EL Path into the model
     * @param {object} value, the value to set
     */
    decapod.exportControls.updateModel = function (that, modelPath, value) {
        that.applier.requestChange(modelPath, value);
    };
    
    decapod.exportControls.addAria = function (that) {
        that.container.attr("aria-live", "polite");
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
        
        that.addAria = function () {
            that.addAria();
        };
    };

    decapod.exportControls.finalInit = function (that) {
        that.addAria();
        
        that.applier.modelChanged.addListener("*", function (newModel, oldModel) {
            that.events.afterModelChanged.fire(newModel, oldModel);
        });

        decapod.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.controls.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
        });

        that.events.onReady.fire(that);
    };

    fluid.defaults("decapod.exportControls", {
        gradeNames : ["decapod.rendererComponentCustomMerge", "autoInit"],
        finalInitFunction : "decapod.exportControls.finalInit",
        preInitFunction : "decapod.exportControls.preInit",
        produceTree : "decapod.exportControls.produceTree",
        selectors : {
            trigger : ".dc-exportControls-trigger",
            progress : ".dc-exportControls-progress",
            complete : ".dc-exportControls-complete",
            exportError : ".dc-exportControls-exportError",
            fileError : ".dc-exportControls-fileError"
        },
        events : {
            afterFetchResources : null,
            afterModelChanged : null,
            onExportTrigger : null,
            onReady : null
        },
        listeners : {
            "afterModelChanged.refreshView" : "{exportControls}.refreshView",
            "afterFetchResources.render" : "{exportControls}.initialRender",
            "onExportTrigger.updateModel" : {
                listener : "{exportControls}.updateModel",
                args : [{
                    showExportStart : false,
                    showExportError : false,
                    showFileError: false,
                    showExportProgress : true,
                    showExportComplete : false,
                    fileError: "{exportControls}.model.fileError"
                }]
            }
        },
        model : {
            showExportStart : true,
            showExportError : false,
            showFileError: false,
            showExportProgress : false,
            showExportComplete : false,
            fileError: false,
            downloadURL : ""
        },
        invokers : {
            updateModel : "decapod.exportControls.updateModel",
            addAria: "decapod.exportControls.addAria"
        },
        resources : {
            controls : {
                url : "../html/exportControlsTemplate.html",
                forceCache : true
            },
            trigger : {
                url : "../html/exportControlsTriggerTemplate.html",
                forceCache : true
            },
            progress : {
                url : "../html/exportControlsProgressTemplate.html",
                forceCache : true
            },
            complete : {
                url : "../html/exportControlsCompleteTemplate.html",
                forceCache : true
            }
        }
    });

    /**********************************
     * decapod.exportControls.trigger *
     **********************************/

    fluid.registerNamespace("decapod.exportControls.trigger");

    /**
     * Determines if the conditions all pass (are all true)
     *
     * @param {object} model, the components model
     */
    decapod.exportControls.trigger.assertState = function (model) {
        var conditions = true;

        $.each(model, function (idx, condition) {
            if (!condition) {
                conditions = condition;
                return false;
            }
        });

        return conditions;
    };

    decapod.exportControls.trigger.produceTree = function (that) {
        return {
            expander : [{
                type : "fluid.renderer.condition",
                condition : {
                    funcName : "decapod.exportControls.trigger.assertState",
                    args : [that.model]
                },
                falseTree : {
                    trigger : {
                        messagekey : "exporter_exportControls_trigger_trigger",
                        decorators : {
                            type : "attrs",
                            attributes : {
                                disabled : "disabled"
                            }
                        }
                    }
                },
                trueTree : {
                    trigger : {
                        messagekey : "exporter_exportControls_trigger_trigger",
                        decorators : [{
                            type : "jQuery",
                            func : "click",
                            args : function () {
                                that.events.afterTriggered.fire();
                            }
                        }]
                    }
                }
            }]
        };
    };

    /**
     * Requests a change to a condition in the model
     *
     * @param {object} that, the component
     * @param {string} condition, the condition to change the status of in the model
     * @param {boolean} status, the value to set
     */
    decapod.exportControls.trigger.updateModel = function (that, condition, status) {
        that.applier.requestChange(condition, status);
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
        that.updateModel = function (condition, status) {
            that.updateModel(condition, status);
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

        that.events.onReady.fire(that);
    };

    /**
     * Displays the exporter trigger control, likely a button, if and only if there are
     * no false conditions. Conditions determine whether or not the trigger should be
     * enabled. For example there may be a condition for when inputs are invalid or
     * requirements not met.
     */
    fluid.defaults("decapod.exportControls.trigger", {
        gradeNames : ["decapod.rendererComponentCustomMerge", "autoInit"],
        preInitFunction : "decapod.exportControls.trigger.preInit",
        finalInitFunction : "decapod.exportControls.trigger.finalInit",
        produceTree : "decapod.exportControls.trigger.produceTree",
        selectors : {
            trigger : ".dc-exportControls-trigger-exportControl"
        },
        events : {
            afterFetchResources : null,
            afterModelChanged : null,
            afterTriggered : null,
            onReady : null
        },
        listeners : {
            "afterModelChanged.internal" : "{trigger}.refreshView"
        },
        model : {}, // in the form, {condition: boolean}
        invokers : {
            updateModel : "decapod.exportControls.trigger.updateModel"
        },
        resources : {
            template : {
                url : "../html/exportControlsTriggerTemplate.html",
                forceCache : true
            }
        }
    });

    /***********************************
     * decapod.exportControls.progress *
     ***********************************/

    fluid.registerNamespace("decapod.exportControls.progress");

    decapod.exportControls.progress.produceTree = function (that) {
        return {
            message : {
                messagekey : "exporter_exportControls_progress_message"
            },
            warning: {
                messagekey: "exporter_exportControls_progress_warning"
            }
        };
    };
    
    decapod.exportControls.progress.addAria = function (that) {
        that.container.attr({
            "role": "progressbar",
            "aria-valuemin": 0,
            "aria-valuemax": 100
        });
    };

    decapod.exportControls.progress.finalInit = function (that) {
        that.addAria();
        
        decapod.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.template.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
            that.refreshView();
        });

        that.events.onReady.fire(that);
    };

    fluid.defaults("decapod.exportControls.progress", {
        gradeNames : ["decapod.rendererComponentCustomMerge", "autoInit"],
        finalInitFunction : "decapod.exportControls.progress.finalInit",
        produceTree : "decapod.exportControls.progress.produceTree",
        selectors : {
            message : ".dc-exportControls-progress-message",
            warning: ".dc-exportControls-warning"
        },
        events : {
            afterFetchResources : null,
            onReady : null
        },
        invokers: {
            addAria: "decapod.exportControls.progress.addAria"
        },
        resources : {
            template : {
                url : "../html/exportControlsProgressTemplate.html",
                forceCache : true
            }
        }
    });

    /*******************************************
     * decapod.exportControls.detailedProgress *
     *******************************************/

    fluid.registerNamespace("decapod.exportControls.detailedProgress");

    /**
     * Requests a change to the current stage in the model.
     *
     * @param {object} that, the component
     * @param {string} stage, the stage to set as the currentStage in the model
     */
    decapod.exportControls.detailedProgress.update = function (that, stage) {
        that.applier.requestChange("currentStage", stage);
    };

    /**
     * Updates the progress. It will convert the stage name to a number and calculate the percentage complete.
     * Note that the steps are 1 based indexes.
     *
     * @param {object} that, the component
     */
    decapod.exportControls.detailedProgress.setProgress = function (that) {
        var index = $.inArray(that.model.currentStage, that.model.stages);
        if (index >= 0) {
            var numStages = that.model.stages.length;
            var percentage = (index / numStages) * 100;
            that.progress.update(percentage, fluid.stringTemplate(that.options.strings.inProgressMessage, {
                step : ++index,
                steps : numStages
            }));
            // index is incremented to make it start at 1 instead of 0.
        }
    };

    /**
     * Sets the completed state for the progress
     *
     * @param {object} that, the component
     * @param {boolean}, if truthy, it will trigger the progress to hide.
     */
    decapod.exportControls.detailedProgress.finish = function (that, hide) {
        that.progress.update(100, that.options.strings.completeProgressMessage);
        if (hide) {
            that.progress.hide();
        }
    };

    decapod.exportControls.detailedProgress.preInit = function (that) {
        /*
         * Work around for FLUID-4709
         * These methods are overwritten by the framework after initComponent executes.
         * This preInit function guarantees that functions which forward to the overwritten versions are available during the event binding phase.
         */
        that.update = function (stage) {
            that.update(stage);
        };

        that.setProgress = function () {
            that.setProgress();
        };

        that.finish = function (hide) {
            that.finish(hide);
        };
    };

    decapod.exportControls.detailedProgress.finalInit = function (that) {
        that.applier.modelChanged.addListener("currentStage", function (newModel, oldModel, index) {
            that.events.afterModelChanged.fire(newModel, oldModel, $.inArray(newModel.currentStage, newModel.stages));
        });

        that.applier.guards.addListener("currentStage", function (model, changeRequest) {
            return $.inArray(changeRequest.value, model.stages) >= 0;
        });

        decapod.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.template.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
            that.progress.locate("label").text(that.options.strings.initialProgressMessage);
            that.events.onReady.fire(that);
        });
    };

    fluid.defaults("decapod.exportControls.detailedProgress", {
        gradeNames : ["decapod.viewComponentCustomMerge", "autoInit"],
        preInitFunction : "decapod.exportControls.detailedProgress.preInit",
        finalInitFunction : "decapod.exportControls.detailedProgress.finalInit",
        selectors : {
            progress : ".dc-exportControls-detailedProgress-progress",
            warning: ".dc-exportControls-warning"
        },
        strings : {
            initialProgressMessage : decapod.globalMessages.exporter_exportControls_detailedProgress_initialProgressMessage,
            inProgressMessage : decapod.globalMessages.exporter_exportControls_detailedProgress_inProgressMessage,
            completeProgressMessage : decapod.globalMessages.exporter_exportControls_detailedProgress_completeProgressMessage,
            warning: decapod.globalMessages.exporter_exportControls_detailedProgress_warning
        },
        events : {
            afterFetchResources : null,
            afterModelChanged : null,
            onReady : null
        },
        listeners : {
            afterModelChanged : {
                listener : "{detailedProgress}.setProgress"
            }
        },
        model : {
            stages : [],
            currentStage : ""
        },
        invokers : {
            update : "decapod.exportControls.detailedProgress.update",
            setProgress : "decapod.exportControls.detailedProgress.setProgress",
            finish : "decapod.exportControls.detailedProgress.finish"
        },
        components : {
            progress : {
                type : "fluid.progress",
                createOnEvent : "afterFetchResources",
                container : "{detailedProgress}.dom.progress",
                options : {
                    selectors : {
                        displayElement : "{detailedProgress}.dom.progress"
                    },
                    strings : {
                        ariaDoneText : decapod.globalMessages.exporter_exportControls_detailedProgress_completeProgressMessage
                    },
                    initiallyHidden : false,
                    listeners: {
                        "onAttach": {
                            listener: function (that) {
                                that.locate("warning").text(that.options.strings.warning);
                            },
                            args: ["{detailedProgress}"]
                        }
                    }
                }
            }
        },
        resources : {
            template : {
                url : "../html/exportControlsDetailedProgressTemplate.html",
                forceCache : true
            }
        }
    });

    /***********************************
     * decapod.exportControls.complete *
     ***********************************/

    fluid.registerNamespace("decapod.exportControls.complete");

    /**
     * Requests a change to the download url in the model.
     *
     * @param {object} that, the component
     * @param {string} url, the url to set the model's downloadURL to
     */
    decapod.exportControls.complete.updateModel = function (that, url) {
        that.applier.requestChange("downloadURL", url);
    };

    decapod.exportControls.complete.produceTree = function (that) {
        return {
            download : {
                linktext : {
                    messagekey : "exporter_exportControls_complete_download"
                },
                target : "${downloadURL}",
                decorators: {
                    type: "attrs",
                    attributes: {
                        target: "_new"
                    }
                }
            },
            restart : {
                messagekey : "exporter_exportControls_complete_restart"
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

        that.events.onReady.fire(that);
    };

    fluid.defaults("decapod.exportControls.complete", {
        gradeNames : ["decapod.rendererComponentCustomMerge", "autoInit"],
        finalInitFunction : "decapod.exportControls.complete.finalInit",
        produceTree : "decapod.exportControls.complete.produceTree",
        invokers : {
            updateModel : "decapod.exportControls.complete.updateModel"
        },
        selectors : {
            download : ".dc-exportControls-complete-download",
            restart : ".dc-exportControls-complete-restart"
        },
        events : {
            afterModelChanged : null,
            afterFetchResources : null,
            onReady : null
        },
        model : {
            downloadURL : ""
        },
        resources : {
            template : {
                url : "../html/exportControlsCompleteTemplate.html",
                forceCache : true
            }
        }
    });
})(jQuery);

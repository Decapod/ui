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

    "use strict";

    /*********************
     *  decapod.stereo *
     *********************/

    fluid.defaults("decapod.stereo", {
        gradeNames: ["autoInit", "fluid.rendererComponent"],
        finalInitFunction: "decapod.stereo.finalInit",
        preInitFunction: "decapod.stereo.preInit",
        selectors: {
            title: ".dc-stereo-title",
            help: ".dc-stereo-help",
            start: ".dc-stereo-start",
            browse: ".dc-stereo-browse",
            status: ".dc-stereo-status"
        },
        components: {
            processSource: {
                type: "decapod.dataSource",
                options: {
                    url: "{decapod.stereo}.options.urls.process",
                    events: {
                        putSuccess: "{decapod.stereo}.events.onProcessStartSuccess",
                        putError: "{decapod.stereo}.events.onProcessStartError",
                        getSuccess: "{decapod.stereo}.events.onProcessProgressSuccess",
                        getError: "{decapod.stereo}.events.onProcessError"
                    }
                }
            },
            start: {
                type: "decapod.button",
                createOnEvent: "afterRender",
                container: "{decapod.stereo}.dom.start",
                options: {
                    strings: {
                        label: "{decapod.stereo}.options.strings.start"
                    },
                    model: {
                        "state": "disabled"
                    },
                    listeners: {
                        onClick: [{
                            listener: "{start}.setState",
                            args: ["disabled"]
                        }, "{decapod.stereo}.events.onProcessStart.fire"],
                        "{decapod.stereo}.events.onUploadSuccess": {
                            listener: "{start}.setState",
                            args: ["enabled"]
                        },
                        "{decapod.stereo}.events.onProcessStartError": {
                            listener: "{start}.setState",
                            args: ["enabled"]
                        },
                        "{decapod.stereo}.events.onProcessError": {
                            listener: "{start}.setState",
                            args: ["enabled"]
                        }
                    }
                }
            },
            status: {
                type: "decapod.stereo.status",
                createOnEvent: "afterRender",
                container: "{decapod.stereo}.dom.status",
                options: {
                    events: {
                        hideInitial: "{decapod.stereo}.events.onFileSelected",
                        statusUpdated: "{decapod.stereo}.events.statusUpdated"
                    }
                }
            }
        },
        selectorsToIgnore: ["start", "status"],
        protoTree: {
            title: {
                messagekey: "title"
            },
            help: {
                target: "${help}",
                linktext: {
                    messagekey: "help"
                },
                decorators: {
                    type: "attrs",
                    attributes: {
                        target: "_new"
                    }
                }
            },
            browse: {
                decorators: {
                    type: "fluid",
                    func: "decapod.stereo.browse"
                }
            }
        },
        model: {
            help: "help.html"
        },
        strings: {
            help: "Help",
            title: "",
            start: "",
            browse: "Browse Files",
            complete: "",
            download: "Download",
            startOver: "Start Over",
            working: "Working...",
            ready: "",
            progress: ""
        },
        resources: {
            template: {
                url: "../../core/html/stereoTemplate.html",
                forceCache: true,
                options: {
                    dataType: "html"
                }
            }
        },
        nickName: "decapod.stereo",
        events: {
            onFileSelected: null,
            statusUpdated: null,
            onUploadStart: null,
            onUploadSuccess: null,
            onUploadError: null,
            onProcessStart: null,
            onProcessStartError: null,
            onProcessStartSuccess: null,
            onProcessError: null,
            onProcessProgressSuccess: null
        },
        listeners: {
            onProcessStart: [{
                listener: "{that}.events.statusUpdated.fire",
                args: ["{decapod.stereo}.options.statuses.working"]
            }, "{that}.startProcess"],
            onUploadStart: {
                listener: "{that}.events.statusUpdated.fire",
                args: ["{that}.options.statuses.working"]
            },
            onUploadSuccess: {
                listener: "{that}.events.statusUpdated.fire",
                args: ["{that}.options.statuses.uploadSuccess", "{arguments}.0"]
            },
            onUploadError: {
                listener: "{that}.events.statusUpdated.fire"
            },
            onProcessStartError: {
                listener: "{that}.events.statusUpdated.fire"
            },
            onProcessError: {
                listener: "{that}.events.statusUpdated.fire"
            },
            onProcessStartSuccess: {
                listener: "{processSource}.get",
                args: [null]
            },
            onProcessProgressSuccess: {
                listener: "{that}.processProgress",
                args: ["{arguments}.0"]
            }
        },
        statuses: {
            uploadSuccess: "",
            working: "WORKING",
            processing: "",
            complete: "COMPLETE"
        },
        urls: {
            upload: "",
            process: "",
            startOver: ""
        }
    });

    fluid.defaults("decapod.dewarper", {
        gradeNames: ["decapod.stereo", "autoInit"]
    });

    fluid.defaults("decapod.calibrator", {
        gradeNames: ["decapod.stereo", "autoInit"]
    });

    decapod.stereo.preInit = function (that) {
        that.nickName = "decapod.stereo";
        that.startProcess = function () {
            that.processSource.put();
        };
        that.processProgress = function (response) {
            var status = response.status === "complete" ?
                that.options.statuses.complete :
                that.options.statuses.processing;
            that.events.statusUpdated.fire(status, response);
        };
    };
    
    decapod.stereo.finalInit = function (that) {
        decapod.fetchResources(that.options.resources, function () {
            that.refreshView();
        });
    };

    fluid.fetchResources.primeCacheFromResources("decapod.stereo");

    fluid.defaults("decapod.stereo.status", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        renderOnInit: true,
        preInitFunction: "decapod.stereo.status.preInit",
        strings: {
            initialMessage: "Select \"Browse Files\" button to choose archive."
        },
        selectors: {
            initialMessage: ".dc-stereo-status-initialMessage",
            message: ".dc-stereo-status-message"
        },
        selectorsToIgnore: "message",
        events: {
            hideInitial: null,
            statusUpdated: null
        },
        listeners: {
            hideInitial: {
                listener: "{that}.hideInitialMessage"
            },
            statusUpdated: {
                listener: "{that}.onStatusUpdated",
                priority: "first"
            }
        },
        components: {
            message: {
                type: "decapod.stereo.status.message",
                container: "{decapod.stereo.status}.dom.message",
                createOnEvent: "statusUpdated"
            }
        },
        protoTree: {
            initialMessage: {
                messagekey: "initialMessage"
            }
        }
    });

    decapod.stereo.status.preInit = function (that) {
        that.hideInitialMessage = function () {
            that.locate("initialMessage").hide();
        };
        that.onStatusUpdated = function (status, response) {
            that.response = response;
            that.options.components.message.type =
                fluid.model.composeSegments("decapod.stereo.status.message",
                    status);
        };
    };

    fluid.defaults("decapod.stereo.browse", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        preInitFunction: "decapod.stereo.browse.preInit",
        selectors: {
            browseLabel: ".dc-stereo-browseLabel",
            browseInput: ".dc-stereo-browseInput"
        },
        strings: {
            browse: "{decapod.stereo}.options.strings.browse"
        },
        listeners: {
            "{decapod.stereo}.events.onProcessStart": "{that}.disable",
            "{decapod.stereo}.events.onProcessStartError": "{that}.enable",
            "{decapod.stereo}.events.onProcessError": "{that}.enable"
        },
        protoTree: {
            browseLabel: {
                messagekey: "browse"
            },
            browseInput: {
                decorators: {
                    type: "fluid",
                    func: "decapod.stereo.browse.input"
                }
            }
        },
        renderOnInit: true
    });

    decapod.stereo.browse.preInit = function (that) {
        that.enable = function () {
            that.container.removeAttr("disabled");
        };
        that.disable = function () {
            that.container.attr("disabled", "disabled");
        };
    };

    fluid.defaults("decapod.stereo.browse.input", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        postInitFunction: "decapod.stereo.browse.input.postInit",
        preInitFunction: "decapod.stereo.browse.input.preInit",
        events: {
            onFileSelected: "{decapod.stereo}.events.onFileSelected",
            onStart: "{decapod.stereo}.events.onUploadStart",
            onSuccess: "{decapod.stereo}.events.onUploadSuccess",
            onError: "{decapod.stereo}.events.onUploadError"
        },
        listeners: {
            onFileSelected: [
                "{that}.events.onStart.fire",
                "{that}.upload"
            ],
            onStart: "{decapod.stereo.browse}.disable",
            onError: "{decapod.stereo.browse}.enable",
            onSuccess: "{decapod.stereo.browse}.enable"
        },
        url: "{decapod.stereo}.options.urls.upload"
    });

    decapod.stereo.browse.input.preInit = function (that) {
        that.upload = function () {
            var data = new FormData();
            data.append("file", that.file);
            $.ajax({
                url: that.options.url,
                type: "PUT",
                cache: false,
                contentType: false,
                processData: false,
                data: data,
                dataType: "json",
                success: function (response) {
                    that.events.onSuccess.fire(response);   
                },
                error: function (xhr) {
                    var error = JSON.parse(xhr.responseText);
                    that.events.onError.fire("ERROR", error);
                }
            });
        };
    };

    decapod.stereo.browse.input.postInit = function (that) {
        that.container.change(function () {
            that.file = this.files[0];
            that.events.onFileSelected.fire();
        });
    };

})(jQuery);
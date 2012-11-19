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
/*global decapod:true, fluid*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function () {

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
                    listeners: {
                        "{decapod.stereo}.events.onFileSelected": {
                            listener: "{decapod.stereo.status}.events.hideInitial.fire",
                            priority: "first"
                        }
                    },
                    events: {
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
            help: "#"
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
            progress: "",
            BAD_ZIP: "Selected file does not seem to be an archive.",
            NO_STEREO_IMAGES: "Selected archive does not appear to have stereo images.",
            NOT_ENOUGH_IMAGES: "No enough calibration images.",
            error: "Unknown Error"
        },
        resources: {
            template: {
                url: "../../core/html/stereoTemplate.html",
                forceCache: true,
                fetchClass: "template",
                options: {
                    dataType: "html"
                }
            }
        },
        nickName: "decapod.stereo",
        events: {
            statusUpdated: null,

            onFileSelected: null,
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
            onProcessStartError: {
                listener: "{that}.events.statusUpdated.fire"
            },
            onProcessError: {
                listener: "{that}.processError"
            },
            onProcessStartSuccess: {
                listener: "{processSource}.get",
                args: [null]
            },
            onProcessProgressSuccess: {
                listener: "{that}.processProgress",
                args: ["{arguments}.0"]
            },
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
            }
        },
        statuses: {
            uploadSuccess: "",
            working: "WORKING",
            processing: "",
            error: "ERROR",
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
        that.processError = function (xhr) {
            var error = JSON.parse(xhr.responseText);
            that.events.statusUpdated.fire(that.options.statuses.error, error);
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
        }, {amalgamateClasses: ["template"]});
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

})();
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
     *  decapod.stereo.status.message *
     *********************/

    fluid.registerNamespace("decapod.stereo.status");

    fluid.defaults("decapod.stereo.status.spinner", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        postInitFunction: "decapod.stereo.status.spinner.postInit",
        styles: {
            spinner: "ds-shared-spinner",
            outerCircle: "ds-shared-spinner-outerCircle",
            innerCircle: "ds-shared-spinner-innerCircle",
            dot: "ds-shared-spinner-dot"
        }
    });

    decapod.stereo.status.spinner.postInit = function (that) {
        var styles = that.options.styles,
            spinner = $("<div></div>").addClass(styles.outerCircle)
                .after($("<div></div>").addClass(styles.innerCircle))
                .after($("<div></div>").addClass(styles.dot))
                .wrapAll($("<div></div>").addClass(styles.spinner))
                .parent("div");
        that.container.prepend(spinner);
    };

    fluid.defaults("decapod.stereo.status.progress", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        postInitFunction: "decapod.stereo.status.progress.postInit",
        model: {
            value: "{decapod.stereo.status}.response.captureIndex",
            max: "{decapod.stereo.status}.response.numCaptures"
        },
        strings: {
            valuetext: "{decapod.stereo}.options.strings.progress"
        },
        styles: {
            progress: "ds-stereo-progress",
        }
    });

    decapod.stereo.status.progress.postInit = function (that) {
        var model = that.model,
            progress = $("<progress></progress>")
                .addClass(that.options.styles.progress)
                .attr(model)
                .attr({
                    "role": "progressbar",
                    "aria-valuenow": model.value,
                    "aria-valuemax": model.max,
                    "aria-valuemin": 0,
                    "aria-valuetext": fluid.stringTemplate(
                        that.options.strings.valuetext, model)
                    }
                );
        that.container.prepend(progress);
    };

    fluid.defaults("decapod.stereo.status.message", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        preInitFunction: "decapod.stereo.status.message.preInit",
        selectors: {
            text: ".dc-stereo-status-message-text",
            startOver: ".dc-stereo-status-message-startOver",
            download: ".dc-stereo-status-message-download"
        },
        styles: {
            text: "ds-stereo-status-message-text"
        },
        strings: {
            text: ""
        },
        renderOnInit: true,
        protoTree: {
            text: {
                messagekey: "text",
                decorators: {
                    type: "fluid",
                    func: "decapod.stereo.status.message.decorator"
                }
            }
        },
        nickName: "decapod.stereo.status.message",
        resources: {
            template: {
                url: "../../core/html/messageTemplate.html",
                forceCache: true,
                options: {
                    dataType: "html"
                }
            }
        }
    });

    fluid.fetchResources.primeCacheFromResources("decapod.stereo.status.message");

    fluid.defaults("decapod.stereo.status.message.decorator", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        postInitFunction: "decapod.stereo.status.message.decorator.postInit",
        styles: {
            text: "{decapod.stereo.status.message}.options.styles.text"
        }
    });

    decapod.stereo.status.message.decorator.postInit = function (that) {
        that.container
            .addClass(that.options.styles.text)
            .attr("role", "status");
    };

    decapod.stereo.status.message.preInit = function (that) {
        that.nickName = "decapod.stereo.status.message";
    };

    fluid.defaults("decapod.stereo.status.message.ERROR", {
        gradeNames: ["decapod.stereo.status.message", "autoInit"],
        strings: {
            text: "{decapod.stereo.status}.response.msg"
        }
    });

    fluid.defaults("decapod.stereo.status.message.COMPLETE", {
        gradeNames: ["decapod.stereo.status.message", "autoInit"],
        strings: {
            text: "{decapod.stereo}.options.strings.complete",
            startOver: "{decapod.stereo}.options.strings.startOver",
            download: "{decapod.stereo}.options.strings.download"
        },
        styles: {
            startOver: "ds-stereo-status-message-startOver",
            download: "ds-stereo-status-message-download"
        },
        model: {
            startOver: "{decapod.stereo}.options.urls.startOver",
            download: "{decapod.stereo.status}.response.url"
        },
        protoTree: {
            text: {
                messagekey: "text",
                decorators: {
                    type: "fluid",
                    func: "decapod.stereo.status.message.decorator"
                }
            },
            startOver: {
                target: "${startOver}",
                linktext: {
                    messagekey: "startOver"
                },
                decorators: {"addClass": "{styles}.startOver"}
            },
            download: {
                target: "${download}",
                linktext: {
                    messagekey: "download"
                },
                decorators: {"addClass": "{styles}.download"}
            }
        }
    });

    fluid.defaults("decapod.stereo.status.message.WORKING", {
        gradeNames: ["decapod.stereo.status.message", "autoInit"],
        strings: {
            text: "{decapod.stereo}.options.strings.working"
        },
        protoTree: {
            text: {
                messagekey: "text",
                decorators: [{
                    type: "fluid",
                    func: "decapod.stereo.status.message.decorator"
                }, {
                    type: "fluid",
                    func: "decapod.stereo.status.spinner"
                }]
            }
        }
    });

    fluid.defaults("decapod.stereo.status.message.processing", {
        gradeNames: ["decapod.stereo.status.message", "autoInit"],
        components: {
            processSource: "{processSource}"
        },
        delay: 2000,
        finalInitFunction: "decapod.stereo.status.message.processing.finalInit"
    });

    decapod.stereo.status.message.processing.finalInit = function (that) {
        setTimeout(function () {
            that.processSource.get();
        }, that.options.delay);
    };

    fluid.defaults("decapod.stereo.status.message.DEWARPING", {
        gradeNames: ["decapod.stereo.status.message.processing", "autoInit"],
        model: {
            value: "{decapod.stereo.status}.response.captureIndex",
            max: "{decapod.stereo.status}.response.numCaptures"
        },
        strings: {
            text: "{decapod.stereo}.options.strings.progress"
        },
        protoTree: {
            text: {
                messagekey: "text",
                args: {
                    value: "${value}",
                    max: "${max}"
                },
                decorators: [{
                    type: "fluid",
                    func: "decapod.stereo.status.message.decorator"
                }, {
                    type: "fluid",
                    func: "decapod.stereo.status.progress"
                }]
            }
        }
    });

    fluid.defaults("decapod.stereo.status.message.WORKING_CALIBRATION", {
        gradeNames: ["decapod.stereo.status.message.WORKING",
            "decapod.stereo.status.message.processing", "autoInit"]
    });

    fluid.defaults("decapod.stereo.status.message.READY_TO_CALIBRATE", {
        gradeNames: ["decapod.stereo.status.message", "autoInit"],
        strings: {
            text: "{decapod.stereo}.options.strings.ready"
        }
    });

    fluid.defaults("decapod.stereo.status.message.CAPTURES_FOUND", {
        gradeNames: ["decapod.stereo.status.message", "autoInit"],
        model: {
            captures: "{decapod.stereo.status}.response.numCaptures"
        },
        strings: {
            text: "{decapod.stereo}.options.strings.ready"
        },
        protoTree: {
            text: {
                messagekey: "text",
                args: {
                    captures: "${captures}"
                },
                decorators: [{
                    type: "fluid",
                    func: "decapod.stereo.status.message.decorator"
                }]
            }
        }
    });

})(jQuery);
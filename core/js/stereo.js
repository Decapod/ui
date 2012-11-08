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
                    listeners: {}
                }
            },
            status: {
                type: "decapod.stereo.status",
                createOnEvent: "afterRender",
                container: "{decapod.stereo}.dom.status"
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
            browse: "Browse Files"
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
            onFileSelected: null
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
    };
    
    decapod.stereo.finalInit = function (that) {
        decapod.fetchResources(that.options.resources, function (resourceSpec) {
           that.refreshView();
       });
    };

    fluid.fetchResources.primeCacheFromResources("decapod.stereo");

    fluid.defaults("decapod.stereo.status", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        renderOnInit: true,
        strings: {
            initialMessage: "Select \"Browse Files\" button to choose archive."
        },
        selectors: {
            initialMessage: ".dc-stereo-status-initialMessage",
            message: ".dc-stereo-status-message"
        },
        protoTree: {
            initialMessage: {
                messagekey: "initialMessage"
            },
            message: {
                decorators: {
                    type: "fluid",
                    func: "decapod.stereo.status.message"
                }
            }
        }
    });

    fluid.defaults("decapod.stereo.status.message", {
        gradeNames: ["fluid.rendererComponent", "autoInit"]
    });
    
    fluid.defaults("decapod.stereo.browse", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        selectors: {
            browseLabel: ".dc-stereo-browseLabel",
            browseInput: ".dc-stereo-browseInput"
        },
        strings: {
            browse: "{decapod.stereo}.options.strings.browse"
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

    fluid.defaults("decapod.stereo.browse.input", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        postInitFunction: "decapod.stereo.browse.input.postInit",
        events: {
            onFileSelected: "{decapod.stereo}.events.onFileSelected"
        },
        url: ""
    });

    decapod.stereo.browse.input.postInit = function (that) {
        that.container.change(function () {
            that.events.onFileSelected.fire(this.files);
        });
    };

})(jQuery);
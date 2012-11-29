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
/*global FormData, decapod:true, fluid, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {

    "use strict";

    /*********************
     *  decapod.stereo.browse *
     *********************/

    fluid.registerNamespace("decapod.stereo");

    fluid.defaults("decapod.stereo.browse", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        preInitFunction: "decapod.stereo.browse.preInit",
        finalInitFunction: "decapod.stereo.browse.finalInit",
        selectors: {
            button: ".dc-stereo-button",
            browseMessage: ".dc-stereo-browseMessage",
            browseLabel: ".dc-stereo-browseLabel",
            browseInput: ".dc-stereo-browseInput"
        },
        selectorsToIgnore: "button",
        styles: {
            browseMessage: "ds-stereo-browseMessage"
        },
        strings: {
            browse: "{decapod.stereo}.options.strings.browse"
        },
        listeners: {
            "{decapod.stereo}.events.onProcessStart": "{that}.disable",
            "{decapod.stereo}.events.onProcessStartError": "{that}.enable",
            "{decapod.stereo}.events.onProcessError": "{that}.enable"
        },
        disabledOnInit: false,
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
        resources: {
            template: {
                url: "../../core/html/browseTemplate.html",
                forceCache: true,
                fetchClass: "template",
                options: {
                    dataType: "html"
                }
            }
        },
        renderOnInit: true,
        url: "{decapod.stereo}.options.urls.upload",
        nickName: "decapod.stereo.browse"
    });

    fluid.fetchResources.primeCacheFromResources("decapod.stereo.browse");

    fluid.defaults("decapod.stereo.browse.local", {
        gradeNames: ["decapod.stereo.browse", "autoInit"],
        url: "../../mock-data/calibrate/mockImages.json"
    });

    fluid.defaults("decapod.stereo.browse.captures", {
        gradeNames: ["autoInit", "decapod.stereo.browse"],
        strings: {
            browseMessage: "{decapod.stereo}.options.strings.step1"
        },
        url: "{decapod.stereo}.options.urls.uploadCaptures",
        protoTree: {
            browseMessage: {
                messagekey: "browseMessage",
                decorators: {addClass: "{styles}.browseMessage"}
            },
            browseLabel: {
                messagekey: "browse"
            },
            browseInput: {
                decorators: {
                    type: "fluid",
                    func: "decapod.stereo.browse.input.captures"
                }
            }
        }
    });

    fluid.defaults("decapod.stereo.browse.captures.local", {
        gradeNames: ["decapod.stereo.browse.captures", "autoInit"],
        url: "../../mock-data/dewarp/mockCaptures.json"
    });

    fluid.defaults("decapod.stereo.browse.calibration", {
        gradeNames: ["autoInit", "decapod.stereo.browse"],
        strings: {
            browseMessage: "{decapod.stereo}.options.strings.step2"
        },
        listeners: {
            "{decapod.stereo}.events.onCapturesUploadSuccess": "{that}.enable",
            "{decapod.stereo}.events.onCapturesFileSelected": "{that}.disable",
            "{decapod.stereo}.events.onProcessStart": "{that}.disable",
            "{decapod.stereo}.events.onProcessStartError": "{that}.enable",
            "{decapod.stereo}.events.onProcessError": "{that}.enable"
        },
        disabledOnInit: true,
        url: "{decapod.stereo}.options.urls.uploadCalibration",
        protoTree: {
            browseMessage: {
                messagekey: "browseMessage",
                decorators: {addClass: "{styles}.browseMessage"}
            },
            browseLabel: {
                messagekey: "browse"
            },
            browseInput: {
                decorators: {
                    type: "fluid",
                    func: "decapod.stereo.browse.input.calibration"
                }
            }
        }
    });

    fluid.defaults("decapod.stereo.browse.calibration.local", {
        gradeNames: ["decapod.stereo.browse.calibration", "autoInit"],
        url: "../../mock-data/dewarp/mockImages.json"
    });

    fluid.defaults("decapod.stereo.browse.colourPicker", {
        gradeNames: ["autoInit", "decapod.stereo.browse"],
        strings: {
            browseMessage: "{decapod.stereo}.options.strings.step3",
            browse: "{decapod.stereo}.options.strings.colourPicker",
            instructions: "{decapod.stereo}.options.strings.instructions",
            instructionsStep1: "{decapod.stereo}.options.strings.instructionsStep1",
            instructionsStep2: "{decapod.stereo}.options.strings.instructionsStep2"
        },
        selectors: {
            instructions: ".dc-colorPicker-instructions",
            instructionsStep1: ".dc-colorPicker-instructionsStep1",
            instructionsStep2: ".dc-colorPicker-instructionsStep2"
        },
        selectorsToIgnore: ["browseLabel", "browseInput"],
        styles: {
            button: "ds-stereo-colorPicker"
        },
        listeners: {
            "{decapod.stereo}.events.onCalibrationSuccess": "{that}.enable",
            "{decapod.stereo}.events.onCapturesFileSelected": "{that}.disable",
            "{decapod.stereo}.events.onCalibrationFileSelected": "{that}.disable",
            "{decapod.stereo}.events.onProcessStart": "{that}.disable",
            "{decapod.stereo}.events.onProcessStartError": "{that}.enable",
            "{decapod.stereo}.events.onProcessError": "{that}.enable"
        },
        resources: {
            template: {
                url: "colorPickerTemplate.html",
                forceCache: true,
                fetchClass: "template",
                options: {
                    dataType: "html"
                }
            }
        },
        disabledOnInit: true,
        url: "{decapod.stereo}.options.urls.colourPicker",
        protoTree: {
            instructions: {
                messagekey: "instructions"
            },
            instructionsStep1: {
                messagekey: "instructionsStep1"
            },
            instructionsStep2: {
                messagekey: "instructionsStep2"
            },
            button: {
                messagekey: "browse",
                decorators: [{
                    type: "fluid",
                    func: "decapod.stereo.browse.input.colourPicker"
                }, {addClass: "{styles}.button"}]
            },
            browseMessage: {
                messagekey: "browseMessage",
                decorators: {addClass: "{styles}.browseMessage"}
            }
        }
    });

    fluid.fetchResources.primeCacheFromResources("decapod.stereo.browse.colourPicker");

    fluid.defaults("decapod.stereo.browse.colourPicker.local", {
        gradeNames: ["decapod.stereo.browse.colourPicker", "autoInit"],
        url: "../../mock-data/dewarp/mockColourPicker.json"
    });

    decapod.stereo.browse.preInit = function (that) {
        that.nickName = "decapod.stereo.browse";
        that.enable = function () {
            that.locate("button").add(that.locate("browseInput")).removeAttr("disabled");
        };
        that.disable = function () {
            that.locate("button").add(that.locate("browseInput")).attr("disabled", "disabled");
        };
    };

    decapod.stereo.browse.finalInit = function (that) {
        if (that.options.disabledOnInit) {
            that.disable();
        }
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
        errorStatus: "{decapod.stereo}.options.statuses.error",
        url: "{decapod.stereo.browse}.options.url",
        nickName: "decapod.stereo.browse.input"
    });

    fluid.defaults("decapod.stereo.browse.input.captures", {
        gradeNames: ["autoInit", "decapod.stereo.browse.input"],
        events: {
            onFileSelected: "{decapod.stereo}.events.onCapturesFileSelected",
            onStart: "{decapod.stereo}.events.onCapturesUploadStart",
            onSuccess: "{decapod.stereo}.events.onCapturesUploadSuccess",
            onError: "{decapod.stereo}.events.onCapturesUploadError"
        }
    });

    fluid.defaults("decapod.stereo.browse.input.calibration", {
        gradeNames: ["autoInit", "decapod.stereo.browse.input"],
        events: {
            onFileSelected: "{decapod.stereo}.events.onCalibrationFileSelected",
            onStart: "{decapod.stereo}.events.onCalibrationUploadStart",
            onSuccess: "{decapod.stereo}.events.onCalibrationSuccess",
            onError: "{decapod.stereo}.events.onCalibrationError"
        }
    });

    fluid.defaults("decapod.stereo.browse.input.colourPicker", {
        gradeNames: ["autoInit", "decapod.stereo.browse.input"],
        postInitFunction: "decapod.stereo.browse.input.colourPicker.postInit",
        events: {
            onStart: "{decapod.stereo}.events.onColourPickerStart",
            onSuccess: "{decapod.stereo}.events.onColourPickerSuccess",
            onError: "{decapod.stereo}.events.onColourPickerError"
        }
    });

    decapod.stereo.browse.input.colourPicker.postInit = function (that) {
        that.container.click(function () {
            that.events.onStart.fire();
            that.upload();
        });
    };

    decapod.stereo.browse.input.preInit = function (that) {
        that.nickName = "decapod.stereo.browse.input";
        that.upload = function (data) {
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
                    var error;
                    try {
                        error = JSON.parse(xhr.responseText);
                    } catch (err) {
                        error = err;
                    }
                    that.events.onError.fire(that.options.errorStatus, error);
                }
            });
        };
    };

    decapod.stereo.browse.input.postInit = function (that) {
        that.container.change(function () {
            var data = new FormData();
            data.append("file", this.files[0]);
            that.events.onFileSelected.fire(data);
        });
    };

})(jQuery);
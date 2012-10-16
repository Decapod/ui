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
     *  decapod.cameraController *
     *****************************/
    
    fluid.registerNamespace("decapod.cameraController");

    decapod.cameraController.setCaptureState = function (that) {
        that.applier.requestChange("disabled", true);
        that.locate("captureButton").html(that.options.strings.atCapture);
    };
    
    decapod.cameraController.removeCaptureState = function (that) {
        that.applier.requestChange("disabled", false);
        that.locate("captureButton").html("");
    };
    
    decapod.cameraController.capture = function (that) {
        decapod.cameraController.setCaptureState(that);
        that.dataSource.post();
    };
    
    decapod.cameraController.handleSuccess = function (that, response) {
        decapod.cameraController.removeCaptureState(that);
        that.events.onCaptureSuccess.fire(response);
    };
    
    decapod.cameraController.handleError = function (that, xhr, response) {
        decapod.cameraController.removeCaptureState(that);
        that.events.onCaptureError.fire(xhr, response);
    };
    
    decapod.cameraController.finalInit = function (that) {
        var captureButton = that.locate("captureButton");
        captureButton.attr("role", "button");
        captureButton.click(function () {
            decapod.cameraController.capture(that);
            that.events.onCapture.fire();
        });
        
        that.applier.modelChanged.addListener("disabled", function () {
            captureButton.attr("disabled", that.model.disabled);
            
            if (that.model.disabled) {
                captureButton.addClass(that.options.styles.disabled);
            } else {
                captureButton.removeClass(that.options.styles.disabled);
            }
        });

        that.events.onReady.fire();
    };
    
    fluid.defaults("decapod.cameraController", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        finalInitFunction: "decapod.cameraController.finalInit",
        components: {
            dataSource: {
                type: "decapod.dataSource",
                options: {
                    url: "http://localhost:8081/stereo/capture",
                    listeners: {
                        "success.handler": {
                            listener: "decapod.cameraController.handleSuccess",
                            args: ["{cameraController}", "{arguments}.0"]
                        },
                        "error.handler": {
                            listener: "decapod.cameraController.handleError",
                            args: ["{cameraController}", "{arguments}.0", "{arguments}.1"]
                        }
                    }
                }
            }
        },
        model: {
            disabled: false
        },
        selectors: {
            captureButton: ".dc-captureButton"
        },
        strings: {
            atCapture: "Taking picture"
        },
        styles: {
            disabled: "dc-captureButton-disabled"
        },
        events: {
            onReady: null,
            onCapture: null,
            onCaptureSuccess: null,
            onCaptureError: null
        }
    });
})(jQuery);

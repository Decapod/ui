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

    decapod.cameraController.finalInit = function (that) {
    	captureButton = that.locate("captureButton");
    	captureButton.attr("role", "button");
    	captureButton.click(decapod.cameraController.capture);
    	
        that.applier.modelChanged.addListener("buttonEnabled", function (a, b, c) {
            captureButton.attr("disabled", !that.model.buttonEnabled);
        });
        
        that.events.onReady.fire();
    };
    
    fluid.defaults("decapod.cameraController", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        finalInitFunction: "decapod.cameraController.finalInit",
        components: {
            dataSource: {
                type: "decapod.dataSource"
            }
        },
        model: {
        	buttonEnabled: true
        },
        selectors: {
            captureButton: ".dc-captureButton"
        },
        strings: {
            capture: "Capture"
        },
        events: {
        	onReady: null,
        	onCaptureReady: null
        }
    });
})(jQuery);
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
/*global setTimeout, decapod:true, fluid, jQuery, jqUnit, start*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {
    $(document).ready(function () {

        /*************************
         * cameraControllerTests *
         *************************/
        
        var cameraControllerTests = jqUnit.testCase("decapod.cameraController");
        
        cameraControllerTests.test("Init", function () {
            jqUnit.expect(2);
            var that = decapod.cameraController(".dc-capture");
            jqUnit.assertTrue("The component should have initialized", that);
            jqUnit.assertEquals("The role attribue of the capture button is set properly", that.locate("captureButton").attr("role"), "button");
        });
        
        cameraControllerTests.asyncTest("onReady", function () {
            jqUnit.expect(1);
            var assertOnReady = function () {
                jqUnit.assertTrue("The onReady event should have fired", true);
                start();
            };
            decapod.cameraController(".dc-capture", {
                listeners: {
                    onReady: assertOnReady
                }
            });
        });

        cameraControllerTests.asyncTest("onCapture", function () {
            jqUnit.expect(1);
            var that = decapod.cameraController(".dc-capture", {
                listeners: {
                    onCapture: function () {
                        jqUnit.assertTrue("The onCapture event should have fired.", true);
                        start();
                    }
                }
            });
            that.locate("captureButton").click();
        });
        
        cameraControllerTests.asyncTest("onCaptureSuccess", function () {
            jqUnit.expect(2);
            var expected = {
                    "captureIndex": 1,
                    "captures": ["http://locahost:8081/data/images/image-1_0.jpg", "http://locahost:8081/data/images/image-1_1.jpg"]
                };
            var that = decapod.cameraController(".dc-capture", {
                listeners: {
                    onCaptureSuccess: function (response) {
                        jqUnit.assertTrue("The onCaptureSuccess event should have fired.", true);
                        jqUnit.assertDeepEq("The response is expected", response, expected);
                        start();
                    }
                }
            });
            
            that.locate("captureButton").click();
        });
        
        cameraControllerTests.test("model change on buttonEnabled", function () {
            jqUnit.expect(2);
            var that = decapod.cameraController(".dc-capture");
            var captureButton = that.locate("captureButton");
            
            jqUnit.assertFalse("The capture button is initially enabled.", captureButton.attr("disabled"));
            that.applier.requestChange("buttonEnabled", false);
            jqUnit.assertTrue("The capture button is initially enabled.", captureButton.attr("disabled"));
        });
        
    });
})(jQuery);

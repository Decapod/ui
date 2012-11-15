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
        
        // helper functions
        var assertRender = function (that, currentStatus) {
            var status = that.model[currentStatus];
            jqUnit.assertEquals("The name should be rendered", status.name, that.locate("name").text());
            jqUnit.assertEquals("The description should be rendered", status.description, that.locate("description").html());
            jqUnit.assertEquals("The refresh text should be rendered", that.options.strings.refresh, that.locate("refresh").text());
            jqUnit.assertTrue("The status style should be applied", that.container.hasClass(status.style));
        };

        /***************
         * statusTests *
         ***************/
        
        var statusTests = jqUnit.testCase("decapod.status");
        
        var MODEL = {
            currentStatus: "READY",
            READY: {
                name: "Ready to Capture",
                description: "Press the Camera Button to start.",
                style: "dc-status-ready"
            },
            NO_CAMERAS: {
                name: "No camera detected",
                description: "",
                style: "dc-status-noCameras"
            },
            CAMERA_DISCONNECTED: {
                name: "A camera has been disconnected.",
                description: "Check that the camera is plugged in and turned on.",
                style: "dc-status-cameraDisconnected"
            },
            NO_CAPTURE: {
                name: "Unable to capture",
                description: 'There was a problem with a camera. See <a href="">Help</a> documentation for possible fixes',
                style: "dc-status-noCapture"
            },
            TOO_MANY_CAMERAS: {
                name: "Too many cameras detected",
                description: "Connect only one or two cameras",
                style: "dc-status-tooManyCameras"
            }
        };
        
        statusTests.test("Init tests", function () {
            var that = decapod.status(".dc-status", {model: MODEL});
            jqUnit.assertTrue("The component should have initialized", that);
        });
        
        statusTests.asyncTest("onReady", function () {
            jqUnit.expect(2);
            var assertOnReady = function (that) {
                jqUnit.assertTrue("The onReady event should have fired", true);
                jqUnit.assertEquals("The status role should be set", "status", that.container.attr("role"));
                start();
            };
            decapod.status(".dc-status", {
                listeners: {
                    onReady: {
                        listener: assertOnReady,
                        args: ["{status}"]
                    }
                },
                model: MODEL
            });
        });
        
        statusTests.asyncTest("afterRender", function () {
            jqUnit.expect(4);
            var assertAfterRender = function (that) {
                assertRender(that, that.model.currentStatus);
                start();
            };
            decapod.status(".dc-status", {
                listeners: {
                    afterRender: {
                        listener: assertAfterRender,
                        priority: "last"
                    }
                },
                model: MODEL
            });
        });
        
        statusTests.asyncTest("afterStatusChanged", function () {
            jqUnit.expect(6);
            var status = "NO_CAMERAS";
            var assertAfterRender = function (that) {
                assertRender(that, that.model.currentStatus);
                start();
            };
            var assertStatusChanged = function (that, newStatus) {
                jqUnit.assertDeepEq("The model should be updated", status, that.model.currentStatus);
                jqUnit.assertDeepEq("The new status should be passed down", status, newStatus);
                that.events.afterRender.addListener(assertAfterRender);
            };
            decapod.status(".dc-status", {
                listeners: {
                    afterStatusChanged: {
                        listener: assertStatusChanged,
                        args: ["{status}", "{arguments}.0"],
                        priority: "first"
                    },
                    onReady: {
                        listener: function (that) {
                            that.updateStatus(status);
                        },
                        args: ["{status}"]
                    }
                },
                model: MODEL
            });
        });
        
        statusTests.asyncTest("onStatusChangeError", function () {
            jqUnit.expect(2);
            var status = "NOT_READY";
            var expectedCR = {value: status, path: "currentStatus", type: "ADD"};
            var assertOnStatusChangeError = function (that, changeRequest) {
                jqUnit.assertDeepEq("The changeRequest should be returned", expectedCR, changeRequest);
                jqUnit.assertNotEquals("The model shouldn't have been updated", status, that.model.currentStatus);
                start();
            };
            decapod.status(".dc-status", {
                listeners: {
                    onStatusChangeError: {
                        listener: assertOnStatusChangeError,
                        args: ["{status}", "{arguments}.0"]
                    },
                    onReady: {
                        listener: function (that) {
                            that.updateStatus(status);
                        },
                        args: ["{status}"]
                    }
                },
                model: MODEL
            });
        });
        
        statusTests.asyncTest("markup description", function () {
            jqUnit.expect(7);
            var status = "NO_CAPTURE";
            var assertAfterRender = function (that) {
                assertRender(that, that.model.currentStatus);
                jqUnit.assertEquals("The description should contain a link", 1, $("a", that.locate("description")).length);
                start();
            };
            var assertStatusChanged = function (that, newStatus) {
                jqUnit.assertDeepEq("The model should be updated", status, that.model.currentStatus);
                jqUnit.assertDeepEq("The new status should be passed down", status, newStatus);
                that.events.afterRender.addListener(assertAfterRender);
            };
            decapod.status(".dc-status", {
                listeners: {
                    afterStatusChanged: {
                        listener: assertStatusChanged,
                        args: ["{status}", "{arguments}.0"],
                        priority: "first"
                    },
                    onReady: {
                        listener: function (that) {
                            that.updateStatus(status);
                        },
                        args: ["{status}"]
                    }
                },
                model: MODEL
            });
        });
    });
})(jQuery);

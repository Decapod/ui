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

        /*****************
         * capturerTests *
         *****************/
        
        var capturerTests = jqUnit.testCase("decapod.capturer");
        
        var CONTAINER = ".dc-capturer";
        
        var initCapturer = function (options) {
            var opts = {
                resources: {
                    template: {
                        url: "../../../capture/html/capturerTemplate.html"
                    }
                }
            };
            
            fluid.merge("replace", opts, options);
            
            return decapod.capturer(CONTAINER, opts);
        };
        
        capturerTests.asyncTest("Init", function () {
            jqUnit.expect(17);
            var expectedStrings = {
                title: "Test Capture",
                help: "Test Help Link",
                restart: "Test Restart Link",
                exportButton: "Test ExportButton",
                loadMessage: "Test Load Message"
            };
            var expectedMarkup = {
                captureButton: "<span>Test Capture</span><span>(Test Keyboard shortcut: C)</span>"
            };

            var options = {
                strings: expectedStrings,
                markup: expectedMarkup,
                listeners: {
                    onReady: {
                        listener: function (that) {
                            jqUnit.assertEquals("The title text should have been set properly", expectedStrings.title, that.locate("title").text());
                            jqUnit.assertEquals("The help link text should have been set properly", expectedStrings.help, that.locate("help").text());
                            jqUnit.assertEquals("The restart link text should have been set properly", expectedStrings.restart, that.locate("restart").text());
                            jqUnit.assertEquals("The export button text should have been set properly", expectedStrings.exportButton, that.locate("exportButton").text());
                            jqUnit.assertEquals("The capture button text should have been set properly", expectedMarkup.captureButton, that.locate("captureButton").html());
                            
                            jqUnit.assertFalse("The capture button should have been enabled", that.locate("captureButton").attr("aria-disabled"));
                            jqUnit.assertFalse("The export button should have been enabled", that.locate("exportButton").attr("aria-disabled"));
                            jqUnit.notVisible("The load indicator should have been hidden", that.locate("load"));
                            jqUnit.notVisible("The status viewer should have been hidden", that.locate("status"));
                            jqUnit.notVisible("The export description should have been hidden", that.locate("exportDesc"));
                            jqUnit.isVisible("The image viewer should have been shown", that.locate("preview"));
                            jqUnit.assertTrue("The image src should have been set", that.captureReviewer.locate("captureIMG").attr("src"));
                            
                            start();
                        },
                        args: ["{capturer}"]
                    },
                    onTemplateReady: {
                        listener: function (that) {
                            jqUnit.assertEquals("The load message should have been set properly.", expectedStrings.loadMessage, that.locate("loadMessage").text());
                            jqUnit.isVisible("The load indicator should be visible", that.locate("load"));
                            jqUnit.notVisible("The status should not be visible", that.locate("status"));
                            jqUnit.notVisible("The preview should not be visible", that.locate("preview"));
                            jqUnit.notVisible("The export description should have been hidden", that.locate("exportDesc"));
                        },
                        args: ["{capturer}"]
                    }
                }
            };
            
            initCapturer(options);
        });

        capturerTests.asyncTest("Capture", function () {
            jqUnit.expect(7);
            var options = {
                listeners: {
                    onCaptureSuccess: {
                        listener: function (that) {
                            jqUnit.assertFalse("The capture button should have been enabled", that.locate("captureButton").attr("aria-disabled"));
                            jqUnit.assertFalse("The export button should have been enabled", that.locate("exportButton").attr("aria-disabled"));
                            jqUnit.assertEquals("The capture button text should have been set back", $("<a>").html(that.options.markup.captureButton).text(), that.locate("captureButton").text());
                            jqUnit.notVisible("The status viewer should have been hidden", that.locate("status"));
                            jqUnit.isVisible("The image viewer should have been shown", that.locate("preview"));
                            jqUnit.assertTrue("The image src should have been set", that.captureReviewer.locate("captureIMG").attr("src"));
                            jqUnit.notVisible("The export description should have been hidden", that.locate("exportDesc"));
                            start();
                        },
                        args: ["{capturer}"]
                    },
                    onReady: {
                        listener: function (that) {
                            that.locate("captureButton").click();
                        },
                        args: ["{capturer}"]
                    }
                }
            };
            
            initCapturer(options);
        });
 
        capturerTests.asyncTest("Export", function () {
            jqUnit.expect(4);
            var options = {
                listeners: {
                    onExportSuccess: {
                        listener: function (that) {
                            jqUnit.assertNotEquals("The href of the download iframe should have been set", that.locate("downloadFrame").attr("src"), "");
                            jqUnit.assertFalse("The export button should have been enabled", that.locate("exportButton").attr("aria-disabled"));
                            jqUnit.assertEquals("The export button text should have been set back", that.options.strings.exportButton, that.locate("exportButton").text());
                            jqUnit.isVisible("The export description should have been visible", that.locate("exportDesc"));
                            start();
                        },
                        args: ["{capturer}"]
                    },
                    onReady: {
                        listener: function (that) {
                            that.locate("exportButton").click();
                        },
                        args: ["{capturer}"]
                    }
                }
            };
            
            initCapturer(options);
        });
 
        capturerTests.asyncTest("Delete", function () {
            jqUnit.expect(3);
            var options = {
                listeners: {
                    onDelete: {
                        listener: function (that) {
                            jqUnit.assertUndefined("No images should have been displayed", that.captureReviewer.locate("captureIMG").attr("src"));
                            jqUnit.assertEquals("The deleted message should have been displayed", fluid.stringTemplate(that.captureReviewer.options.strings.deletedIndex, {0: "1"}), that.captureReviewer.locate("captureIndex").text());
                            jqUnit.notVisible("The export description should have been hidden", that.locate("exportDesc"));
                            start();
                        },
                        args: ["{capturer}"],
                        priority: "last"
                    },
                    onReady: {
                        listener: function (that) {
                            that.captureReviewer.locate("del").click();
                        },
                        args: ["{capturer}"]
                    }
                }
            };
            
            initCapturer(options);
        });

        capturerTests.asyncTest("onRestart", function () {
            jqUnit.expect(2);
            var options = {
                listeners: {
                    onRestart: {
                        listener: function (that) {
                            jqUnit.assertTrue("onRestart event should have been fired", true);
                            jqUnit.notVisible("The export description should have been hidden", that.locate("exportDesc"));
                            start();
                        },
                        args: ["{capturer}"]
                    },
                    onReady: {
                        listener: function (that) {
                            that.locate("restart").click();
                        },
                        args: ["{capturer}"]
                    }
                }
            };
            
            initCapturer(options);
        });
        
        capturerTests.asyncTest("onReadyToCapture", function () {
            jqUnit.expect(2);
            var options = {
                listeners: {
                    "onReady.test": {
                        listener: function (that) {
                            that.events.onReady.removeListener("test");
                            that.events.onReadyToCapture.addListener(function () {
                                jqUnit.assertTrue("onReadyToCapture event should have been fired", true);
                                jqUnit.notVisible("The load element should not be visible", that.locate("load"));
                                start();
                            });
                            that.events.onReadyToCapture.fire();
                        },
                        args: ["{capturer}"]
                    }
                }
            };
            
            initCapturer(options);
        });
        
        capturerTests.asyncTest("onCameraReady", function () {
            jqUnit.expect(2);
            var options = {
                listeners: {
                    "onReady.test": {
                        listener: function (that) {
                            that.events.onReady.removeListener("test");
                            that.events.onReadyToCapture.addListener(function () {
                                start();
                            });
                            that.captureStatusSource.events.getSuccess.addListener(function () {
                                jqUnit.assertTrue("captureStatusSource success event should have been fired", true);
                            });
                            that.events.onCameraReady.addListener(function () {
                                jqUnit.assertEquals("The captureControl should be enabled", "enabled", that.captureControl.model.state);
                            }, null, null, "last");
                            that.events.onCameraReady.fire();
                        },
                        args: ["{capturer}"]
                    }
                }
            };
            
            initCapturer(options);
        });
        
        capturerTests.asyncTest("onNoCaptures", function () {
            jqUnit.expect(4);
            var statusCode = "NO_CAPTURE";
            var options = {
                listeners: {
                    onNoCaptures: {
                        listener: function (that) {
                            jqUnit.notVisible("The capturerReviewer should be hidden", that.captureReviewer.container);
                            jqUnit.isVisible("The status should be visible", that.status.container);
                            jqUnit.assertEquals("The status should have updated", statusCode, that.status.model.currentStatus);
                            start();
                        },
                        priority: "last",
                        args: ["{capturer}"]
                    },
                    "onReady.test": {
                        listener: function (that) {
                            that.events.onReady.removeListener("test");
                            that.events.onReadyToCapture.addListener(function () {
                                jqUnit.assertTrue("onReadyToCapture event should have been fired", true);
                            });
                            that.events.onNoCaptures.fire(statusCode);
                        },
                        args: ["{capturer}"]
                    }
                }
            };
            
            initCapturer(options);
        });

        capturerTests.asyncTest("onCapturesRetrieved", function () {
            jqUnit.expect(3);
            var response = {"totalCaptures": 1, "lastCaptureIndex": 1};
            var options = {
                listeners: {
                    "onReady.test": {
                        listener: function (that) {
                            that.events.onReady.removeListener("test");
                            that.events.onReadyToCapture.addListener(function () {
                                start();
                            });
                            // TODO: test that the imageSource event is fired. Currently the application works, but this test listener never gets triggered.
                            // that.imageSource.events.getSuccess.addListener(function () {
                                // jqUnit.assertTrue("imageSource getSuccess event should have been fired", true);
                            // });
                            that.events.onCapturesRetrieved.addListener(function () {
                                jqUnit.assertEquals("The captureControl should be enabled", "enabled", that.captureControl.model.state);
                                jqUnit.assertEquals("The exportControl should be enabled", "enabled", that.exportControl.model.state);
                                jqUnit.assertEquals("The caputreReviewer model should have been updated", response.totalCaptures, that.captureReviewer.model.captureIndex);
                            }, null, null, "last");
                            that.events.onCapturesRetrieved.fire(response);
                        },
                        args: ["{capturer}"]
                    }
                }
            };
            
            initCapturer(options);
        });

        capturerTests.asyncTest("onError", function () {
            jqUnit.expect(5);
            var statusCode = "NO_CAMERAS";
            var options = {
                listeners: {
                    "onError": {
                        listener: function (that) {
                            jqUnit.notVisible("The captureReviewer should not be visible", that.captureReviewer.container);
                            jqUnit.isVisible("The status should be visible", that.status.container);
                            jqUnit.notVisible("The load should not be visible", that.locate("load"));
                            jqUnit.assertEquals("The status should have been upated", statusCode, that.status.model.currentStatus);
                            jqUnit.assertEquals("The captureControl should be disabled", "disabled", that.captureControl.model.state);
                            start();
                        },
                        priority: "last",
                        args: ["{capturer}"]
                    },
                    "onReady.test": {
                        listener: function (that) {
                            that.events.onReady.removeListener("test");
                            that.events.onError.fire(null, statusCode);
                        },
                        args: ["{capturer}"]
                    }
                }
            };
            
            initCapturer(options);
        });
    });
})(jQuery);

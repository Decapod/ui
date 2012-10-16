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
        var assertRender = function (that, expectedModel) {
            jqUnit.assertEquals("The delete text should be rendered", that.options.strings.del, that.locate("del").text());
            jqUnit.assertEquals("The capture index should be rendered", "Capture #" + expectedModel.captureIndex, that.locate("captureIndex").text());
            var captures = that.locate("captureIMG");
            jqUnit.assertEquals("There should be two images rendered", expectedModel.captures.length, captures.length);
            captures.each(function (idx, elm) {
                jqUnit.assertEquals("The image at index" + idx + " should have the correct src set", expectedModel.captures[idx], $(elm).attr("src"));
            });
        };

        /************************
         * captureReviewerTests *
         ************************/
        
        var captureReviewerTests = jqUnit.testCase("decapod.captureReviewer");
        
        captureReviewerTests.test("Init tests", function () {
            var that = decapod.captureReviewer(".dc-captureReviewer");
            jqUnit.assertTrue("The component should have initialized", that);
        });
        
        captureReviewerTests.asyncTest("onReady", function () {
            jqUnit.expect(1);
            var assertOnReady = function () {
                jqUnit.assertTrue("The onReady event should have fired", true);
                start();
            };
            decapod.captureReviewer(".dc-captureReviewer", {
                listeners: {
                    onReady: assertOnReady
                }
            });
        });
        
        captureReviewerTests.asyncTest("afterRender", function () {
            jqUnit.expect(5);
            var model = {
                captureIndex: 10,
                captures: ["http://localhost:8080/test/image1.jpg", "http://localhost:8080/test/image2.jpg"]
            };
            var assertAfterRender = function (that) {
                assertRender(that, model);
                start();
            };
            decapod.captureReviewer(".dc-captureReviewer", {
                listeners: {
                    afterRender: assertAfterRender
                },
                model: model
            });
        });
        
        captureReviewerTests.asyncTest("afterModelChanged", function () {
            jqUnit.expect(7);
            var model = {
                captureIndex: 10,
                captures: ["http://localhost:8080/test/image1.jpg", "http://localhost:8080/test/image2.jpg"]
            };
            var assertAfterRender = function (that) {
                assertRender(that, model);
                start();
            };
            var assertModelChanged = function (that, newModel) {
                jqUnit.assertDeepEq("The model should be updated", model, that.model);
                jqUnit.assertDeepEq("The newModel should be passed down", model, newModel);
                that.events.afterRender.addListener(assertAfterRender);
            };
            decapod.captureReviewer(".dc-captureReviewer", {
                listeners: {
                    afterModelChanged: {
                        listener: assertModelChanged,
                        args: ["{captureReviewer}", "{arguments}.0"],
                        priority: "first"
                    },
                    onReady: {
                        listener: function (that) {
                            that.updateModel(model);
                        },
                        args: ["{captureReviewer}"]
                    }
                }
            });
        });
        
        captureReviewerTests.asyncTest("onDelete", function () {
            jqUnit.expect(1);
            var assertDelete = function () {
                jqUnit.assertTrue("The onDelete event should have fired", true);
                start();
            };
            decapod.captureReviewer(".dc-captureReviewer", {
                listeners: {
                    afterRender: function (that) {
                        that.locate("del").click();
                    },
                    onDelete: assertDelete
                }
            });
        });
    });
})(jQuery);

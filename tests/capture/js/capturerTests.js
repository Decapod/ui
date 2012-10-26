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
        
        capturerTests.asyncTest("Init", function () {
            var expectedTitle = "Test Capture";
            var expectedHelp = "Test Help Link";
            var expectedRestart = "Test Restart Link";

            decapod.capturer(CONTAINER, {
                strings: {
                    title: expectedTitle,
                    help: expectedHelp,
                    restart: expectedRestart
                },
                listeners: {
                    onReady: {
                        listener: function (that) {
                            jqUnit.assertTrue("The component should have initialized", that);
                            jqUnit.assertTrue("The onReady event should have fired", true);
                            jqUnit.assertEquals("The title text should have been set properly", that.locate("title").html(), expectedTitle);
                            jqUnit.assertEquals("The help link text should have been set properly", that.locate("help").html(), expectedHelp);
                            jqUnit.assertEquals("The restart link text should have been set properly", that.locate("restart").html(), expectedRestart);
                            that.captureReviewer.events.afterRender.addListener(start);
                        },
                        args: ["{capturer}"]
                    }
                }
            });
        });

        capturerTests.asyncTest("Initial page load", function () {
            decapod.capturer(CONTAINER, {
                listeners: {
                    onImageProcessedReady: {
                        listener: function (that) {
                            jqUnit.assertUndefined("The capture button should have been enabled", that.locate("captureButton").attr("disabled"));
                            jqUnit.assertUndefined("The export button should have been enabled", that.locate("exportButton").attr("disabled"));
                            jqUnit.notVisible("The status viewer should have been hidden", that.locate("status"));
                            jqUnit.isVisible("The image viewer should have been shown", that.locate("preview"));
                            jqUnit.assertNotEquals("The image should have been displayed", that.captureReviewer.locate("captureIMG").attr("src"), "");
                            start();
                        },
                        args: ["{capturer}"]
                    }
                }
            });
        });

        capturerTests.asyncTest("Export", function () {
            decapod.capturer(CONTAINER, {
                listeners: {
                    onExportSuccess: {
                        listener: function (that) {
                            jqUnit.assertNotEquals("The href of the download iframe should have been set", that.locate("downloadFrame").attr("src"), "");
                            that.captureReviewer.events.afterRender.addListener(start);
                        },
                        args: ["{capturer}"]
                    },
                    onReady: {
                        listener: function (that) {
                            that.exportControl.locate("button").click();
                        },
                        args: ["{capturer}"]
                    }
                }
            });
        });

        capturerTests.asyncTest("Delete", function () {
            decapod.capturer(CONTAINER, {
                listeners: {
                    onDelete: {
                        listener: function (that) {
                            
                            jqUnit.assertUndefined("No images should have been displayed", that.captureReviewer.locate("captureIMG").attr("src"));
                            jqUnit.assertEquals("The deleted message should have been displayed", fluid.stringTemplate(that.captureReviewer.options.strings.deletedIndex, {0: ""}), that.captureReviewer.locate("captureIndex").text());
                            that.captureReviewer.events.afterRender.addListener(start);
                        },
                        args: ["{capturer}"]
                    },
                    onReady: {
                        listener: function (that) {
                            that.captureReviewer.locate("del").click();
                        },
                        args: ["{capturer}"]
                    }
                }
            });
        });

    });
})(jQuery);

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
            jqUnit.expect(15);
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

            decapod.capturer(CONTAINER, {
                strings: expectedStrings,
                markup: expectedMarkup,
                listeners: {
                    onReady: {
                        listener: function (that) {
                            jqUnit.assertEquals("The title text should have been set properly", expectedStrings.title, that.locate("title").text());
                            jqUnit.assertEquals("The help link text should have been set properly", expectedStrings.help, that.locate("help").text());
                            jqUnit.assertEquals("The restart link text should have been set properly", expectedStrings.restart, that.locate("restart").text());
                            jqUnit.assertEquals("The export button text should have been set properly", expectedStrings.exportButton, that.locate("exportButton").text())
                            jqUnit.assertEquals("The export button text should have been set properly", expectedMarkup.captureButton, that.locate("captureButton").html())
                            
                            jqUnit.assertTrue("The capture button should have been enabled", that.locate("captureButton").is(":enabled"));
                            jqUnit.assertTrue("The export button should have been enabled", that.locate("exportButton").is(":enabled"));
                            jqUnit.notVisible("The load indicator should have been hidden", that.locate("load"));
                            jqUnit.notVisible("The status viewer should have been hidden", that.locate("status"));
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
                        },
                        args: ["{capturer}"]
                    }
                },
                resources: {
                    template: {
                        url: "../../../capture/html/capturerTemplate.html"
                    }
                }
            });
        });

        // capturerTests.asyncTest("Export", function () {
            // decapod.capturer(CONTAINER, {
                // listeners: {
                    // onExportSuccess: {
                        // listener: function (that) {
                            // jqUnit.assertNotEquals("The href of the download iframe should have been set", that.locate("downloadFrame").attr("src"), "");
                            // that.captureReviewer.events.afterRender.addListener(start);
                        // },
                        // args: ["{capturer}"]
                    // },
                    // onReady: {
                        // listener: function (that) {
                            // that.exportControl.locate("button").click();
                        // },
                        // args: ["{capturer}"]
                    // }
                // }
            // });
        // });
// 
        // capturerTests.asyncTest("Delete", function () {
            // decapod.capturer(CONTAINER, {
                // listeners: {
                    // onDelete: {
                        // listener: function (that) {
//                             
                            // jqUnit.assertUndefined("No images should have been displayed", that.captureReviewer.locate("captureIMG").attr("src"));
                            // jqUnit.assertEquals("The deleted message should have been displayed", fluid.stringTemplate(that.captureReviewer.options.strings.deletedIndex, {0: ""}), that.captureReviewer.locate("captureIndex").text());
                            // that.captureReviewer.events.afterRender.addListener(start);
                        // },
                        // args: ["{capturer}"]
                    // },
                    // onReady: {
                        // listener: function (that) {
                            // that.captureReviewer.locate("del").click();
                        // },
                        // args: ["{capturer}"]
                    // }
                // }
            // });
        // });

    });
})(jQuery);

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
/*global window, decapod:true, expect, fluid, jQuery, jqUnit, start*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {
    var CONTAINER = ".dc-importStatus";
    var RENDER_CONTAINER = ".dc-importStatus-renderer";
    
    var initialModel = {
        valid: 0,
        errors: {}
    };
    
    var PROTO_TREE = {
        expander: {
            type: "fluid.renderer.repeat",
            repeatID: "statusMessages:",
            controlledBy: "statuses",
            pathAs: "statusPath",
            tree: {
                value: "${{statusPath}}"
            }
        }
    };
    
    $(document).ready(function () {
        
        var tests = jqUnit.testCase("Decapod Import Status");
        
        tests.test("Init importStatus tests", function () {
            var that = decapod.importStatus(CONTAINER);
            jqUnit.assertTrue("The importStatus component should have initialized", that);
            jqUnit.assertDeepEq("The model should be in its initial state", initialModel, that.model);
        });
        
        tests.test("addValid - none", function () {
            var that = decapod.importStatus(CONTAINER);
            var mockThat = {
                model: {
                    valid: 0
                }
            };
            var numValidFiles = 5;
            
            decapod.importStatus.addValid(mockThat, numValidFiles);
            jqUnit.assertEquals("valid files added to the model - global function", numValidFiles, mockThat.model.valid);
            
            that.addValid(numValidFiles);
            jqUnit.assertEquals("valid files added to the model - through the component", numValidFiles, that.model.valid);
        });
        
        tests.test("addValid - valid files already added", function () {
            var existingValid = 5;
            var that = decapod.importStatus(CONTAINER, {
                model: {
                    valid: existingValid
                }
            });
            var mockThat = {
                model: {
                    valid: existingValid
                }
            };
            var newValidFiles = 5;
            var numValidFiles = existingValid + newValidFiles;
            
            decapod.importStatus.addValid(mockThat, newValidFiles);
            jqUnit.assertEquals("valid files added to the model - global function", numValidFiles, mockThat.model.valid);
            
            that.addValid(newValidFiles);
            jqUnit.assertEquals("valid files added to the model - through the component", numValidFiles, that.model.valid);
        });
        
        tests.test("addError - none", function () {
            var that = decapod.importStatus(CONTAINER);
            var errorName = "-100";
            var mockThat = {
                model: {
                    errors: {}
                }
            };
            
            decapod.importStatus.addError(mockThat, errorName);
            jqUnit.assertEquals("the error should be added to the model - global funciton", 1, mockThat.model.errors[errorName]);
            
            that.addError(errorName);
            jqUnit.assertEquals("the error should be added to the model - through the component", 1, that.model.errors[errorName]);
        });
        
        tests.test("addError - errors already added", function () {
            var that = decapod.importStatus(CONTAINER, {
                model: {
                    errors: {
                        "-100": 1
                    }
                }
            });
            var errorName = "-100";
            var mockThat = {
                model: {
                    errors: {
                        "-100": 1
                    }
                }
            };
            
            decapod.importStatus.addError(mockThat, errorName);
            jqUnit.assertEquals("the error should be added to the model - global funciton", 2, mockThat.model.errors[errorName]);
            
            that.addError(errorName);
            jqUnit.assertEquals("the error should be added to the model - through the component", 2, that.model.errors[errorName]);
        });
        
        tests.test("addError - number of errors", function () {
            var that = decapod.importStatus(CONTAINER);
            var errorName = "-100";
            var numErrors = 3;
            var mockThat = {
                model: {
                    errors: {}
                }
            };
            
            decapod.importStatus.addError(mockThat, errorName, numErrors);
            jqUnit.assertEquals("the error should be added to the model - global funciton", 3, mockThat.model.errors[errorName]);
            
            that.addError(errorName, numErrors);
            jqUnit.assertEquals("the error should be added to the model - through the component", 3, that.model.errors[errorName]);
        });
        
        tests.test("totalNumErrors", function () {
            var model = {
                errors: {
                    "-100": 1,
                    "-200": 2
                }
            };
            var that = decapod.importStatus(CONTAINER, {model: model});
            var mockThat = {
                model: model,
                options: {
                    ignoreFromTotals: []
                }
            };
            
            jqUnit.assertEquals("The total number of errors should be calculated - global function", 3, decapod.importStatus.totalNumErrors(mockThat));
            jqUnit.assertEquals("The total number of errors should be calculated - through the component", 3, that.totalNumErrors());
        });
        
        tests.test("totalNumErrors - ignored errors", function () {
            var model = {
                errors: {
                    "-100": 1,
                    "-200": 2
                }
            };
            var that = decapod.importStatus(CONTAINER, {
                model: model,
                ignoreFromTotals: ["-200"]
            });
            var mockThat = {
                model: model,
                options: {
                    ignoreFromTotals: ["-200"]
                }
            };
            
            jqUnit.assertEquals("The total number of errors should be calculated - global function", 1, decapod.importStatus.totalNumErrors(mockThat));
            jqUnit.assertEquals("The total number of errors should be calculated - through the component", 1, that.totalNumErrors());
        });
        
        tests.test("totalNumFiles", function () {
            var model = {
                valid: 2,
                errors: {
                    "-100": 1,
                    "-200": 2
                }
            };
            var that = decapod.importStatus(CONTAINER, {model: model});
            jqUnit.assertEquals("The total number of files should be calculated - through the component", 5, that.totalNumFiles());
        });
        
        tests.test("totalNumFiles - ignored errors", function () {
            var model = {
                valid: 2,
                errors: {
                    "-100": 1,
                    "-200": 2
                }
            };
            var that = decapod.importStatus(CONTAINER, {
                model: model,
                ignoreFromTotals: ["-200"]
            });
            jqUnit.assertEquals("The total number of files should be calculated - through the component", 3, that.totalNumFiles());
        });
        
        tests.test("totalMessage", function () {
            var message = "5 files found.";
            var that = decapod.importStatus(CONTAINER, {
                model: {
                    valid: 2,
                    errors: {
                        "-100": 1,
                        "-200": 2
                    }
                }
            });
            jqUnit.assertEquals("The status message for the total number of files should be generated", message, that.totalMessage());
        });
        
        tests.test("errorMessage", function () {
            var message = "-100: 2";
            var that = decapod.importStatus(CONTAINER, {
                model: {
                    errors: {
                        "-100": 2
                    }
                },
                strings: {
                    "-100": "%errorName: %numErrors"
                }
            });
            jqUnit.assertEquals("The error message should be generated", message, that.errorMessage("-100"));
        });

        tests.test("messages", function () {
            var that = decapod.importStatus(CONTAINER, {
                model: {
                    valid: 2,
                    errors: {
                        "-100": 1,
                        "-200": 2
                    }
                },
                strings: {
                    "-100": "%errorName: %numErrors files exceeded the queue limit",
                    "-200": "%errorName: %numErrors files exceeded the size limit"
                }
            });
            
            var expectedMessages = [
                "5 files found.",
                "-100: 1 files exceeded the queue limit",
                "-200: 2 files exceeded the size limit"
            ];
            
            jqUnit.assertDeepEq("The status messages should have been generated", expectedMessages, that.messages());
        });
        
        tests.test("renderStatuses - 0 files", function () {
            var importStatus = decapod.importStatus(CONTAINER);
            var expectedMessage = "0 files found.";
            importStatus.renderStatuses();
            var statusMessages = importStatus.renderer.locate("statusMessages");
            jqUnit.assertEquals("Only the 1 status should be rendered", 1, statusMessages.length);
            jqUnit.assertEquals("The total status should be rendered", expectedMessage, statusMessages.text());
        });
        
        tests.test("renderStatuses - some errors", function () {
            var importStatus = decapod.importStatus(CONTAINER, {
                model: {
                    valid: 0,
                    errors: {
                        "-100": 1,
                        "-110": 1
                    }
                },
                strings: {
                    "-100": "%numErrors files exceeded the queue limit",
                    "-110": "%numErrors files exceeded the size limit"
                }
            });
            var expectedMessages = [
                "2 files found.",
                "1 files exceeded the queue limit",
                "1 files exceeded the size limit"
            ];
            importStatus.renderStatuses();
            var messages = importStatus.renderer.locate("statusMessages");
            jqUnit.assertEquals("The statuses should be rendered", 3, messages.length);
            messages.each(function (idx, message) {
                jqUnit.assertEquals("The message should be rendered", expectedMessages[idx], $(message).text());
            });
        });
        
        tests.asyncTest("Init importStatus.renderer tests", function () {
            var assertInit = function (that) {
                jqUnit.assertTrue("The importStatus.renderer component should have initialized", that);
                start();
            };
            decapod.importStatus.renderer(RENDER_CONTAINER, {
                listeners: {
                    onCreate: {
                        listener: assertInit,
                        priority: "last"
                    }
                }
            });
        });
        
        tests.test("decapod.importStatus.renderer.produceTree - empty model", function () {
            var mockThat = {
                selectors: {
                    statusMessages: ".dc-importStatus-renderer-statusMessage" 
                },
                repeatingSelectors: ["statusMessages"],
                model: {
                    statuses: []
                }
            };

            var producedTree = decapod.importStatus.renderer.produceTree(mockThat);
            jqUnit.assertDeepEq("The proto tree should be produced", PROTO_TREE, producedTree);
        });
        
        tests.asyncTest("render - no statuses", function () {
            var assertRender = function (that) {
                jqUnit.assertEquals("There should be no statuses rendered", 0, that.locate("statusMessages").length);
                start();
            };
            decapod.importStatus.renderer(RENDER_CONTAINER, {
                listeners: {
                    afterRender: {
                        listener: assertRender,
                        priority: "last"
                    }
                }
            });
            
        });
        
        tests.asyncTest("renderer - statuses", function () {
            var statuses = ["status 1", "status 2"];
            var assertRender = function (that) {
                jqUnit.assertEquals("The statuses should be rendered", statuses.length, that.locate("statusMessages").length);
                for (var i = 0; i < statuses.length; i++) {
                    jqUnit.assertEquals("The status message should be rendered", statuses[i], that.locate("statusMessages").eq(i).text());
                }
                start();
            };
            decapod.importStatus.renderer(RENDER_CONTAINER, {
                model: {
                    statuses: statuses
                },
                listeners: {
                    afterRender: {
                        listener: assertRender,
                        priority: "last"
                    }
                }
            });
        });
    });
})(jQuery);

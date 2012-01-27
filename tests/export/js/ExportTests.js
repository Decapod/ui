/*
Copyright 2011 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one of these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
*/

// Declare dependencies
/*global window, decapod:true, expect, fluid, jQuery, jqUnit, start*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {
    $(document).ready(function () {
        
        var tests = jqUnit.testCase("Decapod Export");
        
        tests.test("Init tests", function () {
            var exporter = decapod.exporter();
            jqUnit.assertTrue("The component should have initialized", exporter);
            jqUnit.assertDeepEq("The default model is created", {}, exporter.model);
        });
        
        tests.asyncTest("Update status", function () {
            expect(3);
            var status = "Started";
            var exporter = decapod.exporter({
                listeners: {
                    afterStatusChanged: function (newStatus, oldStatus) {
                        jqUnit.assertEquals("The new status should match the passed in value", status, newStatus);
                        jqUnit.assertFalse("The old status should be falsey", oldStatus);
                        jqUnit.assertEquals("The status in the model should be set", status, exporter.model.status);
                        start();
                    }
                }
            });
            
            exporter.updateStatus(status);
        });
        
        tests.asyncTest("setStarted", function () {
            expect(4);
            var inProgress = "Making PDF...";
            var exporter = decapod.exporter({
                listeners: {
                    afterStatusChanged: function (newStatus, oldStatus) {
                        jqUnit.assertEquals("The in progress status should be set", inProgress, newStatus);
                        jqUnit.assertFalse("The old status should be falsey", oldStatus);
                        jqUnit.assertEquals("The in progress status should be set in the model", inProgress, exporter.model.status);
                    },
                    afterExportStarted: function () {
                        jqUnit.assertEquals("The status should be updated to the inProgress state", inProgress, exporter.model.status);
                        start();
                    }
                },
                strings: {
                    inProgress: inProgress
                }
            });
            
            exporter.setStarted();
        });
        
        tests.asyncTest("Start export: Success", function () {
            expect(4);
            var inProgress = "Making PDF...";
            var exporter = decapod.exporter({
                listeners: {
                    serverSuccess: function () {
                        jqUnit.assertTrue("The export was successfully triggered", true);
                        start();
                    },
                    afterStatusChanged: function (newStatus, oldStatus) {
                        jqUnit.assertEquals("The in progress status should be set", inProgress, newStatus);
                        jqUnit.assertFalse("The old status should be falsey", oldStatus);
                    },
                    afterExportStarted: function () {
                        jqUnit.assertEquals("The status should be updated to the inProgress state", inProgress, exporter.model.status);
                    }
                },
                strings: {
                    inProgress: inProgress
                }
            });
            
            exporter.start();
        });
        
        tests.asyncTest("Start export: Fail", function () {
            expect(1);
            var exporter = decapod.exporter({
                listeners: {
                    serverError: function () {
                        jqUnit.assertTrue("There should be an error event", true);
                        start();
                    },
                    afterStatusChanged: function (newStatus, oldStatus) {
                        jqUnit.assertFalse("The afterStatusChanged event shouldn't have fired", true);
                    },
                    afterExportStarted: function () {
                        jqUnit.assertFalse("The afterExportStarted event shouldn't have fired", true);
                    }
                }
            });
            
            exporter.start(decapod.exporter.test.error);
        });
        
        tests.test("setFetched", function () {
            expect(2);
            var url = "../path/to/download";
            var complete = "Completed";
            var model = {
                status: complete,
                downloadSRC: url
            };
            var exporter = decapod.exporter({
                listeners: {
                    afterModelChanged: function (newModel, oldModel) {
                        jqUnit.assertDeepEq("The model should represent the completion of export", model, newModel);
                        jqUnit.assertDeepEq("The components model should be set", model, exporter.model);
                        start();
                    }
                },
                strings: {
                    completed: complete
                }
            });
            
            exporter.setFetched(url);
        });
        
        tests.asyncTest("Fetch export: Error", function () {
            expect(1);
            var exporter = decapod.exporter({
                listeners: {
                    serverSuccess: function () {
                        jqUnit.assertFalse("The serverSuccess event shouldn't have fired", true);
                    },
                    serverError: function () {
                        jqUnit.assertTrue("The serverFailure event should have fired", true);
                        start();
                    }
                }
            });
            
            exporter.fetchExport(decapod.exporter.test.error);
        });
        
        tests.asyncTest("Fetch export: In Progress", function () {
            expect(1);
            var exporter = decapod.exporter({
                listeners: {
                    serverSuccess: function () {
                        jqUnit.assertTrue("The serverSuccess event should have fired", true);
                        start();
                    },
                    serverError: function () {
                        jqUnit.assertFalse("The serverFailure event shouldn't have fired", true);
                    },
                    afterModelChanged: function () {
                        jqUnit.assertFalse("The afterModelChanged event shouldn't have fired", true);
                    }
                }
            });
            
            exporter.fetchExport(decapod.exporter.test.inProgress);
        });
        
        tests.asyncTest("Fetch export: Complete", function () {
            expect(3);
            var complete = "Completed";
            var model = {
                status: complete,
                downloadSRC: "../path/to/download"
            };
            var exporter = decapod.exporter({
                listeners: {
                    serverSuccess: function () {
                        jqUnit.assertTrue("The serverSuccess event should have fired", true);
                    },
                    serverError: function () {
                        jqUnit.assertFalse("The serverFailure event shouldn't have fired", true);
                    },
                    afterModelChanged: function () {
                        jqUnit.assertTrue("The afterModelChanged event should have fired", true);
                        jqUnit.assertDeepEq("The model should indicate that it is completed", model, exporter.model);
                        start();
                    }
                },
                strings: {
                    complete: complete
                }
            });
            
            exporter.fetchExport(decapod.exporter.test.complete);
        });
        
        tests.asyncTest("Fetch export: Success", function () {
            expect(1);
            var exporter = decapod.exporter({
                listeners: {
                    serverSuccess: function () {
                        jqUnit.assertTrue("The serverSuccess event should have fired", true);
                        start();
                    },
                    serverError: function () {
                        jqUnit.assertFalse("The serverFailure event shouldn't have fired", true);
                    },
                    afterModelChanged: function () {
                        jqUnit.assertFalse("The afterModelChanged event shouldn't have fired", true);
                    }
                }
            });
            
            exporter.deleteExport();
        });
        
        tests.asyncTest("Fetch export: Error", function () {
            expect(1);
            var exporter = decapod.exporter({
                listeners: {
                    serverSuccess: function () {
                        jqUnit.assertFalse("The serverSuccess event shouldn't have fired", true);
                    },
                    serverError: function () {
                        jqUnit.assertTrue("The serverFailure event should have fired", true);
                        start();
                    },
                    afterModelChanged: function () {
                        jqUnit.assertFalse("The afterModelChanged event shouldn't have fired", true);
                    }
                }
            });
            
            exporter.deleteExport(decapod.exporter.test.error);
        });
        
        tests.asyncTest("Update model", function () {
            expect(3);
            var model = {
                status: "Complete",
                downloadSRC: "../path/to/download"
            };
            var exporter = decapod.exporter({
                listeners: {
                    afterModelChanged: function (newModel, oldModel) {
                        jqUnit.assertDeepEq("The new model should match the passed in value", model, newModel);
                        jqUnit.assertDeepEq("The old model should be empty", {}, oldModel);
                        jqUnit.assertDeepEq("The components model should be set", model, exporter.model);
                        start();
                    }
                }
            });

            exporter.updateModel(model);
        });
        
        var testResetModel = function (msg, origModel) {
            var orignalModel = fluid.copy(origModel);
            tests.test(msg, function () {
                var setModel = {
                    status: "Complete",
                    downloadSRC: "../path/to/download"
                };
                var exporter = decapod.exporter({
                    model: orignalModel
                });
                
                exporter.updateModel(setModel);
                exporter.resetModel();
                jqUnit.assertDeepEq("The model should be reset", origModel, exporter.model);
            });
        };
        
        testResetModel("Test resetModel, when the original model is an empty object", {});
        testResetModel("Test resetModel, when the original model is fully specified", {
            status: "Started",
            downloadSRC: "../path/to/export"
        });
    });
})(jQuery);



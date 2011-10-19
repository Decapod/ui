/*
Copyright 2010 University of Toronto

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one of these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
*/

/*global jQuery,fluid,jqUnit,expect,decapod*/

(function ($) {
    
    var component;
    var eventFired = false;
    
    var setup = function () {
        var opts = {
            initialModel: {
                status: "success"
            },
            listeners: {
                afterRender: function () {
                    eventFired = true;
                }
            }
        };
        
        component = decapod.cameraMessage(".dc-cameraMessage", opts);
    };
    
    var teardown = function () {
        component = null;
        eventFired = false;
    };
    
    /**
     * Returns the text of the passed selector
     * 
     * @param {Object} component
     * @param {Object} selector, a selector for the element who's text is returned
     */
    var getText = function (component, selector) {
        return component.locate(selector).text();
    };
    
    /**
     * Asserts the error state for a given error
     * 
     * @param {Object} component
     * @param {Object} error, the error that should be displayed
     */
    var assertErrorStrings = function (component, error) {
        var str = component.options.strings;
        
        jqUnit.assertEquals("The " + error + " message is set", str.statuses[error], getText(component, "message"));
        jqUnit.assertEquals("The supported cameras message is set", str.supportedCamerasMessage, getText(component, "supportedCamerasMessage"));
        jqUnit.assertEquals("The supported cameras button text is set", str.supportedCamerasButton, getText(component, "supportedCamerasButton"));
        jqUnit.assertEquals("The retry link text is set", str.retryLink, getText(component, "retryAndContinue"));
        jqUnit.assertEquals("The skip link text is set", str.skipErrorLink, getText(component, "skipLink"));
    };
    
    /**
     * Asserts the success state
     * 
     * @param {Object} component
     */
    var assertSuccessStrings = function (component) {
        var str = component.options.strings;
        
        jqUnit.assertEquals("The success message is set", str.statuses.success, getText(component, "message"));
        jqUnit.assertEquals("The continue link text is set", str.continueLink, getText(component, "retryAndContinue"));
        jqUnit.assertEquals("The skip link text is set", str.skipSuccessLink, getText(component, "skipLink"));
        jqUnit.assertEquals("The warning message is set", str.skipWarningSuccess, getText(component, "warning"));
        
        //assert items aren't present
        jqUnit.assertEquals("The supported cameras message should not be rendered", 0, component.locate("supportedCamerasMessage").length);
        jqUnit.assertEquals("The supported cameras button should not be rendered", 0, component.locate("supportedCamerasButton").length);
    };
    
    var assertModel = function (component, status) {
        jqUnit.assertEquals("The model should be updated", status, component.model.status);
    };
    
    $(document).ready(function () {
        var messageTests = new jqUnit.TestCase("CameraMessage Tests", setup, teardown);
        
        messageTests.test("Default Model Status", function () {
            var initStatus = component.options.initialModel.status;
            
            if (initStatus) {
                if (initStatus === "success") {
                    assertSuccessStrings(component);
                } else {
                    assertErrorStrings(component, initStatus);
                }
                jqUnit.assertTrue("afterRender event should have fired", eventFired);
            }
        });
        
        messageTests.test("Success Message", function () {
            component.updateStatus("success");
            assertSuccessStrings(component);
            assertModel(component, "success");
            jqUnit.assertTrue("afterRender event should have fired", eventFired);
        });
        
        messageTests.test("One Camera and Incompatible Error Message", function () {
            var error = "oneCameraIncompatible";
            
            component.updateStatus(error);
            assertErrorStrings(component, error);
            assertModel(component, error);
            jqUnit.assertTrue("afterRender event should have fired", eventFired);
        });
        
        messageTests.test("One Compatible Camera Connected Error Message", function () {
            var error = "oneCameraCompatible";
            
            component.updateStatus(error);
            assertErrorStrings(component, error);
            assertModel(component, error);
            jqUnit.assertTrue("afterRender event should have fired", eventFired);
        });
        
        messageTests.test("One Camera Compatible One Not Error Message", function () {
            var error = "notMatchingOneCompatibleOneNot";
            
            component.updateStatus(error);
            assertErrorStrings(component, error);
            assertModel(component, error);
            jqUnit.assertTrue("afterRender event should have fired", eventFired);
        });
        
        messageTests.test("One Camera Connected and Compatible Error Message", function () {
            var error = "notMatchingIncompatible";
            
            component.updateStatus(error);
            assertErrorStrings(component, error);
            assertModel(component, error);
            jqUnit.assertTrue("afterRender event should have fired", eventFired);
        });
        
        messageTests.test("Cameras Not Matching and Both Incompatible Error Message", function () {
            var error = "notMatchingIncompatible";
            
            component.updateStatus(error);
            assertErrorStrings(component, error);
            assertModel(component, error);
            jqUnit.assertTrue("afterRender event should have fired", eventFired);
        });
        
        messageTests.test("Cameras Not Matching and Both Compatible Error Message", function () {
            var error = "notMatchingCompatible";
            
            component.updateStatus(error);
            assertErrorStrings(component, error);
            assertModel(component, error);
            jqUnit.assertTrue("afterRender event should have fired", eventFired);
        });
        
        messageTests.test("Both Cameras are Incompatible Error Message", function () {
            var error = "incompatible";
            
            component.updateStatus(error);
            assertErrorStrings(component, error);
            assertModel(component, error);
            jqUnit.assertTrue("afterRender event should have fired", eventFired);
        });
        
        messageTests.test("No Cameras Connected Error Message", function () {
            var error = "noCameras";
            
            component.updateStatus(error);
            assertErrorStrings(component, error);
            assertModel(component, error);
            jqUnit.assertTrue("afterRender event should have fired", eventFired);
        });
        
        messageTests.test("Show Progress", function () {
            var progStyle = component.options.styles.showProgress;
            component.startProgress();
            
            jqUnit.assertEquals("Only one element should have the " + progStyle + " class", 1, $("." + progStyle).length);
            jqUnit.assertTrue("The cameraMessage component's container should have the " + progStyle + " class", component.container.hasClass(progStyle));
            
        });
        
        messageTests.test("Hide Progress", function () {
            var progStyle = component.options.styles.showProgress;
            
            component.startProgress();
            component.stopProgress();
            
            jqUnit.assertEquals("No element should have the " + progStyle + " class", 0, $(progStyle).length);
        });
    });
})(jQuery);

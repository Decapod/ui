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
    
    var setup = function () {
        var opts = {
            initialModel: {
                status: "success"
            }
        };
        
        component = decapod.cameraMessage(".dc-cameraMessage", opts);
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
     * Returns the url of the passed selector (only works for links)
     * 
     * @param {Object} component
     * @param {Object} selector, a selector for the element who's url is returned
     */
    var getURL = function (component, selector) {
        return component.locate(selector).attr("href");
    };
    
    /**
     * Asserts the error state for a given error
     * 
     * @param {Object} component
     * @param {Object} error, the error that should be displayed
     */
    var assertErrorStrings = function (component, error) {
        var str = component.options.strings;
        var url = component.options.urls;
        
        jqUnit.assertEquals("The " + error + " message is set", str[error], getText(component, "message"));
        jqUnit.assertEquals("The supported cameras message is set", str.supportedCamerasMessage, getText(component, "supportedCamerasMessage"));
        jqUnit.assertEquals("The supported cameras link text is set", str.supportedCamerasLink, getText(component, "supportedCamerasLink"));
        jqUnit.assertEquals("The supported cameras link url is set", url.supportedCamerasLink, getURL(component, "supportedCamerasLink"));
        jqUnit.assertEquals("The retry link text is set", str.retryLink, getText(component, "retryLink"));
        jqUnit.assertEquals("The retry link url is set", url.retryLink, getText(component, "retryLink"));
        jqUnit.assertEquals("The skip link text is set", str.skipErrorLink, getText(component, "skipLink"));
        jqUnit.assertEquals("The skip link url is set", url.skipErrorLink, getURL(component, "skipLink"));
        jqUnit.assertEquals("The warning message is set", str.skipWarningError, getText(component, "warning"));
    };
    
    var assertModel = function (component, status) {
        jqUnit.assertEquals("The model should be updated", status, component.model.status);
    };
    
    $(document).ready(function () {
        var messageTests = new jqUnit.TestCase("Message Tests", setup);
        
        messageTests.test("Success Message", function () {
            var str = component.options.strings;
            var url = component.options.urls;
            
            component.showSuccessMessage();
            
            //assert strings and urls are correct
            jqUnit.assertEquals("The success message is set", str.success, getText(component, "message"));
            jqUnit.assertEquals("The continue link text is set", str.continueLink, getText(component, "retryLink"));
            jqUnit.assertEquals("The continue link url is set", url.continueLink, getText(component, "retryLink"));
            jqUnit.assertEquals("The skip link text is set", str.skipSuccessLink, getText(component, "skipLink"));
            jqUnit.assertEquals("The skip link url is set", url.skipSuccessLink, getURL(component, "skipLink"));
            jqUnit.assertEquals("The warning message is set", str.skipWarningSuccess, getText(component, "warning"));
            
            //assert items aren't present
            jqUnit.assertEquals("The supported cameras message should not be rendered", 0, component.locate("supportedCamerasMessage").length);
            jqUnit.assertEquals("The supported cameras link should not be rendered", 0, component.locate("supportedCamerasLink").length);
            
            //assert model
            assertModel("success");
        });
        
        messageTests.test("One Camera and Incompatible Error Message", function () {
            var error = "oneCameraIncompatible";
            
            component.showErrorMessage(error);
            assertErrorStrings(component, error);
            assertModel(error);
        });
        
        messageTests.test("One Compatible Camera Connected Error Message", function () {
            var error = "oneCameraCompatible";
            
            component.showErrorMessage(error);
            assertErrorStrings(component, error);
            assertModel(error);
        });
        
        messageTests.test("One Camera Compatible One Not Error Message", function () {
            var error = "notMatchingOneCompatibleOneNot";
            
            component.showErrorMessage(error);
            assertErrorStrings(component, error);
            assertModel(error);
        });
        
        messageTests.test("One Camera Connected and Compatible Error Message", function () {
            var error = "notMatchingIncompatible";
            
            component.showErrorMessage(error);
            assertErrorStrings(component, error);
            assertModel(error);
        });
        
        messageTests.test("Cameras Not Matching and Both Incompatible Error Message", function () {
            var error = "notMatchingIncompatible";
            
            component.showErrorMessage(error);
            assertErrorStrings(component, error);
            assertModel(error);
        });
        
        messageTests.test("Cameras Not Matching and Both Compatible Error Message", function () {
            var error = "notMatchingCompatible";
            
            component.showErrorMessage(error);
            assertErrorStrings(component, error);
            assertModel(error);
        });
        
        messageTests.test("Both Cameras are Incompatible Error Message", function () {
            var error = "incompatible";
            
            component.showErrorMessage(error);
            assertErrorStrings(component, error);
            assertModel(error);
        });
        
        messageTests.test("No Cameras Connected Error Message", function () {
            var error = "noCameras";
            
            component.showErrorMessage(error);
            assertErrorStrings(component, error);
            assertModel(error);
        });
    });
})(jQuery);

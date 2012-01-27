/*
Copyright 2011 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one of these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
*/

// Declare dependencies
/*global window, decapod:true, fluid, jQuery, jqUnit*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {
    $(document).ready(function () {
        
        /*********************
         * renderThumbsTests *
         *********************/
        
        var renderThumbsTests = jqUnit.testCase("Decapod renderThumbs");
        
        //TODO: Test tree generation
        //TODO: Test events
        //TODO: Test event handlers
        
        var renderThumbsTestModel = {
            images: [
                {index: 1, thumbnail: "path/to/thumbnail1.png"},
                {index: 2, thumbnail: "path/to/thumbnail2.png"}
            ]
        };
        
        var testAltText = function (elm, expectedText) {
            jqUnit.assertEquals("Ensure the alt text is set correctly", expectedText, $(elm).attr("alt"));
        };
        
        var testImgSrc = function (elm, expectedSrc) {
            jqUnit.assertEquals("Ensure the src attribute is set correctly", expectedSrc, $(elm).attr("src"));
        };
        
        var testText = function (elm, expectedText) {
            jqUnit.assertEquals("Ensure the element's text is set correctly", expectedText, $(elm).text());
        };
        
        var testThumbRendering = function (that, model) {
            model = model;// || that.model;
            var numImages = model.images.length;
            var images = that.locate("image");
            var labels = that.locate("label");
            var delButtons = that.locate("delete");
            
            jqUnit.assertEquals("Ensure the correct number of images rendered", numImages, images.length);
            jqUnit.assertEquals("Ensure the correct number of labels rendered", numImages, labels.length);
            jqUnit.assertEquals("Ensure the correct number of delete buttons rendered", numImages, delButtons.length);
            
            images.each(function (idx, image) {
                var thumb = model.images[idx].thumbnail;
                testAltText(image, "Page " + (idx + 1));
                testImgSrc(image, thumb.value || thumb);
            })
            
            labels.each(function (idx, labelElm) {
                testText(labelElm, idx + 1);
            });
            
            delButtons.each(function (idx, delButton) {
                testText(delButton, "Delete");
            });
        };
        
        renderThumbsTests.test("Rendering tests", function () {
            var rt = decapod.renderThumbs(".dc-imageManagement-thumbnails", {
                model: renderThumbsTestModel
            });
            
            testThumbRendering(rt, renderThumbsTestModel);
        });
        
        /**********************
         * renderPreviewTests *
         **********************/
        
        var renderPreviewTests = jqUnit.testCase("Decapod renderPreview");

        //TODO: Test produced tree
        //TODO: Test rendering
        //TODO: Test events
        
        /************************
         * imageManagementTests *
         ************************/
        
        var imageManagementTests = jqUnit.testCase("Decapod imageManagement integration");
        
        //TODO: Test rendering
        //TODO: Test events
        //TODO: Test updating preview
        //TODO: Test updating model
    });
})(jQuery);

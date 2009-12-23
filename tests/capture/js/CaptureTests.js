/*
Copyright 2008-2009 University of Toronto

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one of these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
*/

/*global jQuery*/
/*global fluid*/
/*global jqUnit*/
/*global expect*/

(function ($) {
    $(document).ready(function () {
        
        var tests = jqUnit.testCase("Decapod Capture Tests");
        
        var options = {
            thumbs: [
                {
                    fullImage: "../../../components/server/testData/Image1.jpg",
                    thumbImage: "../../../components/server/testData/Image1-thumb.jpg"
                },
                {
                    fullImage: "../../../components/server/testData/Image2.jpg",
                    thumbImage: "../../../components/server/testData/Image2-thumb.jpg"
                },
                {
                    fullImage: "../../../components/server/testData/Image3.jpg",
                    thumbImage: "../../../components/server/testData/Image3-thumb.jpg"
                },
                {
                    fullImage: "../../../components/server/testData/Image4.jpg",
                    thumbImage: "../../../components/server/testData/Image4-thumb.jpg"
                }
            ],
            offlineMode: true
        };
        
        /**
         * Finds the path to the full-sized image of an item in the model
         * by the source of its thumbnail image. Returns the path found or a
         * default path if no such item exists.
         * 
         * @param {Array} model, the model of items to search in
         * @param {String} src, the 'src' tag of the thumbnail image
         */
        var findFullSrc = function (model, thumbSrc) {
            var i;
            for (i = 0; i < model.length; i++) {
                if (model[i].thumbImage === thumbSrc) {
                    return model[i].fullImage;
                }
            }
            
            return "../../../components/server/testData/noImage.jpg";
        };
        
        /**
         * Tests if the component is initialized properly. The containers for 
         * the Capture and ImageReorderer should be set correctly. Model should
         * not be undefined or null.
         * 
         * @param {Object} component, the Capture component to be tested
         */
        var testComponentConstruction = function (component) {
            var captureContainer = $(".flc-capture");
            var reordererContainer = $(".flc-imageReorderer");
            
            jqUnit.assertEquals("Capture container is set to", captureContainer[0].id, component.container[0].id);
            jqUnit.assertEquals("Image reorderer container is set to", reordererContainer[0].id, component.imageReorderer.container[0].id);
            
            jqUnit.assertNotUndefined("Model is not undefined", component.model);
            jqUnit.assertNotNull("Model is not null", component.model);
        };
        
        /**
         * Tests whether the preview area correctly represents the currently
         * selected thumbnail item.
         * 
         * @param {Object} component, the Capture component to be tested
         * @param {Object} thumbItem, the selected item which should be displayed
         *                  full-sized in the preview area.
         */
        var testPreview = function (component, thumbItem) {
            var thumbSrc = $(thumbItem).find(component.options.selectors.thumbImage).attr('src');
            var fullSrc = findFullSrc(component.model, thumbSrc);
            var imagePreview = component.locate("imagePreview")[0];
            
            jqUnit.assertEquals("Image in preview is", fullSrc, $(imagePreview).attr('src'));
        };
        
        tests.test("Component construction with no model", function () {
            expect(7);
            
            var capture = fluid.capture(".flc-capture");
            var thumbItems = capture.locate("thumbItem");
            testComponentConstruction(capture);
            
            jqUnit.assertEquals("Model length is", 0, capture.model.length);
            jqUnit.assertEquals("Image items on page are", 1, thumbItems.length);
            
            testPreview(capture, thumbItems[0]);
        });
        
        tests.test("Component construction with a sample model", function () {
            expect(7);
            
            var capture = fluid.capture(".flc-capture", options);
            var thumbItems = capture.locate("thumbItem");
            testComponentConstruction(capture);
            
            jqUnit.assertEquals("Model length is", options.thumbs.length, capture.model.length);
            jqUnit.assertEquals("Image items on page are", capture.model.length, thumbItems.length);
            
            testPreview(capture, thumbItems[thumbItems.length - 1]);
        });
        
        tests.test("Preview update on image selection", function () {
            expect(2);
            
            var capture = fluid.capture(".flc-capture", options);
            
            var firstItem = capture.locate("thumbItem")[0];
            var secondItem = capture.locate("thumbItem")[1];
            
            $(firstItem).click();
            testPreview(capture, firstItem);
            
            $(secondItem).click();
            testPreview(capture, secondItem);
        });
        
        tests.test("Thumbnail deletion", function () {
            expect(6);
            
            var capture = fluid.capture(".flc-capture", options);
            var currentLength = options.thumbs.length;
            var thumbItems = capture.locate("thumbItem");
            $(thumbItems[0]).focus();
            var deleteButton = $(thumbItems[0]).find(capture.options.selectors.deleteButton)[0];
            var itemToBeSelected = thumbItems[1];
            
            jqUnit.assertEquals("Model length before deletion is", currentLength, capture.model.length);
            jqUnit.assertEquals("Images on page before deletion are", currentLength, thumbItems.length);            
            
            $(deleteButton).click();
            thumbItems = capture.locate("thumbItem");
            
            jqUnit.assertEquals("Model length after deletion is", currentLength - 1, capture.model.length);
            jqUnit.assertEquals("Images on page after deletion are", currentLength - 1, thumbItems.length);
            
            testPreview(capture, itemToBeSelected);
            
            currentLength = capture.model.length;
            $(thumbItems[currentLength - 1]).focus();
            deleteButton = $(thumbItems[currentLength - 1]).find(capture.options.selectors.deleteButton)[0];
            itemToBeSelected = thumbItems[currentLength - 2];
            
            $(deleteButton).click();
            testPreview(capture, itemToBeSelected);
        });
        
        tests.test("Taking pictures", function () {
            expect(3);
            
            var capture = fluid.capture(".flc-capture", options);
            var thumbItems;
            
            var takePictureButton = capture.locate("takePictureButton")[0];
            
            $(takePictureButton).click();
            thumbItems = capture.locate("thumbItem");
            
            jqUnit.assertEquals("Model length after first picture taken", options.thumbs.length + 1, capture.model.length);
            jqUnit.assertEquals("Images on page after first picture taken", capture.model.length, thumbItems.length);
            testPreview(capture, thumbItems[thumbItems.length - 1]);
        });
        
        tests.test("Deleting the last image left", function () {
            expect(2);
            
            var capture = fluid.capture(".flc-capture", {
                thumbs: [
                    {
                        fullImage: "../../../components/server/testData/Image1.jpg",
                        thumbImage: "../../../components/server/testData/Image1-thumb.jpg"
                    }
                ],
                offlineMode: true
            });
            
            var thumbItems = capture.locate("thumbItem");
            var deleteButton = $(thumbItems[0]).find(capture.options.selectors.deleteButton)[0];
            $(deleteButton).click();
            
            jqUnit.assertEquals("Model length is", 0, capture.model.length);
            jqUnit.assertEquals("Image items on page are", 1, thumbItems.length);
        });
    });
    
})(jQuery);

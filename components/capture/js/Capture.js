/*
Copyright 2009 University of Toronto

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one of these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
*/

/*global jQuery*/
/*global fluid_1_2*/

fluid_1_2 = fluid_1_2 || {};

(function ($, fluid) {
    
    /**
     * Renders the reorderable list of thumbnails. For each item in the model
     * adds the appropriate markup for it. An item in the rendered markup
     * consists of a label (optionally), an image and a delete button. The last
     * two should be present exactly once in the markup. Currently only the
     * image is rendered dynamically. 
     * 
     * @param {Object} that, the Capture component
     */
    var render = function (that) {
        if (that.model.length === 0) {
            return; // We do not want to render an empty model (and thus destroy the HTML template).
        }
        
        var selectorMap = [
            {selector: that.options.selectors.thumbItem, id: "item:"},
            {selector: that.options.selectors.thumbImage, id: "image"}
        ];
        
        var generateTree = function () {
            
            return fluid.transform(that.model, function (object) {
                var tree = {
                    ID: "item:",
                    children: [
                        {
                            ID: "image",
                            target: object.thumbImage
                        }
                    ]
                };
                
                return tree;
            });
        };
        
        var options = {
            cutpoints: selectorMap
        };
        
        return fluid.selfRender(that.locate(that.options.selectors.imageReorderer), generateTree(), options);
    };
    
    /**
     * Finds an item in the model by the source of its thumbnail image. Returns
     * the index of that item in the model or -1 if no such item exists.
     * 
     * @param {Array} model, the model of items to search in
     * @param {String} src, the 'src' tag of the thumbnail image
     */
    var findByThumbSrc = function (model, thumbSrc) {
        var i;
        for (i = 0; i < model.length; i++) {
            if (model[i].thumbImage === thumbSrc) {
                return i;
            }
        }
        
        return -1;
    };
    
        /**
     * Adds a listener for the click event of the delete button. Should remove
     * the item from the model as well as from the markup. Asks for confirmation
     * before that and focuses on the next image (if such) after deletion. If
     * the last image is deleted, the previous thumbnail is selected.
     * 
     * @param {Object} that, the Capture component
     * @param {Object} item, the item that is to be deleted
     */
    var bindDeleteHandler = function (that, item) {
        var images = $(item).find(that.options.selectors.thumbImage);
        if (images.length !== 1) {
            fluid.fail("Each thumbnail item is expected to have exactly one image.");
        }
        
        var deleteButton = $(item).find(that.options.selectors.deleteButton);
        deleteButton.click(
            function () {
                var previewSrc = "../../server/testData/noImage.jpg";
                
                var imgSrc = $(images).attr('src');
                var itemIndex = findByThumbSrc(that.model, imgSrc);
                var fileIndex = imgSrc.match(/\d+/);
                
                if (itemIndex === -1) {
                    fluid.fail("The image you want to delete is not in the model.");
                }
                
                that.model.splice(itemIndex, 1);
                if ($(item).next().length !== 0) {
                    $(item).next().focus();
                } else {
                    $(item).prev().focus();
                }
                
                $(item).remove();
                if (that.options.serverOn) {
                    $.get("http://localhost:8080/delete?fileIndex=" + fileIndex);
                }
                
                if (that.model.length === 0) {
                    $(that.locate("imageReorderer")).append(that.initialModel);
                    $(that.locate("imagePreview")).attr('src', previewSrc);
                }
                
                that.imageReorderer.refresh();
            });
    };
    
    /**
     * Adds a listener for the onSelect event of the Reorderer. The listener
     * should display the selected thumbnail in the preview area of the Capture
     * component.
     * 
     * @param {Object} that, the Capture component
     */
    var addSelectionListener = function (that) {
        return {
            listeners: {
                onSelect: function (item) {
                    var deleteButtonMarkup = '<a class="flc-imageReorderer-button-delete fl-button-left">' +
                      '<span class="fl-button-inner">Delete</span></a>';
                    $(that.locate("deleteButton")).remove();
                    
                    if ($(item).find(that.options.selectors.deleteButton).length === 0) {
                        $(item).append(deleteButtonMarkup);
                        bindDeleteHandler(that, item);
                    }
                    
                    var images = $(item).find(that.options.selectors.thumbImage);
                    var imagePreview = that.locate("imagePreview");
                    var previewSrc;
                    
                    if (images.length !== 1) {
                        fluid.fail("Each thumbnail item is expected to have exactly one image.");
                    }
                    
                    var itemIndex = findByThumbSrc(that.model, $(images).attr('src'));
                    
                    if (that.model.length !== 0) {
                        previewSrc = that.model[itemIndex].fullImage;
                    }
                    
                    $(imagePreview).attr('src', previewSrc);
                }
            }
        };
    };
    
    /**
     * Binds listeners for the click events of the various buttons in the UI,
     * such as fixing/comparing images, exporting to PDF, and taking pictures.
     * 
     * Adds a listener for the afterPictureTaken event. Should refresh the thumbnails
     * displayed and select the last captured image.
     * 
     * @param {Object} that, the Capture component
     */
    var bindHandlers = function (that) {
        that.events.afterPictureTaken.addListener(function (newItem) {
            var clone = $(that.initialModel).clone();
            
            if (that.model.length === 1) {
                $(that.initialModel).remove();
            }
            
            $(clone).find(".flc-imageReorderer-itemIndex").text(that.model.length);
            var images = $(clone).find(that.options.selectors.thumbImage);
            $(images).attr('src', newItem.thumbImage);
           
            $(that.locate("imageReorderer")).append(clone);
            that.imageReorderer.refresh();
            $(clone).focus();
        });
        
        that.locate("fixButton").click(
            function () {
                // TODO Implement fix image functionality.
        });
        
        that.locate("compareButton").click(
            function () {
                // TODO Implement compare images functionality.
        });
        
        that.locate("exportButton").click(
            function () {
                // TODO Implement export to PDF functionality.
        });
        
        var imageToInsert = 0;
        var totalImages = 5; // For testing purposes in offline mode only.
        that.locate("takePictureButton").click(
            function () {
                var newItem = {};
                var params = {
                    fileIndex: imageToInsert
                };
                if (that.options.cameraOn) {
                    params.cameraOn = 'True';
                }
                if (that.options.serverOn) {
                    $.get("http://localhost:8080/takePicture", params, function (path) {
                        var imagePaths = path.split("|");
                        newItem.fullImage = imagePaths[0];
                        newItem.thumbImage = imagePaths[1];
                        
                        that.model.push(newItem);
                        that.events.afterPictureTaken.fire(newItem);
                        imageToInsert++;
                    });
                } else {
                    var imageToShow = imageToInsert % totalImages;
                    newItem.fullImage = "../../server/testData/capturedImages/Image" + imageToShow + ".jpg";
                    newItem.thumbImage = "../../server/testData/capturedImages/Image" + imageToShow + "-thumb.jpg";
                    
                    that.model.push(newItem);
                    that.events.afterPictureTaken.fire(newItem);
                    imageToInsert++;
                }
        });
        
        if (that.model.length !== 0) {
            var thumbItems = that.locate("thumbItem");
            $(thumbItems[thumbItems.length - 1]).focus();
        }
    };
    
    /**
     * Creates a View for the Capture component. Contains an imageReorderer
     * subcomponent, a preview area for the image, and controls for capturing
     * images and manipulating them.
     * 
     * @param {Object} container, the component this View should be placed in
     * @param {Object} options, the options passed into the component
     */
    fluid.capture = function (container, options) {
        var that = fluid.initView("fluid.capture", container, options);
        
        that.model = that.options.thumbs || [];
        that.initialModel = that.locate("thumbItem").get(0);
        
        render(that);
        
        var selectOptions = addSelectionListener(that);
        fluid.merge(null, selectOptions, that.options.imageReorderer.options);
        
        that.imageReorderer = fluid.initSubcomponent(
          that, "imageReorderer", [that.locate("imageReorderer"), selectOptions]);
        
        bindHandlers(that);
        
        return that;
    };
    
    fluid.defaults("fluid.capture", {
        imageReorderer: {
            type: "fluid.reorderImages",
            options: {
                selectors: {
                    movables: ".flc-imageReorderer-item",
                    imageTitle: ".flc-imageReorderer-label"
                }
            }
        },
        
        selectors: {
            imageReorderer: ".flc-imageReorderer",
            thumbItem: ".flc-imageReorderer-item",
            thumbImage: ".flc-imageReorderer-image",
            deleteButton: ".flc-imageReorderer-button-delete",
            
            fixButton: ".flc-capture-button-fix",
            compareButton: ".flc-capture-button-compare",
            exportButton: ".flc-capture-button-export",
            takePictureButton: ".flc-capture-button-takePicture",
            imagePreview: ".flc-capture-image-preview"
        },
        
        events: {
            afterPictureTaken: null
        }
    });
    
})(jQuery, fluid_1_2);

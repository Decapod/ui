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
     * consists of a label, an image, and a delete button that is visible only
     * when the item is selected. All these should be present exactly once.
     * Currently the image and its index are rendered dynamically.
     * 
     * @param {Object} that, the Capture component
     */
    var render = function (that) {
        if (that.model.length === 0) {
            return; // We do not want to render an empty model (and thus destroy the HTML template).
        }
        
        var selectorMap = [
            {selector: that.options.selectors.thumbItem, id: "item:"},
            {selector: that.options.selectors.itemIndex, id: "index"},
            {selector: that.options.selectors.thumbImage, id: "image"}
        ];
        
        var generateTree = function () {
            
            return fluid.transform(that.model, function (object, index) {
                var tree = {
                    ID: "item:",
                    children: [
                        {
                            ID: "index",
                            value: index + 1
                        },
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
     * Refreshes the indices in the thumbnails' title. Should be called after
     * model change - for example deletion or reordering of images.
     * 
     * @param {Object} that, the Capture component
     */
    var refreshIndices = function (that) {
        that.locate("itemIndex").each(function (index, item) {
            $(item).text(index + 1);
        });
    };
    
    /**
     * Adds a listener for the click event of the delete button. Should remove
     * the item from the model as well as from the markup. When working with the
     * server on, removes the image from the file system as well. Focuses on the
     * next image (if such) after the deletion. If the last image is deleted,
     * the previous thumbnail is selected.
     * 
     * @param {Object} that, the Capture component
     * @param {Object} item, the item that is to be deleted
     */
    var bindDeleteHandler = function (that, item) {
        var deleteButton = $(':visible', that.locate("deleteButton"));
        deleteButton.click(
            function () {
                var itemIndex = $(item).find(that.options.selectors.itemIndex).text() - 1;
                if (itemIndex === -1) {
                    fluid.fail("The image you want to delete is with an invalid index.");
                }
                
                if ($(item).next().length !== 0) {
                    $(item).next().focus();
                } else {
                    $(item).prev().focus();
                }
                
                $(item).remove();
                
                if (that.options.serverOn) {
                    var fileIndex = that.model[itemIndex].fullImage.match(/\d+/);
                    $.get("http://localhost:8080/delete?fileIndex=" + fileIndex);
                }
                
                if (that.model.length === 1) {
                    var previewSrc = "../../server/testData/noImage.jpg";
                    
                    that.locate("imageReorderer").append(that.initialModel);
                    that.locate("deleteButton").hide();
                    that.locate("imagePreview").attr('src', previewSrc);
                }
                
                that.model.splice(itemIndex, 1);
                refreshIndices(that);
                that.imageReorderer.refresh();
            });
    };    
    
    /**
     * Reorders the model after images have been reordered on the page. Moves an
     * image from the old index to its new one by manipulating the array
     * directly.
     * 
     * @param {Object} model, the model of images to be reordered
     * @param {Object} index, the new index of the moved image
     * @param {Object} oldIndex, the old index of the moved image
     */
    var reorderModel = function (model, index, oldIndex) {
        var result;
        var start;
        var middle;
        var end;
        
        if (index > oldIndex) {
            start = model.slice(0, oldIndex);
            middle = model.slice(oldIndex + 1, index + 1);
            end = model.slice(index + 1);
            
            result = start.concat(middle);
            result.push(model[oldIndex]);
            result = result.concat(end);
        } else {
            start = model.slice(0, index);
            middle = model.slice(index, oldIndex);
            end = model.slice(oldIndex + 1);
            
            result = start;
            result.push(model[oldIndex]);
            result = result.concat(middle).concat(end);
        }
        
        return result;
    };
    
    /**
     * Adds listeners for the events of the Reorderer. The onSelect listener
     * should display the selected thumbnail in the preview area of the Capture
     * component. The afrerMove listener should update the model and refresh the
     * indices in the title of the images.
     * 
     * @param {Object} that, the Capture component
     */
    var addReordererListeners = function (that) {
        return {
            listeners: {
                onSelect: function (item) {
                    that.locate("deleteButton").hide();
                    
                    var imagePreview = that.locate("imagePreview");
                    var previewSrc = "../../server/testData/noImage.jpg";
                    
                    var itemIndex = $(item).find(that.options.selectors.itemIndex).text() - 1;
                    
                    if (that.model.length !== 0) {
                        previewSrc = that.model[itemIndex].fullImage;
                        $(item).find(that.options.selectors.deleteButton).show();
                        bindDeleteHandler(that, item);
                    }
                    
                    imagePreview.attr('src', previewSrc);
                },
                
                afterMove: function (item, requestedPosition, allItems) {
                    var index = allItems.index(item);
                    var oldIndex = $(item).find(that.options.selectors.itemIndex).text() - 1;
                    
                    if (index === oldIndex) {
                        return;
                    }
                    
                    that.model = reorderModel(that.model, index, oldIndex);
                    refreshIndices(that);
                }
            }
        };
    };
    
    /**
     * Binds listeners for the click events of the various buttons in the UI,
     * such as fixing/comparing images, exporting to PDF, and taking pictures.
     * 
     * Adds a listener for the afterPictureTaken event. Should refresh the
     * thumbnails displayed and select the last captured image.
     * 
     * @param {Object} that, the Capture component
     */
    var bindHandlers = function (that) {
        that.events.afterPictureTaken.addListener(function (newItem) {
            var clone = $(that.initialModel).clone();
            
            if (that.model.length === 1) {
                $(that.initialModel).remove();
            }
            
            $(clone).find(that.options.selectors.itemIndex).text(that.model.length);
            var images = $(clone).find(that.options.selectors.thumbImage);
            $(images).attr('src', newItem.thumbImage);
           
            that.locate("imageReorderer").append(clone);
            that.imageReorderer.refresh();
            $(clone).focus();
        });
        
        var imageToInsert = 0;
        var totalImages = 5; // For testing purposes with no server only.
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
    };
    
    /**
     * Creates a View for the Capture component. Contains an imageReorderer
     * subcomponent, a preview area for the image, and controls for capturing
     * images and manipulating them.
     * 
     * @param {Object} container, the component this View should be placed in
     * @param {Object} options, the options passed to the component
     */
    fluid.capture = function (container, options) {
        var that = fluid.initView("fluid.capture", container, options);
        
        that.model = that.options.thumbs || [];
        that.initialModel = that.locate("thumbItem").get(0);
        
        render(that);
        that.locate("deleteButton").hide();
        
        var modifiedOptions = addReordererListeners(that);
        fluid.merge(null, modifiedOptions, that.options.imageReorderer.options);
        
        that.imageReorderer = fluid.initSubcomponent(
          that, "imageReorderer", [that.locate("imageReorderer"), modifiedOptions]);
        
        bindHandlers(that);
        
        if (that.model.length !== 0) {
            var thumbItems = that.locate("thumbItem");
            $(thumbItems[thumbItems.length - 1]).focus();
        }
        
        return that;
    };
    
    fluid.defaults("fluid.capture", {
        imageReorderer: {
            type: "fluid.reorderImages",
            options: {
                selectors: {
                    movables: ".flc-capture-thumbItem"
                }
            }
        },
        
        selectors: {
            imageReorderer: ".flc-capture-reorderer",
            thumbItem: ".flc-capture-thumbItem",
            imageLabel: ".flc-capture-thumbLabel",
            itemIndex: ".flc-capture-thumbIndex",
            thumbImage: ".flc-capture-thumbImage",
            deleteButton: ".flc-capture-button-delete",
            
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

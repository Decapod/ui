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
     * Refreshes the indices in the thumbnails' title. Should be called after
     * model change - for example deletion or reordering of images.
     * 
     * @param {Object} that, the Capture component
     */
    var refreshIndices = function (that) {
        that.locate("itemIndex").each(function (index) {
            $(this).text(index + 1);
        });
    };
    
    /**
     * Updates the state of various elements on the page according to the
     * currently selected image. Only one of the 'Fix image' and 'Compare
     * before/after' buttons should be enabled (depending on whether the image
     * is fixed or not). If the model is empty, both buttons should be disabled
     * and the empty thumbnail item should have no styles.
     * 
     * @param {Object} that, the Capture component
     */
    var updateElementStates = function (that) {
        var disabledClass = that.options.styles.stateDisabled;
        var hiddenClass = that.options.styles.elementHidden;
        var itemIndex = that.selectedItemIndex;
        
        if (itemIndex < 0 || itemIndex >= that.model.length) {
            that.locate("fixButton").addClass(disabledClass);
            that.locate("compareButton").addClass(disabledClass);
            
            var thumbItem = that.locate("thumbItem");
            thumbItem.children().addClass(hiddenClass);
            that.locate("noImage").removeClass(hiddenClass);
            
            return;
        }
        
        var isFixed = that.model[itemIndex].isFixed || false;
        that.locate("fixButton").toggleClass(disabledClass, isFixed);
        that.locate("compareButton").toggleClass(disabledClass, !isFixed);
    };
    
    /**
     * The function that is executed upon clicking the delete button. Finds the
     * currently selected thumbnail item by its index, stored in the view.
     * Should remove the item from the model as well as from the markup. When
     * working with the server on, removes the image from the file system as
     * well. Focuses on the next image (if such) after the deletion. If the last
     * image is deleted, the previous thumbnail is selected.
     * 
     * @param {Object} that, the Capture component
     * @param {Object} item, the thumbnail item to be deleted
     * @param {Object} itemIndex, the index of the item in the model
     */
    // TODO Show a confirmation dialog before deleting.
    var deleteHandler = function (that) {
        var itemIndex = that.selectedItemIndex;
        if (itemIndex < 0 || itemIndex >= that.model.length) {
            return; // No image selected or invalid index.
        }
        
        if (that.options.serverOn) {
            // TODO Send the filename of the image to be deleted to the server.
            // Or, if the model is persisted, only the item index.
            // We should not make assumptions about the file name.
            // TODO Load the server URL from a config file.
            var fileIndex = that.model[itemIndex].fullImage.match(/\d+/);
            $.get("http://localhost:8080/delete", {fileIndex: fileIndex});
        }
        
        if (that.model.length === 1) { // About to remove the last image.
            that.locate("imageReorderer").append(that.itemTemplate.clone());
            that.locate("imagePreview").removeAttr('src');
            that.selectedItemIndex = -1;
            updateElementStates(that);
        }
        
        var item = that.locate("thumbItem").get(itemIndex);
        
        var next = $(item).next(":visible");
        var prev = $(item).prev(":visible");
        
        $(item).remove();
        refreshIndices(that);
        that.model.splice(itemIndex, 1);
        
        if (next.length !== 0) {
            next.focus();
        } else if (prev.length !== 0) {
            prev.focus();
        }
        
        that.imageReorderer.refresh();
    };
    
    /**
     * Renders the reorderable list of thumbnails. For each item in the model
     * adds the appropriate markup for it. An item in the rendered markup
     * consists of a label, an image, and a delete button that is visible only
     * when the item is selected. All these should be present exactly once.
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
            {selector: that.options.selectors.thumbImage, id: "image"},
            {selector: that.options.selectors.deleteButton, id: "deleteButton"}
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
                        },
                        {
                            ID: "deleteButton",
                            decorators: [
                                {
                                    type: "jQuery",
                                    func: "click",
                                    args: function () {
                                        deleteHandler(that);
                                    }
                                }
                            ]
                        }
                    ]
                };
                
                if (object.fixedImage) {
                    tree.decorators = [
                        {
                            type: "addClass",
                            classes: that.options.styles.itemFixed
                        }
                    ];
                }
                
                return tree;
            });
        };
        
        var options = {
            cutpoints: selectorMap
        };
        
        return fluid.selfRender(that.locate(that.options.selectors.imageReorderer), generateTree(), options);
    };
    
    /**
     * Reorders the model after images have been reordered on the page. Moves an
     * item from the old index to its new one by manipulating the array
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
                    var imagePreview = that.locate("imagePreview");
                    
                    var itemIndex = that.locate("itemIndex", item).text() - 1;
                    that.selectedItemIndex = itemIndex;
                    
                    if (that.model.length !== 0) {
                        imagePreview.attr("src", that.model[itemIndex].fullImage);
                    }
                    
                    updateElementStates(that);
                },
                
                afterMove: function (item, requestedPosition, allItems) {
                    var index = allItems.index(item);
                    var oldIndex = that.locate("itemIndex", item).text() - 1;
                    
                    if (index !== oldIndex) {
                        that.model = reorderModel(that.model, index, oldIndex);
                        refreshIndices(that);
                    }
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
            that.model.push(newItem);
            var clone = $(that.itemTemplate).clone(true);
            
            if (that.model.length === 1) {
                that.locate("thumbItem").remove();
            }
            
            that.locate("itemIndex", clone).text(that.model.length);
            var image = that.locate("thumbImage", clone);
            $(image).attr('src', newItem.thumbImage);
           
            that.locate("imageReorderer").append(clone);
            
            that.imageReorderer.refresh();
            $(clone).focus();
            var deleteButton = that.locate("deleteButton", clone);
            deleteButton.click(
                function () {
                    deleteHandler(that);
                });
        });
        
        // XXX Get rid of this once deployed on the build server.
        var totalImages = 5; // For testing purposes with no server only.
        that.locate("takePictureButton").click(
            function () {
                var newItem = {};
                
                var params = {
                    fileIndex: that.model.length
                };
                if (that.options.cameraOn) {
                    params.cameraOn = 'True';
                }
                
                // TODO Automatically detect if there is server according to the document location.
                if (that.options.serverOn) {
                    $.get("http://localhost:8080/takePicture", params, function (path) {
                        var imagePaths = path.split("|");
                        newItem.fullImage = imagePaths[0];
                        newItem.thumbImage = imagePaths[1];
                        
                        that.events.afterPictureTaken.fire(newItem);
                    });
                } else {
                    // TODO Load image paths from a config file instead of using them staticly.
                    var imageToShow = that.model.length % totalImages;
                    newItem.fullImage = "../../server/testData/capturedImages/Image" + imageToShow + ".jpg";
                    newItem.thumbImage = "../../server/testData/capturedImages/Image" + imageToShow + "-thumb.jpg";
                    
                    that.events.afterPictureTaken.fire(newItem);
                }
            });
            
        that.locate("fixButton").click(
            function () {
                var progressDialog = that.locate("progressDialog", document);
                progressDialog.dialog("open");
                if (that.options.serverOn) {
                    $.get("http://localhost:8080/fix", {fileIndex: that.selectedItemIndex}, function (fixedPath) {
                        that.model[that.selectedItemIndex].fixedImage = fixedPath;
                    });
                } else {
                    that.model[that.selectedItemIndex].fixedImage = that.model[that.selectedItemIndex].fullImage;
                }
                
                setTimeout(function () {
                    progressDialog.dialog("close");
                    
                    var selectedItem = that.locate("thumbItem").get(that.selectedItemIndex);
                    $(selectedItem).addClass(that.options.styles.itemFixed).focus();
                    
                    var fixConfirmMessage = that.locate("fixConfirmMessage");
                    fixConfirmMessage.slideDown(1000);
                    setTimeout(function () {
                        fixConfirmMessage.slideUp(1000);
                    }, 2000);
                    
                }, 3000);
            });
    };
    
    var initProgressDialog = function (that) {
        var dialogOptions = {
            modal: true,
            draggable: false,
            resizable: false,
            autoOpen: false,
            closeOnEscape: false,
            width: 160,
            height: 50,
            minHeight: 50,
            maxHeight: 50
        };
        
        that.locate("progressDialog").dialog(dialogOptions);
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
        that.selectedItemIndex = -1;
        that.itemTemplate = that.locate("thumbItem").clone();
        
        render(that);
        
        var reordererOptions = addReordererListeners(that);
        fluid.merge(null, reordererOptions, that.options.imageReorderer.options);        
        that.imageReorderer = fluid.initSubcomponent(that, "imageReorderer", [that.locate("imageReorderer"), reordererOptions]);
        
        initProgressDialog(that);
        bindHandlers(that);
        
        if (that.model.length !== 0) {
            var thumbItems = that.locate("thumbItem");
            $(thumbItems[thumbItems.length - 1]).focus();
        }
        updateElementStates(that);
        
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
            imageLabel: ".flc-capture-label-item",
            unfixedLabel: ".flc-capture-label-unfixed",
            itemIndex: ".flc-capture-label-index",
            thumbImage: ".flc-capture-thumbImage",
            deleteButton: ".flc-capture-button-delete",
            
            fixButton: ".flc-capture-button-fix",
            compareButton: ".flc-capture-button-compare",
            exportButton: ".flc-capture-button-export",
            takePictureButton: ".flc-capture-button-takePicture",
            imagePreview: ".flc-capture-image-preview",
            
            progressDialog: ".flc-capture-dialog",
            fixConfirmMessage: ".flc-capture-message-confirm",
            noImage: ".flc-capture-message-noImage"
        },
        
        styles: {
            stateDisabled: "ui-state-disabled",
            itemFixed: "fl-capture-thumbItem-fixed",
            elementHidden: "fl-capture-element-hidden"
        },
        
        events: {
            afterPictureTaken: null
        }
    });
    
})(jQuery, fluid_1_2);

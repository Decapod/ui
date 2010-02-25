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
        that.locate('itemIndex').each(function (index) {
            var labelText = [2 * index + 1, "-", 2 * index + 2];
            $(this).text(labelText.join(''));
        });
    };
    
    /**
     * Updates the state of various elements on the page. If the model is empty,
     * the empty thumbnail item should have no styles.
     * 
     * @param {Object} that, the Capture component
     */
    var updateElementStates = function (that) {
        var hiddenClass = that.options.styles.elementHidden;
        var itemIndex = that.selectedItemIndex;
        
        if (itemIndex < 0 || itemIndex >= that.model.length) {
            var thumbItem = that.locate("thumbItem");
            thumbItem.children().addClass(hiddenClass);
            that.locate("noImage").removeClass(hiddenClass);
            
            return;
        }
    };
    
    /**
     * Displays a message with user information. The message currently slides
     * down from the top of the page, stays for a moment and slides back up.
     * 
     * @param {Object} that, the Capture component
     * @param {Object} styleClass, the class used to determine the style of the message
     * @param {Object} text, the message text
     */
    var showMessage = function (that, styleClass, messageText) {
        var message = that.locate("message");
        message.text(messageText);
        message.addClass(styleClass);
        message.slideDown(1000);
        setTimeout(function () {
            message.slideUp(1000);
        }, 2000);
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
     * @param {Object} itemIndex, the index of the item in the model
     */
    var deleteHandler = function (that, itemIndex) {
        if (that.options.serverOn) {
            // TODO Load the server URL from a config file.
            $.ajax({
                url: "http://localhost:8080/images/" + itemIndex,
                type: "DELETE"
            });
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
        showMessage(that, "fl-message-confirm", "Image successfully deleted");
    };
    
    /**
     * Displays a confirmation dialog with the specified options.
     * 
     * @param {Object} that, the Capture component
     * @param {Object} title, the title of the dialog
     * @param {Object} message, the content of the dialog
     * @param {Object} confirmed, the callback to be executed on confirmation
     * @param {Object} cancelled, the callback to be executed on cancellation
     */
    var invokeConfirmationDialog = function (that, title, message, confirmed, cancelled) {
        var confirmDialog = that.locate("confirmDialog", document);
        confirmDialog.dialog('option', 'title', title);
        confirmDialog.text(message);
        confirmDialog.dialog('open');
        confirmDialog.bind('dialogclose', function (event, ui) {
            if (that.confirmed === true) {
                confirmed.call();
            } else {
                cancelled.call();
            }
            that.confirmed = false;
        });
    };
    
    /**
     * Handles a user request to delete the currently selected image. Displays a
     * confirmation dialog first and does nothing if the user cancels the
     * operation.
     * 
     * @param {Object} that, the Capture component
     */
    var deleteSelectedImage = function (that) {
        var itemIndex = that.selectedItemIndex;
        if (itemIndex < 0 || itemIndex >= that.model.length) {
            return; // No image selected or invalid index.
        }
        
        invokeConfirmationDialog(that, "Delete image?",
            "Are you sure you want to delete this image?",
            function () {
                deleteHandler(that, itemIndex);
            },
            function () {
                $(that.locate("thumbItem")[that.selectedItemIndex]).focus();
            });
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
                            value: [2 * index + 1, "-", 2 * index + 2].join('')
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
                                        deleteSelectedImage(that);
                                    }
                                }
                            ]
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
    // TODO Sync the model of the server with the one in the client.
    var addReordererListeners = function (that) {
        return {
            listeners: {
                onSelect: function (item) {
                    var imagePreview = that.locate("imagePreview");
                    
                    var labelText = that.locate('itemIndex', item).text();
                    var itemIndex = labelText.slice(labelText.indexOf('-') + 1) / 2 - 1;
                    
                    that.selectedItemIndex = itemIndex;
                    
                    if (that.model.length !== 0) {
                        imagePreview.attr("src", that.model[itemIndex].fullImage);
                    }
                    
                    updateElementStates(that);
                },
                
                afterMove: function (item, requestedPosition, allItems) {
                    var index = allItems.index(item);
                    var labelText = that.locate('itemIndex', item).text();
                    var oldIndex = labelText.slice(labelText.indexOf('-') + 1) / 2 - 1;
                    
                    if (index !== oldIndex) {
                        that.model = reorderModel(that.model, index, oldIndex);
                        refreshIndices(that);
                    }
                }
            }
        };
    };
    
    /**
     * Initializes two dialogs for the component - one for displaying progress
     * indication and another to ask for confirmation.
     * 
     * @param {Object} that, the Capture component
     */
    var initDialogs = function (that) {
        var progressOptions = {
            modal: true,
            draggable: false,
            resizable: false,
            autoOpen: false,
            closeOnEscape: false,
            width: 160,
            height: 50,
            minHeight: 50,
            maxHeight: 50,
            dialogClass: 'fl-container-progress'
        };
        
        var confirmOptions = {
            modal: true,
            autoOpen: false,
            dialogClass: 'fl-container-confirm',
            buttons: {
                "No": function () {
                    $(this).dialog("close");
                },
                "Yes": function () {
                    that.confirmed = true;
                    $(this).dialog("close");
                }
            }
        };
        
        that.locate("progressDialog", document).dialog(progressOptions);
        that.locate("confirmDialog", document).dialog(confirmOptions);
    };
    
    /**
     * Binds listeners for the click events of the various buttons in the UI.
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
            
            var labelText = [2 * that.model.length - 1, "-", 2 * that.model.length];
            that.locate('itemIndex', clone).text(labelText.join(''));
            
            var image = that.locate("thumbImage", clone);
            $(image).attr('src', newItem.thumbImage);
           
            that.locate("imageReorderer").append(clone);
            
            that.imageReorderer.refresh();
            $(clone).focus();
            var deleteButton = that.locate("deleteButton", clone);
            deleteButton.click(
                function () {
                    deleteSelectedImage(that);
                });
        });
        
        var totalImages = 5; // For testing purposes with no server only.
        that.locate("takePictureButton").click(
            function () {
                var newItem = {};
                
                var params = {
                    fileIndex: that.model.length
                };
                if (that.options.cameraOn) {
                    params['camera-on'] = 'True';
                }
                
                // TODO Automatically detect if there is server according to the document location.
                if (that.options.serverOn) {
                    $.ajax({
                        url: "http://localhost:8080/images/",
                        type: "POST",
                        dataType: "json",
                        success: function (json_model) {
                            newItem.fullImage = json_model.fullImage;
                            newItem.thumbImage = json_model.thumbImage;
                        
                            that.events.afterPictureTaken.fire(newItem);
                        }
                    });
                    
                } else {
                    // TODO Load image paths from a config file instead of using them staticly.
                    var imageToShow = that.model.length % totalImages;
                    newItem.fullImage = "../../server/testData/capturedImages/Image" + imageToShow + ".jpg";
                    newItem.thumbImage = "../../server/testData/capturedImages/Image" + imageToShow + "-thumb.jpg";
                    
                    that.events.afterPictureTaken.fire(newItem);
                }
            });
            
        that.locate("imageReorderer").keyup(function (event) {
            var thumbItems = that.locate('thumbItem');
            if ($.ui.keyCode.PAGE_UP === event.keyCode) {
                thumbItems.get(0).focus();
            } else if ($.ui.keyCode.PAGE_DOWN === event.keyCode) {
                thumbItems.get(thumbItems.length - 1).focus();
            } else if ($.ui.keyCode.DELETE === event.keyCode) {
                deleteSelectedImage(that);
            }
        });
        
        $().keyup(function (event) {
            if ($.ui.keyCode.SPACE === event.keyCode) {
                that.locate('takePictureButton').click();
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
        
        if (that.options.serverOn) {
            $.ajax({
                url: "http://localhost:8080/images/",
                dataType: "json",
                async: false,
                success: function (json_model) {
                    that.model = json_model;
                }
            });
        } else {
            that.model = that.options.thumbs || [];
        }
        
        that.selectedItemIndex = -1;
        that.itemTemplate = that.locate("thumbItem").clone();
        
        render(that);
        
        var reordererOptions = addReordererListeners(that);
        fluid.merge(null, reordererOptions, that.options.imageReorderer.options);
        that.imageReorderer = fluid.initSubcomponent(that, "imageReorderer", [that.locate("imageReorderer"), reordererOptions]);
        
        initDialogs(that);
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
            itemIndex: ".flc-capture-label-index",
            thumbImage: ".flc-capture-thumbImage",
            deleteButton: ".flc-capture-button-delete",
            
            exportButton: ".flc-capture-button-export",
            takePictureButton: ".flc-capture-button-takePicture",
            imagePreview: ".flc-capture-image-preview",
            
            progressDialog: ".flc-capture-dialog-progress",
            confirmDialog: ".flc-capture-dialog-confirm",
            message: ".flc-capture-message",
            noImage: ".flc-capture-message-noImage"
        },
        
        styles: {
            stateDisabled: "ui-state-disabled",
            elementHidden: "fl-capture-element-hidden"
        },
        
        events: {
            afterPictureTaken: null
        }
    });
    
})(jQuery, fluid_1_2);

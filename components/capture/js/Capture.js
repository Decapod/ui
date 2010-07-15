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
            that.locate("itemIndex").addClass(hiddenClass);
            that.locate("deleteButton").addClass(hiddenClass);
            that.locate("noImageLabel").removeClass(hiddenClass);
            that.locate("emptyPlaceholder").removeClass(hiddenClass);
        } else {
            that.locate("noImageLabel").remove();
            that.locate("emptyPlaceholder").remove();
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
            $.ajax({
                url: "/images/" + itemIndex,
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
        showMessage(that, "fl-capture-message-success", "Image successfully deleted");
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
        
        if (itemIndex >= 0 && itemIndex <= that.model.length) {
            deleteHandler(that, itemIndex);
        }
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
            // TODO Use thumbnail of stitched image instead of right image.
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
                            target: object.thumb
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
                    
                    // TODO Use stitched image instead of left image
                    if (that.model.length !== 0) {
                        imagePreview.attr("src", that.model[itemIndex].spread);
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

                    $.ajax({
                        url: "/images/",
                        type: "PUT",
                        data: {
                    	    images: JSON.stringify(that.model)
                        }
                    });

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
        
        var cameraOptions = {
            modal: true,
            autoOpen: false
        };
        
        that.locate("progressDialog", document).dialog(progressOptions);
        that.locate("confirmDialog", document).dialog(confirmOptions);
        that.locate("cameraDialog", document).dialog(cameraOptions);
    };
    
    /**
     * Displays an informational dialog about detected cameras. Should provide
     * the user with the list of camera models and whether they are supported or
     * not.
     * 
     * @param {Object} that, the Capture component
     */
    var invokeCameraDialog = function (that) {
        var cameraDialog = that.locate("cameraDialog", document);
        var cameraList = that.locate("cameraList", document);
        var camerasElement = that.locate("cameraEntry", document);
        cameraList.children().remove();
        
        that.detectedCameras = that.detectedCameras || [];
        for (var i = 0; i < that.detectedCameras.length; i++) {
            var cameraSupported = "Not ";
            if (that.detectedCameras[i].capture) {
                cameraSupported = "";
            }
            
            var textToInsert = [that.detectedCameras[i].model, "-", cameraSupported, "Supported"].join(" ");
            var elementToInsert = $(camerasElement[0]).clone().text(textToInsert);            
            cameraList.append(elementToInsert);
        }
                    
        cameraDialog.dialog('option', 'buttons', {
            "Close": function () {
                $(this).dialog("close");
            },
            "Try again": function () {
                $(this).dialog("close");
                that.events.onBeginFirstCapture.fire();
            }
        });
        cameraDialog.dialog("open");
    };
    
    // TODO: This method shouldn't be synchronous, and isn't really needed once we
    // add the ability to check cameras on the server before taking a picture.
    var checkCameraStatus = function (that) {
        var progressDialog = that.locate("progressDialog", document);
        var progressMessage = that.locate("progressMessage", document);
        progressMessage.text("Detecting cameras...");
        progressDialog.dialog("open");
        
        if (that.options.serverOn) {
        	var status;
        	
            $.ajax({
                url: "/cameras/",
                type: "GET",
                dataType: "json",
                async: false,
                
                success: function (cameraInfo) {
                    status = cameraInfo.status;
                    progressDialog.dialog("close");
                },
                
                error: function () {
                    progressDialog.dialog("close");
                    showMessage(that, that.options.styles.errorMessage, "Error detecting cameras.");
                }
            });
            
            return status;
        } else {
			return "success";
            progressDialog.dialog("close");
        }
    };
    
    /**
     * Binds listeners for the component events. These include picture taking
     * and keyboard shortcuts.
     * 
     * @param {Object} that, the Capture component
     */
    var bindHandlers = function (that) {
        that.events.onBeginFirstCapture.addListener(function () {
        	var cameraStatus = checkCameraStatus(that);
        	if (cameraStatus != "success") {
        		invokeCameraDialog(that);
        		return false;
        	}
			return true;
        });
        
        that.events.afterPictureTaken.addListener(function (newItem) {
            that.model.push(newItem);
            var clone = $(that.itemTemplate).clone(true);
            
            if (that.model.length === 1) {
                that.locate("thumbItem").remove();
            }
            that.locate("emptyPlaceholder", clone).remove();
            that.locate("noImageLabel", clone).remove();
            
            var labelText = [2 * that.model.length - 1, "-", 2 * that.model.length];
            that.locate('itemIndex', clone).text(labelText.join(''));
            
            var image = that.locate("thumbImage", clone);
            $(image).attr('src', newItem.thumb);
           
            that.locate("imageReorderer").append(clone);
            
            that.imageReorderer.refresh();
            $(clone).focus();
            var deleteButton = that.locate("deleteButton", clone);
            deleteButton.click(
                function () {
                    deleteSelectedImage(that);
                });
        });
        
        that.locate("exportButton").click(function () {
        	$.ajax({
        		url: "/pdf/",
        		type: "POST",
        		success: function (pdfURL) {
        		    window.location.href = pdfURL;
        		}
        	});
        		
        });
        
        that.locate("takePictureButton").click(function () {
            if (that.model.length === 0) {
                var prevent = that.events.onBeginFirstCapture.fire();
                if (prevent === false) {
                    return false;
                }
            }
            
            var progressDialog = that.locate("progressDialog", document);
            progressDialog.text("Taking picture...");
            progressDialog.dialog("open");
            
            if (that.options.serverOn) {
                $.ajax({
                    url: "/images/",
                    type: "POST",
                    dataType: "json",
                    
                    success: function (newItem) {
                        progressDialog.dialog("close");
                        showMessage(that, that.options.styles.successMessage, "Picture successfully taken.");
                        that.events.afterPictureTaken.fire(newItem);
                    },
                    
                    error: function () {
                        progressDialog.dialog("close");
                        showMessage(that, that.options.styles.errorMessage, "Error taking picture.");
                    }
                });
                    
            } else {
                // TODO Load image paths from a config file instead of using them staticly.
                var totalImages = 5; // For testing purposes with no server only.
                var imageToShow = that.model.length % totalImages;
                
                // TODO Provide stitched and thumbnail test images.
                var newItem = {};
                newItem.left = "../../server/testData/capturedImages/Image" + imageToShow + ".jpg";
                newItem.right = "../../server/testData/capturedImages/Image" + imageToShow + "-thumb.jpg";
                
                progressDialog.dialog("close");
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
        
        var url = window.location.href; // TODO Is this right?
        var protocol = url.slice(0, url.indexOf(":"));
        that.options.serverOn = (protocol.toLowerCase() === "http");
        
        // TODO Handle failure of getting the model.
        if (that.options.serverOn) {
            $.ajax({
                url: "/images/",
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
            
            exportButton: ".dc-toolbar-button-export",
            takePictureButton: ".flc-capture-button-takePicture",
            imagePreview: ".flc-capture-image-preview",
            
            progressDialog: ".flc-capture-dialog-progress",
            progressMessage: ".flc-capture-progress-content",
            confirmDialog: ".flc-capture-dialog-confirm",
            cameraDialog: ".flc-capture-dialog-cameras",
            message: ".flc-capture-message",
            noImageLabel: ".flc-capture-label-noImage",
            emptyPlaceholder: ".flc-capture-thumbItem-empty",
            
            cameraList: ".flc-capture-list-cameras",
            cameraEntry: ".flc-capture-entry-camera"
        },
        
        styles: {
            stateDisabled: "ui-state-disabled",
            elementHidden: "fl-capture-element-hidden",
            successMessage: "fl-capture-message-success",
            errorMessage: "fl-capture-message-error"
        },
        
        events: {
            onBeginFirstCapture: "preventable",
            afterPictureTaken: null
        }
    });
    
})(jQuery, fluid_1_2);

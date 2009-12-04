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
     * Renders the reorderable list of thumbnails. For each item in the model,
     * adds an appropriate image tag for it. An item in the rendered markup
     * consists of (optionally) a label, an image and a delete button. Only
     * the image is rendered dynamically.
     * 
     * @param {Object} that, the Capture component
     */
    var render = function (that) {
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
        
        fluid.selfRender(that.locate(that.options.selectors.imageReorderer), generateTree(), options);
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
                    var image = $(item).find('img').get(0);
                    // TODO What if an item contains no image or more than one image?
                    
                    // TODO Use the path to the full-sized image from the model.
                    // Cannot count on what the file name is expected to be!!!
                    var previewSrc = image.getAttribute('src').replace("-thumb", "");
                    
                    var imagePreview = that.locate("imagePreview").get(0);
                    imagePreview.setAttribute('src', previewSrc);
                }
            }
        };
    };
    
    /**
     * Binds listeners for the click events of the various buttons in the UI,
     * such as fixing/comparing images, exporting to PDF, deleting and taking
     * pictures.
     * 
     * Adds a listener for the modelChanged event. Should refresh the thumbnails
     * displayed and select the last captured image.
     * 
     * @param {Object} that, the Capture component
     */
    var bindHandlers = function (that) {
        that.events.modelChanged.addListener(function (newItem) {
            var clone;
            var template = that.locate("thumbItem").get(0);
        
            // TODO Do not use hard-coded values. Make a smarter check!
            if ($(template).find('img').get(0).getAttribute('src') === "../../server/testData/noImage-thumb.jpg") {
                clone = template;
            } else {
                clone = $(template).clone();
            }
            $(clone).find('img').get(0).setAttribute('src', newItem.thumbImage);
           
            $(that.locate("imageReorderer")).append(clone);
          
            that.imageReorderer.refresh();
          
            $(clone).focus();
        });
        
        that.locate("deleteButton").click(
            function () {
                // TODO Implement delete image functionality.
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
        
        var imageToInsert = 1;
        // TODO Make taking pictures work with the server, not directly from the filesystem.
        that.locate("takePictureButton").click( 
            function () {
                var newItem = {
                    fullImage: "../../server/testData/Image" + imageToInsert + ".jpg",
                    thumbImage: "../../server/testData/Image" + imageToInsert + "-thumb.jpg"
                };
                
                that.model.push(newItem);
                that.events.modelChanged.fire(newItem);
                imageToInsert++;
            });
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
        
        that.model = that.options.thumbs;
        
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
            capture: ".flc-capture",
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
            modelChanged: null
        },
        
        thumbs: [
            {
                fullImage: "#",
                thumbImage: "../../server/testData/noImage-thumb.jpg"
            }
        ]
    });
    
})(jQuery, fluid_1_2);

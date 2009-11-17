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
     * Creates a render component for the component tree. The key can be any key
     * that a component tree would take and the value is what would be assigned
     * to it. For example if you wanted to have node that just prints out
     * "Hello World" you could set the key to "value" and the value to
     * "Hello World".
     *
     * @param {Object} id, the ID used by the component tree
     * @param {Object} key, a key representing an entry in a renderer component
     * @param {Object} value, the value assigned to the key
     * @param {Object} classes, (optional) can add classes without having to
     *                 specify the decorator key
     */
    var treeNode = function (id, key, value, classes) {
        var obj = {ID: id};
        obj[key] = value;
        if (classes) {
            obj.decorators = {
                type: "addClass",
                classes: classes
            };
        }
        
        return obj; 
    };
    
    var render = function (that) {
        // TODO Implement Capture component rendering.
    };
    
    /**
     * Creates a View for the Capture component. Contains a thumbBrowser
     * subcomponent, a preview area for the image, and the needed controls.
     * 
     * @param {Object} container, the component this View should be placed in
     * @param {Object} options, the options passed into the component
     */
    fluid.capture = function (container, options) {        
        var that = fluid.initView("fluid.capture", container, options);
        
        that.thumbBrowser = fluid.initSubcomponents(
          that, "thumbBrowser", [".flc-thumbBrowser", that.options.thumbBrowser.options]);                
        
        that.locate(that.options.selectors.capture).addClass(that.options.styles.capture);
        
        render(that);       
       
        return that;
    };
    
    fluid.defaults("fluid.capture", {
		thumbBrowser: {
			type: "fluid.thumbBrowser",
			options: {
				thumbs: [
                            {
                                target: "../../server/testData/Image1.jpg",
                                image: "../../server/testData/Image1-thumb.jpg",
                                deleteTarget: "#",
                            },
                            {
                                target: "../../server/testData/Image2.jpg",
                                image: "../../server/testData/Image2-thumb.jpg",
                                deleteTarget: "#",
                            },
                            {
                                target: "../../server/testData/Image3.jpg",
                                image: "../../server/testData/Image3-thumb.jpg",
                                deleteTarget: "#",
                            },
                            {
                                target: "../../server/testData/Image4.jpg",
                                image: "../../server/testData/Image4-thumb.jpg",
                                deleteTarget: "#"
                            }
                        ]
			}
		},
		
		selectors: {
			capture: ".flc-capture",
			thumbBrowser: ".flc-thumbBrowser",
			previewArea: ".flc-preview-area",
			previewMenuBar: ".flc-preview-menuBar",
			fixImages: ".flc-fix-link",
			compareImages: ".flc-compare-link",
			exportImages: ".flc-export-link",
			imagePreview: ".flc-image-preview",
			bottomArea: ".flc-bottom-area",
			takePicture: ".flc-capture-buton",
			cameraZoom: ".flc-zoom-control"
		},
		
		styles: {
			capture: null,
			previewArea: null,
            previewMenuBar: null,
            fixImages: null,
            compareImages: null,
            exportImages: null,
			imagePreview: null,
            bottomArea: null,
            takePicture: null,
            cameraZoom: null
		}
	});
    
})(jQuery, fluid_1_2);

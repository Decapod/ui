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
     * Renders the component in an "imageReorderer" node by generating its tree.
     * 
     * @param {Object} that, the component
     */
    var render = function (that) {
        var selectorMap = [
            {selector: that.options.selectors.thumbItem, id: "item:"},
            {selector: that.options.selectors.thumbLink, id: "link"},
			{selector: that.options.selectors.thumbImage, id: "image"},
            {selector: that.options.selectors.deleteButton, id: "deleteButton"}            
        ];

        var generateTree = function () {            
            return fluid.transform(that.model, function (object) {
                var tree = {
					ID: "item:",
					children: [
					    {
							ID: "link",
							target: object.target
					    },
					    {
						    ID: "deleteButton",
						    target: "#"
					    },
					    {
						    ID: "image",
						    target: object.image
					    }
					]
				};
				
				var decorator = 
                {
                    type: "fluid",
                    func: "fluid.reorderImages",
                    container: that.locate("imageReorderer"),
                    options: that.options.imageReorderer.options
                };
                tree.decorators = decorator;

                return tree;
            });
        };
        
        var options = {
            cutpoints: selectorMap
        };
        
        fluid.selfRender(that.locate(that.options.selectors.imageReorderer), generateTree(), options);
    };
	
	/**
	 * Binds listeners for the click events of the various buttons in the UI,
	 * such as fixing/comparing images, exporting to PDF, and taking pictures.
	 * 
	 * @param {Object} that, the Capture component
	 */
	var bindHandlers = function (that) { 
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
		
		that.locate("takePictureButton").click( 
            function () {
                // TODO Implement take picture functionality.
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
        
        that.imageReorderer = fluid.initSubcomponents(
          that, "imageReorderer", [that.locate("imageReorderer"), that.options.imageReorderer.options]);
		
		that.model = that.options.thumbs;
		
		render(that);
		
		var listeners = bindHandlers(that);
        
        that.returnedOptions = {
            listeners: listeners
        };
        
        return that;
    };
    
    fluid.defaults("fluid.capture", {
		selectors: {
			capture: ".flc-capture",
			imageReorderer: ".flc-imageReorderer",
			thumbItem: ".flc-imageReorderer-item",	
			thumbLink: ".flc-imageReorderer-link",		
			thumbImage: ".flc-imageReorderer-image",
			deleteButton: ".flc-imageReorderer-button-delete",
			
			fixButton: ".flc-capture-button-fix",
			compareButton: ".flc-capture-button-compare",
			exportButton: ".flc-capture-button-export",
			takePictureButton: ".flc-capture-button-takePicture",
			previewArea: ".flc-capture-image-preview"
		},
		
		imageReorderer: {
            type: "fluid.reorderImages",
            options: {              
                selectors: {
                    movables: ".flc-imageReorderer-item",
                    imageTitle: ".flc-imageReorderer-label"
                }
            }
        },
		
		thumbs: [
		    {
                target: null,
			    image: null
		    }
		]
	});
    
})(jQuery, fluid_1_2);

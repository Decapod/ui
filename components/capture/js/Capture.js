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
	
	var thumbSelectionListener = function (item) {
		// TODO Implement thumb selection handler.
	};
    
    /**
     * Creates a View for the Capture component. Contains a thumbBrowser
     * subcomponent, a preview area for the image, and controls for taking
     * images and manipulating them.
     * 
     * @param {Object} container, the component this View should be placed in
     * @param {Object} options, the options passed into the component
     */
    fluid.capture = function (container, options) {        
        var that = fluid.initView("fluid.capture", container, options);
        
        that.thumbBrowser = fluid.initSubcomponents(
          that, "thumbBrowser", [that.locate("thumbBrowser"), that.options.thumbBrowser.options]);
		  
		var listeners = bindHandlers(that);
        
        that.returnedOptions = {
            listeners: listeners
        };
        
        return that;
    };
    
    fluid.defaults("fluid.capture", {
		thumbBrowser: {
			type: "fluid.thumbBrowser",
			options: {
				thumbs: [
                    {
                        target: "#",
                        image: "../../server/testData/Image1-thumb.jpg"
                    },
                    {
                        target: "#",
                        image: "../../server/testData/Image2-thumb.jpg"
                    },
                    {
                        target: "#",
                        image: "../../server/testData/Image3-thumb.jpg"
                    },
                    {
                        target: "#",
                        image: "../../server/testData/Image4-thumb.jpg"
                    }
                ],
				
				listeners: {
					onThumbSelected: thumbSelectionListener
				}
			}
		},
		
		selectors: {
			thumbBrowser: ".flc-thumbBrowser",
			thumbImage: ".flc-thumbBrowser-image",
			fixButton: ".flc-capture-button-fix",
			compareButton: ".flc-capture-button-compare",
			exportButton: ".flc-capture-button-export",
			takePictureButton: ".flc-capture-button-takePicture"
		}
	});
    
})(jQuery, fluid_1_2);

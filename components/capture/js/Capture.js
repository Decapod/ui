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
          that, "thumbBrowser", [".flc-thumbBrowser", that.options.thumbBrowser.options]);
        
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
                        deleteTarget: "#"
                    },
                    {
                        target: "../../server/testData/Image2.jpg",
                        image: "../../server/testData/Image2-thumb.jpg",
                        deleteTarget: "#"
                    },
                    {
                        target: "../../server/testData/Image3.jpg",
                        image: "../../server/testData/Image3-thumb.jpg",
                        deleteTarget: "#"
                    },
                    {
                        target: "../../server/testData/Image4.jpg",
                        image: "../../server/testData/Image4-thumb.jpg",
                        deleteTarget: "#"
                    }
                ]
			}
		}
	});
    
})(jQuery, fluid_1_2);

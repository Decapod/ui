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
    
    /**
     * Renders the component in a "thumbBrowser" node by generating its tree.
     * 
     * @param {Object} that, the component
     */
    var render = function (that) {
        var selectorMap = [
            {selector: that.options.selectors.listItems, id: "listItems:"},
            {selector: that.options.selectors.link, id: "link"},
            {selector: that.options.selectors.image, id: "image"},
			{selector: that.options.selectors.deleteButton, id: "deleteButton"}
        ];

        var generateTree = function () {
            var styles = that.options.styles;
			
            return fluid.transform(that.model, function (object) {
                var tree = treeNode(
					"listItems:",
					"children", 
                    [treeNode("link", "target", object.target, styles.link),
					 treeNode("deleteButton", "target", object.deleteTarget, styles.deleteButton)],                    
                    styles.listItems);
                
                if (object.image) {
                    tree.children.push(treeNode(
						"image",
						"target",
						object.image,
						styles.image));
                }
				
                var decorator = 
				{
					type: "fluid",
					func: "fluid.reorderImages",
					container: that.container,
					options: that.options.reorderer.options
				};
				tree.decorators = decorator;
				
                return tree;
            });
        };
        
        var options = {
            cutpoints: selectorMap
        };
        
        fluid.selfRender(that.locate(that.options.selectors.thumbBrowser), generateTree(), options);         
    };
    
    /**
     * Creates a View for the thumbBrowser component. It contains a list of
     * images, each one having a delete button next to it and possibly a label.
     * 
     * @param {Object} container, the component this View should be placed in
     * @param {Object} options, the options passed into the component
     */
    fluid.thumbBrowser = function (container, options) {
		
		var that = fluid.initView("fluid.thumbBrowser", container, options);
		
		that.reorderer = fluid.initSubcomponents(
		  that, "reorderer", [that.container, that.options.reorderer.options]);
				
		that.model = that.options.thumbs;
		
		that.locate(that.options.selectors.thumbBrowser).addClass(that.options.styles.thumbBrowser);
		
		render(that);		
       
        return that;
    };
    
    fluid.defaults("fluid.thumbBrowser", {
		reorderer : {
			type: "fluid.reorderImages",
			options: {
				selectors: {
					movables: ".flc-thumbBrowser-container-thumbs",
					imageTitle: ".flc-thumbBrowser-label"
				}
			}
		},
		
        selectors: {
			thumbBrowser: ".flc-thumbBrowser",
            listItems: ".flc-thumbBrowser-container-thumbs",
            link: ".flc-thumbBrowser-link",
            image: ".flc-thumbBrowser-image",
			deleteButton: ".flc-thumbBrowser-button-delete"			
        },
        
        styles: {
			thumbBrowser: null,
            allImages: null,
            listItems: null,
            link: null,
            image: null,
			deleteButton: null
        },
        
        thumbs: [
                {
                    target: "",
                    image: "",
					deleteTarget: ""
                }			
            ]		
        }
    );
    
})(jQuery, fluid_1_2);

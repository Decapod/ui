/*
Copyright 2009 University of Toronto

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one of these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
*/

/*global jQuery*/
/*global fluid*/

fluid = fluid || {};

(function ($) {
    
    /**
     * Creates a render component for the component tree. The key can be any key
     * that a componet tree would take and the value is what would be assigned
     * to it. For example if you wanted to have node that just prints out
     * "Hello World" you could set the key to "value" and the value to
     * "Hello World".
     *
     * @param {Object} id, the ID used by the component tree
     * @param {Object} key, a key representing an entry in a renderer component
     * @param {Object} value, the value assigned to the key
     * @param {Object} classes, (optional) can add classes without having to
     * 				   specify the decorator key
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
     * Renders the copmonent based on values passed into the options
     * 
     * @param {Object} that, the component
     */
    var render = function (that) {
        var selectorMap = [
            {selector: that.options.selectors.listItems, id: "listItems:"},
            {selector: that.options.selectors.link, id: "link"},
            {selector: that.options.selectors.image, id: "image"},
			{selector: that.options.selectors.deleteButton, id: "deleteButton"},
        ];

        var generateTree = function () {
            var styles = that.options.styles;
            return fluid.transform(that.options.thumbs, function (object) {
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
                };
                
                return tree;
            });
        };
        
        var options = {
            cutpoints: selectorMap,
        };
        
        fluid.selfRender(that.locate("listGroup"), generateTree(), options);
         
    };
    
    /**
     * Creates a View for the thumbBrowser component. It contains a list of
     * images, each one having a delete button next to it and possibly a title
     * message.
     * 
     * @param {Object} container, the component this View should be placed in
     * @param {Object} options, the options passed into the component
     */
    fluid.thumbBrowser = function (container, options) {
        var that = fluid.initView("fluid.thumbBrowser", container, options);
		
		that.locate("listGroup").addClass(that.options.styles.listGroup);
		render(that);		
       
        return that;
    };
    
    /**
     * The components defaults.
     */
    fluid.defaults("fluid.thumbBrowser", {
        selectors: {
            listGroup: ".flc-thumbBrowser-listGroup",
            listItems: ".flc-thumbBrowser-items",
            link: ".flc-thumbBrowser-link",
            image: ".flc-thumbBrowser-image",
			deleteButton: ".flc-thumbBrowser-deleteButton",
        },
        
        styles: {
            listGroup: "fl-list-menu fl-list-thumbnails fl-thumbnails-expanded",
            listItems: null,
            link: null,
            image: "fl-icon",
			deleteButton: null,
        },
        
        thumbs: [
                {
                    target: "",
                    image: "",
					deleteTarget: "",
                }			
            ]
        }
    );
    
})(jQuery);

/*
Copyright 2012 OCAD University 

Licensed under the Apache License, Version 2.0 (the "License"); 
you may not use this file except in compliance with the License. 
You may obtain a copy of the License at 

   http://www.apache.org/licenses/LICENSE-2.0 

Unless required by applicable law or agreed to in writing, software 
distributed under the License is distributed on an "AS IS" BASIS, 
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
See the License for the specific language governing permissions and 
limitations under the License.
*/

// Declare dependencies
/*global decapod:true, fluid, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

decapod.globalMessages = {
    exporter_exportControls_complete_download: "Download",
    exporter_exportControls_complete_restart: "Start Over",

    exporter_exportControls_detailedProgress_initialProgressMessage: "Creating export...",
    exporter_exportControls_detailedProgress_inProgressMessage: "Creating export... Step %step of %steps.",
    exporter_exportControls_detailedProgress_completeProgressMessage: "Creating export... Done!",
    exporter_exportControls_detailedProgress_warning: "Warning Message",
    
    exporter_exportControls_progress_message: "Export Progress",
    exporter_exportControls_progress_warning: "Warning Message",

    exporter_exportControls_trigger_trigger: "Start Export",

    exporter_decapod_exportControls_fileError_desc: "They may not have been valid image files.",
    exporter_decapod_exportControls_exportError_desc: "<div>See Help for more details.</div><div class='ds-exportControls-complete-links'><a href='help.html' target='_new' class='ds-shared-helpButton'>Help</a><a href='' class='ds-shared-restartButton'>Restart</a>",
    
    exporter_outputSettings_errorMessage : "Enter value from %0 to %1.",
    
    // exporter_select_label: "Output"

    // name: "Format type label",
    // description: "A delectable medley of bits and bytes to satisfy every platform",
    // documentResolutionLabel: "Output:",
    // exportControl: "Start Export",
    // initialProgressMessage: "Creating export...",
    // inProgressMessage: "Creating export... Step %step of %steps.",
    // completeProgressMessage: "Creating export... Done!",
    // warning: "Note: Refreshing the browser will cancel the export.",
    // download: "Download PDF",  
    // restart: "Start Over",

    capturer_title: "Capture",
    capturer_help: "Help",
    capturer_restart: "Restart",
    capturer_exportButton: "Download Captures",
    capturer_exportInProgress: "Creating archive...",
    capturer_captureInProgress: "Taking picture...",
    capturer_loadMessage: "Checking cameras...",
    
    capturer_markup_captureButton: "Capture<br /><span>(Keyboard shortcut: c)</span>",
    capturer_markup_exportDesc: "If capturing with Stereo 3D, run Decapod Stereo 3D Calibration before dewarping images. <br /><br />See <a href='help.html'>Help</a> or Decapod documentation for details.",

    capturer_captureReviewer_captureIndex: "Capture #%0",
    capturer_captureReviewer_deletedIndex: "Deleted Capture #%0",
    capturer_captureReviewer_deletedMessage: "Press 'Capture' button to continue capturing.",
    capturer_captureReviewer_del: "Delete"

};

fluid.staticEnvironment.globalBundle = fluid.messageResolver({
	messageBase: decapod.globalMessages
});

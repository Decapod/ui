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
    exporter_exportControls_detailedProgress_warning: "Note: Refreshing the browser will cancel the export.",
    
    exporter_exportControls_progress_message: "Creating export",
    exporter_exportControls_progress_warning: "Note: Refreshing the browser will cancel the export.",

    exporter_exportControls_trigger_trigger: "Start Export",

    exporter_decapod_exportControls_fileError_desc: "They may not have been valid image files.",
    exporter_decapod_exportControls_exportError_desc: "<div>See Help for more details.</div><div class='ds-exportControls-complete-links'><a href='help.html' target='_new' class='ds-shared-helpButton'>Help</a><a href='' class='ds-shared-restartButton'>Restart</a>",
    
    exporter_outputSettings_errorMessage: "Enter value from %0 to %1.",
    
    exporter_select_label: "Output",

    exporter_imagePDF_name: "1. Image PDF",
    exporter_imagePDF_description: "Export each image as a page in a PDF document. Export process is quick and generates a basic PDF.",
    exporter_ocrPDF_name: "2. Image PDF with OCR Text",
    exporter_ocrPDF_description: "OCR is performed on images, and resulting text is embedded in the PDF.",
    exporter_tracedPDF_name: "3. Computer Traced PDF with OCR Text",
    exporter_tracedPDF_description: "Content of each image is traced by the computer, OCR'ed, and output to a PDF. The process takes longer, but results is a much smaller PDF.",
    exporter_fontMatchedPDF_name: "4. Font Matched PDF with OCR Text",
    exporter_fontMatchedPDF_description: "Text on image is matched to a True-Type font resulting in a very compact PDF. Works best with Latin script.",

	exporter_pdf_outputSettings_a4: "A4 (210x297 mm)",
	exporter_pdf_outputSettings_a5: "A5 (148x210 mm)",
	exporter_pdf_outputSettings_letter: "Letter (216x279mm)",
	exporter_pdf_outputSettings_custom: "Custom",

	exporter_pdfExportStatus_exportError_name: "Error creating export",
	exporter_pdfExportStatus_exportError_description: "<div>See Help for more details.</div><div class='ds-exportControls-complete-links'><a href='help.html' target='_new' class='ds-shared-helpButton'>Help</a><a href='' class='ds-shared-restartButton'>Restart</a>",
	exporter_pdfExportStatus_filesIgnored_name: "Some files were ignored",
	exporter_pdfExportStatus_filesIgnored_description: "They may not have been valid image files.",
	exporter_imageExportStatus_exportError_name: "Error creating export",
	exporter_imageExportStatus_exportError_description: "<div>See Help for more details.</div><div class='ds-exportControls-complete-links'><a href='help.html' target='_new' class='ds-shared-helpButton'>Help</a><a href='' class='ds-shared-restartButton'>Restart</a>",
	exporter_imageExportStatus_filesIgnored_name: "Some files were ignored",
	exporter_imageExportStatus_filesIgnored_description: "They may not have been valid image files.",

	exporter_tiff_name: "5. TIFF",
	exporter_tiff_description: "",
	exporter_png_name: "6. PNG",
	exporter_png_description: "",
	
	exporter_importStatus_total: "%totalNumFiles files found.",
    exporter_importStatus_100: "%numErrors files exceeded the queue limit",
    exporter_importStatus_110: "%numErrors files exceeded the size limit",
    exporter_importStatus_120: "%numErrors files were empty (0 bytes)",
    exporter_importStatus_130: "%numErrors files had an invalid file type",
    exporter_importStatus_250: "%numErrors files were ignored by the server. May have not been valid image type.",
    
    exporter_uploader_browseFiles: "Browse Files",
    
    exporter_title: "PDF and Image Export",
    exporter_instructions: "Select 'Browse Files' to choose images to export.",
    exporter_uploadClear: "Restart",
    exporter_help: "Help",
    exporter_pageUnloadWarning: "Leaving the page could result in loss of export data.",
    exporter_formats: "Select Export Option",
    exporter_pdfFormat_name: "PDF",
    exporter_imageFormat_name: "Image",

    capturer_title: "Capture",
    capturer_help: "Help",
    capturer_restart: "Restart",
    capturer_exportButton: "Download Captures",
    capturer_exportInProgress: "Creating archive...",
    capturer_captureInProgress: "Taking picture...",
    capturer_loadMessage: "Checking cameras...",
    
    capturer_markup_captureButton: "Capture<br /><span>(Keyboard shortcut: c)</span>",
    capturer_markup_exportDesc: "If capturing with Stereo 3D, run Decapod Stereo 3D Calibration before dewarping images. <br /><br />See <a href='help.html'>Help</a> or Decapod documentation for details.",
    
    capturer_readyForConventional_name: "Ready to capture.",
    capturer_readyForConventional_description: "<p>Press 'Capture' button to start.</p> <div class='ds-capturer-stereoUnavailable'><span class='ds-capturer-stereoStatusSubtitle'>Stereo 3D capturing: <i>unavailable</i></span>.<br />See <a href='help.html' target='_new'>Help</a> for details.</div>",
    capturer_readyForStereo_name: "Ready to capture.",
    capturer_readyForStereo_description: "<p>Press 'Capture' button to start.</p> <div class='ds-capturer-stereoAvailable'><span class='ds-capturer-stereoStatusSubtitle'>Stereo 3D capturing: <i>available</i></span>.<br />See <a href='help.html' target='_new'>Help</a> for details.</div>",
    capturer_noCameras_name: "No camera detected.",
    capturer_noCameras_description: "",
    capturer_camerasDisconnected_name: "Camera disconnected.",
    capturer_camerasDisconnected_description: "Check camera USB cables and batteries.",
    capturer_noCapture_name: "Unable to capture.",
    capturer_noCapture_description: 'Problem with camera. See <a href="help.html" target="_new">Help</a> for possible fixes.',
    capturer_tooManyCameras_name: "Too many cameras.",
    capturer_tooManyCameras_description: "Connect only one or two cameras.",
    capturer_noExport_name: "Unable to create download.",
    capturer_noExport_description: 'Problem creating the file to download. See <a href="help.html" target="_new">Help</a> for possible fixes.',

    capturer_captureReviewer_captureIndex: "Capture #%0",
    capturer_captureReviewer_deletedIndex: "Deleted Capture #%0",
    capturer_captureReviewer_deletedMessage: "Press 'Capture' button to continue capturing.",
    capturer_captureReviewer_del: "Delete",
    
    core_status: "Refresh",

    // Stereo 3D Common
    stereo_initialMessage: "Select \"Browse Files\" button to choose archive.",
    stereo_help: "Help",
    stereo_browse: "Browse Files",
    stereo_download: "Download",
    stereo_startOver: "Restart",
    stereo_BAD_ZIP: "The zip file is invalid.",
    stereo_NO_STEREO_IMAGES: "Selected archive does not appear to have stereo images.",
    stereo_NOT_ENOUGH_IMAGES: "No enough calibration images.",
    stereo_error: "Unknown Error",

    // Stereo 3D Dewarp
    stereo_working_dewarp: "Working...",
    stereo_title_dewarp: "Stereo 3D Dewarp",
    stereo_start_dewarp: "Dewarp",
    stereo_ready_dewarp: "%captures captures found.",
    stereo_calibrationReady: "Calibration information found.",
    stereo_readyToDewarp: "Ready to dewarp.",
    stereo_progress_dewarp: "Dewarping catpure %value of %max.",
    stereo_complete_dewarp: "Dewarping complete.",
    stereo_colourPicker: "Pick Colour",
    stereo_step1: "Step 1: Choose Stereo 3D Captures",
    stereo_step2: "Step 2: Choose Stereo 3D Calibration Information",
    stereo_step3: "Step 3: Select boundary colour",
    stereo_instructions: "Instructions - The colour picker expects 2 mouse clicks:",
    stereo_instructionsStep1: "First mouse click chooses the page seperator colour.",
    stereo_instructionsStep2: "Second mouse click chooses the background colour.",

    // Stereo 3D Calibration
    stereo_progress_calibration: "",
    stereo_title_calibration: "Stereo 3D Calibration",
    stereo_start_calibration: "Calibrate",
    stereo_ready_calibration: "Ready to calibrate.",
    stereo_complete_calibration: "Calibration complete.",
    stereo_working_calibration: "Creating calibration data..."

};

fluid.staticEnvironment.globalBundle = fluid.messageResolver({
	messageBase: decapod.globalMessages
});

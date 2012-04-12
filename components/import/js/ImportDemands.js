/*
Copyright 2011-2012 OCAD University 

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

(function ($) {

    // Run in demo mode if loaded from the local file system
    fluid.demands("fluid.uploader", ["decapod.fileSystem", "decapod.import"], {
        options: {
            demo: true,
            strings: {
                progress: {
                    fileUploadLimitLabel: "%fileUploadLimit %fileLabel maximum",
                    toUploadLabel: "Total files: %fileCount %fileLabel", 
                    totalProgressLabel: "Copying: %curFileN of %totalFilesN %fileLabel", 
                    completedLabel: "Copied: %curFileN of %totalFilesN %fileLabel %errorString",
                    numberOfErrors: ", %errorsN %errorLabel",
                    singleFile: "file",
                    pluralFiles: "files",
                    singleError: "error",
                },
                buttons: {
                    browse: "Browse Files",
                    addMore: "Add More",
                    stopUpload: "Stop Importing",
                    cancelRemaning: "Cancel importing remaining files",
                    resumeUpload: "Resume Importing"
                },
                queue: {
                    emptyQueue: "File list: No files waiting to be copied.",
                    queueSummary: "File list:  %totalUploaded files copied, %totalInUploadQueue file waiting to be copied." 
                }
            }
        }
        
    });
    
    fluid.demands("fluid.uploader", ["decapod.import"], {
        options: {
            queueSettings: {
                uploadURL: "/library/decapod05a/pages/"
            }
        }
        
    });    
})(jQuery);


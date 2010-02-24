"""Module contains a fully operable stand-alone Decapod server.
It provides a resource-oriented approach to working with images (capturing,
deleting, generating thumbnails). It can be used with any client by providing
an uniform interface for accessing and modifying images.
"""

import cherrypy
import glob
import os
import simplejson as json
import sys
from PIL import Image

class ImageController(object):
    """Main class for manipulating images.
    
    Exposes operations such as capturing, post-processing and deleting pictures
    and sets of pictures. All URLs are considered a path to an image or to a set
    of images represented by a JSON file of their attributes."""
    
    camcap_cmd = \
    "gst-launch-0.10 v4l2src num-buffers=1 device=%s ! " + \
    "video/x-raw-yuv, width=%d, height=%d ! " + \
    "ffmpegcolorspace ! jpegenc ! filesink location='%s'"

    def camcap(file, device="/dev/video0", width=640, height=480):
        """Captures a single low-resolution picture using gstreamer."""
        os.system(camcap_cmd % (device, width, height, file))

    images = []
    
    @cherrypy.expose
    def index(self):
        """Handles the /images/ URL - a collection of sets of images.
        
        Supports getting the list of images (GET) and adding a new image to the
        collection (POST with no arguments)."""
        
        method = cherrypy.request.method.upper()
        if method == 'GET':
            cherrypy.response.headers['Content-Type'] = 'application/json'
            cherrypy.response.headers['Content-Disposition'] = 'attachment; filename="Captured images.json"'
            return json.dumps(self.images)

        elif method == 'POST':
            index = len(self.images)
            camera_on=False
            if 'camera-on' in cherrypy.request.params:
                camera_param = cherrypy.request.params['camera-on'].lower()
                camera_on = (camera_param == 'true')            
            return self.take_picture(index, camera_on)
        
        else:
            cherrypy.response.headers['Allow'] = "GET, POST"
            raise cherrypy.HTTPError(405)
    
    @cherrypy.expose
    def default(self, id, state=None):
        """Handles the /images/:id/ and /images/:id/:state URLs.
        
        Supports getting (GET) and deleting (DELETE) sets of images by their id;
        The first operation returns a JSON text with the paths to the images. If
        state is provided, GET returns a jpeg image with the specified state"""
        
        index = int(id)
        if index < 0 or index >= len(self.images):
            raise cherrypy.HTTPError(404, "The specified resource is not currently available")
                
        method = cherrypy.request.method.upper()        
        if not state:
            if method == 'GET':
                cherrypy.response.headers['Content-Type'] = 'application/json'
                cherrypy.response.headers['Content-Disposition'] = 'attachment; filename="Image%d.json"' % index
                return json.dumps(self.images[index])
            
            elif method == 'DELETE':
                return self.delete(id)
            
            else:
                cherrypy.response.headers['Allow'] = "GET, DELETE"
                raise cherrypy.HTTPError(405)
            
        else:
            if method == 'GET':
                if not state in self.images[index]:
                    raise cherrypy.HTTPError(404, "The specified resource is not currently available")
                
                path = self.images[index][state+"Image"]
                cherrypy.response.headers['Content-type'] = 'image/jpeg'
                return open(path).read()
            
            elif method == 'POST':
                if state.lower() == "fixed":
                    return self.fix(index)
                raise cherrypy.HTTPError(404)
            
            else:
                cherrypy.response.headers['Allow'] = "GET, POST"
                raise cherrypy.HTTPError(405)
    
    def take_picture(self, index=None, camera_on=False):
        """Capture an image and generates a thumbnail from it.
        
        If there is no camera attached, gets an image locally from the file
        system."""
        
        path, extension = "testData/capturedImages/Image", ".jpg"
        name_to_save = path + `index` + extension
        
        if camera_on:
            camcap(name_to_save)
        else:
            files = glob.glob("testData/imageFeed/*")
            files.sort()
            file_count = len(files)

            nameToOpen = files[int(index) % file_count]
            im = Image.open(nameToOpen)
            im.save(name_to_save);
        
        size = 200, 150
        im = Image.open(name_to_save)
        im.thumbnail(size, Image.ANTIALIAS)
        thumb_name_to_save = path + `index` + "-thumb" + extension
        im.save(thumb_name_to_save)

        cherrypy.response.headers['Content-type'] = 'application/json'
        model_entry = {'fullImage': name_to_save, 'thumbImage': thumb_name_to_save}
        self.images.append(model_entry)
        content = [index, model_entry]
        return json.dumps(model_entry)
    
    def delete(self, index=None):
        """Delete an image from the list of images and from the file system."""
        
        result = ""
        path = "testData/capturedImages/Image" + index
        for filename in glob.glob(path + "*"):
            os.unlink(filename)
        self.images.pop(int(index))
        return
    
    def fix(self, file_index=None):
        """Currently unsupported."""
        
        raise cherrypy.HTTPError(404)

class DecapodServer(object):
    """Main class for the Decapod server.
       
    Exposes the index and capture pages as a starting point for working with the
    application. Does not expose any image-related functionality."""

    @cherrypy.expose
    def index(self):
        raise cherrypy.HTTPRedirect("/capture")

    @cherrypy.expose
    def capture(self):
        html_path = "../capture/html/Capture.html"
        return open(html_path).read()

if __name__ == "__main__":
    root = DecapodServer()
    root.images = ImageController()
    cherrypy.quickstart(root, '/', 'dserver.conf')

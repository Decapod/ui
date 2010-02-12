import cherrypy
import glob
import os
import simplejson as json
import sys
from PIL import Image

camcap_cmd = \
    "gst-launch-0.10 v4l2src num-buffers=1 device=%s ! " + \
    "video/x-raw-yuv,width=%d,height=%d ! " + \
    "ffmpegcolorspace ! jpegenc ! filesink location='%s'"

def camcap(file, device="/dev/video0", width=640, height=480):
    os.system(camcap_cmd % (device, width, height, file))
    
class ImageController(object):
 
    #TODO Start with an empty model or load one from file system.
    #TODO Decide whether absolure/relative paths should be persisted.
    #TODO Unify client paths with server paths.
    images = []
    
    @cherrypy.expose
    def index(self):
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
    def default(self, id, status=None):        
        index = int(id)
        if index < 0 or index >= len(self.images):
            raise cherrypy.HTTPError(404, "The specified resource is not currently available")
                
        method = cherrypy.request.method.upper()        
        if not status:
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
                if not status in self.images[index]:
                    raise cherrypy.HTTPError(404, "The specified resource is not currently available")
                
                path = self.images[index][status+"Image"]
                cherrypy.response.headers['Content-type'] = 'image/jpeg'
                return open(path).read()
            
            elif method == 'POST':
                if status.lower() == "fixed":
                    return self.fix(index)
                raise cherrypy.HTTPError(404)
            
            else:
                cherrypy.response.headers['Allow'] = "GET, POST"
                raise cherrypy.HTTPError(405)
    
    def take_picture(self, file_index=None, camera_on=False):
        path, extension = "testData/capturedImages/Image", ".jpg"
        name_to_save = path + `file_index` + extension
        
        if camera_on:
            camcap(name_to_save)
        else:
            files = glob.glob("testData/imageFeed/*")
            files.sort()
            file_count = len(files)

            nameToOpen = files[int(file_index) % file_count]
            im = Image.open(nameToOpen)
            im.save(name_to_save);
        
        size = 200, 150
        im = Image.open(name_to_save)
        im.thumbnail(size, Image.ANTIALIAS)
        thumb_name_to_save = path + `file_index` + "-thumb" + extension
        im.save(thumb_name_to_save)

        cherrypy.response.headers['Content-type'] = 'application/json'
        model_entry = {'fullImage': name_to_save, 'thumbImage': thumb_name_to_save}
        self.images.append(model_entry)
        content = [file_index, model_entry]
        return json.dumps(model_entry)
    
    def delete(self, file_index=None):
        result = ""
        path = "testData/capturedImages/Image" + file_index
        for filename in glob.glob(path + "*"):
            os.unlink(filename)
        self.images.pop(int(file_index))
        return
    
    def fix(self, file_index=None):
        self.images[file_index]['fixedImage'] = self.images[file_index]['fullImage']
        return json.dumps(self.images[file_index])

class DecapodServer(object):

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

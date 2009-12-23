import cherrypy
import os, glob, sys
from PIL import Image

camcap_cmd = \
    "gst-launch-0.10 v4l2src num-buffers=1 device=%s ! " + \
    "video/x-raw-yuv,width=%d,height=%d ! " + \
    "ffmpegcolorspace ! jpegenc ! filesink location='%s'"

def camcap(file, device="/dev/video0", width = 640, height = 480):
    os.system(camcap_cmd % (device, width, height, file))

class DecapodServer (object):

    @cherrypy.expose
    def index(self):
        raise cherrypy.HTTPRedirect("./capture")

    @cherrypy.expose
    def capture(self):
        content = open("../capture/html/Capture.html").read()
        return content

    @cherrypy.expose
    def takePicture(self, fileIndex = None, cameraOn = False):
        path, extension = "testData/capturedImages/Image", ".jpg"
        nameToSave = path + fileIndex + extension
        
        if cameraOn:
            camcap(nameToSave)
        else:
            files = glob.glob("testData/imageFeed/*")
            files.sort()
            file_count = len(files)

            nameToOpen = files[int(fileIndex) % file_count]
            im = Image.open(nameToOpen)
            im.save(nameToSave);
        
        size = 200, 150
        im = Image.open(nameToSave)
        im.thumbnail(size, Image.ANTIALIAS)
        thumbNameToSave = path + fileIndex + "-thumb" + extension
        im.save(thumbNameToSave)

        cherrypy.response.headers['Content-type'] = 'text/plain'
        return nameToSave + "|" + thumbNameToSave
    
    @cherrypy.expose
    def delete(self, fileIndex = None):
        result = ""
        path = "testData/capturedImages/Image" + fileIndex
        for filename in glob.glob(path + "*.*"):
            os.unlink(filename)
            result += file + "\n"
        cherrypy.response.headers['Content-type'] = 'text/plain'
        return result
    
cherrypy.quickstart(DecapodServer(), '/', 'dserver.conf')

"""
This File is used to run the predict what is in an image given as a byte string

author: Aaron Exley
"""
# Built in libaries
import sys
import base64
import io

# External Libaries downloaded through pip
import cv2 #pip install opencv-python
import tensorflow as tf #pip install tensorflow OR pip install tensorflow-gpu
import numpy as np #pip install numpy
from imageio import imread #pip install imageio

def run(image):
    """
    Loads the model found in location given, creates a Tensorflow session and
    executes it on the given image
    =========================================================================
    param: image - an image as a numpy array in the form [?, ?, ?, 3]
    =========================================================================
    returns: multiple numpy arrays as the predictions of the image
            - boxes: numpy array of floats of shape [400]
            - score: numpy array of floats of shape [100]
            - classes: numpy array of ints of shape [100]
            - num_detections: int
    """
    detection_graph = tf.Graph()

    with detection_graph.as_default():
        od_graph_def = tf.GraphDef()
        with tf.gfile.GFile('model/frozen_inference_graph.pb', 'rb') as fid:
            serialized_graph = fid.read()
            od_graph_def.ParseFromString(serialized_graph)
            tf.import_graph_def(od_graph_def, name='')

        sess = tf.Session(graph=detection_graph)

    image_tensor = detection_graph.get_tensor_by_name('image_tensor:0')

    detection_boxes = detection_graph.get_tensor_by_name('detection_boxes:0')
    detection_scores = detection_graph.get_tensor_by_name('detection_scores:0')
    detection_classes = detection_graph.get_tensor_by_name('detection_classes:0')
    num_detections = detection_graph.get_tensor_by_name('num_detections:0')

    (boxes, scores, classes, num) = sess.run(
      [detection_boxes, detection_scores, detection_classes, num_detections],
      feed_dict={image_tensor: image})

    return boxes, scores, classes, num


def decodeImage():
    """
    Checks if a file path is given for a tmp file of an encoded image, and decodes
    it into a numpy array of shape [1, width, height, 3]
    ==============================================================================
    returns: numpy array of shape [1, width, height, 3]
    """
    if len(sys.argv) <= 1:
        raise Exception('No image passed')

    try:
        fd = open(sys.argv[1])
        encodedImage = fd.read()
        fd.close()
    except:
        raise Exception('Encoded Image not found')

    image = imread(io.BytesIO(base64.b64decode(encodedImage)))
    image_e = np.expand_dims(image, axis=0)

    return image_e

def printOutput(boxes, scores, classes, num):
    """
    Takes in the output of the Tensorflow prediction and prints it to the console in a
    valid JSON format
    ==================================================================================
    params:
        - boxes: numpy array of floats of shape [400]
        - score: numpy array of floats of shape [100]
        - classes: numpy array of ints of shape [100]
        - num_detections: int
    ==================================================================================
    prints: The results in valid JSON format in the order: boxes, scores, classes, num
    """
    print(np.array2string(boxes[0], separator=',',suppress_small=True, formatter={'float_kind': lambda x: "%.5f" % x}), end=",\n")
    print(np.array2string(scores[0], separator=',',suppress_small=True, formatter={'float_kind': lambda x: "%.5f" % x}), end=",\n")
    print(np.array2string(classes[0], separator=',',suppress_small=True, formatter={'float_kind': lambda x: "%.0f" % x}), end=",\n")
    print(np.array2string(num[0], separator=',',suppress_small=True, formatter={'float_kind': lambda x: "%.0f" % x}))
    sys.stdout.flush()

def main():
    image = decodeImage()
    boxes, scores, classes, num = run(image)
    printOutput(boxes, scores, classes, num)

if __name__ == "__main__":
    main()
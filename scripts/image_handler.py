import os
from numpy.random import randint
from numpy import load
from numpy import zeros
from numpy import ones

#   Retrieves n_samples from the dataset, that means n_samples
#   pairs of source and target images. It also generates n_samples
#   labels with a patch_shape full of ones. 
#   It returns the pairs and the labels.

def retrieve_real_samples(dataset, n_samples, patch_shape):
    source_imgs, target_imgs = dataset
    random_index = randint(0, source_imgs.shape[0], n_samples)
    source_imgs, target_imgs = source_imgs[random_index], target_imgs[random_index]
    real_img_labels = ones((n_samples, patch_shape, patch_shape, 1))
    return [source_imgs, target_imgs], real_img_labels

#   Loads the dataset and normalizes the images to be
#   between a range of 0 and 1
def load_dataset(file_path):
    if os.path.exists(file_path) == False:
        sys.exit("Error: No file with path: " + file_path + " exists.")

    dataset = load(file_path)
    source_imgs , target_imgs = dataset['arr_1'], dataset['arr_0']
    source_imgs = (source_imgs - 127.5) / 127.5
    target_imgs = (target_imgs - 127.5) / 127.5
    return [source_imgs, target_imgs]

#   Scales the pixels
def scale_img_pixels(img):
    return (img + 1) / 2.0
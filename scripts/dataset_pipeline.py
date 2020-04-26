#!/usr/bin/env python
# coding: utf-8

from os import listdir
from numpy import asarray
from numpy import vstack
from keras.preprocessing.image import img_to_array
from keras.preprocessing.image import load_img
from numpy import savez_compressed

import argparse
from pathlib import Path

parser = argparse.ArgumentParser(prog="dataset_pipeline", description="Loads a dataset, splits it \
                                 in source and target images and finally saves it as a compressed .npz file")

parser.add_argument('input_dir_path', help="The directory where the files are located")

parser.add_argument('output_file_path', help="The path and name of the output file")


def pipeline(input_dir_path, output_file_path):
    if Path(output_file_path).exists():
        override = input("A file with that name already exists in the provided directory do you want to override it? [Y\\N] : ")
        if(override.lower() != "y"):
            print("Skipping data pipelining")
            return
    
    images = load_images(input_dir_path)
    save_images(output_file_path, images)

def load_images(path, size=(256,512)):
    source_imgs_list, target_imgs_list = list(), list()
    print("Splitting data into source and target lists...")
    for filename in listdir(path):
        img_pixels = load_img(path + filename, target_size=size)
        img_pixels = img_to_array(img_pixels)
        # The source and target images came as a unique image where half of it is
        # the source and the other half the target.
        source_img, target_img = img_pixels[:, :256], img_pixels[:, 256:]
        source_imgs_list.append(source_img)
        target_imgs_list.append(target_img)
    print("Data splitted!")
    return [asarray(source_imgs_list), asarray(target_imgs_list)]        


def save_images(path, images):
        
        print("Saving images as compressed " + path + " file.")
        [source_images, target_images] = images
        savez_compressed(output_file_path, source_images, target_images)
        print("Compressed file successfully generated!")
        
'''
args = parser.parse_args()

input_dir_path = args.input_dir_path
output_file_path = args.output_file_path + ".npz"

pipeline(input_dir_path, output_file_path)
'''
    
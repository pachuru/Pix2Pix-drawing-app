# Test dataset_pipeline.py
import pytest
import os
from dataset_pipeline import load_images
from dataset_pipeline import save_images

@pytest.mark.skip(reason="Very expensive test to perform.")
class TestDatasetPipeline:

    def test_load_images(self):
        dir_path = os.path.dirname(os.path.realpath(__file__))
        input_file_path = dir_path.replace("scripts","datasets\\raw\\maps\\train\\")
        number_of_files = 1096

        loaded_dataset = load_images(input_file_path)

        assert len(loaded_dataset) == 2, "it returns two arrays"
        assert len(loaded_dataset[0]) == len(loaded_dataset[1]) == number_of_files, "each array contains all the images"
        assert loaded_dataset[0].shape == loaded_dataset[1].shape == (number_of_files, 256, 256, 3), "each instance have a shape of (256,256,3)"

    def test_save_images(self):

        dir_path = os.path.dirname(os.path.realpath(__file__))
        input_file_path = dir_path.replace("scripts","datasets\\raw\\maps\\train\\")
        output_file_path = dir_path.replace("scripts","output\\compressed_tested_file.npz")
        number_of_files = 1096

        loaded_dataset = load_images(input_file_path)

        save_images(output_file_path, loaded_dataset)

        assert os.path.exists(output_file_path) == True, "The compressed file is created"

        os.remove(output_file_path)

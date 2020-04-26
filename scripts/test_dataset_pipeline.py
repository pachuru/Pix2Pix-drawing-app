# Test dataset_pipeline.py
import pytest
from dataset_pipeline import load_images


class TestDatasetPipeline:

    def test_load_images(self):
        input_file_path = "..\\datasets\\raw\maps\\train\\"
        number_of_files = 1096

        loaded_dataset = load_images(input_file_path)

        assert len(loaded_dataset) == 2, "it returns two arrays"
        assert len(loaded_dataset[0]) == len(loaded_dataset[1]) == number_of_files, "each array contains all the images"
        assert loaded_dataset[0].shape == loaded_dataset[1].shape == (number_of_files, 256, 256, 3), "each instance have a shape of (256,256,3)"

import os

#   Routes for the different paths required by the scripts

output_dir_path = os.path.dirname(os.path.realpath(__file__))
output_dir_path = output_dir_path.replace("scripts","output")
pred_dir_path = output_dir_path + "\\predictions\\"
samples_dir_path = output_dir_path + "\\images\\"
models_dir_path = output_dir_path + "\\models\\"
log_dir_path = output_dir_path + "\\logs\\"

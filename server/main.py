from tensorflow.keras.models import load_model
from os.path import join
from io import BytesIO
import numpy as np
import PIL.Image as Image
import PIL.ImageOps as ImageOps
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

# Model
tensorflow_nn_model = load_model(
    join(BASE_DIR, "trained_models", "tensorflow_nn_model.keras")
)


def preprocess_image(contents: bytes) -> np.ndarray:
    pil_image = Image.open(BytesIO(contents))
    pil_image = pil_image.convert("L")
    pil_image = ImageOps.invert(pil_image)
    pil_image = pil_image.resize((20, 20), Image.Resampling.LANCZOS)

    image_array = np.array(pil_image).astype(np.float32)
    image_array = np.pad(image_array, 4, mode="constant", constant_values=0)
    image_array = image_array.reshape(1, -1) / 255.0

    return image_array


# FastAPI
app = FastAPI(docs_url=None, redoc_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/predict")
def predict_mnist_image(file: UploadFile = File(...)):
    try:
        contents = file.file.read()
        image_array = preprocess_image(contents)
        prediction = tensorflow_nn_model.predict(image_array)

        return {
            "message": "Prediction successful",
            "prediction": int(np.argmax(prediction)),
            "probabilities": prediction.tolist()[0],
        }
    except Exception as e:
        return {"message": "An error occurred"}

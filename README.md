<h1 align="center">🔎 Digit Classifier</h1>

![screenshot](https://github.com/user-attachments/assets/f921f8b5-2c02-4e3e-8fd5-2f7ef4238904)

This project is my "Hello World" as a machine learning student. It features a digit classifier powered by a TensorFlow Neural Network, trained on the MNIST dataset. The API is wrapped in a Docker image, and there’s even a cool React frontend where you can draw digits and see instant predictions!

✨ Try the app live at [https://digit-classifier.ahmedsobhy.net](https://digit-classifier.ahmedsobhy.net)

## 📁 Project Structure

-   **`models/`** - TensorFlow model files live here! 🧠
-   **`server/`** - FastAPI application folder, the brain of our backend! 🖥️
    -   **`main.py`** - The heart of the FastAPI app, handling all API requests and the magical script that loads the model and predicts the digits. 💡
-   **`frontend/`** - The React frontend app, where users can draw digits and have fun! 🎨
-   **`Dockerfile`** - Configuration to wrap everything in a Docker image. 🐳
-   **`requirements.txt`** - List of dependencies to make everything work smoothly. 🛠️

## 🚀 Getting Started

### ✅ Prerequisites

-   **Docker** - To build and run the API in a container. 🐋
-   **Node.js and npm** - For building the frontend application. 📦

### 🛠️ Building the Docker Image

1. **Clone the repository**:

    ```bash
    git clone https://github.com/AhmedSobhy01/digit-classifier.git
    cd digit-classifier
    ```

2. **Build the Docker image**:

    ```bash
    docker build -t digit-classifier-api .
    ```

3. **Once the image is built, it’s time to launch the API**:
    ```bash
    docker run -d -p 5000:5000 digit-classifier-api
    ```

Your API is now live at `http://localhost:5000`!

### 🔗 API Endpoints

-   **POST /predict**: Predict the digit from an uploaded image file. 📸

    #### Example Request

    ```bash
    curl -X POST "http://localhost:5000/predict" -H "Content-Type: multipart/form-data" -F "file=@your_image_file.png"
    ```

    -   **`file`**: The image file you want to classify. 🎯

    #### Example Response

    ```json
    {
        "message": "Prediction successful",
        "prediction": 1,
        "probabilities": [2.6359641196904704e-5, 0.7292985916137695, 3.460873995209113e-5, 0.10600192844867706, 0.005066428333520889, 0.053292419761419296, 3.709441443788819e-6, 0.002449796535074711, 0.005420663394033909, 0.09840560704469681]
    }
    ```

## 🎨 Building the Frontend Web Application

The React frontend is where the fun happens! Follow these steps to build and run it locally:

1. **Navigate to the `frontend` directory**:

    ```bash
    cd frontend
    ```

2. **Install the necessary dependencies**:

    ```bash
    npm install
    ```

3. **Build the React application**:

    ```bash
    npm run build
    ```

4. **Serve the application locally**:

    ```bash
    npm start
    ```

    The frontend app will be available at `http://localhost:3000`.

## 🌐 Live Demo

No need to set up locally? Try the live version here: [https://digit-classifier.ahmedsobhy.net/](https://digit-classifier.ahmedsobhy.net/).

## 🧠 Model Architecture

The neural network model used is a simple yet powerful one:

-   **Input Layer**: 784 neurons (28x28 pixels, flattened)
-   **Hidden Dropout Layer**
-   **Hidden Dense Layer**: 1 fully connected layer with ReLU activation
-   **Output Layer**: 10 neurons (one for each digit class) with softmax activation

## 🎓 Model Training

The model was trained using the MNIST dataset. Want to retrain it? Use the `models/tensorflow_nn_model.py` script.

## 📜 License

This project is licensed under the MIT License. For more details, see the [LICENSE](LICENSE) file.

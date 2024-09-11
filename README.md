<h1 align="center">🔎 Digit Classifier</h1>

![screenshot](https://github.com/user-attachments/assets/de0e06fc-7f17-4a47-aabc-ea75e19135ef)

This project is my "Hello World" as a machine learning student. It features a digit classifier powered by a TensorFlow Neural Network, trained on the MNIST dataset. The API is wrapped in a Docker image, and there’s even a cool React frontend where you can draw digits and see instant predictions!

✨ Try the app live at [https://digit-classifier.ahmedsobhy.net](https://digit-classifier.ahmedsobhy.net)

## 📁 Project Structure

-   **`frontend/`** - The React frontend app, where users can draw digits and have fun! 🎨
-   **`models/`** - TensorFlow model files live here! 🧠
-   **`server/`** - FastAPI application folder, the brain of our backend! 🖥️
-   **`docker-compose.yml`** - Docker Compose configuration to build and run both frontend and backend services. 📦

## 🚀 Getting Started

### ✅ Prerequisites

-   **Docker** - To build and run the API in a container. 🐋
-   **Node.js and npm** - For building the frontend application. 📦

### 🛠️ Building and Running the Application with Docker Compose

1. **Clone the repository**:

    ```bash
    git clone https://github.com/AhmedSobhy01/digit-classifier.git
    cd digit-classifier
    ```

2. **Build and start the services**:

    ```bash
    docker-compose up --build -d
    ```

    This command builds the Docker images for both the React frontend and the FastAPI backend, then starts the services defined in `docker-compose.yml`.

3. **Access the services**:

    - **React Frontend**: Open `http://localhost:3000` in your browser to use the frontend app.
    - **FastAPI Backend**: The backend API will be accessible at `http://localhost:5000`.

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

## 🎨 Building the Frontend Web Application (Optional)

If you prefer to build and run the React frontend without Docker, follow these steps:

1. **Navigate to the `frontend` directory**:

    ```bash
    cd frontend
    ```

2. **Install the necessary dependencies**:

    ```bash
    npm install
    ```

3. **Build the frontend application**:

    ```bash
    npm run build
    ```

4. **Serve the application locally**:

    ```bash
    npm start
    ```

    The frontend app will be available at `http://localhost:3000` (port may vary).

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

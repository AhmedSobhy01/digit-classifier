import numpy as np
import matplotlib.pyplot as plt
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.datasets import mnist
from tensorflow.keras.utils import to_categorical
from os.path import join
from argparse import ArgumentParser
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

np.random.seed(0)


class bcolors:
    OKBLUE = "\033[94m"
    OKCYAN = "\033[96m"
    OKGREEN = "\033[92m"
    WARNING = "\033[93m"
    FAIL = "\033[91m"
    ENDC = "\033[0m"
    BOLD = "\033[1m"
    UNDERLINE = "\033[4m"


def load_mnist_data() -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    (X_train, y_train), (X_test, y_test) = mnist.load_data()

    return X_train, y_train, X_test, y_test


def preprocess_mnist_data(
    X_train: np.ndarray, y_train: np.ndarray, X_test: np.ndarray, y_test: np.ndarray
) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    # Reshape the data to 1D vectors
    X_train = X_train.reshape(X_train.shape[0], -1)
    X_test = X_test.reshape(X_test.shape[0], -1)

    # Normalize the data to 0-1
    X_train = X_train / 255.0
    X_test = X_test / 255.0

    # One-hot encode the labels
    y_train_encoded = to_categorical(y_train)
    y_test_encoded = to_categorical(y_test)

    return X_train, y_train_encoded, X_test, y_test_encoded


def show_mnist_samples(X_train: np.ndarray, y_train: np.ndarray) -> None:
    fig, axis = plt.subplots(3, 3)

    for i in range(9):
        rand_ind = np.random.choice(len(X_train))

        axis[i // 3, i % 3].imshow(X_train[rand_ind], cmap=plt.get_cmap("gray"))
        axis[i // 3, i % 3].set_title(f"Label: {y_train[rand_ind]}")

    fig.tight_layout()
    plt.show()


def build_model(
    input_size: int,
    hidden_units: int,
    dropout: float,
) -> Sequential:
    model = Sequential(
        [
            Dense(
                hidden_units,
                input_dim=input_size,
                activation="relu",
            ),
            Dropout(dropout),
            Dense(hidden_units, activation="relu"),
            Dense(10, activation="softmax"),
        ]
    )

    model.compile(
        optimizer="adam",
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    return model


def calc_model_accuracy(
    model: Sequential,
    X_test: np.ndarray,
    y_test_encoded: np.ndarray,
    batch_size: int,
) -> float:
    scores = model.evaluate(X_test, y_test_encoded, batch_size=128, verbose=2)

    return scores[1] * 100


def main(
    run_quiet: bool,
    hidden_units: int,
    dropout: float,
    epochs: int,
    batch_size: int,
    save_model: bool,
    save_dir: str,
) -> None:
    # Load the MNIST dataset
    print(bcolors.OKBLUE + "Loading the MNIST dataset..." + bcolors.ENDC)
    X_train, y_train, X_test, y_test = load_mnist_data()
    print(bcolors.OKGREEN + "Dataset loaded!" + bcolors.ENDC + "\n")

    # Show some samples from the dataset
    if not run_quiet:
        ans = input(
            bcolors.WARNING + "Do you want to see some samples? (Y/n): " + bcolors.ENDC
        )
        if ans.lower() != "n":
            show_mnist_samples(X_train, y_train)
        print()

    # Preprocess the data
    print(bcolors.OKBLUE + "Preprocessing the data..." + bcolors.ENDC)
    X_train, y_train_encoded, X_test, y_test_encoded = preprocess_mnist_data(
        X_train, y_train, X_test, y_test
    )
    print(bcolors.OKGREEN + "Data preprocessed!" + bcolors.ENDC + "\n")

    # Build the model
    print(bcolors.OKBLUE + "Building the model..." + bcolors.ENDC)
    model = build_model(X_train[0].shape[0], hidden_units, dropout)
    print(bcolors.OKGREEN + "Model built!" + bcolors.ENDC + "\n")

    # Train the model
    print(bcolors.OKBLUE + "Training the model..." + bcolors.ENDC)
    model.fit(X_train, y_train_encoded, epochs=epochs, batch_size=batch_size, verbose=2)
    print(bcolors.OKGREEN + "Model trained!" + bcolors.ENDC + "\n")

    # Calculate model accuracy
    print(bcolors.OKBLUE + "Calculating model accuracy..." + bcolors.ENDC)
    accuracy = calc_model_accuracy(model, X_test, y_test_encoded, batch_size)
    print(f"{bcolors.OKGREEN}Model accuracy: {accuracy:.2f}%{bcolors.ENDC}\n")

    ans = "y"
    if not run_quiet and not save_model:
        ans = input(
            bcolors.WARNING
            + "Do you want to save the model to current directory as 'tensorflow_nn_model.keras'? (Y/n): "
            + bcolors.ENDC
        )

    if save_model or (not run_quiet and ans.lower() != "n"):
        print(bcolors.OKBLUE + "Saving the model..." + bcolors.ENDC)
        model.save(join(save_dir, "tensorflow_nn_model.keras"))
        print(bcolors.OKGREEN + "Model saved!" + bcolors.ENDC)


if __name__ == "__main__":
    # Parse command line arguments
    parser = ArgumentParser(
        description="Train a simple neural network model on MNIST dataset using TensorFlow"
    )

    parser.add_argument(
        "--epochs", type=int, default=20, help="Number of epochs to train the model"
    )
    parser.add_argument(
        "--batch-size", type=int, default=128, help="Batch size for training the model"
    )

    parser.add_argument(
        "--hidden-units",
        type=int,
        default=256,
        help="Number of hidden units in the model",
    )

    parser.add_argument(
        "--dropout", type=float, default=0.45, help="Dropout rate for the model"
    )

    parser.add_argument(
        "--save-model",
        action="store_true",
        help="Save the trained model to current directory",
    )

    parser.add_argument(
        "--save-dir",
        type=str,
        default=BASE_DIR,
    )

    parser.add_argument("--quiet", action="store_true", help="Do ask for user input")

    args = parser.parse_args()

    main(
        args.quiet,
        args.hidden_units,
        args.dropout,
        args.epochs,
        args.batch_size,
        args.save_model,
        args.save_dir,
    )

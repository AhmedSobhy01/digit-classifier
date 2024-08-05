import { useEffect, useState } from "react";
import { ToastContainer, Bounce, toast } from "react-toastify";
import SmilingLoader from "./SmilingLoader.tsx";
import "react-toastify/dist/ReactToastify.css";

function DrawingCanvas({ image }: { image: string | null }) {
    const [loading, setLoading] = useState(false);
    const [predictions, setPredictions] = useState<{ probabilities: number[]; prediction: number | null }>({ probabilities: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], prediction: null });

    useEffect(() => {
        if (!image) {
            setPredictions({ probabilities: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], prediction: null });
            return;
        }

        setLoading(true);

        fetch(image)
            .then((res) => res.blob())
            .then((blob) => {
                const fd = new FormData();
                const file = new File([blob], "filename.jpeg");
                fd.append("file", file);

                return fd;
            })
            .then((fd) =>
                fetch(import.meta.env.VITE_MODEL_URL || "http://localhost:5000/predict", {
                    method: "POST",
                    body: fd,
                })
                    .then((response) => response.json())
                    .then((data) =>
                        setPredictions({
                            probabilities: data.probabilities,
                            prediction: data.prediction,
                        })
                    )
                    .catch((_) => toast.error("An error occurred while trying to predict the image"))
                    .finally(() => setLoading(false))
            );
    }, [image]);

    return (
        <>
            <ToastContainer position="bottom-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" transition={Bounce} />

            <div className="relative flex flex-col gap-4 bg-white rounded-md shadow-xl w-full p-6 border border-gray-200">
                <div className="rounded-md p-4">
                    {loading && (
                        <>
                            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-md"></div>
                            <SmilingLoader className="absolute inset-0 w-full h-full" />
                        </>
                    )}

                    <div className="flex flex-col gap-2 border-2 border-gray-200 border-dashed rounded-md w-fit p-8 mx-auto">
                        <div className="text-center text-2xl font-bold text-gray-600">Prediction</div>
                        <div className="text-center text-4xl font-bold text-purple-600">{predictions.prediction ?? "-"}</div>
                    </div>

                    <div className="flex flex-col gap-4 mt-8">
                        {predictions.probabilities.map((probability, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">{index}</div>
                                <div className="flex items-center gap-2 flex-1">
                                    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-4 bg-purple-600 rounded-full" style={{ width: `${(probability * 100).toFixed(2)}%` }} />
                                    </div>
                                    <div>{(probability * 100).toFixed(2)}%</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default DrawingCanvas;

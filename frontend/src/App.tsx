import { useState } from "react";
import DrawingCanvas from "./components/DrawingCanvas.tsx";
import Predictions from "./components/Predictions.tsx";
import logo from "./assets/magnifier.gif";

function App() {
    const [image, setImage] = useState<string | null>(null);

    const newImageHandler = (image: string | null) => setImage(image);

    return (
        <>
            <div className="relative">
                <div aria-hidden="true" className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 -z-10">
                    <div className="blur-[106px] h-56 bg-gradient-to-br from-[#9333EA] to-purple-400 "></div>
                    <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 "></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-6 pb-12">
                    <header className="flex items-center justify-center py-12 flex-col gap-5">
                        <div className="flex items-center gap-2 flex-col md:flex-row">
                            <img src={logo} alt="logo" className="w-24 h-24 mx-auto" />
                            <h1 className="text-5xl text-center font-bold text-purple-800">Digit Recognizer</h1>
                        </div>
                        <p className="text-lg text-center text-gray-600">Draw a digit and see if the model can recognize it</p>
                    </header>

                    <div className="flex md:items-start gap-8 flex-col md:flex-row items-center">
                        <DrawingCanvas onNewImage={newImageHandler} />
                        <Predictions image={image} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;

import { useEffect, useRef } from "react";
import { throttle } from "lodash";

function DrawingCanvas({ onNewImage }: { onNewImage: (image: string | null) => void }) {
    const canvasElement = useRef<HTMLCanvasElement>(null);
    let context = canvasElement.current?.getContext("2d")!;

    let is_drawing = false;

    const convertToImage = () => {
        const image = new Image();
        image.src = canvasElement.current!.toDataURL("image/png");

        return image.src;
    };

    const sendImage = throttle(() => onNewImage(convertToImage()), 1000);

    const getX = (event: MouseEvent | TouchEvent) => {
        if (!canvasElement.current) return 0;

        let mouseX = (event as TouchEvent).changedTouches ? (event as TouchEvent).changedTouches[0].pageX : (event as MouseEvent).pageX;
        mouseX -= canvasElement.current.offsetLeft;

        return mouseX;
    };

    const getY = (event: MouseEvent | TouchEvent) => {
        if (!canvasElement.current) return 0;

        let mouseY = (event as TouchEvent).changedTouches ? (event as TouchEvent).changedTouches[0].pageY : (event as MouseEvent).pageY;
        mouseY -= canvasElement.current.offsetTop;

        return mouseY;
    };

    const onStart = (event: MouseEvent | TouchEvent) => {
        event.preventDefault();

        is_drawing = true;
        context.beginPath();
        context.moveTo(getX(event), getY(event));
    };

    const onMove = (event: MouseEvent | TouchEvent) => {
        event.preventDefault();

        if (is_drawing) {
            context.lineTo(getX(event), getY(event));
            context.strokeStyle = "black";
            context.lineWidth = 20;
            context.lineCap = "round";
            context.lineJoin = "round";
            context.stroke();
        }
    };

    const onEnd = (event: MouseEvent | TouchEvent) => {
        event.preventDefault();

        if (is_drawing) {
            context.stroke();
            context.closePath();
            is_drawing = false;

            sendImage();
        }
    };

    const clearCanvas = () => {
        context.fillStyle = "white";
        context.clearRect(0, 0, canvasElement.current!.width, canvasElement.current!.width);
        context.fillRect(0, 0, canvasElement.current!.width, canvasElement.current!.width);

        onNewImage(null);
    };

    useEffect(() => {
        if (!canvasElement.current) return;

        context = canvasElement.current.getContext("2d")!;

        // Clear the canvas
        context.fillStyle = "white";
        context.fillRect(0, 0, canvasElement.current.width, canvasElement.current.height);

        // Initialize event listeners (didn't use React's event listeners because they don't support passive: false)
        canvasElement.current.addEventListener("mousedown", onStart, { passive: false });
        canvasElement.current.addEventListener("touchstart", onStart, { passive: false });
        canvasElement.current.addEventListener("mousemove", onMove, { passive: false });
        canvasElement.current.addEventListener("touchmove", onMove, { passive: false });
        canvasElement.current.addEventListener("mouseup", onEnd, { passive: false });
        canvasElement.current.addEventListener("touchend", onEnd, { passive: false });

        return () => {
            canvasElement.current!.removeEventListener("mousedown", onStart);
            canvasElement.current!.removeEventListener("touchstart", onStart);
            canvasElement.current!.removeEventListener("mousemove", onMove);
            canvasElement.current!.removeEventListener("touchmove", onMove);
            canvasElement.current!.removeEventListener("mouseup", onEnd);
            canvasElement.current!.removeEventListener("touchend", onEnd);
        };
    }, []);

    return (
        <div className="flex flex-col items-center w-fit">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80 flex flex-col items-center">
                <canvas ref={canvasElement} width={250} height={250} className="border-2 border-black"></canvas>

                <p className="text-sm text-gray-600 mt-2 text-center">Click and drag to draw a digit, try to keep it centered and as large as possible to improve recognition</p>
            </div>

            <div className="flex justify-center mt-4">
                <button type="button" className="px-4 py-2 rounded-md bg-purple-600 text-white w-32" onClick={clearCanvas}>
                    Clear
                </button>
            </div>
        </div>
    );
}

export default DrawingCanvas;

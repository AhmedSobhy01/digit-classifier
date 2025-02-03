import { useCallback, useEffect, useMemo, useRef } from "react";
import { throttle } from "lodash";

const DrawingCanvas: React.FC<{ onNewImage: (image: string | null) => void }> = ({ onNewImage }) => {
    const canvasElement = useRef<HTMLCanvasElement | null>(null);
    const isDrawing = useRef(false);

    const convertToImage = () => {
        const image = new Image();
        image.src = canvasElement.current!.toDataURL("image/png");

        return image.src;
    };

    const sendImage = useMemo(
        () =>
            throttle(() => {
                if (canvasElement.current) {
                    onNewImage(convertToImage());
                }
            }, 700),
        [onNewImage]
    );

    const getX = (event: MouseEvent | TouchEvent) => {
        if (canvasElement.current === null) return 0;

        let mouseX = (event as TouchEvent).changedTouches ? (event as TouchEvent).changedTouches[0].pageX : (event as MouseEvent).pageX;
        mouseX -= canvasElement.current.offsetLeft;

        return mouseX;
    };

    const getY = (event: MouseEvent | TouchEvent) => {
        if (canvasElement.current === null) return 0;

        let mouseY = (event as TouchEvent).changedTouches ? (event as TouchEvent).changedTouches[0].pageY : (event as MouseEvent).pageY;
        mouseY -= canvasElement.current.offsetTop;

        return mouseY;
    };

    const onStart = useCallback((event: MouseEvent | TouchEvent) => {
        event.preventDefault();

        const context = canvasElement.current!.getContext("2d")!;

        isDrawing.current = true;
        context.beginPath();
        context.moveTo(getX(event), getY(event));
    }, []);

    const onMove = useCallback((event: MouseEvent | TouchEvent) => {
        event.preventDefault();

        if (isDrawing.current) {
            const context = canvasElement.current!.getContext("2d")!;

            context.lineTo(getX(event), getY(event));
            context.strokeStyle = "black";
            context.lineWidth = 20;
            context.lineCap = "round";
            context.lineJoin = "round";
            context.stroke();
        }
    }, []);

    const onEnd = useCallback(
        (event: MouseEvent | TouchEvent) => {
            event.preventDefault();

            if (isDrawing.current) {
                const context = canvasElement.current!.getContext("2d")!;

                context.stroke();
                context.closePath();
                isDrawing.current = false;

                sendImage();
            }
        },
        [sendImage]
    );

    const clearCanvas = (): void => {
        if (canvasElement.current === null) return;

        const context = canvasElement.current.getContext("2d")!;

        context.clearRect(0, 0, canvasElement.current!.width, canvasElement.current!.width);
        context.fillRect(0, 0, canvasElement.current!.width, canvasElement.current!.width);

        onNewImage(null);
    };

    useEffect(() => {
        const canvasElm = canvasElement.current;
        if (canvasElm === null) return;

        // Get the canvas context
        const context = canvasElm.getContext("2d")!;

        // Clear the canvas
        context.fillStyle = "white";
        context.fillRect(0, 0, canvasElm.width, canvasElm.height);

        // Initialize event listeners (didn't use React's event listeners because they don't support passive: false)
        canvasElm.addEventListener("mousedown", onStart, { passive: false });
        canvasElm.addEventListener("touchstart", onStart, { passive: false });
        canvasElm.addEventListener("mousemove", onMove, { passive: false });
        canvasElm.addEventListener("touchmove", onMove, { passive: false });
        canvasElm.addEventListener("mouseup", onEnd, { passive: false });
        canvasElm.addEventListener("touchend", onEnd, { passive: false });

        return () => {
            canvasElm.removeEventListener("mousedown", onStart);
            canvasElm.removeEventListener("touchstart", onStart);
            canvasElm.removeEventListener("mousemove", onMove);
            canvasElm.removeEventListener("touchmove", onMove);
            canvasElm.removeEventListener("mouseup", onEnd);
            canvasElm.removeEventListener("touchend", onEnd);
        };
    }, [onStart, onMove, onEnd]);

    // Add global event listeners for mouseup and touchend events
    useEffect(() => {
        const handleGlobalEnd = (event: MouseEvent | TouchEvent) => {
            if (isDrawing.current) onEnd(event);
        };

        window.addEventListener("mouseup", handleGlobalEnd, { passive: false });
        window.addEventListener("touchend", handleGlobalEnd, { passive: false });

        return () => {
            window.removeEventListener("mouseup", handleGlobalEnd);
            window.removeEventListener("touchend", handleGlobalEnd);
        };
    }, [onEnd]);

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
};

export default DrawingCanvas;

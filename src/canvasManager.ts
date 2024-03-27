import debouce from "lodash/debounce";

export class CanvasManager {
    private readonly canvas: HTMLCanvasElement;
    private readonly resizeObserver: ResizeObserver;
    public readonly context: WebGL2RenderingContext;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;

        // Context
        const context = this.canvas.getContext("webgl2");
        if (!context) {
            throw Error("Can't create WebGL2 context");
        }
        this.context = context;

        // Resize
        const debouncedResizeHandler = debouce(this.resizeCanvas.bind(this), 500)
        this.resizeObserver = new ResizeObserver(debouncedResizeHandler)
        this.resizeObserver.observe(canvas)
        this.resizeCanvas()

        // Lock pointer
        canvas.requestPointerLock();
        canvas.addEventListener("click", () =>  {
            if (document.pointerLockElement !== canvas) {
                canvas.requestPointerLock();
            }
        })
    }

    private resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * devicePixelRatio;
        this.canvas.height = rect.height * devicePixelRatio;
        this.context.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    get width() {
        return this.canvas.width;
    }

    get height() {
        return this.canvas.height;
    }
}

import { CanvasManager } from "./canvasManager";

export function startPlaying(canvas: HTMLCanvasElement) {
    new CanvasManager(canvas);
}

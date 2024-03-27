import { glMatrix, mat4 } from "gl-matrix";
import { CanvasManager } from "./canvasManager";
import { Plane } from "./gameObject";
import { SceneGraphNode } from "./sceneGraph";
import { renderMeshScene } from "./renderer";
import { createMeshShaderProgram } from "./shaderHelpers";

export function startPlaying(canvas: HTMLCanvasElement) {
    glMatrix.setMatrixArrayType(Float32Array);
    const canvasManager = new CanvasManager(canvas);

    // Root node with floor
    const rootNode = new SceneGraphNode();
    const floor = new Plane(10, 10);
    rootNode.addGameObject(floor);

    const program = createMeshShaderProgram(canvasManager.context);

    const cameraTransform = new Float32Array(16);
    mat4.lookAt(cameraTransform, [0, 0, 20], [0, 0, 0], [1, 1, 0])

    const projectionMatrix = new Float32Array(16);
    const verticalFov = 30 * 3.14 / 180;
    const aspect = canvas.width / canvas.height;
    const near = 0.01; // 1cm
    const far = 1000; // 1km
    mat4.perspective(projectionMatrix, verticalFov, aspect, near, far);

    const cameraProjectionMatrix = new Float32Array(16);
    mat4.mul(cameraProjectionMatrix, projectionMatrix, cameraTransform);

    renderMeshScene(canvasManager.context, program, rootNode, cameraProjectionMatrix);
}

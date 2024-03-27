import { glMatrix, mat4, vec3 } from "gl-matrix";
import { CanvasManager } from "./canvasManager";
import { GameObject, Plane, Texture } from "./gameObject";
import { SceneGraphNode } from "./sceneGraph";
import { renderMeshScene } from "./renderer";
import { createMeshShaderProgram } from "./shaderHelpers";

function randomColor(): vec3 {
    return [Math.random(), Math.random(), Math.random()];
}

export async function startPlaying(canvas: HTMLCanvasElement) {
    glMatrix.setMatrixArrayType(Float32Array);
    const canvasManager = new CanvasManager(canvas);

    // Root node with floor
    const rootNode = new SceneGraphNode();
    const slabSizeX = 1;
    const slabSizeY = 1;
    const floorSlabMesh = (new Plane(slabSizeX, slabSizeY)).getMesh();
    const nFloorSlabsX = 100;
    const nFloorSlabsY = 100;
    for (let x = 0; x < nFloorSlabsX; ++x) {
        for (let y = 0; y < nFloorSlabsY; ++y) {
            const floorSlab = new GameObject();
            floorSlab.setMesh(floorSlabMesh);
            floorSlab.setTexture(new Texture(randomColor()));
            const floorSlabNode = new SceneGraphNode();
            floorSlabNode.addGameObject(floorSlab);
            mat4.fromTranslation(floorSlabNode.ownTransform, [x * slabSizeX, y * slabSizeY, 0]);
            rootNode.addChild(floorSlabNode);
        }
    }

    const program = createMeshShaderProgram(canvasManager.context);

    const cameraTransform = new Float32Array(16);
    const floorCenter: vec3 = [nFloorSlabsX * slabSizeX * 0.5, nFloorSlabsY * slabSizeY * 0.5, 0];
    mat4.lookAt(cameraTransform, [floorCenter[0], floorCenter[1], 1000], floorCenter, [1, 1, 0]);

    const projectionMatrix = new Float32Array(16);
    const verticalFov = 30 * 3.14 / 180;
    const aspect = canvas.width / canvas.height;
    const near = 0.01; // 1cm
    const far = 1000; // 1km
    mat4.perspective(projectionMatrix, verticalFov, aspect, near, far);

    const cameraProjectionMatrix = new Float32Array(16);
    mat4.mul(cameraProjectionMatrix, projectionMatrix, cameraTransform);

    let previousDate = Date.now();
    while (true) {
        renderMeshScene(canvasManager.context, program, rootNode, cameraProjectionMatrix);
        const nextDate = Date.now();
        console.log(nextDate - previousDate);
        previousDate = nextDate;
        await new Promise(resolve => setTimeout(resolve, 0));
    }
}

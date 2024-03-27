import { Mesh, Texture } from "./gameObject";
import { mat4 } from "gl-matrix";
import { SceneGraphNode } from "./sceneGraph";
import { updateMeshAttributesInVao, getOrCreateMeshVao } from "./bufferHelpers";


export interface IMeshAttributes {
    transform: mat4;
    texture: Texture;
}

// Dark cyan
const defautTexture = new Texture([0, 0.5, 0.5]);

export function renderMeshScene(gl: WebGL2RenderingContext, program: WebGLProgram, sceneGraph: SceneGraphNode, cameraProjectionMatrix: Float32Array) {
    const renderMap: Map<Mesh, IMeshAttributes[]> = new Map();
    const nodeStack = [{ node: sceneGraph, previousTransform: mat4.create() }];
    while (nodeStack.length > 0) {
        const { node, previousTransform } = nodeStack.pop()!
        const transform = mat4.multiply(mat4.create(), previousTransform, node.ownTransform);
        // Add game objects to the render map
        const gameObjects = node.getGameObjects();
        for (const gameObject of gameObjects) {
            const mesh = gameObject.getMesh();
            if (!mesh) {
                continue;
            }
            const texture = gameObject.getTexture() ?? defautTexture;
            const meshRenderArray = renderMap.get(mesh) ?? [];
            meshRenderArray.push({ transform, texture });
            renderMap.set(mesh, meshRenderArray);
        }
        // Push children to the stack
        for (const child of node.getChildren()) {
            nodeStack.push({ node: child, previousTransform: transform });
        }
    }

    // Now render all the meshes using instanced draw elements when there are more than two elements
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(program)
    const projectionMatLoc = gl.getUniformLocation(program, "projectionMatrix")!;
    gl.uniformMatrix4fv(projectionMatLoc, false, cameraProjectionMatrix);
    const indexType = gl.UNSIGNED_SHORT;
    for (const [mesh, attributes] of renderMap.entries()) {
        const count = mesh.triangleIndices.length;
        const instanceCount = attributes.length;
        // Create vertex buffer
        const vaoCache = getOrCreateMeshVao(gl, mesh);
        updateMeshAttributesInVao(gl, vaoCache, attributes);
        gl.bindVertexArray(vaoCache.vao);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vaoCache.indexBuffer);
        gl.drawElementsInstanced(gl.TRIANGLES, count, indexType, 0, instanceCount);
    }
}

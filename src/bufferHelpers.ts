import { Mesh } from "./gameObject";
import { IMeshAttributes } from "./renderer";

// Cache mesh buffer objects for each context
export interface IVaoCacheEntry {
    vao: WebGLVertexArrayObject;
    vertexBuffer: WebGLBuffer;
    indexBuffer: WebGLBuffer;
    attributeBuffer: WebGLBuffer;
}
const meshVaoCache: Map<WebGL2RenderingContext, Map<Mesh, IVaoCacheEntry>> = new Map();


export function getOrCreateMeshVao(gl: WebGL2RenderingContext, mesh: Mesh): IVaoCacheEntry {
    const cacheValue = meshVaoCache.get(gl)?.get(mesh);
    if (cacheValue) {
        return cacheValue;
    }

    // Create VAO
    const vao = gl.createVertexArray()
    if (!vao) {
        throw "Can't create VAO";
    }
    gl.bindVertexArray(vao);

    // Create the buffer for vertices
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        throw "Can't create vertex buffer for mesh";
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    // Create the buffer for indices
    const indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
        throw "Can't create index buffer for mesh";
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.triangleIndices, gl.STATIC_DRAW);

    // Create the buffer for instance attributes
    // Don't give data to this buffer
    const attributeBuffer = gl.createBuffer();
    if (!attributeBuffer) {
        throw "Can't create attribute buffer for mesh";
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, attributeBuffer);
    const matrixLocation = 1;
    gl.vertexAttribPointer(matrixLocation + 0, 4, gl.FLOAT, false, 80, 0);
    gl.vertexAttribPointer(matrixLocation + 1, 4, gl.FLOAT, false, 80, 16);
    gl.vertexAttribPointer(matrixLocation + 2, 4, gl.FLOAT, false, 80, 32);
    gl.vertexAttribPointer(matrixLocation + 3, 4, gl.FLOAT, false, 80, 48);
    gl.vertexAttribDivisor(matrixLocation + 0, 1);
    gl.vertexAttribDivisor(matrixLocation + 1, 1);
    gl.vertexAttribDivisor(matrixLocation + 2, 1);
    gl.vertexAttribDivisor(matrixLocation + 3, 1);
    gl.enableVertexAttribArray(matrixLocation + 0);
    gl.enableVertexAttribArray(matrixLocation + 1);
    gl.enableVertexAttribArray(matrixLocation + 2);
    gl.enableVertexAttribArray(matrixLocation + 3);

    const textureDescriptorLocation = 5;
    gl.vertexAttribPointer(textureDescriptorLocation, 4, gl.FLOAT, false, 80, 64);
    gl.vertexAttribDivisor(textureDescriptorLocation, 1);
    gl.enableVertexAttribArray(textureDescriptorLocation);

    // Put the buffer in cache
    const contextCache: Map<Mesh, IVaoCacheEntry> = meshVaoCache.get(gl) ?? new Map();
    const cacheEntry = { vao, vertexBuffer, indexBuffer, attributeBuffer };
    contextCache.set(mesh, cacheEntry);
    meshVaoCache.set(gl, contextCache);

    return cacheEntry;
}

export function updateMeshAttributesInVao(gl: WebGL2RenderingContext, vaoCache: IVaoCacheEntry, attributes: IMeshAttributes[]) {
    // A mat4 for the transform and a vec4 for the texture descriptor, this is 20 floats per mesh
    const floatsPerAttribute = 20;
    const numberOfAttributes = attributes.length;
    const buffer = new Float32Array(floatsPerAttribute * numberOfAttributes);
    for (let attributeIndex = 0; attributeIndex < numberOfAttributes; attributeIndex++) {
        const { texture, transform } = attributes[attributeIndex];
        buffer.set(transform, attributeIndex * floatsPerAttribute);
        const textureDescriptor = texture.getShaderRepresentation();
        buffer.set(textureDescriptor, attributeIndex * floatsPerAttribute + 16);
    }

    gl.bindVertexArray(vaoCache.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, vaoCache.attributeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STREAM_DRAW)
}

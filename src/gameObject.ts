import { vec3, vec4 } from "gl-matrix";

export class Mesh {
    constructor(
        public readonly vertices: Float32Array,
        public readonly triangleIndices: Uint16Array,
    ) {}
}

export class Texture {
    private readonly shaderRepresentation: vec4;

    // Use a negative textureId to always use the default color
    constructor(
        public readonly defaultNormalizedRgbColor: vec3,
        public readonly textureId: number = -1,
    ) {
        // [R G B ID]
        this.shaderRepresentation = [this.defaultNormalizedRgbColor[0], this.defaultNormalizedRgbColor[1], this.defaultNormalizedRgbColor[2], this.textureId];
    }

    public getShaderRepresentation(): vec4 {
        return this.shaderRepresentation;
    }
}

export class GameObject {
    private inverseMass: number = 0;
    
    protected mesh: Mesh | null = null;
    protected texture: Texture | null = null;

    constructor() {}

    public setMesh(mesh: Mesh | null) {
        this.mesh = mesh;
    }

    public getMesh(): Mesh | null {
        return this.mesh;
    }

    public setTexture(texture: Texture | null) {
        this.texture = texture;
    }

    public getTexture(): Texture | null {
        return this.texture;
    }

    public getInverseMass() {
        return this.inverseMass;
    }

    public setInverseMass(inverseMass: number) {
        this.inverseMass = inverseMass;
    }
}

export class Plane extends GameObject {
    constructor(
        public readonly xSize: number,
        public readonly ySize: number,
    ) {
        super()
        const vertices = new Float32Array([
            0, 0, 0,
            xSize, 0, 0,
            xSize, ySize, 0,
            0, ySize, 0,
        ]);
        const triangles = new Uint16Array([
            0, 1, 2,
            2, 3, 0,
        ]);
        this.mesh = new Mesh(vertices, triangles);
    }
}

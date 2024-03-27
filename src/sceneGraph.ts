import { mat4 } from "gl-matrix";
import { GameObject } from "./gameObject";

export class SceneGraphNode {
    private readonly parentNodes: SceneGraphNode[] = [];
    private readonly childrenNodes: SceneGraphNode[] = [];
    private readonly gameObjects: GameObject[] = [];
    public ownTransform: mat4;

    constructor() {
        this.ownTransform = mat4.create();
    }

    public addChild(node: SceneGraphNode) {
        this.childrenNodes.push(node);
        node.parentNodes.push(this);
    }

    public addGameObject(gameObject: GameObject) {
        this.gameObjects.push(gameObject);
    }

    public getChildren() {
        return this.childrenNodes;
    }

    public getParents() {
        return this.parentNodes;
    }

    public getGameObjects() {
        return this.gameObjects;
    }
}

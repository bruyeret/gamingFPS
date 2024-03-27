// @ts-ignore: using vite-plugin-string
import meshVS from "./mesh.vert";
// @ts-ignore: using vite-plugin-string
import meshFS from "./mesh.frag";

// Copy pasted from: https://webgl2fundamentals.org/webgl/lessons/webgl-boilerplate.html
function compileShader(gl: WebGL2RenderingContext, shaderSource: string, shaderType: number) {
    // Create the shader object
    const shader = gl.createShader(shaderType);
    if (!shader) {
        throw "Can't create shader";
    }
    
    // Set the shader source code.
    gl.shaderSource(shader, shaderSource);
    
    // Compile the shader
    gl.compileShader(shader);
    
    // Check if it compiled
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
        // Something went wrong during compilation; get the error
        throw ("could not compile shader:" + gl.getShaderInfoLog(shader));
    }
    
    return shader;
}

function createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    // create a program.
    const program = gl.createProgram();
    if (!program) {
        throw "Can't create program";
    }
   
    // attach the shaders.
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
   
    // link the program.
    gl.linkProgram(program);
   
    // Check if it linked.
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        // something went wrong with the link; get the error
        throw ("program failed to link:" + gl.getProgramInfoLog(program));
    }
   
    return program;
};

export function createMeshShaderProgram(gl: WebGL2RenderingContext) {
    const vs = compileShader(gl, meshVS, gl.VERTEX_SHADER);
    const fs = compileShader(gl, meshFS, gl.FRAGMENT_SHADER);
    const program = createProgram(gl, vs, fs);
    return program;
}

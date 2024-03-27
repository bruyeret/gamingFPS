#version 300 es

precision mediump float;

in float textureId;
in vec3 defaultColor;

out vec4 outColor;

void main() {
    outColor = vec4(defaultColor, 1.0);
}

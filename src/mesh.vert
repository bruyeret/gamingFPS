#version 300 es

uniform mat4 projectionMatrix;

layout (location=0) in vec3 vertexWorldCoordinates;
layout (location=1) in mat4 modelToWorldMatrix;
layout (location=5) in vec4 textureDescriptor;

out float textureId;
out vec3 defaultColor;

void main() {
   textureId = textureDescriptor.a;
   defaultColor = textureDescriptor.rgb;
   gl_Position = projectionMatrix * modelToWorldMatrix * vec4(vertexWorldCoordinates, 1.0);
}

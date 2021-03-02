attribute vec3 aPositionSphere;
attribute vec3 aColor;

uniform float uTransitionTime;

varying vec3 vColor;

void main() {

  vec3 localPosition = mix(position, aPositionSphere, uTransitionTime);
  vec4 modelPosition = modelMatrix * vec4(localPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;

  gl_PointSize = 2.0;
  vColor = aColor;
}

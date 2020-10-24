attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;

varying vec2 vUv;

const float interval=3.;

#pragma glslify:ease=require(glsl-easings/cubic-out)

void main(){
  float now=ease(min(time/interval,1.));
  vec3 updatePosition=vec3(
    position.x*(1.5-now*.5),
    position.y*(1.5-now*.5),
    position.z
  );
  vUv=uv;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(updatePosition,1.);
}
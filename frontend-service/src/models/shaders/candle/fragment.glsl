precision lowp float;

uniform float uAlpha;

varying vec2 vUv;

vec3 color = vec3(0.9686, 1.0, 0.6235);

		void main() {
			gl_FragColor = vec4(color, uAlpha);
		}
precision lowp float;

uniform sampler2D uDiffuse;
varying vec2 vUv;


		void main() {
			vec4 shadow = texture2D(uDiffuse, vUv);

            vec3 color = vec3(0.0, 0.0, 0.0);
			gl_FragColor = vec4(shadow-0.7);

		}
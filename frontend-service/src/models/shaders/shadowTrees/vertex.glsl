        uniform mat4 projectionMatrix;
        uniform mat4 viewMatrix;
        uniform mat4 modelMatrix;
        uniform mat4 modelViewMatrix;

        uniform float uTime;
        uniform float uSpeed;
        uniform vec2 uFrequency;


        attribute vec2 uv;
        attribute vec3 position;

        varying vec2 vUv;

		void main() {

			vUv = uv;

            vec4 modelPosition = vec4(position,1.0);
            float waves = sin(modelPosition.x * uFrequency.x -(uTime * uSpeed)) * .01;
            waves += sin(modelPosition.y * uFrequency.y - (uTime * uSpeed)) * .01;
            modelPosition.x += waves * (1.0 - vUv.x);
            modelPosition.y += waves * (1.0 - vUv.x);
            gl_Position = projectionMatrix * modelViewMatrix * modelPosition;

		}
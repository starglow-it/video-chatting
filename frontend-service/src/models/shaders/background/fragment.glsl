precision lowp float;

uniform float uTreeStrength;
uniform float uWaterStrength;

uniform sampler2D uBackgroundDiffuse;
uniform sampler2D uBackgroundLayers;

uniform sampler2D uFnoise;
uniform sampler2D uCnoise;

uniform float uTime;
uniform float uWaterSpeed;

varying vec2 vUv;

float wave(float xstr, float mask, float strength, float phi){
return sin(vUv.x * xstr + sin(uTime + vUv.y * mask +phi+ cos(vUv.x + phi))) * strength ;
}

vec2 imgDistord(float mask, vec2 uv, float offset, float strengthMult, float phi){
            float grad = clamp(1.0 -(uv.y + offset),0.,1.);
            float treeWave = wave(.5, grad, uTreeStrength * strengthMult, phi) * grad;
            uv.x += treeWave * mask;

            return uv;
}
vec4 imgMasking(vec4 texture, float mask){
        return (texture * clamp(mask, 0., 1.));
}

float avg(vec4 color) {
    return (color.r + color.g + color.b)/3.0;
}
		void main() {
            vec4 layers = texture2D(uBackgroundLayers, vUv);
            
            // foreground right tree
            vec4 rightTree = texture2D(uBackgroundDiffuse , imgDistord(layers.r, vUv, .5, 1., 1.));
            vec4 imgRightTree = imgMasking(rightTree, layers.r);
            // foreground left tree
            vec4 leftTree = texture2D(uBackgroundDiffuse , imgDistord(layers.g, vUv, .5, 1., 0.));
            vec4 imgLeftTree = imgMasking(leftTree, layers.g);
            //others trees
            vec4 otherTrees = texture2D(uBackgroundDiffuse , imgDistord(layers.b, vUv, .7, .5, .7));
            vec4 imgOtherTrees = imgMasking(otherTrees, layers.b);
            //sky
            vec4 sky = texture2D(uBackgroundDiffuse, vUv);
            vec4 imgSky = imgMasking(sky, 1.0 - (layers.r+layers.g+layers.b));
            
            vec4 composition_sup =  (imgRightTree + imgLeftTree + imgOtherTrees + imgSky) * vec4(layers.a);
            

            // MIRROR PART
            float offset = 0.6;
            float offset2 = 0.2;
            vec2 mirrorUv = vec2(vUv.x, 1.0 - vUv.y);

            //make waves
            // Flow Speed, increase to make the water flow faster.
            float speed = uWaterSpeed * (vUv.y -.5);
            
            // Water Scale, scales the water, not the background.
            vec2 scale = vec2(vUv.x + (1.0-vUv.x), vUv.y * 4.);
            
            // Water opacity, higher opacity means the water reflects more light.
            float opacity = .5;

            vec2 scaledUv = vUv * scale ;

            vec4 water1 = texture2D(uFnoise, scaledUv + uTime*0.02*speed - 0.1);
            vec4 water2 = texture2D(uFnoise, scaledUv.xy + uTime*speed*vec2(-0.02, -0.02) + 0.1);
            // Water highlights
            vec4 highlights1 = texture2D(uCnoise, scaledUv.xy + uTime*speed * vec2(-0.1, 0.01));
            vec4 highlights2 = texture2D(uCnoise, scaledUv.xy + uTime*speed * vec2(0.1, 0.01));
            
            mirrorUv += avg(water1) * (0.15* vUv.y);

            // Average the colors of the water layers (convert from 1 channel to 4 channel
            water1.rgb = vec3(avg(water1));
            water2.rgb = vec3(avg(water2));

            // Average and smooth the colors of the highlight layers
            highlights1.rgb = vec3(avg(highlights1)/1.5);
            highlights2.rgb = vec3(avg(highlights2)/1.5);

            float alpha = opacity;
    
            if(avg(water1 + water2) > 0.3) {
                alpha = 0.0;
            }
            
            if(avg(water1 + water2 + highlights1 + highlights2) > 0.75) {
                alpha = 5.0 * opacity;
            }

            // mirrorUv += SineWave(mirrorUv, 0.014, 50.);
            
            vec4 layersShad = texture2D(uBackgroundLayers, vec2(mirrorUv.x, mirrorUv.y + offset2));
            // float grad = clamp(1.0 -(mirrorUv.y + offset),0.,1.);
            // foreground right tree
            vec2 uvRtree = imgDistord(layersShad.r, mirrorUv, offset, 1., 1.);
            vec4 rightTreeShad = texture2D(uBackgroundDiffuse , vec2(uvRtree.x, uvRtree.y + offset2));
            vec4 imgRightTreeShad = imgMasking(rightTreeShad, layersShad.r);
            
            // foreground left tree
            vec2 uvLtree = imgDistord(layersShad.g, mirrorUv, offset, 1., 0.);
            vec4 leftTreeShad = texture2D(uBackgroundDiffuse , vec2(uvLtree.x, uvLtree.y + offset2));
            vec4 imgLeftTreeShad = imgMasking(leftTreeShad, layersShad.g);
            //others trees
            vec2 uvOtherTrees = imgDistord(layersShad.b, mirrorUv, offset + .2, .5, .7);
            vec4 otherTreesShad = texture2D(uBackgroundDiffuse , vec2(uvOtherTrees.x, uvOtherTrees.y + offset2));
            vec4 imgOtherTreesShad = imgMasking(otherTreesShad, layersShad.b);
            //sky
            vec4 skyShad = texture2D(uBackgroundDiffuse, mirrorUv);
            vec4 imgSkyShad = imgMasking(skyShad, 1.0 - (layersShad.r+layersShad.g+layersShad.b));
            float waterMask = step((1.0-layers.a), 0.01);
            vec4 composition_inf =  (1.0-waterMask) * (imgRightTreeShad + imgLeftTreeShad + imgOtherTreesShad + imgSkyShad) ;
            

            //fresnel and intensity
            float waterFresnel = clamp(layers.a, .8, 1.);
            float intensity = 1. * waterFresnel;

            //Addition
            vec4 final = composition_sup + composition_inf * vec4(intensity);
            final += (water1 * water2) * alpha * 0.1 * (1.0 - layers.a) ;
			gl_FragColor = vec4(final);
			// gl_FragColor = vec4(foregroundgrad);



		}
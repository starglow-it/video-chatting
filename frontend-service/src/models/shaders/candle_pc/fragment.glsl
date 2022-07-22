precision lowp float;

uniform float uTime;
uniform float uOffset;
uniform float uSpeed;
uniform float uAlpha;


varying vec2 vUv;

void main(){
    float waves = sin(vUv.x +cos(vUv.y + uTime + uOffset)) * 0.1 * vUv.y ;
    vec2 newUv = vUv;
    newUv.x += waves;
            
	vec2 pos = ( newUv )*8.-vec2(4.,4.);
	if (pos.y>-6.) {
		pos.y += 0.2*fract(sin(uTime*400. /uSpeed));
	}
	
	vec3 color = vec3(0.,0.,0.0);
	float p =.014;
	float y = pow(abs(pos.x),3.2)/(2.*p)*3.3;
	float dir = length(pos+vec2(pos.x,y))*sin(0.26);
	if (dir < 0.7) {
		color.rg += smoothstep(0.0,1.,.75-dir);
		color.g /=2.4;
	}
	
	color += pow(color.r,1.1);
	
	// blue flame
	float p1 = .015;
        float y1 = pow(abs(pos.x),3.2)/(2.*p1)*3.3;
        float d = length(pos+vec2(pos.x,y1+2.4))*sin(0.28);
        color.r += smoothstep(-0.5,.9,0.17-d);
        color.g += smoothstep(-0.3,.9,0.17-d);
        color.b += smoothstep(-0.5,2.9,0.47-d);
	
	gl_FragColor = vec4(color, uAlpha);
}
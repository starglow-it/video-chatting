precision lowp float;


uniform float uScale;

uniform float uTime;
uniform float uOffset;
uniform float uIntensity;
uniform float uAlpha;
uniform float uSpeed;
uniform float uX;
uniform float uY;

varying vec2 vUv;


float rand(vec2 n){
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

mat2 rotate(float angle){
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

float noise2d(vec2 p){
vec2 ip = floor(p);
vec2 u = fract(p) ;
u = u*u*(3.0-2.0*u);

    float res = mix(
        mix(rand(ip), rand(ip+vec2(1.,0.)), u.x),
        mix(rand(ip+vec2(0.,1.)),rand(ip+vec2(1.,1.)), u.x), u.y);
     
    return res*res;
}
float turbulence(){
    vec2 st = vUv.xy; // * uResolution.xy;
    st *= uScale * (sin(vUv.x)+0.1);
    st.y += uOffset;
    st -= vec2((1. - vUv.x ));
    st = rotate((1. - vUv.x )) * st;
    st += vec2((1. - vUv.x ));

    return noise2d(vec2(st.x + (uTime*uSpeed),st.y));
}

float Rect(vec2 coordUv, vec2 p, float width, float height, float blur)
{
	coordUv -= p;
	
	width /= 2.0;
	height /= 2.0;
	
	float mask = smoothstep(-width, -width + blur, coordUv.x) - smoothstep(width - blur, width, coordUv.x);
	mask *= smoothstep(-height, -height + blur, coordUv.y) - smoothstep(height - blur, height, coordUv.y);
	

	return mask;
}

void main()
{
    vec2 coordUv = vUv;
    coordUv -= .5;
	coordUv *= 10.;
    coordUv += vec2(uX,uY);

    coordUv -= vec2(turbulence()* (1. - vUv.x ));
    coordUv = rotate(turbulence()* (1. - vUv.x )) * coordUv;
    coordUv += vec2(turbulence()* (1. - vUv.x ));

	
	vec3 col = vec3(0.0, 0.0, 0.0);
	
	float x = coordUv.x;
	
	float m = (-x + 0.5) * (x + 0.5);
	
	m = m * m * 4.;
	
	
	m = (sin(x + uTime + uOffset)) * (1. - vUv.x );
	
	float y = coordUv.y - m;
	
		
	float mask = Rect(vec2(x, y), vec2(0.0, 0.), 10.5, 0.1, (coordUv.x - 4.) * 0.5);
	
	col = vec3(mask) * vUv.x;
    col *= turbulence();

    //don't touch the edges please
    float edges_horizontals = (1.-vUv.y) * vUv.y;
    col *= edges_horizontals;

    col*= uIntensity + 2.5;

    // gl_FragColor = vec4(col, col.x * uAlpha);
    gl_FragColor = vec4(col, uAlpha);


}
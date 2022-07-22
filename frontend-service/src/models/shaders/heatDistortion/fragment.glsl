precision lowp float;

        uniform sampler2D tDiffuse; //Old rendering passes

        uniform float uTime;
        uniform float uSpeed;
        uniform float uMult;

        uniform float uScale;
        uniform float uSmooth;
        uniform float uIntensity1;
        uniform float uIntensity2;
        uniform vec2 uResolution; //Screen sizes in pixels

        varying vec2 vUv;

float Rect(vec2 position, float scale){
    vec2 shaper = position * scale;
    return shaper.x * shaper.y;
}
float Circle(vec2 position){return length(position - vec2(0.5));}
float unite( float a, float b, float k){
                float h = clamp(.5+.5*(b-a)/k,0.,1.);
                return mix(b,a,h)-k*h*(1.-h);}
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
float turbulence(vec2 p){
    vec2 st = p;
    st *= uScale + (cos(vUv.y+sin(vUv.x+uTime)));
    st -= vec2((1. - vUv.y ));
    st = rotate((1. - vUv.x  )) * st;
    st += vec2((1. - vUv.y ));

    return noise2d(vec2(st.x + (uTime*uSpeed*0.3),st.y + (sin(st.y)*0.5)- (uTime*uSpeed)));
}

		void main() {
            

            vec2 uv = ((vUv - .5) * uResolution) / uResolution.y;
            float t = Rect(vec2(uv.x-.52,uv.y+5.), uIntensity2);
            float t1 = 1.-(Circle(vec2(uv.x-.13,uv.y+.81))* uIntensity1);


            float result = clamp(unite(t,t1,uSmooth),0.,1.);
            float noise = turbulence(vec2(uv.x + (result*0.3),uv.y+(result*0.1)));
            noise *= result;

            vec2 heatUv = vUv;
            heatUv += (noise * result) * uMult; // multiply to zdepth too will be better
            vec4 previousRender = texture2D(tDiffuse, heatUv);
            gl_FragColor = previousRender;


		}
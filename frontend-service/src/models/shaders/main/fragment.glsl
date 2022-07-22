precision lowp float;

uniform float uTime;

uniform sampler2D uLight;
uniform sampler2D uDark;
uniform sampler2D uMask;
uniform sampler2D uNormal;
uniform sampler2D uParallax;


varying vec2 vUv;

float fbm(float x, float y){
float amplitude = 1.;
float frequency = 50.;
y = sin(x * frequency);
float t = (-uTime*.1);
y += sin(x*frequency*2.1 + t)*4.5;
y += sin(x*frequency*1.72 + t*1.121)*4.0;
y += sin(x*frequency*2.221 + t*0.437)*5.0;
y += sin(x*frequency*3.1122+ t*4.269)*2.5;
y *= amplitude * 0.05;
return y;
}
void main()
{

vec4 lightImg = texture2D(uLight, vUv);
vec4 DarkImg = texture2D(uDark, vUv);

//trees movement
float maskMiddle = floor(vUv.x + 0.5);
vec2 newUV = vec2(vUv.x,vUv.y-0.05);
newUV.x += sin(fbm(10.,10.)) * ((1.0- vUv.y)+0.02) * maskMiddle;
newUV.x += sin(fbm(15.,10.)) * 0.5* ((1.0- vUv.y)+0.05) * (1.0 - maskMiddle);


//normal
vec4 NormImg = texture2D(uNormal, vUv);
newUV += NormImg.xy *0.009;

//z-depth
vec4 zImg = texture2D(uParallax, vUv);
newUV *= 1.+(zImg.xy * 0.01);

vec4 maskImg = texture2D(uMask, newUV);





vec4 final = mix(DarkImg, lightImg, maskImg);

gl_FragColor = final;

}
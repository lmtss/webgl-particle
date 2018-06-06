var vShader = "#version 300 es\n"+
"in vec4 aPos;\n"+
"out vec4 oPos;"+
"out vec4 vColor;"+
"uniform float time;"+
"uniform float hpw;"+
"uniform sampler2D u_s;"+
"uniform float radius;"+
"float rand(vec2 co){return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);}"+
"vec2 ro(vec2 co, float deg){return vec2(co.x*cos(deg) - co.y*sin(deg), co.x*sin(deg) + co.y*cos(deg));}"+
"void main(){"+
"   float restTime = aPos.z;"+
"   restTime -= 0.1;"+
"   float val = rand(vec2(float(int(aPos.w)), 17.0));"+
"   if(restTime < 0.0 && restTime > -5.0){"+
"       restTime = 50.0;"+
"       float deg = aPos.w;"+
"       oPos = vec4(radius * sin(deg) * hpw, radius * cos(deg), restTime, aPos.w);"+
"       vColor = vec4(1.0, 0.0, 0.0, 1.0);"+
/*
"   }else if(restTime < -5.0){"+
"       restTime = 50.0;"+
"       oPos = vec4(aPos.x, aPos.y, restTime, aPos.w);"+
*/
"   }else if(restTime > 15.0/* && gl_VertexID % 10000 > 2000*/){"+
"       vec2 pos = vec2(aPos.x/hpw, aPos.y);"+
"       vec2 xxSpeed = vec2(pos.y, -pos.x);"+
"       xxSpeed = vec2(xxSpeed.x, xxSpeed.y);\n"+
"       xxSpeed = xxSpeed/1000.0;"+
"       oPos = vec4((pos.x + xxSpeed.x)*hpw, aPos.y + xxSpeed.y, restTime, aPos.w);\n"+
"       oPos = vec4(aPos.x, aPos.y, restTime, aPos.w);\n"+
"       vColor = vec4(1.0, 0.0, 0.0, 1.0);"+
"   }else{"+
"       vec4 tex = texture(u_s, vec2(aPos.x, aPos.y));\n"+
"       //vec4 tex = vec4(rand(vec2(aPos.x, aPos.y)), 0.0, 0.0, 0.0);\n"+
"       vec2 pos = vec2(aPos.x/hpw, aPos.y);"+
"       float noiseDeg = sign(2.0*rand(vec2(aPos.w, 1.0))-1.0)*(2.0 * tex.x - 1.0)*0.5;//(25.0 - restTime)/25.0;\n"+

"       vec2 xxSpeed = vec2(pos.y, -pos.x);"+
"       xxSpeed = vec2(xxSpeed.x*cos(noiseDeg) - xxSpeed.y*sin(noiseDeg), xxSpeed.x*sin(noiseDeg) + xxSpeed.y*cos(noiseDeg));\n"+
"       xxSpeed = xxSpeed/800.0;"+
"       //pos = ro(vec2((pos.x + xxSpeed.x), aPos.y + xxSpeed.y), 0.001);\n"+
"       //oPos = vec4(pos.x*hpw, pos.y, restTime, aPos.w);\n"+
"       oPos = vec4((pos.x + xxSpeed.x)*hpw, aPos.y + xxSpeed.y, restTime, aPos.w);\n"+
"       if(restTime > 7.0){vColor = vec4(1.0, 0.0, 0.0, 1.0);}"+
"       else{vColor = vec4(1.0, 0.0, 0.0, 1.0);}"+
"   }"+

"   gl_Position = vec4(aPos.x, aPos.y, 0.0, 1.0);"+
"   gl_PointSize = 1.0;"+
"}"
,
fShader = "#version 300 es\n"+ 
"precision highp float;\n" +
"in vec4 vColor;"+
"out vec4 outColor;"+
"uniform sampler2D u_s;"+
"void main(){"+
"   outColor = vColor;"+
"}",
vShader2 = "#version 300 es\n"+
"in vec4 aPos;\n"+
"out vec4 oPos;"+
"out vec4 vColor;"+
"uniform float time;"+
"uniform float hpw;"+
"uniform float radius;"+

'vec2 hash22(vec2 p)'+

'{'+
'    p = vec2( dot(p,vec2(127.1,311.7)),'+
'             dot(p,vec2(269.5,183.3)));'+
'    return -1.0 + 2.0 * fract(sin(p)*43758.5453123);'+
'}'+

'float perlin_noise(vec2 p)'+
'{'+
'   vec2 pi = floor(p);'+
'   vec2 pf = p - pi;'+
'    vec2 w = pf * pf * (3.0 - 2.0 * pf);'+
'    return mix(mix(dot(hash22(pi + vec2(0.0, 0.0)), pf - vec2(0.0, 0.0)), '+
'                   dot(hash22(pi + vec2(1.0, 0.0)), pf - vec2(1.0, 0.0)), w.x), '+
'               mix(dot(hash22(pi + vec2(0.0, 1.0)), pf - vec2(0.0, 1.0)), '+
'                   dot(hash22(pi + vec2(1.0, 1.0)), pf - vec2(1.0, 1.0)), w.x),'+
'               w.y);'+
'}'+

'float noise_sum(vec2 p){'+
'  float f = 0.0;'+
'  p = p * 8.0;'+
'  f += 1.0000 * perlin_noise(p); p = 2.0 * p;'+
'  f += 0.5000 * perlin_noise(p); p = 2.0 * p;'+
'  f += 0.2500 * perlin_noise(p); p = 2.0 * p;'+
'  f += 0.1250 * perlin_noise(p); p = 2.0 * p;'+
'  f += 0.0625 * perlin_noise(p); p = 2.0 * p;'+
' return f;}'+

'float noise_sum_abs(vec2 p){float f = 0.0;p = p * 15.0;'+
' f += 1.0000 * abs(perlin_noise(p)); p = 2.0 * p;'+
'  f += 0.5000 * abs(perlin_noise(p)); p = 2.0 * p;f += 0.2500 * abs(perlin_noise(p)); p = 2.0 * p;'+
'  f += 0.1250 * abs(perlin_noise(p)); p = 2.0 * p;f += 0.0625 * abs(perlin_noise(p)); p = 2.0 * p;return f;}'+

'float noise_sum_abs_sin(vec2 p){float f = 0.0;p = p * 2.0;'+
' f += sin(1.0000 * perlin_noise(p)); p = 2.0 * p;'+
'  f += sin(0.5 * perlin_noise(p)); p = 2.0 * p;f += sin(0.25 * perlin_noise(p)); p = 2.0 * p;'+
'  f += sin(0.125 * perlin_noise(p)); p = 2.0 * p;f += sin(0.0625 * perlin_noise(p)); p = 2.0 * p;return f;}'+


"float rand(vec2 co){return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);}"+
"vec2 ro(vec2 co, float deg){return vec2(co.x*cos(deg) - co.y*sin(deg), co.x*sin(deg) + co.y*cos(deg));}"+
"void main(){"+
"   float restTime = aPos.z;"+
"   restTime -= 0.1;"+
"   vec2 pos = vec2(aPos.x/hpw, aPos.y);"+
"   if(restTime < 0.0){"+
"       restTime = 50.0;"+
"       float deg = aPos.w;"+
"       oPos = vec4(radius * sin(deg) * hpw, radius * cos(deg), restTime, aPos.w);"+
"       vColor = vec4(1.0, 0.0, 0.0, 1.0);"+
"   }else if(restTime > 35.0){"+
"       oPos = vec4(aPos.x, aPos.y, restTime, aPos.w);\n"+
"       vColor = vec4(1.0, 0.0, 0.0, 1.0);"+
"   }else{"+
"       float noise = noise_sum(vec2(aPos.x + time/80.0, aPos.y + time/80.0));"+
"       //noise = sin(aPos.w - noise*2.0);\n"+
"       float noiseDeg = (2.0 * noise - 1.0)*1.57;\n"+

"       vec2 xxSpeed = vec2(-pos.x, -pos.y);"+
"       xxSpeed = vec2(xxSpeed.x*cos(noiseDeg) - xxSpeed.y*sin(noiseDeg), xxSpeed.x*sin(noiseDeg) + xxSpeed.y*cos(noiseDeg));\n"+
"       xxSpeed = xxSpeed/length(xxSpeed)/1200.0;"+

"       oPos = vec4((pos.x + xxSpeed.x)*hpw, aPos.y + xxSpeed.y, restTime, aPos.w);\n"+
"   }"+
"   if(restTime < 15.0){"+
"       vColor = vec4(0.0, 0.752, 0.984, restTime/15.0);"+
"   }else{vColor = vec4(0.0, 0.752, 0.984, 1.0);}"+
"   pos = ro(pos, time/100.0);"+
"   gl_Position = vec4(pos.x*hpw, pos.y, 0.0, 1.0);"+
"   gl_PointSize = 1.0;"+
"}"
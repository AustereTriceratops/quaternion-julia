// TODO: fix grainy renders somehow
// TODO: refactoring and cleanup
// TODO: use sphere SDF when ray is outside (not sure if a good idea when camera is inside the set)

const vertexShader = `
attribute vec4 aVertexPosition;

void main() {
    gl_Position = aVertexPosition;
}
`

const setup = `
precision highp float;

// include uniforms
uniform vec2 resolution;
uniform float aspect;

// camera rotation
uniform vec3 cameraX;
uniform vec3 cameraY;
uniform vec3 cameraZ;

// camera position
uniform vec3 cameraPos;

// Julia set parameters
uniform vec4 juliaSeed;
uniform float plane;
`

const quaternions = `
vec4 quaternionMult(vec4 q1, vec4 q2) {
  vec4 r;

  r.x = q1.x*q2.x - dot( q1.yzw, q2.yzw );
  r.yzw = q1.x*q2.yzw + q2.x*q1.yzw + cross( q1.yzw, q2.yzw );

  return r;
}

vec4 quatSq( vec4 q ) {
  vec4 r;

  r.x = q.x*q.x - dot( q.yzw, q.yzw );
  r.yzw = 2.0*q.x*q.yzw;

  return r;
}


// q: starting quaternion
// dp: derivative estimate
void iterateIntersect( inout vec4 q, inout vec4 dq, vec4 c) {
  for(int i=0; i<60; i++) {
    dq = 2.0 * quaternionMult(q, dq) + dq;
    q = quatSq(q) + q + c;

    if( dot( q, q ) > 20.0 ) {
      break;
    }
  }
}


// ray: position of end of ray in real space
// center: center of the Julia set
// c: parameters defining the Julia set
float JuliaSDF( vec3 ray, vec3 center, vec4 c ) {
  float dist = 0.0;

  // get vector from Julia set's center to real space
  vec3 p = ray - center;

  vec4 q = vec4( p.z, p.y, p.x, plane );
  vec4 dq = vec4( 1.0, 0.0, 0.0, 0.0 );

  iterateIntersect( q, dq, c );

  float x =  dot( q, q );
  float y = dot( dq, dq );
  dist = 0.2 * sqrt( x / y ) * log( x );

  return min(dist, 2.0);
}


vec3 estimateJuliaNormal( vec3 ray, vec3 center, vec4 c ) {
  float delta = 0.0005;
  float ref = JuliaSDF(ray, center, c);

  vec2 h = vec2( delta, 0 );

  vec3 normal =  normalize( 
    vec3(
      JuliaSDF(ray + h.xyy, center, c) - ref,
      JuliaSDF(ray + h.yxy, center, c) - ref,
      JuliaSDF(ray + h.yyx, center, c) - ref
    ) 
  );

  return normal;
}
`

const coordinateTransforms =
`
// COORDINATE TRANSFORMS ===========
vec2 to0Pos1( vec2 v ) {
  return vec2(aspect, 1.0) * v / resolution;
}

vec2 toNeg1Pos1( vec2 v ) {
  vec2 w = to0Pos1(v);
  return vec2(2.0*w.x - aspect, 2.0*w.y - 1.0);
}

// maps p in interval a to interval b
float toInterval( vec2 a, vec2 b, float p ) {
  float n = (p - a.x)/(a.y - a.x);
  float m = n * (b.y - b.x) + b.x;
  return m;
}
`

const shaderMain = `
// gl_FragCoord in [0,1]
void main() {
  vec2 uv = toNeg1Pos1(gl_FragCoord.xy) * vec2(1.0/(aspect*aspect), 1.0);

  // background color
  vec3 color = vec3(0.7, 0.6, 0.65);

  // get pxl real space as if camera is centered at origin
  vec3 pxl = 0.5 * uv.x * cameraX + cameraY + 0.5 * uv.y * cameraZ;
  vec3 ray_norm = normalize( pxl );

  // get position of ray in real space
  vec3 ray = cameraPos.xyz;

  // ====================
  vec3 juliaCenter = vec3(0.0, 0.0, 0.0);
  vec3 lightNorm = vec3(0.7071, 0.0, 0.7071);
  // ====================

  int RAYMARCHING_ITERATIONS = 150;
  float distance = 0.0;

  // raymarch for 180 iterations
  for (int i = 0; i < 180; i++) {
    float radius = max(ray.y, JuliaSDF(ray, juliaCenter, juliaSeed));

    float r_min = 0.0001 + 0.0003*distance*distance;

    if (radius < r_min) {
      color = vec3(0.5, 0.6, 0.7);

      vec3 normal = vec3(1.0, 0.0, 0.0);
      
      if (ray.y < 0.0) {
        normal = estimateJuliaNormal(ray, juliaCenter, juliaSeed);
      }

      // facs will be in interval [-1, 1]
      float fac_d = dot(normal, lightNorm);
      float fac_s = max(0.0, dot(ray_norm, lightNorm));

      // 0.0: total light (i.e white)
      // 1.0: lighting unchanged
      // >1.0: darkened
      float lightExponent = 0.6*(1.0 - fac_d)*(1.0 - fac_d) + 0.4;
      //float lightExponent = 1.0;

      // ambient occlusion
      lightExponent += 4.0*float(i)/float(RAYMARCHING_ITERATIONS);

      color = pow(color, vec3(2.0*lightExponent - 1.0, 1.1*lightExponent, 0.5*lightExponent + 0.1));
      
      break;
    }

    if (distance > 10.0) {
      break;
    }

    ray += radius * ray_norm;
    distance += radius;
  }

  gl_FragColor = vec4(color, 1.0);
}
`

const fragmentShader = setup + quaternions + coordinateTransforms + shaderMain;

export {vertexShader, fragmentShader};

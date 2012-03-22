#ifdef GL_ES
precision highp float;
#endif

#define STEP .8

varying vec3 circle;
varying vec4 color;

uniform float zoom;
uniform bool select;

uniform sampler2D glyph;

void main () {
  vec2 tex = (circle.xy + 1.0) / 2.0;
  float rad = length (circle.xy);
  //float left = length (circle.xy - vec2 (pxW / 2.0, pxH / 2.0));
  //float right = length (circle.xy + vec2 (pxW / 2.0, pxH / 2.0));
  gl_FragColor = color;
  if (!select) {
    //gl_FragColor.a = texture2D (glyph, tex).a;
    //if (rad > 1.0)
    //  gl_FragColor.a = 0.0;
    //gl_FragColor = mix (gl_FragColor, vec4 (gl_FragColor.rgb, 0.0), smoothstep (STEP, 1.0, rad)); 
    //gl_FragColor.a = exp (-(pow (rad, 2.0) / .4));
    gl_FragColor.a *= clamp (1.0 - smoothstep (STEP, 1.0, rad), 0.0, 1.0);
    //if (rad > STEP)
    //  gl_FragColor.a = .25;
  }

  else {
    if (rad > 1.0) 
      gl_FragColor.a = 0.0;
  }

  /*float x1 = (circle.x + pxW / 2.0);
  float x2 = (circle.x - pxW / 2.0);
  float y1 = sqrt (1.0 - x1);
  float y2 = sqrt (1.0 - x2);
  if (rad >= 1.0 && left < 1.0) {
    //gl_FragColor.a = (rad - left) / (right - rad);
    gl_FragColor.r = 1.0;
    //gl_FragColor.a = abs (y2 - y1) * abs (x1 - x2) / 2.0;
  }
  else if (rad < 1.0 && right > 1.0) {
    gl_FragColor.r = 1.0;
    //gl_FragColor.a = 1.0 - (rad - left) / (right - rad);
    //gl_FragColor.a = 1.0 - abs (y2 - y1) * abs (x1 - x2) / 2.0;
  }
  else if (rad > 1.0)
    gl_FragColor.a = 0.0;*/
  //    anchorX = circle.x - 1.0;
  //else if (circle.x < 1.0 && (circle.x + pxW / 2.0) > 1)
  //  anchorX = 1.0 - circle.x;
}
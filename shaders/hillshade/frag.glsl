#ifdef GL_ES
precision highp float;
#endif

#define PI 3.14159265
#define SHADE_RES .002

uniform sampler2D elevation;
uniform sampler2D background;

varying vec2 tex;
varying vec2 tex2;

uniform float pix_w;
uniform float pix_h;

float altitude = 45.0;
float azimuth = 315.0;

//varying vec3 world_p;
//vec3 light = vec3 (0.0, 90.0, 25.0);



void main () {
     float zenith_rad = (90.0 - altitude) * PI / 180.0;
     float azimuth_rad = (360.0 - azimuth + 90.0) * PI / 180.0;
     
     //float cellwidth = cellwidth;
     //float cellheight = cellheight;
     //float cellsize = .01;
     float z_factor = 1.0;
     
     /*     float a = texture2D (elevation, tex + vec2 (-pix_w, pix_h)).r;
     float b = texture2D (elevation, tex + vec2 (0.0, pix_h)).r;
     float c = texture2D (elevation, tex + vec2 (pix_w, pix_h)).r;
     float d = texture2D (elevation, tex + vec2 (-pix_w, 0.0)).r;
     float e = texture2D (elevation, tex + vec2 (0.0, 0.0)).r;
     float f = texture2D (elevation, tex + vec2 (pix_w, 0.0)).r;
     float g = texture2D (elevation, tex + vec2 (-pix_w, -pix_h)).r;
     float h = texture2D (elevation, tex + vec2 (0.0, -pix_h)).r;
     float i = texture2D (elevation, tex + vec2 (pix_w, -pix_h)).r;*/

     float a = texture2D (elevation, tex + vec2 (-SHADE_RES, SHADE_RES)).r;
     float b = texture2D (elevation, tex + vec2 (0.0, SHADE_RES)).r;
     float c = texture2D (elevation, tex + vec2 (SHADE_RES, SHADE_RES)).r;
     float d = texture2D (elevation, tex + vec2 (-SHADE_RES, 0.0)).r;
     float e = texture2D (elevation, tex + vec2 (0.0, 0.0)).r;
     float f = texture2D (elevation, tex + vec2 (SHADE_RES, 0.0)).r;
     float g = texture2D (elevation, tex + vec2 (-SHADE_RES, -SHADE_RES)).r;
     float h = texture2D (elevation, tex + vec2 (0.0, -SHADE_RES)).r;
     float i = texture2D (elevation, tex + vec2 (SHADE_RES, -SHADE_RES)).r;

     float dx = ((c + 2.0 * f + i) - (a + 2.0 * d + g)) / (8.0 * SHADE_RES);
     float dy = ((g + 2.0 * h + i) - (a + 2.0 * b + c)) / (8.0 * SHADE_RES);
     
     float slope_rad = atan (z_factor * sqrt (dx * dx + dy * dy));
     float aspect_rad = 0.0;
     if (dx != 0.0) {
       aspect_rad = atan (dy, -dx);
       if (aspect_rad < 0.0) 
       	  aspect_rad += 2.0 * PI;
     }
     if (dx == 0.0) {
     	  if (dy > 0.0)
	     aspect_rad = PI / 2.0;
	  else if (dy < 0.0)
	     aspect_rad = 2.0 * PI - PI / 2.0;
     }     

      float hillshade = cos (zenith_rad) * cos (slope_rad) + sin (zenith_rad) * sin (slope_rad) * cos (azimuth_rad - aspect_rad);
     hillshade = hillshade * .4 + .6;
     vec4 color = texture2D (background, tex2);
     gl_FragColor = vec4 (color.rgb * hillshade, 1.0);

     /*float dx = texture2D (elevation, tex + vec2 (pix_w, 0.0)).r - texture2D (elevation, tex - vec2 (pix_w, 0.0)).r;
    float dy = texture2D (elevation, tex + vec2 (0.0, pix_h)).r - texture2D (elevation, tex - vec2 (0.0, pix_h)).r;
    vec3 x = vec3 (.5, 0.0, dx);
    vec3 y = vec3 (0.0, .5, dy);
    vec3 dir = normalize (cross (x, y));
    //    gl_FragColor = texture2D (elevation, tex) * texture2D (background, tex2);
    //        gl_FragColor = vec4 (dir + 1.0 / 2.0, 1.0);
    //	return;
    vec3 norm = normalize (light - world_p);
    //vec3 norm = vec3 (0.0, 0.0, 1.0);
    float n = dot (dir, norm);
    //gl_FragColor = vec4 (dir + 1.0 / 2.0, 1.0);
    vec4 color = texture2D (background, tex2);
    gl_FragColor = clamp (vec4 (color.rgb * n + color.rgb * .5, 1.0), 0.0, 1.0);*/
}
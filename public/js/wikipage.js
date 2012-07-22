function WikiPage(name, position) {
    this.name = name;

    var canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    var context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.lineWidth = 2.5;
    context.strokeStyle = "black";
    context.save();
    context.font = "bold 150px Helvetica";
    context.textAlign = "center";
    context.textBaseline = "middle";
    var leftOffset = context.canvas.width / 2;
    var topOffset = context.canvas.height / 2;
    context.strokeText(name, leftOffset, topOffset);
    context.fillText(name, leftOffset, topOffset);
    context.restore();
    this.nameTexture = GL.Texture.fromImage(canvas, {
        minFilter: gl.LINEAR_MIPMAP_NEAREST,
    });

    this.position = [position[0], position[1], -40];
    
    var planeMesh = GL.Mesh.plane({
        coords: true,
    });
    
    var sphereMesh = GL.Mesh.sphere({
        detail: 10,
        normals: true
    });
    
    var shader = new GL.Shader('\
varying vec3 normal;\
void main() {\
  normal = gl_Normal;\
  gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;\
}\
', '\
varying vec3 normal;\
void main() {\
  vec3 light = vec3(3,5,6);\
  light = normalize(light);\
  float dProd = max(0.0, dot(normal, light));\
  gl_FragColor = vec4(dProd, dProd, dProd, 1.0);\
}\
    ');
    
    var textureShader = new GL.Shader('\
        varying vec2 coord;\
        void main() {\
          coord = gl_TexCoord.xy;\
          gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;\
        }\
        ', '\
        varying vec2 coord;\
        uniform sampler2D texture;\
        void main() {\
          gl_FragColor = texture2D(texture, coord);\
        }\
    ');

    this.draw = function() {
        gl.pushMatrix();
        
        gl.translate(this.position[0], this.position[1], this.position[2]);
        shader.draw(sphereMesh);
        
        gl.translate(0, 1.5, 0);
        gl.scale(2, 2, 2);
        this.nameTexture.bind(0);
        textureShader.uniforms({
            texture: 0,
        });
        //textureShader.draw(planeMesh);
        this.nameTexture.unbind(0);
        
        gl.popMatrix();
    }
}


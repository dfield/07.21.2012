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
    this.nameTexture = GL.Texture.fromURL("/images/mountains.jpeg");

    this.position = [position[0], position[1], -40];
    
    var planeMesh = GL.Mesh.plane({
        coords: true,
    });
    
    var sphereMesh = GL.Mesh.sphere({
        detail: 10,
        normals: true
    });
    
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


function WikiPage(name, position, currentPage) {
    this.name = name;
    this.currentPage = currentPage;
    var zCoord = (!!currentPage) ? 0 : -40;
    this.position = [position[0], position[1], zCoord];
  
    if (!this.currentPage) {
        var text = $("<span></span>")
            .attr("id", name)
            .addClass("page-title")
            .css("position", "absolute")
            .text(name);
        $("body").append(text);
        this.textElement = text;
    }

    var planeMesh = GL.Mesh.plane({
        coords: true,
    });
    
    var sphereMesh = GL.Mesh.sphere({
        detail: 10,
        normals: true,
        coords: true
    });

    var planetTexture1 = GL.Texture.fromURL("/images/planet-texture3.jpg", {
        minFilter: gl.LINEAR_MIPMAP_NEAREST
    });

    this.draw = function() {
        gl.pushMatrix();

        gl.translate(this.position[0], this.position[1], this.position[2]);
        planetTexture1.bind(0);
        textureShader.uniforms({
            texture: 0,
        });
        shadyTextureShader.draw(sphereMesh);
        planetTexture1.unbind(0);

        if (!this.currentPage) {
            var screenPosition = gl.project(0, 1.5, 0);
            this.textElement.css("left", screenPosition.x - this.textElement.width() / 2);
            this.textElement.css("bottom", screenPosition.y);
        }
        
        gl.popMatrix();
    }
}


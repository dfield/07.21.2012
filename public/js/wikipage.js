function WikiPage(article, position, currentPage) {
    this.article = article;
    this.currentPage = currentPage;
    var zCoord = (!!currentPage) ? 0 : -40;
    this.position = new GL.Vector(
        position[0],
        position[1],
        zCoord
    );

    this.highlighted = false;
    this.sizeAnimationTime = 0;
  
    if (!this.currentPage) {
        var text = $("<span></span>")
            .attr("id", this.article.name)
            .addClass("page-title")
            .css("position", "absolute")
            .text(this.article.name);
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
    
    this.update = function(seconds) {
        if (this.highlighted) {
            this.sizeAnimationTime = Math.min(this.sizeAnimationTime + seconds, 0.1);
        } else {
            this.sizeAnimationTime = Math.max(this.sizeAnimationTime - seconds, 0);
        }
    }

    this.draw = function() {
        gl.pushMatrix();

        gl.translate(this.position.x, this.position.y, this.position.z);

        var scaleFactor = 1 + this.sizeAnimationTime * 10;
        gl.scale(scaleFactor, scaleFactor, scaleFactor);

        if (!this.currentPage) {
            var screenPosition = gl.project(0, 1.5, 0);
            this.textElement.css("left", screenPosition.x - this.textElement.width() / 2);
            this.textElement.css("bottom", screenPosition.y);
        }
        
        gl.rotate(90, 0, 1, 0);

        planetTexture1.bind(0);
        shadyTextureShader.uniforms({
            texture: 0,
        });
        shadyTextureShader.draw(sphereMesh);
        planetTexture1.unbind(0);        
        gl.popMatrix();
    }
}


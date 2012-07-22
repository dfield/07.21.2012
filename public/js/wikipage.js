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
  
    if (!this.currentPage) {
        var text = $("<span></span>");
        text.attr("id", this.article.name);
        text.css("position", "absolute");
        text.css("z-index", 2);
        text.css("color", "#44AADD");
        text.css("font-family", "Helvetica");
        text.text(this.article.name);
        $("body").append(text);
        this.textElement = text;
    }

    var planeMesh = GL.Mesh.plane({
        coords: true,
    });
    
    var sphereMesh = GL.Mesh.sphere({
        detail: 10,
        normals: true
    });
    
    this.draw = function() {
        gl.pushMatrix();
        
        gl.translate(this.position.x, this.position.y, this.position.z);
        
        if (this.highlighted) {
            gl.pushMatrix();
            gl.scale(2, 2, 2);
        }
        shader.draw(sphereMesh);
        if (this.highlighted) {
            gl.popMatrix();
            gl.scale(2, 2, 2);
        }
       
        if (!this.currentPage) {
            var screenPosition = gl.project(0, 1.5, 0);
            this.textElement.css("left", screenPosition.x - this.textElement.width() / 2);
            this.textElement.css("bottom", screenPosition.y);
        }
        
        gl.popMatrix();
    }
}


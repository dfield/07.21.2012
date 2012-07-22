function WikiPage(name, position, currentPage) {
    this.name = name;
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
        var text = $("<span></span>");
        text.attr("id", name);
        text.css("position", "absolute");
        text.css("z-index", 2);
        text.css("color", "#44AADD");
        text.css("font-family", "Helvetica");
        text.text(name);
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
        
        shader.draw(sphereMesh);
        
        gl.popMatrix();
    }
}


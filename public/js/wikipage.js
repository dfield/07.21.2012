function WikiPage(name, position, currentPage) {
    this.name = name;
    this.currentPage = currentPage;
    var zCoord = (!!currentPage) ? 0 : -40;
    this.position = [position[0], position[1], zCoord];
  
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
    
    this.draw = function() {
        gl.pushMatrix();
        
        gl.translate(this.position[0], this.position[1], this.position[2]);
        shader.draw(sphereMesh);
        
        if (!this.currentPage) {
            var screenPosition = gl.project(0, 1.5, 0);
            this.textElement.css("left", screenPosition.x - this.textElement.width() / 2);
            this.textElement.css("bottom", screenPosition.y);
        }
        
        gl.popMatrix();
    }
}


function WikiPage(article, position, currentPage) {
    this.article = article;
    this.currentPage = currentPage;
    var lowerTextBound = 15;
    var upperTextBound = 21;
    var lowerBound = -50;
    var upperBound = -30;
    var rand = Math.random();
    var zCoord = (!!currentPage) ? 0 : lowerBound + rand * (upperBound - lowerBound);
    var fontSize = lowerTextBound + rand * (upperTextBound - lowerTextBound);;

    this.position = new GL.Vector(
        position[0],
        position[1],
        zCoord
    );

    this.highlighted = false;
    this.sizeAnimationTime = 0;
  
    var text = $("<span></span>")
        .attr("id", this.article.name)
        .addClass("page-title")
        .css("position", "absolute")
        .css("font-size", fontSize + "px")
        .text(this.article.name);
    this.textElement = text;

    var bridgeMesh = new GL.Mesh();
    bridgeMesh.vertices = [
        [-0.5, -0.5, 0],
        [0.5, -0.5, 0],
        [this.position.x - 0.5, this.position.y - 0.5, this.position.z],
        [this.position.x + 0.5, this.position.y - 0.5, this.position.z]
    ];
    bridgeMesh.triangles = [
        [0, 1, 2],
        [2, 1, 3]
    ];
    bridgeMesh.compile();
    
    var sizeAnimationDuration = 0.1;
    var sizeAnimationMaxSize = 1.2;
    this.size = 1;
    this.hitSize = this.size + 0.5;

    this.alpha = 1;

    this.update = function(seconds) {
        seconds *= 1 / sizeAnimationDuration;

        if (this.highlighted) {
            this.sizeAnimationTime = Math.min(this.sizeAnimationTime + seconds, 1);
        } else {
            this.sizeAnimationTime = Math.max(this.sizeAnimationTime - seconds, 0);
        }

        this.size = 1 + this.sizeAnimationTime * (sizeAnimationMaxSize - 1);
        this.hitSize = this.size + 1 ;
    }

    this.draw = function() {
        gl.pushMatrix();

        gl.translate(this.position.x, this.position.y, this.position.z);
        gl.scale(this.size, this.size, this.size);

        if (!this.currentPage) {
            var screenPosition = gl.project(0, 1.5, 0);
            this.textElement.css("left", screenPosition.x - this.textElement.width() / 2);
            this.textElement.css("bottom", screenPosition.y);
        } else {
            var screenPosition = gl.project(0, 1.5, 0);
            this.textElement.css("left", screenPosition.x - this.textElement.width() / 2);
            this.textElement.css("bottom", screenPosition.y - 200);
        }
        
        gl.rotate(90, 0, 1, 0);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    
        planetTexture1.bind(0);
        shadyTextureShader.uniforms({
            alpha: this.alpha,
            texture: 0,
        });
        shadyTextureShader.draw(sphereMesh);
        planetTexture1.unbind(0);        

        gl.disable(gl.BLEND);

        gl.popMatrix();

        if (this.highlighted) {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            flatShader.uniforms({
                color: [0.3, 0.3, 0.3, this.sizeAnimationTime * 0.3]
            }).draw(bridgeMesh);
            gl.disable(gl.BLEND);
            this.textElement.addClass("highlight");
        }
        else {
            this.textElement.removeClass("highlight");
        }
    }
}


function WikiPage(name) {
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
}

WikiPage.prototype = {
   
};


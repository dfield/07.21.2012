var gl = GL.create();

$(document).ready(function() {
    initShaders();

    var currentPage = new WikiPage("Potato", [0, 0]);
    var relatedPages = [
        new WikiPage("Spud", [0, 0]),
        new WikiPage("Plant", [10, 10]),
        new WikiPage("Farm", [-10, 10]),
    ];
    currentPage.position = [0, 0, 0];
    var planeMesh = GL.Mesh.plane({
        coords: true,
    });

    var cubeMesh = GL.Mesh.cube();
    var bgTexture = GL.Texture.fromURL("/images/starfield.jpg");

    gl.onupdate = function(seconds) {

    };

    gl.ondraw = function() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.loadIdentity();
        gl.translate(0, -1.5, -5);

        // draw the background
        gl.pushMatrix();
        gl.scale(90, 50, 1);
        gl.translate(0, 0, -60);

        bgTexture.bind(0);
        textureShader.uniforms({
            texture: 0,
        });
        textureShader.draw(planeMesh);
        bgTexture.unbind(0);

        gl.popMatrix();

        // current page is at the origin
        currentPage.draw();

        // related pages are further out
        for (var i = 0; i < 3; i++) {
            var page = relatedPages[i];
            page.draw();
        }
    };

    gl.fullscreen({
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
    });

    gl.enable(gl.DEPTH_TEST);

    gl.animate();
});

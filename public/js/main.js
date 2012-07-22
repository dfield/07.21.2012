var gl = GL.create();

$(document).ready(function() {
    var currentPage = new WikiPage("Potato", [0, 0]);
    var relatedPages = [
        new WikiPage("Spud", [0, 0]),
        new WikiPage("Plant", [10, 10]),
        new WikiPage("Farm", [-10, 10]),
    ];
    currentPage.position = [0, 0, 0];

    var cubeMesh = GL.Mesh.cube();
    var flatShader = new GL.Shader('\
      void main() {\
        gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;\
      }\
    ', '\
      uniform vec4 color;\
      void main() {\
        gl_FragColor = color;\
      }\
    ');

    gl.onupdate = function(seconds) {

    };

    gl.ondraw = function() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.loadIdentity();
        gl.translate(0, -1.5, -5);

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

$(document).ready(function() {
    var currentPage = "Potato";
    var relatedPages = [
        "Spud",
        "Plant",
        "Farm",
    ];
    var relatedPositions = [
        [0, 0],
        [10, 10],
        [-10, 10],
    ];

    var gl = GL.create();
    var cubeMesh = GL.Mesh.cube();
    var sphereMesh = GL.Mesh.sphere({
        detail: 6,
    });

    var shader = new GL.Shader('\
void main() {\
gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;\
}\
', '\
uniform vec3 color;\
void main() {\
  gl_FragColor = vec4(color, 1);\
}\
');

    gl.onupdate = function(seconds) {

    };

    gl.ondraw = function() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.loadIdentity();
        gl.translate(0, -1.5, -5);

        // current page is at the origin
        shader.uniforms({
            color: [0.3, 0.6, 0.9],
        });
        shader.draw(sphereMesh);

        // related pages are further out
        for (var i = 0; i < 3; i++) {
            gl.pushMatrix();
            var pos = relatedPositions[i];
            gl.translate(pos[0], pos[1], -50);
            shader.uniforms({
                color: [0.5, 0.5, 0.5],
            });
            shader.draw(sphereMesh);
            gl.popMatrix();
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

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
        detail: 10,
        normals: true
    });
    var planeMesh = GL.Mesh.plane();

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

    var shader = new GL.Shader('\
        varying vec3 normal;\
        void main() {\
            normal = gl_Normal;\
            gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;\
        }\
    ', '\
        varying vec3 normal;\
        void main() {\
            vec3 light = vec3(3,5,6);\
            light = normalize(light);\
            float dProd = max(0.0, dot(normal, light));\
            gl_FragColor = vec4(dProd, dProd, dProd, 1.0);\
        }\
    ');

    gl.onupdate = function(seconds) {

    };

    gl.ondraw = function() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.loadIdentity();
        gl.translate(0, -1.5, -5);

        // draw background
        gl.pushMatrix();
        gl.scale(100, 100, 1);
        gl.translate(0, 0, -50);
        flatShader.uniforms({
            color: [0.4, 0.6, 0.7]
        })
        flatShader.draw(planeMesh);
        gl.popMatrix();

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
            shader.draw(sphereMesh);
            gl.popMatrix();
        }

        gl.pushMatrix();
        gl.scale(5, 1, 30);
        gl.translate(0, -1, -1);
        gl.rotate(-90, 1, 0, 0);
        flatShader.uniforms({
            color: [1, 1, 1]
        })
        flatShader.draw(planeMesh);
        gl.popMatrix();
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

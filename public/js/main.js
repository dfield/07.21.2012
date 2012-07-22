var gl = GL.create();

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

    var cubeMesh = GL.Mesh.cube();
    var sphereMesh = GL.Mesh.sphere({
        detail: 10,
        normals: true
    });

    var flatShader = new GL.Shader('\
        void main() {\
            gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;\
        }\
        ', '\
        uniform vec3 color;\
        void main() {\
            gl_FragColor = vec4(color, 1);\
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

    var planeMesh = GL.Mesh.plane({
        coords: true,
    });

    var textureShader = new GL.Shader('\
        varying vec2 coord;\
        void main() {\
          coord = gl_TexCoord.xy;\
          gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;\
        }\
        ', '\
        varying vec2 coord;\
        uniform sampler2D texture;\
        void main() {\
          gl_FragColor = texture2D(texture, coord);\
        }\
    ');

    gl.onupdate = function(seconds) {

    };

    var test = new WikiPage('Plant');

    gl.ondraw = function() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.loadIdentity();
        gl.translate(0, -1.5, -5);

        gl.pushMatrix();
        gl.scale(50, 50, 1);
        gl.translate(0, 0, -60);
        flatShader.uniforms({
            color: [1, 1, 1]
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
            gl.translate(pos[0], pos[1], -40);
            shader.draw(sphereMesh);

            gl.translate(0, 1.5, 0);
            gl.scale(2, 2, 2);
            test.nameTexture.bind(0);
            textureShader.uniforms({
                texture: 0,
            });
            textureShader.draw(planeMesh);
            test.nameTexture.unbind(0);
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

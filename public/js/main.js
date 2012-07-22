var gl = GL.create();

$(document).ready(function() {
    initShaders();

    var currentPage = new WikiPage("Potato", [0, 0], true);
    var relatedPages = [
        new WikiPage(new Article("Spud", 1), [0, 0], false),
        new WikiPage(new Article("Plant", 2), [10, 10], false),
        new WikiPage(new Article("Farm", 3), [-10, 10], false),
    ];

    var planeMesh = GL.Mesh.plane({
        coords: true,
    });

    var cubeMesh = GL.Mesh.cube();
    var bgTexture = GL.Texture.fromURL("/images/starfield.jpg");

    var mousePosition = { x: 0, y: 0 };
    
    document.onmousemove = function(e) {
        mousePosition = { x: e.x, y: e.y };
    }

    gl.onmouseup = function(e) {
      var tracer = new GL.Raytracer();
      var ray = tracer.getRayForPixel(e.x, e.y);
      
      for (var i = 0; i < relatedPages.length; i++) {
          var page = relatedPages[i];
          var result = GL.Raytracer.hitTestSphere(tracer.eye, ray, page.position, 1);
          if (result) {
            setArticle(page.article);
          }
      }
    }

    gl.onupdate = function(seconds) {
        var tracer = new GL.Raytracer();
        var ray = tracer.getRayForPixel(mousePosition.x, mousePosition.y);
        
        for (var i = 0; i < relatedPages.length; i++) {
            var page = relatedPages[i];
            var result = GL.Raytracer.hitTestSphere(tracer.eye, ray, page.position, 2);
            if (result) {
                page.highlighted = true;
            } else {
                page.highlighted = false;
            }

            page.update(seconds);
        }
    };

    gl.ondraw = function() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.loadIdentity();
        gl.translate(0, -1.5, -5);
        
        var gaussian = function(value, sigma) {
            return Math.exp(value * value / (-2 * sigma * sigma));
        }
        
        var cameraTurnCoefficient = 0.01;
        var dxToCenter = mousePosition.x - (gl.canvas.width / 2);
        var dyToCenter = mousePosition.y - (gl.canvas.height / 2);
        gl.rotate(dyToCenter * cameraTurnCoefficient, 1, 0, 0);
        gl.rotate(dxToCenter * cameraTurnCoefficient, 0, 1, 0);

        // draw the background
        gl.pushMatrix();
        gl.scale(65, 45, 1);
        gl.translate(0, 0, -60);

        bgTexture.bind(0);
        textureShader.uniforms({
            texture: 0,
        });
        textureShader.draw(planeMesh);
        bgTexture.unbind(0);

        gl.popMatrix();

        // related pages are further out
        for (var i = 0; i < relatedPages.length; i++) {
            var page = relatedPages[i];
            page.draw();
        }

        // current page is at the origin
        currentPage.draw();
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

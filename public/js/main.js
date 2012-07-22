var gl = GL.create();
var relatedPages = [];
var currentPage = new WikiPage("Potato", [0, 0], true);

$(window).unload(function() {
    alert("HI");
});

$(document).ready(function() {
    /* WEBGL stuff */
    initShaders();

    var planeMesh = GL.Mesh.plane({
        coords: true,
    });

    var cubeMesh = GL.Mesh.cube();
    var bgTexture = GL.Texture.fromURL("/images/starfield.jpg");

    var mousePosition = { x: 0, y: 0 };
    
    document.onmousemove = function(e) {
        mousePosition = { x: e.x, y: e.y };
    }

    var cameraOffset = new GL.Vector(0, 1.5, 5);
    var moveAnimationRemaining = 0;
    var moveDestination = null;

    document.onmousedown = function(e) {
      var tracer = new GL.Raytracer();
      var ray = tracer.getRayForPixel(e.x, e.y);
      
      for (var i = 0; i < relatedPages.length; i++) {
          var page = relatedPages[i];
          var result = GL.Raytracer.hitTestSphere(tracer.eye, ray, page.position, page.hitSize);
          if (result) {
              setArticle(page.article);
              moveAnimationRemaining = 1;
              moveDestination = page.position;
              page.highlighted = false;

              $(".page-title").fadeOut(500);
          }
      }
    }

    gl.onupdate = function(seconds) {
        var tracer = new GL.Raytracer();
        var ray = tracer.getRayForPixel(mousePosition.x, mousePosition.y);
        
        for (var i = 0; i < relatedPages.length; i++) {
            var page = relatedPages[i];
        
            if (moveAnimationRemaining > 0) {
                page.highlighted = false;
            } else {
                var result = GL.Raytracer.hitTestSphere(tracer.eye, ray, page.position, page.hitSize);
                if (result) {
                    page.highlighted = true;
                } else {
                    page.highlighted = false;
                }
            }

            page.update(seconds);
        }
        
        moveAnimationRemaining -= seconds;
        if (moveAnimationRemaining <= 0) {
            $(".page-title").fadeIn(500);
            moveAnimationRemaining = 0;
            moveDestination = null;
        }
    };

    gl.ondraw = function() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.loadIdentity();

        // draw the scene
        gl.translate(-cameraOffset.x, -cameraOffset.y, -cameraOffset.z);

        var cameraTurnCoefficient = 0.01;
        var dxToCenter = mousePosition.x - (gl.canvas.width / 2);
        var dyToCenter = mousePosition.y - (gl.canvas.height / 2);
        gl.rotate(dyToCenter * cameraTurnCoefficient, 1, 0, 0);
        gl.rotate(dxToCenter * cameraTurnCoefficient, 0, 1, 0);
        
        var cameraPosition;
        if (moveAnimationRemaining > 0) {
            cameraPosition = GL.Vector.lerp(moveDestination, currentPage.position, moveAnimationRemaining); 
            gl.translate(-cameraPosition.x, -cameraPosition.y, -cameraPosition.z);
        }

        // draw the background
        gl.pushMatrix();
        gl.translate(0, 0, -60);
        if (cameraPosition) {
            gl.translate(cameraPosition.x, cameraPosition.y, cameraPosition.z);
        }
        gl.scale(65, 45, 1);

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

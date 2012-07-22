var gl = GL.create();
var nextRelatedPages = [];
var relatedPages = [];
var currentPage = new WikiPage(new Article("Waiting for an article"), [0, 0], true);

var moveDuration = 0.5;
var textFadeDuration = moveDuration / 2;
var planetFadeInDuration = moveDuration / 2;

function useNewPages() {
    if (relatedPages.length > 0) {
        $.each(relatedPages, function(i, elt) {
            elt.textElement.remove();
        });
    }

    relatedPages = nextRelatedPages;
    nextRelatedPages = [];
    
    $.each(relatedPages, function(i, elt) {
        elt.alpha = 0;

        /*
        elt.textElement.css("opacity", "0.05");
        elt.textElement.animate({
            opacity: 0.4,
        }, textFadeDuration * 1000, function() {
            // this is so that opacity is controlled via css
            $(this).css("opacity", "");
        });
        */
        $("body").append(elt.textElement);
    });

    $(".page-title").ellipsis();
    $(".page-title").show();
}

$(document).ready(function() {
    /* WEBGL stuff */
    initGlobals();

    var mousePosition = { x: 0, y: 0 };
    
    document.onmousemove = function(e) {
        mousePosition = { x: e.x, y: e.y };
    }

    var cameraOffset = new GL.Vector(0, 1.5, 5);
    var moveAnimationRemaining = 0;
    var moveDestination = null;

    document.onmousedown = function(e) {
        if (moveAnimationRemaining == 0) {
            var tracer = new GL.Raytracer();
            var ray = tracer.getRayForPixel(e.x, e.y);
            
            for (var i = 0; i < relatedPages.length; i++) {
                var page = relatedPages[i];
                var result = GL.Raytracer.hitTestSphere(tracer.eye, ray, page.position, page.hitSize);
                if (result) {
                    setArticle(page.article);
                    moveAnimationRemaining = moveDuration;
                    moveDestination = page.position;
                    page.highlighted = false;
                    
                    $(".page-title").fadeOut(textFadeDuration * 1000);
                }
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

            page.alpha = Math.min(1, page.alpha + seconds / planetFadeInDuration);
        }
        
        moveAnimationRemaining = Math.max(moveAnimationRemaining - seconds, 0);
        if (moveAnimationRemaining == 0) {
            moveAnimationRemaining = 0;
            moveDestination = null;
            
            if (nextRelatedPages.length > 0) {
                useNewPages();
            } else {
                // ???
            }
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
            cameraPosition = GL.Vector.lerp(
                moveDestination,
                currentPage.position,
                moveAnimationRemaining / moveDuration
            ); 
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

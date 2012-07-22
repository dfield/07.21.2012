function initGlobals() {
	window.shader = new GL.Shader('\
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

	window.shadyTextureShader = new GL.Shader('\
		varying vec3 normal;\
		varying vec2 coord;\
		void main() {\
			coord = gl_TexCoord.xy;\
			normal = gl_Normal;\
			gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;\
		}\
		', '\
		varying vec3 normal;\
		varying vec2 coord;\
		uniform sampler2D texture;\
		uniform float alpha;\
		uniform vec3 color;\
		void main() {\
			vec3 light = vec3(-4,6,8);\
			vec3 rimlight = vec3(8, -10, -10);\
			rimlight = normalize(rimlight);\
			light = normalize(light);\
			float dProd = max(0.0, dot(normal, light));\
			float dProd2 = max(0.0, dot(normal, rimlight));\
			vec4 shadow = vec4(dProd, dProd, dProd, 1);\
			vec4 rimLight = .5*vec4(dProd2, dProd2, dProd2, 1);\
			vec4 color4 = vec4(color, 1);\
			vec4 blue = vec4(.8, .9, 1, 1);\
            vec4 color = texture2D(texture, coord * .5)*\
            	(shadow+rimLight*blue)*color4 + vec4(.08, .08, .08, 1);\
            gl_FragColor = vec4(color.xyz * alpha, alpha);\
		}\
	');

	window.textureShader = new GL.Shader('\
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
   
    window.flatShader = new GL.Shader('\
        void main() {\
            gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;\
        }\
        ', '\
        uniform vec4 color;\
        void main() {\
            gl_FragColor = color;\
        }\
    ');

    window.bridgeShader = new GL.Shader('\
        varying vec2 coord;\
        void main() {\
            coord = gl_TexCoord.xy;\
            gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;\
        }\
        ', '\
        uniform vec3 color;\
        uniform float alpha;\
        varying vec2 coord;\
        void main() {\
            float a = abs(coord.x - 0.5) * 2.0;\
            float sideAlpha = 1.0 - a;\
            float fadeStart = 0.0;\
            float fadeEnd = 0.0;\
            float lengthAlpha = 1.0;\
            if (coord.y < fadeStart) {\
                lengthAlpha = coord.y / fadeStart;\
            } else if (coord.y < fadeEnd) {\
                lengthAlpha = 1.0;\
            } else {\
                lengthAlpha = 1.0 - (coord.y - fadeEnd) / (1.0 - fadeEnd);\
            }\
            float cumulativeAlpha = alpha * sideAlpha * lengthAlpha;\
            gl_FragColor = vec4(color * cumulativeAlpha, cumulativeAlpha);\
        }\
    ');

    /* MESHES */
    window.planeMesh = GL.Mesh.plane({
        coords: true,
    });

    window.cubeMesh = GL.Mesh.cube();

    window.planeMesh = GL.Mesh.plane({
        coords: true,
    });
    
    window.sphereMesh = GL.Mesh.sphere({
        detail: 10,
        normals: true,
        coords: true
    });

    /* TEXTURES */
    window.bgTexture = GL.Texture.fromURL("/images/starfield.jpg");
    window.planetTexture1 = GL.Texture.fromURL("/images/planet-texture3.jpg", {
        minFilter: gl.LINEAR_MIPMAP_NEAREST
    });
    
}

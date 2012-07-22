function initShaders() {
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
		void main() {\
			vec3 light = vec3(3,5,6);\
			light = normalize(light);\
			float dProd = max(0.0, dot(normal, light));\
			vec4 shadow = vec4(dProd, dProd, dProd, 1);\
			vec4 purple = vec4(1, .9, 1, 1);\
			gl_FragColor =  texture2D(texture, coord * .5)*shadow*purple;\
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
}

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
			vec3 light = vec3(3,10,10);\
			vec3 rimlight = vec3(8, -10, -10);\
			rimlight = normalize(rimlight);\
			light = normalize(light);\
			float dProd = max(0.0, dot(normal, light));\
			float dProd2 = max(0.0, dot(normal, rimlight));\
			vec4 shadow = vec4(dProd, dProd, dProd, 1);\
			vec4 rimLight = vec4(dProd2, dProd2, dProd2, 1);\
			vec4 purple = vec4(1, .9, 1, 1);\
			vec4 blue = vec4(.8, .9, 1, 1);\
			gl_FragColor =  texture2D(texture, coord * .5)*(shadow+rimLight*blue)*purple;\
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
        uniform vec3 color;\
        void main() {\
            gl_FragColor = vec4(color, 1);\
        }\
    ');
}
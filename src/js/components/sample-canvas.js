/* eslint-disable no-unreachable */
import * as T from 'three';

/**
 * Template for creation a canvas with three.js
 * Describes the structure and sequence of functions for rendering
 * Contains useful developments often found in projects
 */
export default class SampleCanvas {
	constructor(options) {
		this.container = options.dom;
		this.init();
	}

	/** Initialization */
	async init() {
		if (!this.container) return;

		this.setupEvironment();
		this.setupScene();

		this.addObjects();
		// this.addLights();
		// this.addGui();
		this.resize();
		this.render();
		this.initEvents();
	}

	/** Environment & Variables */
	setupEvironment() {
		this.width = this.container.offsetWidth;
		this.height = this.container.offsetHeight;
		this.time = 0;
	}

	/** Setup Canvas */
	setupScene() {
		/** Rendering: */
		this.scene = new T.Scene();
		this.renderer = new T.WebGLRenderer();
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(this.width, this.height);
		this.renderer.setClearColor(0xeeeeee, 1);
		this.renderer.outputEncoding = T.sRGBEncoding;
		this.container.appendChild(this.renderer.domElement);

		/** User View: */
		this.camera = new T.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.001, 1000);
		this.camera.position.set(0, 0, 8);
	}

	/** Setup Events */
	initEvents() {
		window.addEventListener('resize', this.resize.bind(this));
	}

	/** Update environment on resize */
	resize() {
		this.width = this.container.offsetWidth;
		this.height = this.container.offsetHeight;
		this.renderer.setSize(this.width, this.height);
		this.camera.aspect = this.width / this.height;
		this.camera.updateProjectionMatrix();
	}

	/** Setup Mesh material */
	setMaterials() {
		this.material = new T.ShaderMaterial({
			//
			extensions: {
				derivatives: '#extension GL_OES_standard_derivatives : enable',
			},
			side: T.DoubleSide,
			uniforms: {
				time: { type: 'f', value: 0 },
				resolution: { type: 'v4', value: new T.Vector4() },
				transparent: true,
				uvRate1: {
					value: new T.Vector2(1, 1),
				},
			},
			wireframe: true,
			// transparent: true, // если в текстурке используется альфа-канал
			vertexShader: `

				uniform float time;
				varying vec2 vUv;
				varying float curvePower;
				uniform vec2 pixels;
				float PI = 3.141592653589793238;
				void main() {

					vUv = uv;

					vec4 vPosition = modelViewMatrix * vec4( position, 1.0 );
					vec4 oldPos = vPosition;
					float curvePower = 1. - vUv.y + 1. - vUv.x;

					float curveRadius = 3.;

					float zCoef = vUv.x * vUv.x * vUv.y * vUv.y;

					// vPosition.x *= -1. * time / 2.;
						vPosition.x *= -1. * (zCoef * 0.5) * time * 4.;

					if (vPosition.x < -1.) {
						vPosition.x = oldPos.x * -1.;
					}

					// vPosition.z *= zCoef * 5. + 1.;
					oldPos = mix(oldPos, vPosition,  time);
					gl_Position = projectionMatrix * oldPos;
				}
			`,
			fragmentShader: `
				uniform float time;
				uniform float progress;
				uniform sampler2D texture1;
				uniform vec4 resolution;
				varying vec2 vUv;
				varying vec3 vPosition;
				float PI = 3.141592653589793238;
				void main()	{
					// vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
					gl_FragColor = vec4(vUv,0.0,1.);
				}
			`,
		});
	}

	/** Setup Mesh geometry */
	setGeometries() {
		this.geometry = new T.PlaneGeometry(3, 3, 50, 50);
	}

	/** Create and add meshes to the scene */
	addObjects() {
		this.setGeometries();
		this.setMaterials();

		this.plane = new T.Mesh(this.geometry, this.material);
		this.scene.add(this.plane);

		this.plane.position.z = 3;
		this.plane.position.x = 1.5;
		this.plane.position.y = 1.5;
		// this.plane.rotation.y = Math.PI / 1.9;

		console.log(); //!
	}

	/** Сanvas drawing */
	render() {
		this.time += 0.005;
		if (this.time >= 1) this.time = 0;
		this.material.uniforms.time.value = this.time;

		window.requestAnimationFrame(this.render.bind(this));
		this.renderer.render(this.scene, this.camera);
	}
}

import * as T from 'three';

import gsap from 'gsap';

import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

import { NodeMesh } from './NodeMesh';

export class ExpandVideo extends NodeMesh {
	constructor(props) {
		super(props);

		this.props = {
			relativeNode: null,
			injectTarget: null,
			triggerTarget: null,
			...props,
		};

		this.handleAnimationTick = this.handleAnimationTick.bind(this);

		this.animationPinDist = this.props.scene.env.height;
	}

	setGeometry() {
		this.getSize();

		this.geometry = new T.PlaneGeometry(1, 1, 50, 50);
	}

	setMaterial() {
		this.material = new T.ShaderMaterial({
			//
			extensions: {
				derivatives: '#extension GL_OES_standard_derivatives : enable',
			},
			side: T.DoubleSide,
			depthTest: true,
			transparent: true,
			uniforms: {
				time: { type: 'f', value: 0 },
				uGlobalScrollPos: { type: 'f', value: 0 },
				uAnimDist: { type: 'f', value: this.getScale(this.animationPinDist) },
				uProgress: { type: 'f', value: 0 },

				uStartVideoPosition: { type: 'v2', value: new T.Vector2(0, 0) },
				uEndVideoPosition: { type: 'v2', value: new T.Vector2(0, 0) },

				uStartVideoSize: {
					type: 'v2',
					value: new T.Vector2(this.size.xScale, this.size.yScale),
				},
				uEndVideoSize: {
					type: 'v2',
					value: new T.Vector2(this.size.xScale * 2, this.size.yScale * 2),
				},

				uPosition: { type: 'v3', value: new T.Vector3(0, 0, 0) },
				uStartColor: { type: 'v3', value: new T.Vector3(0.4, 0.4, 1) },
				uTexture: { value: new T.VideoTexture(this.props.relativeNode) },
				u_radialCenter: { type: 'v2', value: new T.Vector2(0.5, 0.5) },

				uBorderRadius: { type: 'f', value: 0.02 },
				uQuaternion: { type: 'v4', value: new T.Quaternion(0, 0, 0, 0) },
				uScale: { type: 'v3', value: new T.Vector3(1, 1, 1) },
				uAnimPivot: { type: 'v2', value: new T.Vector2(0.3, 0) },
				// uAnimPivot: { type: 'v2', value: new T.Vector2(0.5, -0.5) },
				uEndAnimAspectScale: { type: 'f', value: 1 },
			},
			// wireframe: true,
			// transparent: true, // если в текстурке используется альфа-канал
			vertexShader: `
				uniform vec3 uPosition;
				uniform vec4 uQuaternion;
				uniform vec3 uScale;
				uniform vec2 uStartVideoPosition;
				uniform vec2 uStartVideoSize;
				uniform vec2 uEndVideoPosition;
				uniform vec2 uEndVideoSize;
				uniform vec2 uAnimPivot;
				uniform float uProgress;
				uniform float uAnimDist;
				uniform float uGlobalScrollPos;
				varying vec2 v_uv;
				varying vec2 v_domWH;
				varying float v_showRatio;
				uniform float uBorderRadius;

				vec3 qrotate(vec4 q,vec3 v){
					return v+2.*cross(q.xyz,cross(q.xyz,v)+q.w*v);
				}
				vec3 getBasePosition(in vec3 pos,in vec2 domWH){
					vec3 basePos=vec3(pos.xy * domWH - uAnimPivot, pos.z);
					return basePos;
				}
				float linearStep(float edge0,float edge1,float x){
					return clamp((x-edge0)/(edge1-edge0),0.0,1.0);
				}
				vec3 getScreenPosition(in vec3 basePos,in vec2 domXY){
					vec3 newPos = uPosition;

					vec3 screenPos=qrotate(uQuaternion,basePos*uScale)+vec3(uAnimPivot.xy,0.);
					screenPos=(screenPos+vec3(domXY,0.)+newPos)*vec3(1.,-1.,1.);
					return screenPos;
				}

				void main() {
					float placementWeight=1.-(pow(position.x*position.x,0.75)+pow(1.-position.y,1.5))/2.;
					v_showRatio=(smoothstep(placementWeight*0.3,0.7+placementWeight*0.3,uProgress - uBorderRadius));

					vec2 startPos = uStartVideoPosition;
					startPos -= uStartVideoSize / 2.;


					vec2 domXY=mix(startPos,uEndVideoPosition,v_showRatio);
					vec2 domWH=mix(uStartVideoSize,uEndVideoSize,v_showRatio);
					domXY.x+=mix(domWH.x,0.,cos(v_showRatio*3.1415926*2.)*0.5+0.5)*0.1;
					vec3 basePos=getBasePosition(position,domWH);
					float rot=(smoothstep(0.,1.,v_showRatio)-v_showRatio)*-0.5;
					vec3 rotBasePos=qrotate(vec4(0.,0.,sin(rot),cos(rot)),basePos);
					vec3 screenPos=getScreenPosition(rotBasePos,domXY);

					vec4 pos1 = modelViewMatrix*vec4(screenPos,1.0);
					pos1.y += uGlobalScrollPos;
					pos1.y -= uAnimDist * uProgress;
					vec4 pos = projectionMatrix * pos1;

					gl_Position = pos;
					v_uv=vec2(uv.x,1.-uv.y);
					v_domWH=domWH;
				}
			`,
			fragmentShader: `

				uniform vec3 uStartColor;
				uniform sampler2D uTexture;
				uniform vec2 u_radialCenter;
				uniform float uProgress;
				uniform float uBorderRadius;
				uniform float uEndAnimAspectScale;
				varying vec2 v_uv;
				varying vec2 v_domWH;
				varying float v_showRatio;

				// #include <getBlueNoise>
				float linearStep(float edge0,float edge1,float x){
					return clamp((x-edge0)/(edge1-edge0),0.0,1.0);
				}
				float sdRoundedBox(in vec2 p,in vec2 b,in float r){
					vec2 q=abs(p)-b+r;
					return min(max(q.x,q.y),0.0)+length(max(q,0.0))-r;
				}
				float getRoundedCornerMask(vec2 uv,vec2 size,float radius,float ratio){
					vec2 halfSize=size*0.5;
					float maxDist=length(halfSize);
					float minSize=min(halfSize.x,halfSize.y);
					float maxSize=max(halfSize.x,halfSize.y);
					float t=ratio*maxDist;
					radius=mix(minSize*linearStep(0.,minSize,t),radius,linearStep(maxSize,maxDist,t));
					halfSize=min(halfSize,vec2(t));
					float d=sdRoundedBox((uv-.5)*v_domWH,halfSize,radius);
					return smoothstep(0.,0.-fwidth(d),d);
				}


				void main()	{
					float imageAlpha=getRoundedCornerMask(v_uv,v_domWH,uBorderRadius,1.0);
					vec2 baseUv=v_uv;
					float toRadialCenterDist=length((baseUv-u_radialCenter)*vec2(v_domWH.x/v_domWH.y,1.));
					baseUv.y=(baseUv.y-.5)*mix(1.,uEndAnimAspectScale,v_showRatio)+0.5;
					vec3 color=texture2D(uTexture,baseUv).rgb;
					vec3 tintedColor=max(uStartColor,vec3(dot(color,vec3(0.299,0.587,0.114))));
					gl_FragColor=vec4(mix(tintedColor,color,v_showRatio),imageAlpha);

					// gl_FragColor = vec4(0.,0.,0.,1.);
				}
			`,
		});
	}

	updateUniforms() {
		// this.mesh.material.uniforms.uSize.value = new T.Vector2(this.size.xScale, this.size.yScale);
		// this.mesh.material.uniforms.uPosition.value.x = -this.mesh.material.uniforms.uStartVideoSize.value.x / 2;
		// this.mesh.material.uniforms.uPosition.value.y = -this.mesh.material.uniforms.uStartVideoSize.value.y / 2;
		// this.mesh.material.uniforms.uPosition.value.y = 0;
		this.mesh.material.uniforms.uStartVideoSize.value = new T.Vector2(0.5, 0.5);
		this.mesh.material.uniforms.uEndVideoSize.value = new T.Vector2(1, 1);
	}

	setVideo(videoTexture) {}

	async loadVideo({ src, onComplete }) {
		const loader = new T.TextureLoader();

		loader.load(
			src,
			(videoTexture) => {
				this.setVideo(videoTexture);
				onComplete();
			},
			() => {},
			(err) => {
				console.error(err);
			},
		);
	}

	setAnimation() {
		this.timeline = gsap
			.timeline({
				paused: true,
				ease: 'sine.inOut',
				onUpdate: (t) => {
					this.handleAnimationTick(this.timeline.scrollTrigger);
				},
			})
			.to({}, {});
		this.scrollTrigger = ScrollTrigger.create({
			trigger: this.props.relativeNode,
			start: 'center center',
			end: `center+=${this.animationPinDist} center`,
			markers: true,
			pin: true,
			pinType: 'fixed',
			animation: this.timeline,
			scrub: true,
			snap: true,
		});
	}

	handleAnimationTick({ progress }) {
		if (this.mesh?.material) this.mesh.material.uniforms.uProgress.value = progress;
	}

	createMesh() {
		if (!this.props.relativeNode || !this.props.injectTarget) return;

		this.setGeometry();
		this.setMaterial();
		this.mesh = new T.Mesh(this.geometry, this.material);
		this.updatePosMatrix();
		this.updateUniforms();
		this.props.injectTarget?.add(this.mesh);

		this.setAnimation();
	}

	destroy() {
		this.props.injectTarget?.remove(this.mesh);
	}
}

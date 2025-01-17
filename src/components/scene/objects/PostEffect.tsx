/** @jsxRuntime classic */
/** @jsx jsx */
import * as THREE from "three";

import { jsx } from "@emotion/core";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import fragmentShader from "../../../assets/glsl/postEffect.frag";
import vertexShader from "../../../assets/glsl/postEffect.vert";
import { DEFAULT_TIME_VALUE_UPDATE } from "../scene-defaults";

const PostEffect = (props: JSX.IntrinsicElements["mesh"]) => {
	const rawShaderMaterialRef = useRef<THREE.RawShaderMaterial>(null!);

	const target = new THREE.WebGLRenderTarget(
		document.body.clientWidth,
		window.innerHeight,
	);

	const handleWindowResize = () => {
		target.setSize(document.body.clientWidth, window.innerHeight);
		rawShaderMaterialRef.current.uniforms.resolution.value.set(
			document.body.clientWidth,
			window.innerHeight,
		);
	};

	const [scene] = useState(() => new THREE.Scene());

	useEffect(() => {
		window.addEventListener("resize", handleWindowResize);

		return () => {
			window.removeEventListener("resize", handleWindowResize);
		};
	}, []);

	useFrame((state) => {
		rawShaderMaterialRef.current.uniforms.time.value += DEFAULT_TIME_VALUE_UPDATE;
		rawShaderMaterialRef.current.visible = false;
		state.gl.setRenderTarget(target);
		state.gl.render(state.scene, state.camera);
		rawShaderMaterialRef.current.visible = true;
		state.gl.setRenderTarget(null);
		state.gl.render(scene, state.camera);
	});

	const uniforms = {
		time: {
			type: "f",
			value: 0,
		},
		resolution: {
			type: "v2",
			value: new THREE.Vector2(document.body.clientWidth, window.innerHeight),
		},
		texture: {
			type: "t",
			value: target.texture,
		},
	};

	return (
		<mesh {...props}>
			<planeGeometry args={[2, 2]} />
			<rawShaderMaterial
				ref={rawShaderMaterialRef}
				uniforms={uniforms}
				vertexShader={vertexShader}
				fragmentShader={fragmentShader}
			/>
		</mesh>
	);
};

export default PostEffect;

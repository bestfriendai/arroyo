/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useThree } from "@react-three/fiber";
import { Fragment, useEffect } from "react";

const ClearColor = () => {
	const state = useThree();

	const handleWindowResize = () => {
		state.gl.setPixelRatio(window.devicePixelRatio);
		state.gl.setSize(document.body.clientWidth, window.innerHeight);
	};

	useEffect(() => {
		state.gl.setClearColor(0xcccccc, 0.1);

		window.addEventListener("resize", handleWindowResize);

		return () => {
			window.removeEventListener("resize", handleWindowResize);
		};
	}, []);

	return <Fragment></Fragment>;
};

export default ClearColor;

/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { useInView } from "react-intersection-observer";
import React, { Suspense, useEffect, useState } from "react";
import { Element } from "react-scroll";
import { getRepos, Repositories } from "../api/octokit-api";
import LoadingIcon from "./icons/LoadingIcon";
import { Orientation } from "./AppContainer";
const RepositoryList = React.lazy(() => import("./RepositoryList"));

type Props = {
	onVisibilityChange: (pageNumber: number, inview: boolean) => void;
	orientation: Orientation;
};

function RepositorySection({ onVisibilityChange, orientation }: Props) {
	const [repositoryData, setRepositoryData] = useState<Repositories | null>(
		null,
	);

	const { ref, inView } = useInView({
		threshold: 1,
	});

	useEffect(() => {
		const loadRepositories = async () => {
			if (!repositoryData) {
				const repos = await getRepos();

				const repositoryData = repos.filter(
					(repo) => !repo.fork && !repo.archived,
				);

				setRepositoryData(repositoryData);
			}
		};

		if (inView && !repositoryData) {
			loadRepositories();
		}
	}, [inView, repositoryData]);

	useEffect(() => {
		onVisibilityChange(1, inView);
	}, [inView, onVisibilityChange]);

	return (
		<Element css={repositorySectionContainerStyle} name="repository-section">
			<div ref={ref} />
			<h2>Repos</h2>
			<div css={repositorySectionStyle}>
				<Suspense fallback={<LoadingIcon />}>
					{repositoryData && <RepositoryList data={repositoryData} />}
				</Suspense>
			</div>
		</Element>
	);
}

const repositorySectionContainerStyle = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0 120px;
	gap: 80px;
`;

const repositorySectionStyle = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	min-height: 100vh;
	width: 100%;
`;

export default RepositorySection;

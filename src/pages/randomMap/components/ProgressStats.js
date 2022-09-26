import {Progress} from "reactstrap";
import React from "react";

const ProgressStats = props => {
	const percentage = props.value / props.total * 100
	const background = percentage < 40 ? "danger" : percentage < 50 ? "warning" : "info"

	return <div className="mt row progress-stats">
		<div className="col-md-9 col-12">
			{
				props.header &&
				<h6 className="name fw-semi-bold">{props.header}</h6>
			}
			<p className="description deemphasize mb-xs text-white">
				{props.label} [{props.duration}s]
			</p>
			<Progress
				color={background}
				value={percentage}
				className="bg-subtle-blue progress-xs"
			/>
		</div>
		<div className="col-md-3 col-12 text-center">
		<span
			className={`status rounded rounded-lg bg-${props.dynamicLabel ? background : "default"} text-light`}>
			<small>{props.verbose || props.value}
			</small>
		</span>
		</div>
	</div>
}
export default ProgressStats
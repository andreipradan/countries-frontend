import {Progress} from "reactstrap";
import React from "react";

const ProgressStats = props => {
	const percentage = props.value / props.total * 100
	return <div className="row progress-stats">
		<div className="col-md-9 col-12">
			<p className="description deemphasize mb-xs text-white">
				{props.label}
			</p>
			<Progress
				color={
					percentage < 40
						? "danger"
						: percentage < 50
							? "warning"
							: "primary"
				}
				value={percentage}
				className="bg-subtle-blue progress-xs"
			/>
		</div>
		<div className="col-md-3 col-12 text-center">
		<span
			className="status rounded rounded-lg bg-default text-light">
			<small>{props.value}
			</small>
		</span>
		</div>
	</div>
}
export default ProgressStats
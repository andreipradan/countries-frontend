import React, {useEffect, useState} from "react"
import {
	Button,
	ButtonGroup,
	Input,
	InputGroup,
	InputGroupAddon, InputGroupText
} from "reactstrap";
import {connect} from "react-redux";

import ProgressStats from "../ProgressStats";
import ResultsModal from "../ResultsModal"
import Widget from "../../../../components/Widget";
import { foundCountry, newGame, setGameOver, setState } from "../../../../actions/map";
import s from "../Map/Map.module.scss";
import SearchIcon from "../../../../components/Icons/HeaderIcons/SearchIcon";
import {secondsToTime} from "./utils";
import { getGameTypeId } from "../../utils";


const Stats = props => {
	const defaultCounter = props.gameCounter
  const [counter, setCounter] = useState(defaultCounter)
	const [modal, setModal] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => setCounter(defaultCounter), [defaultCounter, props.totalCountries])

  useEffect(() => {
    props.inProgress && setTimeout(() => {
      if (counter < 1 || !props.countries.length ) handleEndGame()
      else setCounter(counter - 1)
    }, 1000)
  })

  const handleEndGame = () => {
		const score = props.totalCountries - props.countries.length
    props.dispatch(setGameOver(
			props.token,
			score,
			props.user.id,
			getGameTypeId(props.activeMap),
		))
    setStarted(false)
    setModal(true)
  }

  const handleNewGame = () => {
    props.dispatch(newGame(props.activeMap))
    setCounter(defaultCounter)
    setStarted(false)
  }

  const startStopGame = () => {
		if (["Start", "Pause", "Resume"].includes(startStopButton))
			props.dispatch(setState({inProgress: !props.inProgress}))
    switch (startStopButton) {
			case "New game":
				return handleNewGame()
			case "Start":
				return setStarted(true)
			default:
				return console.log(`Unhandled ${startStopButton}`)
		}
  }

	const {mins, secs} = secondsToTime(counter)

	const startStopButton = props.inProgress
		? "Pause"
		: started
			? "Resume"
			: props.gameOver
				? "New game"
				: "Start"

	return props.activeMap && <div className={s.stats}>
		<span className="mr-xs fw-normal">
			<Widget className="bg-transparent">
				<div className="row progress-stats">
					<p className="description deemphasize mb-xs text-white">
						Controls
					</p>
				</div>
				<ButtonGroup>
					<Button
						className="text-white"
						color="info"
						size="xs"
						type="submit"
						onClick={startStopGame}
					>
						<span className="auth-btn-circle ">
							<i className={`la la-${props.inProgress ? "pause": "play"}`}/>
						</span>
						{startStopButton}
					</Button>
					{
						!props.inProgress && started && <>
							<Button
								className="text-white"
								color="warning"
								size="xs"
								onClick={handleNewGame}
							>
								<span className="auth-btn-circle ">
									<i className="la la-refresh"/>
								</span>
								Restart
							</Button>
							<Button
								className="text-white"
								color="danger"
								size="xs"
								onClick={handleEndGame}
							>
								<span className="auth-btn-circle ">
									<i className="la la-times"/>
								</span>
								End game
							</Button>
						</>
					}
					{
						props.gameOver && !modal && <Button
							className="text-white"
							color="danger"
							size="xs"
							onClick={() => setModal(true)}
						>
						<span className="auth-btn-circle ">
							<i className="la la-trophy"/>
						</span>
							Results
						</Button>
					}
				</ButtonGroup>
				{
					props.inProgress && <InputGroup
						className={`input-group-no-border ${s.searchForm}`}
					>
						<InputGroupAddon addonType="prepend">
							<InputGroupText className={s.inputGroupText}>
								<SearchIcon className={s.headerIcon}/>
							</InputGroupText>
						</InputGroupAddon>
						<Input
							id="search-input"
							className="input-transparent"
							placeholder="Country"
							onInput={e => {
								e.preventDefault()
								const text = e.target.value.toLowerCase().trim()
								if (props.countries.map(c => c.name.toLowerCase()).includes(text)) {
									props.dispatch(foundCountry(text))
									e.target.value = ""
								}
							}}
							autoFocus
						/>
					</InputGroup>
				}
				<ProgressStats
					dynamicLabel
					label="Time remaining"
					value={counter}
					verbose={`${mins}:${secs}`}
					total={defaultCounter}
				/>
				<div className="row progress-stats">
					<p className="description deemphasize mb-xs text-white">
						Statistics
					</p>
				</div>
				<div className="stats-row">
					<div className="stat-item">
						<h6 className="name">Found</h6>
						<p className="value">{props.foundCountries?.length || 0} ({
							((props.foundCountries?.length || 0) / props.totalCountries * 100).toFixed(2)
						}%)</p>
					</div>
					<div className="stat-item">
						<h6 className="name">Remaining</h6>
						<p className="value">{props.countries?.length || 0} ({
							((props.countries?.length || 0) / props.totalCountries * 100).toFixed(2)
						}%)</p>
					</div>
					<div className="stat-item">
						<h6 className="name">Total</h6>
						<p className="value">{props.totalCountries || 0}</p>
					</div>
				</div>
				<ResultsModal
					body={"foo"}
					isOpen={modal}
					toggle={() => setModal(!modal)}
				/>
			</Widget>
		</span>
	</div>
}
export default connect(state => ({
	...state.map,
	token: state.auth.token,
	user: state.auth.user,
}))(Stats)

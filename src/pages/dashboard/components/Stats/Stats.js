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
import {foundCountry, newGame, setGameOver, setState} from "../../../../actions/map";
import s from "../Map/Map.module.scss";
import SearchIcon from "../../../../components/Icons/HeaderIcons/SearchIcon";
import {secondsToTime} from "./utils";


const Stats = props => {
  const [counter, setCounter] = useState(0)
	const [modal, setModal] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => setCounter(props.totalCountries * 10), [props.totalCountries])

  useEffect(() => {
    props.inProgress && setTimeout(() => {
      if (counter < 1 || !props.countries.length ) handleEndGame()
      else setCounter(counter - 1)
    }, 1000)
  })

  const handleEndGame = () => {
    props.dispatch(setGameOver(true))
    setStarted(false)
    setModal(true)
  }

  const handleNewGame = () => {
    props.dispatch(newGame(props.activeMap))
    setCounter(props.totalCountries * 10)
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
			{
				props.inProgress && <InputGroup className={`input-group-no-border ${s.searchForm}`}>
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
							const text = e.target.value.toLowerCase()
							if (props.countries.map(c => c.name.toLowerCase()).includes(text)) {
								props.dispatch(foundCountry(text))
								e.target.value = ""
							}
						}}
						autoFocus
					/>
				</InputGroup>
			}
			<Widget className="bg-transparent">
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
				<ProgressStats label="Countries found"
											 value={props.foundCountries?.length || 0}
											 total={props.totalCountries} dynamicLabel/>
				<ProgressStats label="Countries remaining"
											 value={props.countries?.length}
											 total={props.totalCountries}/>
				<ProgressStats label="Total countries" value={props.totalCountries}
											 total={props.totalCountries}/>
				<ProgressStats label="Time remaining" value={counter} dynamicLabel
											 verbose={`${mins}:${secs}`}
											 total={props.totalCountries * 10}/>
				<ResultsModal
					body={"foo"}
					isOpen={modal}
					toggle={() => setModal(!modal)}
				/>
			</Widget>
		</span>
	</div>
}
export default connect(state => state.map)(Stats)

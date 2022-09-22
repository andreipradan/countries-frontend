import React, {useEffect, useRef, useState} from "react"
import {
	Button,
	ButtonGroup,
	Input,
	InputGroup,
	InputGroupAddon, InputGroupText, Modal, ModalBody, ModalFooter, ModalHeader
} from "reactstrap";
import {connect} from "react-redux";

import ProgressStats from "../../../../../dashboard/components/ProgressStats"
import ResultsModal from "../../../../../dashboard/components/ResultsModal/ResultsModal"
import {
	foundCountry,
	newGame,
	SET_RANDOM_COUNTRY,
	setGameOver,
	setState
} from "../../../../../../actions/map";
import s from "../../../../../dashboard/components/Map/Map.module.scss";
import SearchIcon from "../../../../../../components/Icons/HeaderIcons/SearchIcon";

const secondsToTime = secs => {
  let divisor_for_minutes = secs % (60 * 60);
  let minutes = Math.floor(divisor_for_minutes / 60);

  let divisor_for_seconds = divisor_for_minutes % 60;
  let seconds = Math.ceil(divisor_for_seconds);

  if (minutes / 10 < 1) minutes = `0${minutes}`
  if (seconds / 10 < 1) seconds = `0${seconds}`
  return {"mins": minutes, "secs": seconds}
}

const Controls = props => {
	const defaultCounter = props.gameCounter * 1.5
  const [counter, setCounter] = useState(defaultCounter)
	const [modal, setModal] = useState(false)
  const [started, setStarted] = useState(false)
	const [endGameModalOpen, setEndGameModalOpen] = useState(false)
	const ref = useRef(null)

  useEffect(() => {
		setCounter(defaultCounter)
		handleNewGame("World")
	}, [defaultCounter, props.totalCountries])

  useEffect(() => {
    props.inProgress && setTimeout(() => {
      if (counter < 1 || !props.countries.length ) handleEndGame()
      else setCounter(counter - 1)
    }, 1000)
  })

	const toggleEndGameModal = () => setEndGameModalOpen(!endGameModalOpen)

  const handleEndGame = () => {
		setEndGameModalOpen(false)
		const score = props.totalCountries - props.countries.length
    props.dispatch(setGameOver(
			props.token,
			props.user.id,
			props.activeMap,
			score,
			props.gameCounter - counter
		))
    setStarted(false)
    setModal(true)
  }

  const handleNewGame = () => {
    props.dispatch(newGame("World"))
    setCounter(defaultCounter)
    setStarted(false)
  }

  const startStopGame = () => {
		if (["Start", "Pause", "Resume"].includes(startStopButton))
			props.dispatch(setState({inProgress: !props.inProgress}))
    switch (startStopButton) {
			case "New game":
				return handleNewGame()
			case "Start": {
				props.dispatch({type: SET_RANDOM_COUNTRY})
				return setStarted(true)
			}
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

	return <div className={s.stats}>
		<span className="mr-xs fw-normal">
			<div className="row progress-stats">
				<p className="description deemphasize mb-xs text-white">Controls</p>
			</div>
			{
				props.inProgress &&	<InputGroup className={`input-group-no-border ${s.searchForm}`}>
					<InputGroupAddon addonType="prepend">
						<InputGroupText className={s.inputGroupText}>
							<SearchIcon className={s.headerIcon}/>
						</InputGroupText>
					</InputGroupAddon>
					<Input
						id="search-input"
						className="input-transparent"
						placeholder="Country"
						ref={ref}
						onKeyUp={event => {
							if (event.key === "Escape" || event.target.value === "skip") {
								event.target.value = ""
								return props.dispatch({type: SET_RANDOM_COUNTRY})
							}
							switch (event.target.value) {
								case "=": {
									event.target.value = ""
									return props.dispatch(setState({zoomIn: true}))
								}
								case "-": {
									event.target.value = ""
									return props.dispatch(setState({zoomOut: true}))
								}
								default: break
							}
						}
					}
						onInput={e => {
							e.preventDefault()
							const text = e.target.value.toLowerCase().trim()
							if (props.currentCountry.name.toLowerCase() === text) {
								props.dispatch(foundCountry(text))
								e.target.value = ""
							}
						}}
						autoFocus
					/>
				</InputGroup>
			}
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
					props.inProgress && <Button
						className="text-white"
						color="warning"
						size="xs"
						type="submit"
						onClick={() => {
							ref.current.focus()
							props.dispatch({type: SET_RANDOM_COUNTRY})
						}}
					>
						<span className="auth-btn-circle ">
							<i className="la la-step-forward"/>
						</span>
						Skip (Esc)
					</Button>
				}
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
							onClick={toggleEndGameModal}
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
			<div>
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
		</span>
		<Modal isOpen={endGameModalOpen} toggle={toggleEndGameModal}>
      <ModalHeader toggle={toggleEndGameModal}>Are you sure?</ModalHeader>
      <ModalBody>Do you really want to end your game?</ModalBody>
      <ModalFooter>
        <Button color="default" onClick={toggleEndGameModal} data-dismiss="modal">No</Button>{' '}
        <Button color="danger" onClick={handleEndGame}>Yes, end game</Button>
      </ModalFooter>
    </Modal>
	</div>
}
export default connect(state => ({
	...state.map,
	token: state.auth.token,
	user: state.auth.user,
}))(Controls)

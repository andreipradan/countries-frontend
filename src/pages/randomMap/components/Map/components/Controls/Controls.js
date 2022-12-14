import React, {useEffect, useRef, useState} from "react"
import {
	Button,
	ButtonGroup,
	Input,
	InputGroup,
	InputGroupAddon, InputGroupText, Modal, ModalBody, ModalFooter, ModalHeader
} from "reactstrap";
import {connect} from "react-redux";
import {toast} from "react-toastify";

import ProgressStats from "../../../ProgressStats"
import ResultsModal from "../../components/ResultsModal/ResultsModal"
import {
	foundCountry,
	newGame,
	SET_RANDOM_COUNTRY,
	setGameOver,
	setState
} from "../../../../../../actions/map";
import s from "../../../../../freeGuessing/components/Map/Map.module.scss";
import SearchIcon from "../../../../../../components/Icons/HeaderIcons/SearchIcon";
import { secondsToTime } from "../../../../../freeGuessing/utils"

const Controls = props => {
	const defaultCounter = props.gameCounter * 1.5
  const [counter, setCounter] = useState(defaultCounter)
	const [modal, setModal] = useState(false)
	const [endGameModalOpen, setEndGameModalOpen] = useState(false)

  useEffect(() => {
		setCounter(defaultCounter)
		handleNewGame()
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
    props.dispatch(setGameOver(
			props.token,
			props.user.id,
			props.gameType,
			props.activeMap,
			props.foundCountries?.length || 0,
			defaultCounter - counter
		))
		props.started && props.dispatch(setState({started: false}))
    setModal(true)
  }

  const handleNewGame = () => {
    props.dispatch(newGame("World"))
    setCounter(defaultCounter)
		props.started && props.dispatch(setState({started: false}))
  }

  const startStopGame = () => {
		if (["Start", "Pause", "Resume"].includes(startStopButton))
			props.dispatch(setState({inProgress: !props.inProgress}))
    switch (startStopButton) {
			case "New game":
				return handleNewGame()
			case "Start": {
				props.dispatch({type: SET_RANDOM_COUNTRY})
				return !props.started && props.dispatch(setState({started: true}))
			}
			default:
				return console.log(`Unhandled ${startStopButton}`)
		}
  }

	const {mins, secs} = secondsToTime(counter)

	const startStopButton = props.inProgress
		? "Pause"
		: props.started
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
						onKeyUp={event => {
							if (
								event.key === "Escape" ||
								event.target.value.toLowerCase().trim() === "skip"
							) {
								event.target.value = ""
								toast.warning(props.currentCountry.name)
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
							toast.warning(props.currentCountry.name)
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
					!props.inProgress && props.started && <>
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

import React from 'react'
import { Link } from 'react-router'

export default class Alert extends React.Component {
	render() {
		return(
			<div>
				<textarea rows="2" cols="50" onChange={this.props.questionInput}>
				</textarea>
				<button 
				  onClick={this.props.clickQuestion} >
				  Question
				</button>
			</div>
		)
	}
}

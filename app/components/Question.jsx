import React from 'react'
import { Link } from 'react-router'

export default class Alert extends React.Component {
	render() {
		return(
			<div>
				<textarea rows="2" cols="50" onChange={this.props.questionInput}>
				</textarea>
				<button 
					className="btn btn-primary"
				  onClick={this.props.clickQuestion} >
				  <span className="glyphicon glyphicon-ok"></span>
				  Send
				</button>
			</div>
		)
	}
}
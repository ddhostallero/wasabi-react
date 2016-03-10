import React from 'react'
import { Link } from 'react-router'

export default class Alert extends React.Component {
	render() {
		return(
			<div>
				<button className="btn"
				  onClick={this.props.clickAlert} >
				  Alert
				</button>
			</div>
		)
	}
}

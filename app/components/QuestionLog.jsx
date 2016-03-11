import React from 'react'
import { Link } from 'react-router'

export default class QuestionLog extends React.Component {
	render() {
		return(
			<div>
	      { this.props.questions.map(
	          (c, i) => {
	            return(
	              <div key={i}>
	                {c.sender}: {c.questionMsg} 
	              </div>
	            )}
	        )}
	    </div>
		)
	}
}
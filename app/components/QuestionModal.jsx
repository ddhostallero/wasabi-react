import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'

export default class QuestionNotif extends React.Component {
	
	componentDidMount(){
    $(ReactDOM.findDOMNode(this)).modal('show');
    $(ReactDOM.findDOMNode(this)).on('hidden.bs.modal', this.props.handleHideModal);
  }

	render() {
		var icon_style = { backgroundColor: "yellow",
		              		 borderRadius:100,
		              		 height: 40,
		              		 width: 40,
		              		 float: "left",
 										   marginRight: 10 }
		return(
      <div className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">Questions</h4>
            </div>
            <div className="modal-body">
              <div>
              	<div style={ icon_style }></div>
              	<div >
              		<div style={{fontWeight: "bold"}}>
              			Lorem Ipsum
              		</div>
              		<div>
              			Lorem Ipsum dolor sit amet
              		</div>
              	</div>
              </div>
            </div>
          </div>
        </div>
      </div>
		)
	}
}

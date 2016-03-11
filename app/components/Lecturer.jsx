import React from 'react';
import { hashHistory, Link } from 'react-router';
import AltContainer from 'alt-container';
import UserActions from '../actions/UserActions';
import UserStore from '../stores/UserStore';
import SlideActions from '../actions/SlideActions';
import SlideStore from '../stores/SlideStore';
import SlideShow from './SlideShow.jsx';
import LocalVideo from './UserMediaLocal.jsx';
import Question from './Questions/Question.jsx';
import QuestionNotif from './Questions/QuestionNotif.jsx';
import QuestionModal from './Questions/QuestionModal.jsx';

export default class Student extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      alerts: 0,
      questionValue: "",
      notifs: 2,
      view: {
        showModal: false
      },
      questions: [{ sender: "dave",
                    questionMsg: "who?" },
                  { sender: "bob",
                    questionMsg: "what?" }]
    }

  }
  componentDidMount() {
    var loggedInUser = UserStore.getState().loggedInUser;
    this.setState({user: loggedInUser});

    this.setState(SlideStore.getState())
    SlideStore.listen(this.changeSlideStore);

    SlideActions.subSlide({slideDeckId:this.props.params.deckId, user: loggedInUser});
    console.log('componentDidMount', this.state, SlideStore.getState());
  }
  componentWillUnmount() {
    SlideActions.unsubSlide(this.props.params.deckId);
    SlideStore.unlisten(this.changeSlideStore);
  }
  changeSlideStore = (state) => {
    this.setState(state);
  }
  render() {
    var AlertNumber = this.state.alerts

    return (
      <div className="row">

        {this.state.view.showModal ? 
          <QuestionModal questions={this.state.questions} 
                         handleHideModal={this.handleHideModal}
                         questionInput={this.handleAnswerInput}
                         clickQuestion={this.handleAnswer}/> : null}  

        <button className="btn btn-danger">
          <span className="glyphicon glyphicon-alert" aria-hidden="true"></span>
          <span className="badge">{AlertNumber}</span>
        </button>

        <QuestionNotif 
          handleShowModal={this.handleShowModal}
          notifs={this.state.notifs}/>


        <AltContainer
          stores={{slides: SlideStore}}
        >
          <SlideShow
            onFirst={this.handleFirst}
            onPrev={this.handlePrev}
            onNext={this.handleNext}
            onLast={this.handleLast} />
        </AltContainer>
        <LocalVideo />
      </div>
    );
  }

  //shows the modal for the questions
  handleHideModal = (event) => {
    this.setState({ view: {showModal: false} })
  }

  //hides the modal for the questions
  handleShowModal = (event) => {
    this.setState({ view: {showModal: true} })
  }

  //triggered when the value of the text area changes
  handleAnswerInput = (event) => {
    this.setState({ questionValue: event.target.value });
  }

  //pushes replies to questions
  handleAnswer = (index) => {
    console.log('send to student:' + this.state.questionValue)
    
    var questions = this.state.questions;
    if (!questions[index].reply)
      questions[index].reply = []
    
    questions[index].reply.push({ sender: "you",
                               questionMsg: this.state.questionValue })

    this.setState({ questions: questions });
  }

  handleFirst = (event) => {
    if (this.state.slideNoLocal > 0 ) {
      SlideActions.changeSlideLocal({slideNoLocal: 0});
      console.log('handleFirst', this.state);
    }
  }
  handlePrev = (event) => {
    if (this.state.slideNoLocal > 0) {
      SlideActions.changeSlideLocal({slideNoLocal: this.state.slideNoLocal -1});
      console.log('handlePrev', this.state);
    }
  }
  handleNext = (event) => {
    if (this.state.slideNoLocal < this.state.slideDeckLength - 1) {
      SlideActions.changeSlideLocal({slideNoLocal: this.state.slideNoLocal + 1});
      console.log('handleNext', this.state);
    }
  }
  handleLast = (event) => {
     if (this.state.slideNoLocal < this.state.slideDeckLength - 1 ) {
      SlideActions.changeSlideLocal({slideNoLocal: this.state.slideDeckLength - 1});
      console.log('handleLast', this.state);
    }
  }
}

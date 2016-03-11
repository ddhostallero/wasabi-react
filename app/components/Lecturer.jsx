import React from 'react';
import { hashHistory, Link } from 'react-router';
import AltContainer from 'alt-container';
import UserActions from '../actions/UserActions';
import UserStore from '../stores/UserStore';
import SlideActions from '../actions/SlideActions';
import SlideStore from '../stores/SlideStore';
import SlideShow from './SlideShow.jsx';
import LocalVideo from './UserMediaLocal.jsx';
import Question from './Question.jsx';
import QuestionNotif from './QuestionNotif.jsx';
import QuestionModal from './QuestionModal.jsx';

export default class Student extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      alerts: 0,
      answerInput: "",
      notifs: 0,
      view: {
        showModal: false
      }
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
    var AlertNumber;
    AlertNumber = <div> {this.state.alerts} </div>

    return (
      <div className="row">a
        <div>Alerts: {AlertNumber}</div>
        {this.state.view.showModal ? <QuestionModal handleHideModal={this.handleHideModal}/> : null}  
        <QuestionNotif 
          handleShowModal={this.handleShowModal}
          notifs={this.state.notifs}/>
        <Question 
          questionInput={this.handleAnswerInput}
          clickQuestion={this.handleAnswer}/>

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

  handleHideModal = (event) => {

    this.setState({ view: {showModal: false} })
  }

  handleShowModal = (event) => {
    console.log(this.state)
    this.setState({ view: {showModal: true} })
  }

  handleAnswerInput = (event) => {
    this.setState({ answerInput: event.target.value });
  }

  handleAnswer = (event) => {
    console.log('send to student:' + this.state.answerInput)
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

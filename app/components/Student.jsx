import React from 'react';
import { hashHistory, Link } from 'react-router';
import AltContainer from 'alt-container';
import UserActions from '../actions/UserActions';
import UserStore from '../stores/UserStore';
import SlideActions from '../actions/SlideActions';
import SlideStore from '../stores/SlideStore';
import SlideShow from './SlideShow.jsx';
import Quiz from './Quiz.jsx';
import Alert from './Alert.jsx';
import Question from './Question.jsx';

export default class Student extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = { 
      quizRetries: 0,
      lastAnswer: null, 
      lastCorrect: false,
      questionValue: "",
      questions: [{ sender: "",
                    questionMsg: "" }]
    }
  }
  componentDidMount() {
    var loggedInUser = UserStore.getState().loggedInUser;
    this.setState({user: loggedInUser});

    this.setState(SlideStore.getState())
    SlideStore.listen(this.changeSlideStore);

    SlideActions.subSlide({slideDeckId:this.props.params.deckId, user: loggedInUser});
    console.log('componentDidMount', this.state, SlideStore.getState());
  
    this.setState({ 
      quizRetries: 0, //number of retries
      lastAnswer: null, //the last answer
      lastCorrect: false //whether the last answer was true or false
    });
  }
  componentWillUnmount() {
    SlideActions.unsubSlide(this.props.params.deckId);
    SlideStore.unlisten(this.changeSlideStore);
  }
  changeSlideStore = (state) => {
    this.setState(state);
  }
  render() {
    var QuizResult;

    if ( this.state.quizRetries > 0 ){
      if ( this.state.lastCorrect === true ){
        QuizResult = <div>Correct answer!</div>
      }
      else{
        QuizResult = <div>WRONG ANSWER! Try again.</div>
      }
    }

    return (
      <div className="row">
        <div className="col-md-8">
          <AltContainer
            stores={{slides: SlideStore}}
          >
            <SlideShow
              onFirst={this.handleFirst}
              onPrev={this.handlePrev}
              onNext={this.handleNext}
              onLast={this.handleLast} />
          </AltContainer>
        </div>
        <div className="col-md-4">
          <Quiz quizText={"What is 1+2?"} 
                quizChoices={["1", "2", "3", "4"]}
                quizHandleAnswer={this.handleAnswer}
          />
          <Alert clickAlert={this.handleAlertButton}/>
          <Question 
            questionInput={this.handleQuestionInput}
            clickQuestion={this.handleQuestion}
            questions={this.state.questions}
            questionValue={this.questionValue}/>
          {QuizResult}
        </div>
      </div>
    );
  }

  handleQuestionInput = (event) => {
    this.setState({ questionValue: event.target.value });
  }

  handleQuestion = (event) => {
    console.log('send to teacher:' + this.state.questionValue)
    console.log(this.state)
    var questions = this.state.questions;
    questions.push({ sender: "you",
                     questionMsg: this.state.questionValue })

    this.setState({ questionValue: "",
                    questions: questions });

  }

  handleAlertButton = (event) => {
    console.log('alert teacher');
  }

  handleAnswer = (choice, index) => {
    var answerCorrect = false
    if(index === 2){
      answerCorrect = true;
    }

    console.log('answer', choice, answerCorrect)

    this.setState({ quizRetries: this.state.quizRetries + 1,
                    lastAnswer: choice,
                    lastCorrect: answerCorrect })

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

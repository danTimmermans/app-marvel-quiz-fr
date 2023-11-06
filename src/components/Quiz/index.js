import React, {Component, Fragment}  from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Levels from '../Levels';
import ProgressBar from '../ProgressBar';
import  { QuizMarvel } from '../quizMarvel';
import QuizOver from '../QuizOver';
import { FaChevronRight } from 'react-icons/fa';

toast.configure();

const initialState = {
  quizLevel: 0,
  maxQuestions: 10,
  storedQuestions: [],
  question: null,
  options: [],
  idQuestion: 0,
  btnDisabled: true,
  userAnswer: null,
  score: 0,
  showWelcomeMsg: false,
  quizEnd : false,
  percent: null
}

const levelNames = ['debutant', 'confirme', 'expert' ];


class Quiz extends Component {

  constructor(props) {
    super(props)
      this.state = initialState;
      this.storedDataRef = React.createRef();
  }
  



  

  

  loadQuestions = quizz => {
    // on recupère les 10 question du niveau debutant
    const fetchedArrayQuiz = QuizMarvel[0].quizz[quizz];
    if (fetchedArrayQuiz.length>=this.state.maxQuestions){
// dans le current on a l'array qui comprends la repnse (answer)
       this.storedDataRef.current = fetchedArrayQuiz;
      //  console.log(this.storedDataRef.current);

      // le spread operator ne prends pas la reponse (answer), pour ne pas l'afficher dans la console react dev tools pour eviter la triche
      const newArray = fetchedArrayQuiz.map(({answer, ...keepRest}) => keepRest);
      this.setState({
        storedQuestions: newArray

      })
  
    }else{
      console.log('pas assez de questions');
    }
  }

    showToastMsg = pseudo =>{
      if(!this.state.showWelcomeMsg){

        this.setState({
          showWelcomeMsg: true
        })

        toast.info(`Bienvenue ${pseudo}!`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          });
      }
    }

  componentDidMount(){
    // on va chercher le levelNames à l'indice [0]
    this.loadQuestions(levelNames[this.state.quizLevel])
  } 
  
  nextQuestion=()=>{
    if(this.state.idQuestion===this.state.maxQuestions - 1){
      this.setState({
        quizEnd: true
      })
    }else{
      this.setState(prevState=>({
        idQuestion: prevState.idQuestion + 1
      }))
    }

    const goodAnswer = this.storedDataRef.current[this.state.idQuestion].answer;
    if(this.state.userAnswer=== goodAnswer){
      this.setState(prevState=>({
        score: prevState.score + 1
      }))

      toast.success('Bravo + 1 Point', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        bodyClassName: 'toastify-color'
        });
    }else{

      toast.error('Raté 0 point', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        bodyClassName: 'toastify-color'
        });
    }
  }

  componentDidUpdate(prevProps, prevState){
    const {
      maxQuestions,
      storedQuestions,
      idQuestion,
      quizEnd,
      score
    } = this.state;
    // charge la 1ere question
    if((storedQuestions !== prevState.storedQuestions)&& storedQuestions.length){
      this.setState({
        question: storedQuestions[idQuestion].question,
        options: storedQuestions[idQuestion].options
      })
    }
// passe à la question suivante en fct du idQuestion ou on se trouve
    if((idQuestion !== prevState.idQuestion)&& storedQuestions.length){
      this.setState({
        question: storedQuestions[idQuestion].question,
        options: storedQuestions[idQuestion].options,
        // on remet au state de départ userAnswer et btnDisabled
        userAnswer: null,
        btnDisabled: true
      })
    }

    if(quizEnd !== prevState.quizEnd){
    const gradePercent = this.getPercentage(maxQuestions, score);
    this.gameOver(gradePercent);
    }

    if(this.props.userData.pseudo !== prevProps.userData.pseudo ){
      this.showToastMsg(this.props.userData.pseudo)
    }

  }

  submitAnswer = selectedAnswer => {
    this.setState({
      userAnswer: selectedAnswer,
      btnDisabled: false
    })
    console.log(this.userAnswer);
  }


  getPercentage = (maxQuest, ourScore)=>(ourScore/maxQuest)*100;

  gameOver = percent =>{


    if(percent >= 50){
      this.setState({
        quizLevel: this.state.quizLevel + 1,
        percent: percent,
      })
    }else{
      this.setState({
        percent: percent,
      })
    }
  }

  loadLevelQuestions=param=>{
    this.setState({...initialState, quizLevel: param})

    this.loadQuestions(levelNames[param])
  }

  render(){

    const {
    quizLevel,
    maxQuestions,
    question,
    options,
    idQuestion,
    btnDisabled,
    userAnswer,
    score,
    quizEnd,
    percent } = this.state;

    const displayOptions = options.map((option, index)=>{
      return(
        <p key={index} 
          className={`answerOptions ${userAnswer===option ?'selected' : null }`}
          onClick={()=>  this.submitAnswer(option)}
        >
          <FaChevronRight/>
          {option}
        </p>
      )
    })

    return  quizEnd ? (
      <QuizOver 
          ref={this.storedDataRef}
          levelNames={levelNames}
          score={score}
          maxQuestions={maxQuestions}
          quizLevel={quizLevel}
          percent={percent}
          loadLevelQuestions={this.loadLevelQuestions}
      />
    ) : (
      <Fragment>
        <Levels
          levelNames={levelNames}
          quizLevel={quizLevel}
          />
        <ProgressBar idQuestion={idQuestion} maxQuestions={maxQuestions} />
        <h2>{question}</h2>
        {displayOptions}
        <button 
          disabled={btnDisabled} 
          className='btnSubmit'
          onClick={this.nextQuestion}
        >
          {idQuestion < maxQuestions - 1 ? 'Suivant' : 'terminer' }
        </button>
      </Fragment>
    )
  }
}

export default Quiz

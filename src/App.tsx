import { useState } from "react";
import questions from './questions.json';
import Button from "./components/Button";


function App() {
   // State to manage the current question's index
  const [questionIndex, setQuestionIndex] = useState(0)

  let currentQuestion = questions[questionIndex]

  // Structure of the answers state
  type AnswerState = {
    [key: number]: string | string[];
  };
  const [answers, setAnswers] = useState<AnswerState>({});

  // Handler function to manage the button actions
  const handleClick = async (action: string) => {
    if (action === "next") {
      // Check if the answer is mandatory and not provided
      console.log(answers[currentQuestion.id])
      if (currentQuestion.mandatory && (answers[currentQuestion.id] === undefined  || answers[currentQuestion.id] === "")){
        alert("Answer required!")
      }
      if (currentQuestion.type === "form-control2") {
        let matchString = String(answers[currentQuestion.id])
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
        if (matchString) 
          setQuestionIndex(questionIndex + 1)
        else 
          alert("format not correct!")
      }
      else {
        // Move to the next question
          setQuestionIndex(questionIndex + 1)
      }
    } else if (action === "back") {
      // Move to the previous question
      setQuestionIndex(questionIndex - 1)
    } else if (action === "submit") {
      // Submit answers to the API
      console.log(answers)
      try {
        const response = await fetch('http://api_url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(answers)
        });
    
        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.error("Error submitting: ", error);
        throw error;
      }
    }
  };


  // Render function for select input
  const renderSelect = () => {  
    return (
      <select 
        className="form-select"   
        value={answers[currentQuestion.id] || ''}
        onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
      >
        <option value="">Options</option>
        {currentQuestion.options.map(item => <option key={item} value={item}>{item}</option>)}
      </select>
    );
  }

  // Render function for checkbox input
  const renderFormCheck = () => (
    <div>
      {currentQuestion.options.map(item => 
        <div className="form-check" key={item}>
          <input 
            className="form-check-input" 
            type="checkbox" 
            value={item} 
            checked={answers[currentQuestion.id] ? answers[currentQuestion.id].includes(item) : false}
            onChange={(e) => {
              const updatedAnswers = answers[currentQuestion.id] ? [...answers[currentQuestion.id]] : [];
              if (e.target.checked) {
                updatedAnswers.push(item);
              } else {
                const index = updatedAnswers.indexOf(item);
                if (index > -1) {
                  updatedAnswers.splice(index, 1);
                }
              }
              setAnswers(prev => ({ ...prev, [currentQuestion.id]: updatedAnswers }));
            }}
          />
          <label className="form-check-label">{item}</label>
        </div>
      )}
    </div>
  );

  // Render function for text input
  const renderFormControl = () => (
    <input className="form-control form-control-lg" type="text"
    value={answers[currentQuestion.id] || ''}
    onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))} />
  )

    // Render function for text input
    const renderFormControl2 = () => (
      
      <input className="form-control form-control-lg" type="email"
      value={answers[currentQuestion.id] || ''}
      onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))} />
    )

  return (
    <div className="d-flex flex-column min-vh-100 justify-content-center bg-light">
      
      <h1 className="text-center mb-4">{questions[questionIndex].question}</h1>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">


          {currentQuestion.type === "form-control2" && (
              <div className="form-group">
                {renderFormControl2()}
              </div>
            )}


            {currentQuestion.type === "form-select" && (
              <div className="form-group">
                {renderSelect()}
              </div>
            )}

            {currentQuestion.type === "form-control" && (
              <div className="form-group">
                {renderFormControl()}
              </div>
            )}

            {currentQuestion.type === "form-check" && (
              <div className="form-group">
                {renderFormCheck()}
              </div>
            )}

            



          </div>


        </div>
      </div>

      {questionIndex > 0 && (
        <div className="position-fixed bottom-0 left-0 m-3">
          <Button name="BACK" handleClick={() => handleClick("back")}/>
        </div>
      )}

      <div className="position-fixed bottom-0 end-0 m-3">
        {questionIndex === questions.length - 1 ? (
          <Button name="SUBMIT" handleClick={() => handleClick("submit")}/>
        ) : (
          <Button name="NEXT" handleClick={() => handleClick("next")}/>
        )}
      </div>
    
    </div>
  );  
}

export default App;

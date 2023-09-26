import { Component } from "react";
import { numbers } from "./components/numbers";
//import { operators } from "./components/operators";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayValue: 0,
      strCalculation: '',
      arrCalculation: []
    }
    this.getNumber = this.getNumber.bind(this);
    this.getOperator = this.getOperator.bind(this);
    this.reset = this.reset.bind(this);
    this.getResult = this.getResult.bind(this);
    this.calculateTwoNumbers = this.calculateTwoNumbers.bind(this);
  }

  getNumber(e) {
    //case: new number after operator (and possible minus presign)
    if (/[*/+-]/.test(this.state.displayValue)) {
      //case: operator and minus presign before number
      if (/[*/+-]/.test(this.state.strCalculation[-2])) {
        this.setState({
          displayValue: e.target.value,
          strCalculation: this.state.strCalculation + e.target.value
        });
      //case: just operator, no minus presign
      } else {
        this.setState({
          displayValue: e.target.value,
          strCalculation: this.state.strCalculation + e.target.value,
          arrCalculation: [...this.state.arrCalculation, this.state.displayValue]
        });
      }
    //case: prevent a 0 in front of a number (except the first) bigger than 1
    } else if (/[/*+-]0/.test(this.state.strCalculation.slice(-2))) {
      this.setState({
        displayValue: e.target.value,
        strCalculation: this.state.strCalculation.slice(0, -1) + e.target.value
      });
    //case: prevent a 0 in front of the first number when it is bigger than one
    } else if (/^0/.test(this.state.displayValue)) {
      //this.state.strCalculation == ''
      //console.log(e.target.value);
      this.setState({
        displayValue: e.target.value,
        strCalculation: this.state.strCalculation.slice(0, -1) + e.target.value
      });
    //check for two decimal in one number
    } else if (e.target.value === '.' && /[.]/.test(this.state.displayValue)) {
      //do nothing, decimal is already placed
    }
    //number that has more than one digit
    else {
      this.setState({
        displayValue: this.state.displayValue + e.target.value,
        strCalculation: this.state.strCalculation + e.target.value
      });
    }
  }

  getOperator(e) {
    //check: no operator at beginning of calculation
    if (this.state.strCalculation !== '' ) {
      //check: second operator will replace first, minus for a negative number will be deleted
      if (/[/*+-]-/.test(this.state.strCalculation.slice(-2))) {
        this.setState({
          displayValue: e.target.value,
          strCalculation: this.state.strCalculation.slice(0, -2) + e.target.value,
          arrCalculation: [...this.state.arrCalculation.slice(0,-1), this.state.displayValue]
        });
      //check: no operators in a row (except -), second will replace first
      } else if (/[/*+-]/.test(this.state.displayValue) && e.target.value !== '-') {
        console.log("test3");
        this.setState({
          displayValue: e.target.value,
          strCalculation: this.state.strCalculation.slice(0, -1) + e.target.value
        });
      //check: minus following another operator, will be used for a negative number
      } else if (/[/*+-]/.test(this.state.displayValue) && e.target.value === '-') {
        console.log("test2");
        this.setState({
          displayValue: e.target.value,
          strCalculation: this.state.strCalculation + e.target.value,
          arrCalculation: [...this.state.arrCalculation, this.state.displayValue]
        });
      //check: (first) operator after number
      } else {
        console.log("test1");
        this.setState({
          displayValue: e.target.value,
          strCalculation: this.state.strCalculation + e.target.value,
          arrCalculation: [...this.state.arrCalculation, Number(this.state.displayValue)]
        });
      }
    }
  }

  reset() {
    this.setState({
      displayValue: 0,
      strCalculation: ''
    });
  }

  getResult() {
    //startvalue of loop is first value of array
    let result = this.state.arrCalculation[0];
    //new array with all results for the operators / and *
    let arrCalculationReduced = [];
    console.log("arrCalculation: " + this.state.arrCalculation);
    console.log("displayValue: " + this.state.displayValue);
    //first loop to go through the operators / and *, results will be added in new arr
    for (let i=1; i<this.state.arrCalculation.length; i+=2) {
      //check for operators / and *
      if (/[/*]/.test(this.state.arrCalculation[i])) {
        result = this.calculateTwoNumbers(this.state.arrCalculation[i-1], i, this.state.arrCalculation)
        //add result to new arr
        arrCalculationReduced = [...arrCalculationReduced, result];
      } else {
        //copy rest to new arr
        if (i === 1 || /[+-]/.test(this.state.arrCalculation[i-2])) {
          arrCalculationReduced = [...arrCalculationReduced,
            this.state.arrCalculation[i-1],
            this.state.arrCalculation[i]
          ];
        } else {
          //copy only operator to new arr because value before is used for / or *
          arrCalculationReduced = [...arrCalculationReduced,
            this.state.arrCalculation[i]
          ];
        }
      }
    }
    //reset result for next loop (with operators + and -)
    result = arrCalculationReduced[0];
    //loop through all values with the operators + and -
    for (let i=1; i<arrCalculationReduced.length; i+=2) {
      result = this.calculateTwoNumbers(result, i, arrCalculationReduced)
    }
    console.log(arrCalculationReduced);
    this.setState({
      displayValue: result,
      strCalculation: '',
      arrCalculation: []
    })
  }

  calculateTwoNumbers(startValue, i, array) {
    let result = 0;
    let secondNumber = 0;
    //add last number of calculation (not in arrCalculation)
    if (!array[i+1]) {
      secondNumber = Number(this.state.displayValue);
    //number is in arrCalculation
    } else {
      secondNumber = array[i+1];
    }
    //define first number as startvalue for calculation
    console.log("first number: "+ startValue,
      ", operator: " + array[i],
      ", second number: " + secondNumber);
    switch (array[i]) {
      case '/':
        result = startValue / secondNumber;
        break;
      case '*':
        result = startValue * secondNumber;
        break;
      case '-':
        result = startValue - secondNumber;
        break;
      case '+':
        result = startValue + secondNumber;
        break;
      default:
        result = 0;
    }
    console.log("result: " + result);
    return result;
  }

  render() { 
    let showNumbers = numbers
      .filter(number => number.digit !== 0)
      .map((number, i, arrNumbers) => {
        return (
          <button
            className="square reverse"
            id={arrNumbers[i].id}
            onClick={this.getNumber}
            value={arrNumbers[i].digit}
            key={arrNumbers[i].id}
          >
            {arrNumbers[i].digit}
          </button>
        )
      })
      
    return (
      <div className="App">
        <div id="calculator">
          <div id="screen">
            <div id="calculation">{this.state.strCalculation}</div>
            <div id="display">{this.state.displayValue}</div>
          </div>
          <div id="operators-top">
            <button
              className="wide"
              onClick={this.reset}
              id="clear"
            >
              AC
            </button>
            <button
              className="square"
              id="divide"
              onClick={this.getOperator}
              value="/"
            >
              /
            </button>
            <button
              className="square"
              id="multiply"
              onClick={this.getOperator}
              value="*"
            >
              x
            </button>
          </div>
          <div id="block-numbers">
            <div id="one-to-nine">{showNumbers}</div>
            <button
              className="wide"
              id={numbers[0].id}
              onClick={this.getNumber}
              value={numbers[0].digit}
            >
              {numbers[0].digit}
            </button>
            <button
              className="square"
              id="decimal"
              onClick={this.getNumber}
              value="."
            >
              .
            </button>
          </div>
          <div id="operators-side">
            <button
              className="square"
              id="subtract"
              onClick={this.getOperator}
              value="-"
            >
              -
            </button>
            <button
              className="square"
              id="add"
              onClick={this.getOperator}
              value="+"
            >
              +
            </button>
            <button
              className="tall"
              id="equals"
              onClick={this.getResult}
            >
              =
            </button>
          </div>
        </div>
      </div>
    );
  }
}
 
export default App;
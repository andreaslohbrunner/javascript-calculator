import { Component } from "react";
import { numbers } from "./components/numbers";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayValue: '0',
      strCalculation: '',
      arrCalculation: []
    }
    this.getNumber = this.getNumber.bind(this);
    this.getOperator = this.getOperator.bind(this);
    this.reset = this.reset.bind(this);
    this.getResult = this.getResult.bind(this);
    this.checkNegativeNumbers = this.checkNegativeNumbers.bind(this);
    this.calculateTwoNumbers = this.calculateTwoNumbers.bind(this);
  }

  getNumber(e) {
    let flagFirstDigit = false;
    let displayBase = '0';
    let strBase = '';
    let arrBase = [];

    //check if a result is available and delete everything in strCalculation before that
    if (!/[=]/.test(this.state.strCalculation)) {
      displayBase = this.state.displayValue;
      strBase = this.state.strCalculation;
      arrBase = this.state.arrCalculation;
    } else {
     //do nothing
    }

    //case 1: first digit after operator, e.g. +5 -> add operator as new item in array
    if (/[*/+-]/.test(displayBase)) {
      //console.log("getNumber-case-1");
      flagFirstDigit = true;
      this.setState({
        arrCalculation: [...arrBase, displayBase]
      });
    }
    //case 2: handling '.'
    if (e.target.value === '.') {
      //case 2-1: '.' after operator, e.g. +. -> +0.
      if (/[*/+-]/.test(displayBase)) {
        //console.log("getNumber-case-2-1");
        this.setState({
          displayValue: '0.',
          strCalculation: strBase + '0.'
        });
      //case 2-2: '.' already in number, e.g. 4.23. -> 4.23
      } else if (/[.]/.test(displayBase)) {
        //console.log("getNumber-case-2-2");
        console.log("'.' is already used in number")
      //case 2-3: '.' can be added to number without restrictions, e.g. 2.
      } else {
        //console.log("getNumber-case-2-3");
        this.setState({
          displayValue: displayBase + '.',
          strCalculation: strBase + '.'
        });
      }
    //case 3: handling digits 0 to 9
    } else {
      //case 3-1: handling '0' at the beginning of a number
      if (displayBase === '0') {
        //console.log("getNumber-case-3-1");
        this.setState({
          displayValue: e.target.value,
          strCalculation: e.target.value
        });
      } else {
        //case 3-2: digit will be the first of the new number, operator will be deleted in display, e.g. 2
        if (flagFirstDigit) {
          //console.log("getNumber-case-3-2");
          this.setState({
            displayValue: e.target.value,
            strCalculation: strBase + e.target.value
          });
        //case 3-3: digit can be added to number without restrictions, e.g. 2.3
        } else {
          //console.log("getNumber-case-3-3");
          this.setState({
            displayValue: displayBase + e.target.value,
            strCalculation: strBase + e.target.value
          });
        }
      }
    }
  }

  getOperator(e) {
    let strBase = '';

    //check if a result is available and delete everything in strCalculation before that
    if (/[=]/.test(this.state.strCalculation)) {
      strBase = this.state.strCalculation.split('=').pop();
      //console.log("strBase: " + strBase);
    } else {
      strBase = this.state.strCalculation;
    }

    //case 1: handling operator as first sign in calculation
    if (strBase === '' ) {
      //case 1.1: '-' as first sign in calculation
      if (e.target.value === '-') {
        //console.log("getOperator-case-1-1");
        this.setState({
          displayValue: '-',
          strCalculation: '-'
        });
      //case 1-2: no other operator (than '-') allowed as first sign in calculation
      } else {
        //console.log("getOperator-case-1-2");
        console.log("No operator allowed as first sign in calculation!")
      }
    //case 2: handling operator between two numbers
    } else {
      //case 2-1: handling two operators in a row
      if (/[/*+-]/.test(this.state.displayValue)) {
        //case2-1-1: check for three operators in a row, take the last one as new operator, e.g. +-+ -> +
        //(three operators are only possible if the second is a '-')
        if (/[/*+-]-/.test(strBase.slice(-2))) {
          //console.log("getOperator-case-2-1-1");
          this.setState({
            displayValue: e.target.value,
            strCalculation: strBase.slice(0, -2) + e.target.value,
            arrCalculation: this.state.arrCalculation.slice(0,-1)
          });
        } else {
          //case 2-1-2-1: '-' after operator, will be used for a negative number, e.g. *-
          if (e.target.value === '-') {
            //console.log("getOperator-case-2-1-2-1");
            this.setState({
              displayValue: e.target.value,
              strCalculation: strBase + e.target.value,
              arrCalculation: [...this.state.arrCalculation, this.state.displayValue]
            });
          //case 2-1-2-2: second operator will replaced first, e.g. +* -> *
          } else {
            //console.log("getOperator-case-2-1-2-2");
            this.setState({
              displayValue: e.target.value,
              strCalculation: strBase.slice(0,-1) + e.target.value
            });
          }
        }
      //case 2-2: one operator after number
      } else {
        //console.log("getOperator-case-2-2");
        this.setState({
          displayValue: e.target.value,
          strCalculation: strBase + e.target.value,
          arrCalculation: [...this.state.arrCalculation, Number(this.state.displayValue)]
        });
      }
    }
  }

  reset() {
    this.setState({
      displayValue: '0',
      strCalculation: ''
    });
  }

  getResult() {
    //startvalue of loop is first value of array
    let result = this.state.arrCalculation[0];
    let arrCalculationComplete = this.checkNegativeNumbers([...this.state.arrCalculation, Number(this.state.displayValue)]);
    //new array with all results for the operators / and *
    let arrCalculationReduced = [];
    //console.log("arrCalculation: " + this.state.arrCalculation);
    //console.log("displayValue: " + this.state.displayValue);
    //console.log("arrCalculationComplete: " + arrCalculationComplete);
    //first loop to go through the operators / and *, results will be added in new arr
    for (let i=1; i<arrCalculationComplete.length; i+=2) {
      //check for operators / and *
      if (/[/*]/.test(arrCalculationComplete[i])) {
        result = this.calculateTwoNumbers(arrCalculationComplete[i-1], i, arrCalculationComplete)
        //add result to new arr
        arrCalculationReduced = [...arrCalculationReduced, result];
      } else {
        //copy rest to new arr
        if (i === 1 || /[+-]/.test(arrCalculationComplete[i-2])) {
          //end off arr is reached, all last 3 three values need to be copied to new arr
          if (i === arrCalculationComplete.length-2) {
            arrCalculationReduced = [...arrCalculationReduced,
              arrCalculationComplete[i-1],
              arrCalculationComplete[i],
              arrCalculationComplete[i+1],
            ];
          } else {
            arrCalculationReduced = [...arrCalculationReduced,
              arrCalculationComplete[i-1],
              arrCalculationComplete[i]
            ];
          }
        } else {
          //copy only operator to new arr because value before is used for / or *
          arrCalculationReduced = [...arrCalculationReduced,
            arrCalculationComplete[i]
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
    //console.log(arrCalculationReduced);
    result = parseFloat(result.toFixed(10));
    this.setState({
      displayValue: result,
      strCalculation: this.state.strCalculation + '=' + result,
      arrCalculation: []
    })
  }

  checkNegativeNumbers(arr) {
    let newArr = [];

    let i = 0;
    do {
      if (arr[i] === '-' && (i === 0 || /[/*+-]/.test(arr[i-1]))) {
        newArr = [...newArr, -arr[i+1]];
        i+=2;
      } else {
        newArr = [...newArr, arr[i]];
        i++;
      }
    } while (i < arr.length)
    
    return newArr;
  }

  calculateTwoNumbers(startValue, i, array) {
    let result = 0;
    //define first number as startvalue for calculation
    //console.log("first number: "+ startValue,
    //  ", operator: " + array[i],
    //  ", second number: " + array[i+1]);
    switch (array[i]) {
      case '/':
        result = startValue / array[i+1];
        break;
      case '*':
        result = startValue * array[i+1];
        break;
      case '-':
        result = startValue - array[i+1];
        break;
      case '+':
        result = startValue + array[i+1];
        break;
      default:
        result = 0;
    }
    //console.log("result: " + result);
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
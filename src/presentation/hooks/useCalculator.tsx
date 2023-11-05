import {useEffect, useRef, useState} from 'react';

enum Operator {
  add = '+',
  subtract = '-',
  multiply = 'x',
  divide = '÷',
}

export const useCalculator = () => {
  const [formula, setFormula] = useState('');
  const [number, setNumber] = useState('0');
  const [previousNumber, setPreviousNumber] = useState('0');

  const lastOperator = useRef<Operator>();

  useEffect(() => {
    if (lastOperator.current) {
      const firstFormulaPart = formula.split(' ').at(0);
      setFormula(`${firstFormulaPart} ${lastOperator.current} ${number}`);
    } else {
      setFormula(number);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [number]);

  useEffect(() => {
    const subResult = calculateSubResult();
    setPreviousNumber(`${subResult}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formula]);

  const clean = () => {
    setNumber('0');
    setPreviousNumber('0');
    setFormula('');
    lastOperator.current = undefined;
  };

  //Delete last number
  const deleteOperation = () => {
    let negative = '';
    let tempNumber = number;

    if (number.includes('-')) {
      negative = '-';
      tempNumber = number.substring(1);
    }

    if (tempNumber.length > 1) {
      return setNumber(negative + tempNumber.slice(0, -1));
    }
    setNumber('0');
  };

  const toggleSign = () => {
    if (number.includes('-')) {
      return setNumber(number.replace('-', ''));
    }
    setNumber('-' + number);
  };

  const buildNumber = (textNumber: string) => {
    //Not accept double dot
    if (number.includes('.') && textNumber === '.') {
      return;
    }

    //Not accept double zero
    if (number.startsWith('0') || number.startsWith('-0')) {
      //decimal point
      if (textNumber === '.') {
        return setNumber(number + textNumber);
      }
      //if it is zero and there is a point
      if (textNumber === '0' && number.includes('.')) {
        return setNumber(number + textNumber);
      }

      //evaluates if it is different from zero and there is no point
      if (textNumber !== '0' && !number.includes('.')) {
        return setNumber(textNumber);
      }

      //if it is zero and there is no point
      if (textNumber === '0' && !number.includes('.')) {
        return;
      }

      return setNumber(number + textNumber);
    }

    setNumber(number + textNumber);
  };

  const setLastNumber = () => {
    calculate();
    if (number.endsWith('.')) {
      setPreviousNumber(number.slice(0, -1));
    } else {
      setPreviousNumber(number);
    }

    setNumber('0');
  };

  const divideOperation = () => {
    setLastNumber();
    lastOperator.current = Operator.divide;
  };

  const multiplyOperation = () => {
    setLastNumber();
    lastOperator.current = Operator.multiply;
  };

  const subtractOperation = () => {
    setLastNumber();
    lastOperator.current = Operator.subtract;
  };

  const addOperation = () => {
    setLastNumber();
    lastOperator.current = Operator.add;
  };

  const calculate = () => {
    const result = calculateSubResult();
    setFormula(`${result}`);

    lastOperator.current = undefined;
    setPreviousNumber('0');
  };

  const calculateSubResult = (): number => {
    const [firstValue, operation, secondValue] = formula.split(' ');

    const num1 = Number(firstValue);
    const num2 = Number(secondValue);

    if (isNaN(num2)) {
      return num1;
    }

    switch (operation) {
      case Operator.add:
        return num1 + num2;
      case Operator.subtract:
        return num1 - num2;
      case Operator.multiply:
        return num1 * num2;
      case Operator.divide:
        return num1 / num2;

      default:
        throw new Error('Operation not implemented');
    }
  };

  return {
    //properties
    number,
    previousNumber,
    formula,
    //methods
    buildNumber,
    toggleSign,
    deleteOperation,
    clean,
    setLastNumber,
    divideOperation,
    multiplyOperation,
    subtractOperation,
    addOperation,
    calculate,
  };
};

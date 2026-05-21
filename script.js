const display = document.getElementById("output");
const button = document.querySelectorAll(".btn");
const backspaceBtn = document.querySelector(".backspace");
let currentInput = "";
let PRECEDENCE = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
}
let ERROR = false;
let opStack = [];
let numStack = [];

function clear(){
    currentInput = "";
    ERROR = false;
    opStack = [];
    numStack = [];
}

function format(n){
    if (Math.abs(n) > 1e12) return n.toExponential(6);
    return Number(n.toPrecision(12));
}

function calc(x, y, op){
    let res = 0;
    let a = Number(x);
    let b = Number(y);
    switch(op){
        case '-':
            res = a-b;
            break;
        case '+':
            res = a+b;
            break;
        case '*':
            res = a*b;
            break;
        case '/':
            if (b == 0){
                display.textContent = "Error";
                ERROR = true;
            }
            else{
                res = a/b;
            }
            break;
    }
    return res;
}

function calculate(expr){
    if (expr.length == 0){
        return;
    }
    else if (expr[0] in PRECEDENCE || expr[expr.length - 1] in PRECEDENCE){
        ERROR = true;
        return;
    }
    
    let num = "";
    for (let i = 0; i < expr.length; i++){
        let char = expr[i];
        if (ERROR) return;

        if (char in PRECEDENCE) {
            if (i != 0 && expr[i-1] in PRECEDENCE) {
                ERROR = true;
            }
            if (num != "") {
                numStack.push(num);
                num = "";
            }

            while (opStack.length != 0 && PRECEDENCE[char] <= PRECEDENCE[opStack[opStack.length-1]]){
                let op = opStack.pop();
                let n2 = numStack.pop();
                let n1 = numStack.pop();
                let res = calc(n1, n2, op);
                numStack.push(res);
            }
            opStack.push(char);
        }
        else {
            num += char;
        }
    }

    if (num != ""){
        numStack.push(num);
    }
    
    while (opStack.length > 0){
        let op = opStack.pop();
        let n2 = numStack.pop();
        let n1 = numStack.pop();
        let res = calc(n1, n2, op);
        numStack.push(res);
    }

    if (ERROR) return;
    return numStack[0];
}

backspaceBtn.addEventListener("click", () => {
    if (display.textContent == "Error" || display.textContent.length == 1){
        display.textContent = display.textContent = "0";
        currentInput = "";
    }
    else{
        display.textContent = display.textContent.slice(0, -1);
        currentInput = currentInput.slice(0, -1);
    }
})

button.forEach(button => {
    button.addEventListener("click", () => {
        const val = button.textContent;
        
        switch(val){
            case "CE": 
                clear();
                display.textContent = 0;
                break;
            case '=':
                if (display.textContent == "Error" || display.textContent == 0){
                    break;
                }
                let res = calculate(currentInput);
                if (ERROR) {
                    display.textContent = "Error";
                    clear();
                    break;
                }
                res = format(res);
                display.textContent = format(res);
                clear();
                currentInput = res.toString();
                break;
            default: 
                if (display.textContent == 0 || display.textContent == "Error"){
                    display.textContent = val;
                }
                else{
                    display.textContent += val;
                }
                currentInput += val;
        }
    })
})
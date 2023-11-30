const inputSlider= document.querySelector("[data-length-slider]" );
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-cpy]");
const copyMsg=document.querySelector("[data-cpyMsg]");
const upperCaseCheck=document.querySelector('#uppercase');
const lowerCaseCheck=document.querySelector('#lowercase');
const numbersCheck=document.querySelector('#numbers');
const symbolsCheck=document.querySelector('#symbols');
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allcheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols='~!@#$%^&*()-;<>/?}{|';


// initial 
let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();

// set strength circle color to gray
setindicator("#ccc");
// set password length
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    // for dynamic background
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min)) + "% 100%"
}

// 
function setindicator(color){
    indicator.style.backgroundColor=color;
    // shadow

}

// get random int
function getRandomInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}


function generateRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowerCase(){
  return  String.fromCharCode(getRandomInteger(97,123)) ;
}

function generateUpperCase(){
   return  String.fromCharCode(getRandomInteger(65,91)) ;
}

function generateSymbol(){
   const randmNum=getRandomInteger(0,symbols.length);
   return symbols.charAt(randmNum);
}

function handlecheckboxchange(){
    checkCount=0;
    allcheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    })
    // special case
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

allcheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handlecheckboxchange);
})



function calcStrength(){
    let hasUpper=false;
    let haslower=false;
    let hasNum=false;
    let hasSymbol=false;
    if(upperCaseCheck.checked) hasUpper=true;
    if(lowerCaseCheck.checked) haslower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSymbol=true;
    if(hasUpper && haslower && (hasNum || hasSymbol) && passwordLength>=8){
        setindicator("#00ff00");
    }
    else if(((haslower || hasUpper) && (hasNum || hasSymbol)&& passwordLength>=6)){
        setindicator("#ff0");
    }
    else{
        setindicator("#f00");
    }
}

async function copycontent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }
    // to make copy wala span visible
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}


inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copycontent();
    }
})

function shufflePassword(array){
    // fisher yates method // it work only on array
    for(let i=array.length-1 ;i>0;i--){
        const j=Math.floor(Math.random()*(i-1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>{
        str+=el;
    })
    return str;

}

generateBtn.addEventListener('click',()=>{
    // none of checkbox are selected
    if(checkCount<=0){
        return ;
    }
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    console.log("starting the journey");
    // lets explore new password
    // clear old password
    password="";
    // let's put the stuff mentioned by the checkboxes
    // if(upperCaseCheck.checked){
    //     password+=generateUpperCase();
    // }
    // if(lowerCaseCheck.checked){
    //     password+=generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password+=generateRandomNumber();
    // }
    // if(symbols.checked){
    //     password+=generateSymbol();
    // }
    let funcArr=[];
    if(upperCaseCheck.checked){
        funcArr.push(generateUpperCase)
    }
    if(lowerCaseCheck.checked){
        funcArr.push(generateLowerCase)    
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber)    
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol)   
     }

    // compulsary addition

    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    } 
    console.log("compulsary addition done")
    //remaining addition
    for(let i=0;i<passwordLength-funcArr.length;i++){
       let randindex= getRandomInteger(0,funcArr.length);
       console.log("randindex"+ randindex);
        password+=funcArr[randindex]();
    }
    console.log("remaining addition done")

    //shuffle the password
    password=shufflePassword(Array.from(password));
    console.log("shuffling done")
    passwordDisplay.value=password;
    console.log("UI addition done")
    calcStrength();


})
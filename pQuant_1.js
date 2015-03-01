//bug:once the first line is deleted,messCount is one less than it should be

//LOGIN:slideIn,slideOut,signUp,logIn,startBranPlan
//CLASS COUNTING,CONSOLE,ALTERNATION

var loginBox=document.getElementById("loginBox");
var currentUserDisp=$("#currentUserDisp")[0];
var welcome=document.getElementById("welcome");
var accountCover=$("#accountCover")[0];
var Parse,x,decrypt,encrypt,fromCloud;//core_2.js
Parse.initialize("r0raWxihobjYXDFyboAXLv6Shv6HyGsaFpKYlTWk", "ebigHVj8Fcy6mcUXXs4Prl78yvAY8x67BiL6wXGj");
var isSciLab=["Chem 11a","Chem 11b","Chem 29a","Chem 29b","Biol 18b","Phys 18a","Phys 18b","Phys 19a","Phys 19b"];
var isLab=function(short){
    if(isSciLab.indexOf(short)>=0){return true;}
    if(short.substring(0,3)=="Mus"){
        short=parseInt(short.substring(4,short.length-1),10);        
        return (short>=80 && short<=119);
    }
    return false;
};

//AUTO
$(document).ready(function(){

    if(Parse.User.current()){
        Parse.User.current().fetch();// polish it up!
        var username=Parse.User.current().get("username");
        //console.log(username);
        startBranPlan(Parse.User.current(),username);
    }else{
        slideIn();
    }
});

//LOGIN
function slideIn(){
    loginBox.style.display="block";
    var posy=0;
    var move=function(){
        loginBox.style.top=(++posy)+"%";
        if(posy<=34){setTimeout(move,5)}
    };
    move();
}

function slideOut(){
    var posy=50;
    var move=function(){
        loginBox.style.top=(++posy)+"%";
        if(posy<=99){setTimeout(move,5)}else{loginBox.parentNode.removeChild(loginBox)}
    };
    move();
}

var User;

function signUp(){
    function signUp2(){
        var secondPass=$("#password").val();
        if(secondPass!=pass){welcome.textContent="Password mismatch.";return}
        if(!confirm("An email will be sent to the provided address. Is this OK?\nNote: E-mail aliases will take longer.")){return}

        User=new Parse.User();
        User.set("username",email);
        User.set("password",pass);
        User.set("email",email+"@brandeis.edu");
        User.set("pass",pass);
        User.set("scheds",[encrypt()]);
        User.set("times",[Date().slice(4,24)]);
        User.set("names",["Original"]);
        User.signUp(null,{success:function(user){
            welcome.textContent="Email has been sent!";Parse.User.logOut();
        }});
        
    }
    
    var pass=$("#password").val();
    var email=$("#email").val();
    if(pass.length<6 || pass.length>50){alert("Password must be between 6 and 50 characters.");return}
    
    $("#password").val("");
    welcome.textContent="Please retype your password for confirmation: ";
    
    document.getElementById("signUp").onclick=signUp2;
}



function logIn(){
    var email=$("#email").val();
    var pass=$("#password").val();
    Parse.User.logIn(email,pass,{success:function(user){
        if(user.get("emailVerified")){
            var username=Parse.User.current().attributes.username || Parse.User.current()._previousAttributes.username;  
            startBranPlan(user,username);
            slideOut();
        }else{
            welcome.textContent="Account has not yet been activated.";
            Parse.User.logOut();
        }
    },error:function(){
        welcome.textContent="Invalid username or password.";
    }
    });
}
loginBox.addEventListener("keydown",function(ev){if(ev.keyCode==13){logIn()}});

function resetPass(){
    var email=$("#email").val()+"@brandeis.edu";
    if(!email){
        welcome.textContent="Please enter your email.";
        return;
    }
    var affirm=confirm("An email will be sent to the provided address. Is this OK?");
    if(!affirm){return}
    Parse.User.requestPasswordReset(email,{success:function(){welcome.textContent="Email has been sent!"}});
}


function startBranPlan(user,name){
    document.addEventListener("keydown",function(event){if(event.keyCode==32){findShift()}});
    currentUserDisp.textContent="You are currently logged in as "+name+".";    
    x=Parse.User.current().attributes;
    decrypt(0);
    fromCloud();
    document.getElementById("accountWrapper").style.opacity=1;
    accountCover.parentNode.removeChild(accountCover);
}






//CLASS COUNTING
function recalc(row) {
    if(row.nodeName=="TD"){row=row.parentNode}else if(row.nodeName=="DIV"){return 0}
    var sum=0;var pe=0;
    //console.log(row);
    for(var loop3=1;loop3<=6;loop3++){
        var short=row.childNodes[loop3];
        if(short.firstChild){
            switch(short.firstChild.title){
                case 'Physical Education':pe++;break;
                case 'Lab':sum+=0.5;break;
                default:sum++;
            }//close switch
        }//close if
    }//close for loop
    if(pe>0){sum+="+"+pe+"PE"}
    row.lastChild.innerHTML=sum;
}



var code=document.getElementById("console").firstChild;

//CONSOLE
var messCount=2;
code.removeChild(code.firstChild);
code.removeChild(code.lastChild);

var message;
function throwMessage(text,type) {
    message=document.createElement("div");
    message.innerHTML=text+".";
    message.className=type;
    code.appendChild(message);
    messCount++;
    if(messCount==17){code.removeChild(code.firstChild);messCount--}
}




//ALTERNATION
// STL left:0-->-100%
// 3 right:0-->100%
// 2 left:100%-->0
// posx:0-->100

var shift=1;var posx=0;

var int,sched2,sched3,schedTabList;

function findShift(){// find and set shift
    switch(posx){
        case 100:shift=-2;int=setInterval(move,10);break;
        case 0:shift=2;int=setInterval(move,10);break;
    }
}

//var start=0;var end=0;
function move(){
    posx+=shift;
    schedTabList.style.left=window.innerWidth*(-posx/100)+"px";
    sched3.style.right=window.innerWidth*(posx/100)+"px";
    sched2.style.left=window.innerWidth*(1-posx/100)+"px";
    if(posx===0 || posx==100){clearInterval(int)}
}













var titles=["African and Afro-American Studies", "American Studies", "Anthropology", "Arabic Language and Literature", "Biochemistry", 
"Biochemistry and Biophysics", "Biological Physics", "Biology", "Business", "Chemistry", "Chinese", "Classical Studies", "Comparative Humanities", 
"Comparative Literature and Culture", "Computer Science", "East Asian Studies", "Economics", "Education", "English", "English as a Second Language", 
"Environmental Studies", "European Cultural Studies", "Film, Television and Interactive Media", "Fine Arts", "First Year Seminars (FYS)", 
"French and Francophone Studies", "Genetic Counseling", "German Studies", "Global Studies", "Greek", "Health: Science, Society, and Policy", 
"Hebrew", "Hispanic Studies", "History", "History of Ideas", "Hornstein Jewish Professional Leadership Program", "International Business School", 
"International and Global Studies", "Internship", "Islamic and Middle Eastern Studies", "Italian Studies", "Japanese", "Journalism", "Korean", 
"Language and Linguistics", "Latin", "Latin American and Latino Studies", "Legal Studies", "Mathematics", "Medieval and Renaissance Studies", 
"Molecular and Cell Biology", "Music", "Near Eastern and Judaic Studies", "Neuroscience", "Peace, Conflict, and Coexistence Studies", "Philosophy", 
"Physical Education", "Physics", "Politics", "Postbaccalaureate Premedical Studies", "Psychology", "Quantitative Biology", "Religious Studies", 
"Russian Studies", "Sexuality and Queer Studies", "Social Justice and Social Policy", "Sociology", "South Asian Studies", "Theater Arts", 
"University Writing (COMP and UWS)", "Women's and Gender Studies", "Yiddish"];

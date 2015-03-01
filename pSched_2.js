/**
jQuery,JSON,Parse
Shorts, Auto, Cloud & JSON, Tab manipulation
*/


//cell_1     cell01-->cell76      cell_7
//          8 rows,6 cols

//SHORTS
var currentTabDisp=$("#currentTabDisp")[0];
var saver=$("#saver")[0];
var schedChart=$("#schedChart")[0];
var schedTabAdd=$("#schedTabAdd")[0];
var schedTabList=$("#schedTabList")[0];
var tabTotal=0;
var x;//attributes,_hashedJSON,changed,_serverData
var origtd;//mobile not officially removed until dropped,so must recalc upon drop
var Parse;
var bay,bay2,clear;//bay_3.js
var isLab;//quant_1.js

var recalc,throwMessage;

var gapLate=document.createElement("div");gapLate.style.height="29px";
var timeLate=document.createElement("i");timeLate.style.fontSize="12px";
var tabLate=document.createElement("div");tabLate.className="schedTab";
var late=function(){loadTab(this)};
var mobileLate=document.createElement("div");mobileLate.setAttribute("draggable","true");
	mobileLate.setAttribute("ondragstart","set(event);origtd=this.parentNode");
	mobileLate.setAttribute("style","padding:5px;width:80px;text-align:center");



//AUTO

schedChart.innerHTML="";
for(var loop8=0;loop8<=10;loop8++){//create 11 rows of 8 (6 for classes)
    var row=document.createElement("tr");
    row.appendChild(document.createElement("td"));//SEM
    
    //CLASSES
    for(var loop2=1;loop2<=6;loop2++){
        var dat=document.createElement("td");
        dat.id="cell"+loop8+loop2;
        dat.setAttribute("ondragover","prev(event)");
        dat.setAttribute("ondrop","get(event);recalc(origtd);recalc(this)");
        dat.style.minWidth="80px";
        row.appendChild(dat);
    }
    row.appendChild(document.createElement("td"));//CALC
    schedChart.appendChild(row);
    
    //LABEL
    if(loop8%3==2){var str="Summer "+(loop8+1)/3}
    else{str="Sem "+(loop8-Math.floor(loop8/3)+1)}
    schedChart.childNodes[loop8].firstChild.textContent=str;
}




//toCloud,fromCloud,encrypt,decrypt
function fromCloud(){
    for(var loop1=1;loop1<=x.scheds.length-1;loop1++){
        var name=x.names[loop1];
        var time=x.times[loop1];

        var tabelem=tabLate.cloneNode();
        tabelem.innerHTML=name;
        tabelem.onclick=late;
        var timeelem=timeLate.cloneNode();
        timeelem.innerHTML=time;

        tabelem.appendChild(document.createElement("br"));
        tabelem.appendChild(timeelem);
        schedTabList.insertBefore(tabelem,schedTabAdd);
        schedTabList.insertBefore(gapLate.cloneNode(),schedTabAdd);
        tabTotal++;
	}
}

function toCloud(){
    Parse.User.current().save();
    throwMessage("All of your tabs have been sent to the cloud","chappy");
}

function encrypt(){//Sched state-->x.scheds[num]
var y=[];
for(var loop5=0;loop5<=10;loop5++){//row
    var z=[];
    for(var loop4=1;loop4<=6;loop4++){//cell
        var iffy=document.getElementById("cell"+loop5+loop4).firstChild;
        if(iffy){z.push(iffy.textContent)}else{z.push("")}
    }
    y.push(z);
}
return y;
}

function decrypt(num){//x.scheds[num]-->sched state
console.log(x.scheds[num]);
for(var loop6=0;loop6<=10;loop6++){//row
    for(var loop7=0;loop7<=5;loop7++){//cell
        var short=x.scheds[num][loop6][loop7];
        if(x.scheds[num][loop6][loop7]){
            var div=mobileLate.cloneNode();
            div.id="mobile"+loop6+loop7;
            div.className=short.split(" ")[0];

            var shorter=short.split(" ")[0];
            if(isLab(short)){div.title="Lab"}
            else if(shorter=="PE"){div.title="Physical Education"}
            div.textContent=short;
            //var ind=short.indexOf("#");
            //if(ind>-1){div.textContent=short.substring(0,ind);div.title=short.substring(ind+1)}else{div.textContent=short}// "Chem 25a" or "Chem 29a#Lab"
            $("#cell"+loop6+(loop7+1)).html(div);
        }else{$("#cell"+loop6+(loop7+1)).html("")}
    }//loop7
    recalc(schedChart.childNodes[loop6]);
}//loop6
}//close decrypt

var transferId;
function set(ev) {//ondragstart
    ev.dataTransfer.setData("Text",ev.target.id);
    transferId=ev.srcElement.id;
}
function prev(ev) {ev.preventDefault()}//ondragover
function get(ev) {//ondrop
	var data=ev.dataTransfer.getData("Text");
	var temp=(ev.target.id.charAt(0)=="c")?ev.target:ev.target.parentNode;// prevents nested mobiles
	temp.appendChild(document.getElementById(data));
	ev.preventDefault();
	saver.style.opacity=1.0;
	if(countDivs(bay)>countDivs(bay2)){
        var tempid=transferId.substring(9);
        clear($("#baymo"+tempid)[0]);
	}
}
function countDivs(elem){return elem.getElementsByTagName("div").length}

function getTrash(ev){//ondrop trashcan
    var data=ev.dataTransfer.getData("Text");
    var elem=document.getElementById(data);
    elem.parentNode.removeChild(elem);
    ev.preventDefault();
    saver.style.opacity=1.0;
}









//ADD,LOAD,SAVE,DELETE
var currentTab="Original";
var previousTab="Original";

function addTab(){
	if(tabTotal<6){
		var name=prompt("Enter a name for the new tab.");
        while((x.names.indexOf(name)>-1)||(name==="")){
			if(name===""){name=prompt("Whoops! You didn't enter a name. Try again.")}
			else{name=prompt("That name is taken. Please enter another name for the new tab.")}	
		}//close while
		if(name){
            var time=Date().slice(4,24);
            x.scheds.push(encrypt());
            x.names.push(name);
            x.times.push(time);
            var tabelem=tabLate.cloneNode();
            tabelem.innerHTML=name;
            tabelem.onclick=late;
            var timeelem=timeLate.cloneNode();
            timeelem.innerHTML=time;
	
            tabelem.appendChild(document.createElement("br"));
            tabelem.appendChild(timeelem);
            schedTabList.insertBefore(tabelem,schedTabAdd);
            schedTabList.insertBefore(gapLate.cloneNode(),schedTabAdd);
            throwMessage("Tab "+name+" has been stored","chappy");
            tabTotal++;
            
            //saveTab(tabTotal-1);
		}//close if(name)
		else{throwMessage("A tab was not added","ctech")}
	}//close if(tabTotal<6)
	else{throwMessage("Don't be greedy!","ctech")}
}//func

function deleteTab() {//pop current-->x.scheds[num], pop tab
    if(currentTab!="Original"){
        var num=x.names.indexOf(currentTab);
        x.scheds.splice(num,1);
        x.names.splice(num,1);
        x.times.splice(num,1);
        var badelem=document.getElementsByClassName("schedTab")[num];
        schedTabList.removeChild(badelem.nextSibling);
        schedTabList.removeChild(badelem);
        tabTotal--;
        throwMessage("Tab "+currentTab+" deleted successfully","chappy");
        //load prev,orig is prev
        loadTab(previousTab);
        previousTab="Original";
    }else{throwMessage("Hey! You can't delete the original! I made that","ctech")}
}

function loadTab(name) {//tabelem-->name or just name
    if(typeof name=="object"){name=name.innerHTML.split("<br>")[0]}
    var num=x.names.indexOf(name);
	if(name=="Original"){saver.onclick=addTab;saver.style.opacity=0.3}else{saver.onclick=function(){saveTab(num)}}
	previousTab=currentTab;
	currentTab=name;
	
	if(currentTab!=previousTab){
        decrypt(num);
        throwMessage("Tab "+currentTab+" loaded successfully","chappy");
        currentTabDisp.innerHTML=currentTab;
        saver.style.opacity=0.3;
    }
}

function saveTab(num) {//change x.scheds[num], update tab time
    x.scheds[num]=encrypt(num);
    throwMessage("Tab "+currentTab+" has been saved","chappy");
    saver.style.opacity=0.3;
    document.getElementsByClassName("schedTab")[num].childNodes[2].innerHTML=Date().slice(4,24);
}





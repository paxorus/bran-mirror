/*
Scrip (Schedule of Classes Screen Scrape)
Visit target domain. In console:
https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
https://www.parsecdn.com/js/parse-1.2.12.min.js
*/

var Parse,html,courseArray;
Parse.initialize("r0raWxihobjYXDFyboAXLv6Shv6HyGsaFpKYlTWk", "ebigHVj8Fcy6mcUXXs4Prl78yvAY8x67BiL6wXGj");
var Department2=Parse.Object.extend("Summer2014");//SEASONAL CHANGE
var dep2=[];

var body=document.getElementsByTagName("body")[0];
var urls=["100", "200", "300", "400", "450", "500", "510", "600", "700", "810", 
"900", "1000", "1100", "1200", "1225", "1250", "1300", "1400", "1425", "1500", 
"1600", "1700", "1800", "1850", "1900", "2000", "2100", "2300", "8000", "2400", 
"2450", "2500", "2525", "2535", "2550", "2700", "2800", "2900", "6600", "3000", 
"3100", "3200", "3300", "3400", "3600", "3700", "3900", "4000", "4100", "4200", 
"4225", "4235", "4600", "4250", "4300", "4400", "4700", "4800", "4900", "5000", 
"5100", "5200", "5300", "5400", "5500", "5600", "5700", "5800", "5900", "5950", 
"6000", "6100", "6300", "6325", "6350", "6400", "6500", "6550", "6625", "6675", 
"6700", "7050", "6900", "7000"];

body.innerHTML="";
function toLink(num){return "http://www.brandeis.edu/registrar/schedule/classes/2014/Summer/"+num+"/all"}//SEASONAL CHANGE
var portal=document.createElement("iframe");
portal.src=toLink(100);
portal.scrolling="no";
portal.setAttribute("frameborder","0");
portal.width="0";
portal.height="0";
body.appendChild(portal);
//setTimeout(kickoff,2000);
var depCount=1;
var deps=[];
portal.onload=depPause;


function depPause(){//start with 200,don't run until portal finished loading
    html=portal.contentDocument.getElementById("classes-list");
    if(html){kickoff()}
    portal.setAttribute("src",toLink(urls[parseInt(depCount,10)]));
    if(depCount<=urls.length-1){console.log("About to run for department "+(++depCount)+" of 84.")}
    else{portal.onload=function(){};toCloud()}
}

function kickoff(){
    //html=portal.contentDocument.getElementById("classes-list");
    courseArray=[];
    for(var i=0;i<=html.lastChild.childNodes.length-1;i++){
        var elem=html.lastChild.childNodes[i];
        if((elem.className)&&(elem.className.substring(0,3))){getCourse(elem)}
    }
    console.log(courseArray);
    var temp=new Department(depCount,portal.contentDocument.getElementsByClassName("subject")[0].innerText,courseArray);
    deps.push(temp);
}


function toCloud(){

    for(var x=0;x<=deps.length-1;x++){
        dep2.push(new Department2());
        var short=dep2[dep2.length-1];
        short.set("no",deps[x].no);
        short.set("title",deps[x].title);
        short.set("courseArray",deps[x].courseArray);
        short.save(null);
    }
}






//DEPARTMENT
function Department(no,title,courseArray){
    this.no=no;
    this.title=title;
    this.courseArray=courseArray;
}

//COURSE
function Course(arr){
    this.no=arr[0];
    this.short=arr[1];this.info=arr[2];
    this.title=arr[3];this.req=arr[4];this.note=arr[5];
    this.logi=arr[6];
    this.status=arr[7];
    this.size=arr[8];
    this.teach=arr[9];
}




function abridge(str){
    var newstr="";
    for(var j=0;j<=str.length-1;j++){
        var lett=str.charAt(j);
        if(("\n"!=lett)&&(" "!=lett)){newstr+=lett}
    }
    return newstr;
}

function getReqs(elem){
    var reqs="";
    for(var loop3=5;loop3<=elem.childNodes.length-3;loop3+=2){//start from 5,+=2 until length-3
        reqs+=abridge(elem.childNodes[loop3].innerHTML)+" ";
    }
    return reqs;
}

function getLogi(elem){
    var logi="";
    for(var i=0;i<=elem.childNodes.length-1;i++){
        if(elem.childNodes[i].data){logi+=abridge(elem.childNodes[i].data)}
    }
    return logi;
}

//var course=[];
function getCourse(elem){
    console.log(elem);
    //[no,short,info,title,req,note,logi,status,size,teach]
    var course=[];
    course.push(abridge(elem.childNodes[1].innerHTML));//no
    course.push(elem.childNodes[3].childNodes[1].name);//short
    course.push(elem.childNodes[3].childNodes[1].href.substring(18,80));//info
    course.push(elem.childNodes[5].childNodes[1].innerHTML);//title
    course.push(getReqs(elem.childNodes[5]));//req
    course.push("");//note
    if(elem.childNodes[7].childNodes[2]){course.push(getLogi(elem.childNodes[7]))}//logi
    course.push(abridge(elem.childNodes[9].childNodes[1].innerHTML));//status
    course.push(abridge(elem.childNodes[9].childNodes[4].data));//size
    course.push(abridge(elem.childNodes[11].childNodes[1].innerHTML));//teach
    console.log(JSON.stringify(course));
    courseArray.push(new Course(course));
}

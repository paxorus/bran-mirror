//bug: switching away should place all mobiles back in bay
//clicking trashcan can bring back up to 5 classes
//should work for different resolutions
//no "you are currently viewing", change color of current tab

var sched3=document.getElementById("sched3");
var sched2=document.getElementById("sched2");
var schedTabList=document.getElementById("schedTabList");
var deps=document.getElementById("deps");
var courseArr=document.getElementById("courseArr");
var _ADF=document.getElementById("_ADF");
var bay2=$("#bay2")[0];
var bay=$("#bay")[0];

var isLab;//quant_1.js
var uniqueCustomMobile=0;
var titles;//quant_1.js
var recalc;//quant_1.js
var mobileLate;//core_2.js
var courseArray;
var Parse;//parse.min.js
var query=new Parse.Query(Parse.Object.extend("Fall2014"));

//seasonify("Fall 2014");
var bayArr=[];
var selectedDep;
var selectedCou;
var isPE;

var classBlock=document.createElement("div");
classBlock.style.backgroundColor="#08F";
classBlock.style.width="150px";
classBlock.style.height="22px";
classBlock.style.color="#FFF";
classBlock.style.padding="5px";
classBlock.style.styleFloat="left";

var svg=document.createElement("img");
svg.src="dropSec.svg";
svg.width="25";
svg.height="22";
svg.style.cssFloat="right";

/**
tapCloud-->depToCourse-->courseToSections-->secToBay
schedReady on other side,drag to trash on other side,X on selection side
*/


//AUTO
//clickable departments
for(var i=0;i<=titles.length-1;i++){
    var temp=document.createElement("div");
    temp.className="_08F";temp.textContent=titles[i];temp.setAttribute("onclick","tapCloud(this)");
    deps.appendChild(temp);
}
selectedDep=deps.firstChild;



function tapCloud(elem){
    selectedDep.style.backgroundColor="#08F";
    selectedDep=elem;
    isPE=(selectedDep.textContent=="Physical Education");
    //console.log(selectedDep.textContent);
    selectedDep.style.backgroundColor="#0C4";
    query.equalTo("title",elem.innerText);
    query.first({success:function(incoming){
        if(incoming){
            courseArray=incoming.get('courseArray');
            depToCourse();
        }else{
            courseArr.innerHTML="";
            _ADF.innerHTML="";
        }
    }});
}

function depToCourse(){//load distinct courses from courseArray[]
    courseArr.innerHTML="";
    for(var loop1=0;loop1<=courseArray.length-1;loop1++){
        if((loop1===0)||(courseArray[loop1].short!=courseArray[loop1-1].short)){//if first or distinct from previous
            var temp=document.createElement("div");
            temp.className="_5AF";temp.textContent=courseArray[loop1].short+": "+courseArray[loop1].title;temp.dataset.no=loop1;
            temp.setAttribute("onclick","courseToSections(this)");
            courseArr.appendChild(temp);
        }//close if
    }//close loop1
    selectedCou=courseArr.firstChild;
}//close depToCourse

function courseToSections(elem){//upon clicking long bar
    selectedCou.style.backgroundColor="#5AF";
    selectedCou=elem;
    var id=elem.dataset.no;
    selectedCou.style.backgroundColor="#0C4";
    var orig=courseArray[id];
    _ADF.innerHTML=orig.short+": "+orig.title;
    _ADF.innerHTML+="<br>Professor: "+orig.teach+"<br>Fulfills: "+orig.req;
    var url="http://registrar-prod.unet.brandeis.edu/registrar/schedule/"+orig.info;
    _ADF.innerHTML+="<br><a href='"+url+"' target='_blank'>See more</a><br><br>";

    var idplus=id;
    do{//write up section from section based on other and idplus
        var other=courseArray[idplus];
        var mobi=classBlock.cloneNode();
        mobi.title=other.title;mobi.textContent="Add "+other.no;mobi.id="cou"+(idplus-id+1);
        mobi.dataset.no=idplus-id+1;mobi.dataset.short=other.short;
        mobi.setAttribute("onclick","secToBay(this)");
        _ADF.appendChild(mobi);
        _ADF.innerHTML+=other.status+", "+other.size+"<br>Logistics: "+other.logi+"<br>";
    }while(courseArray[++idplus].short==orig.short);//while identical course
}

function secToBay(orig){//upon selecting class section, orig=section div
    var naam=orig.dataset.short;

    //MOBI for BAY
    var mobi=classBlock.cloneNode();
    mobi.textContent=naam+" "+orig.dataset.no;//BCHM 100A 1
    mobi.id="baymo"+uniqueCustomMobile;
    var cross=svg.cloneNode();
    cross.onclick=function(){secDestroy(this.parentNode.id)};
    mobi.appendChild(cross);
    
    //MOBI2 for BAY 2
    var mobi2=mobileLate.cloneNode();
    mobi2.textContent=naam[0]+naam.substring(1).toLowerCase();//Bchm 100a
    mobi2.className=mobi2.textContent.split(" ")[0];//Bchm
    mobi2.id="mobileBay"+uniqueCustomMobile++;//"mobileBay0"
    if(isLab.indexOf(mobi2.textContent)>=0){mobi2.title="Lab"}
    else if(isPE){mobi2.title="Physical Education"}
    
    bayArr.push(mobi.textContent);
    bay.appendChild(mobi);
    bay2.appendChild(mobi2);

}


function secDestroy(id){//from bayArr,bay,bay2
    if(id[0]=="m"){id=id.substring(9)}else{id=id.substring(5)} //bay2 id=mobileBayX, bay id=baymoX
    var tempTd=$("#mobileBay"+id)[0].parentNode;
    clear($("#mobileBay"+id)[0]);
    recalc(tempTd);
    clear($("#baymo"+id)[0]);
    bayArr.splice(bayArr.indexOf(),1);
}

function clear(domElem){
    domElem.parentNode.removeChild(domElem);
}

function seasonify(season){//given text content
    season=season.substring(0,season.length-5)+season.substring(season.length-4);
    var Department2=Parse.Object.extend(season);
    query=new Parse.Query(Department2);
    tapCloud(selectedDep);
}



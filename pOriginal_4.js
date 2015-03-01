var output=document.getElementById("output");
var M={};//object of Major objects
function Major(static){
    this.static=static;// array of statics
    this.groups=[];
}

M.biolba=new Major(["Biol block","Chem1 block","Chem2 block","Bio 16a"]);
M.biolba.writeGroups=function(){
    //1 quantitative, >=3 biology, <=2 gen sci
    this.groups.push(["Biol 51a","Biol 107a","Biol 135b","Hssp 100b","Nbio 136b","Psyc 51a","Cosi:10","Math:10","Qbio"]);
    this.groups.push(["Biol 17b","Anth 116a","Bchm 100a","Bchm 155b","Bchm 172a","Cosi 178a","Biol:23","Bibc","Cbio","Nbio","Qbio"]);
    this.groups.push(["Bchm:10","Chem:10","Cosi:10","Math:10","Phys:10"]);
    this.guide=["0","1","1","1","1+2","1+2"];
};

M.bchmbs=new Major(["Biol block","Chem1 block","Chem2 block","Phys2 block","Bchm 100a","Bchm 101a","Bchm 103b","Bchm 104b"]);
M.bchmbs.writeGroups=function(){
    //Bchm 104a or Chem 141a, 1 bchm elec
    this.groups.push(["Bchm 104a","Chem 141a"]);
    this.groups.push(["Bchm"]);
    this.guide=["0","1"];
};

M.cosiba=new Major(["Cosi 11a","Cosi 12b","Cosi 21a","Cosi 29a","Cosi 131a"]);
M.cosiba.writeGroups=function(){
    //1 group A, 1 group B, 2 any
    this.groups.push(["101a","111a","112a","113b","114b","118a","125a","132a","133b","134a","137b","139a","140b","178a","215a","216a","217b","235a","236b"]);
    this.groups.push(["120a", "123a", "127b", "128a", "132b", "135b", "146a", "147a", "175a", "180a", "190a", "228a"]);
    this.groups.push(["Cosi"]);
    this.guide=["0","1","2","2"];
};


var stat;
function compile(m1,m2){
    m1=M[m1];
    m2=M[m2];

    stat=m1.static.concat(m2.static);
    for(var i=stat.length-1;i>=m1.static.length;i--){
        if(m1.static.indexOf(stat[i])>=0){
            stat.splice(i,1);
        }
    }
    console.log("Statics: "+stat);
    m1.writeGroups();m2.writeGroups();
    //var elec1=compareSE(m1.static,m2.groups[0]);
    var elec2;
    elec2=compareSE(m2.static,m1.groups[0]);    console.log(elec2);
    elec2=compareSE(m2.static,m1.groups[1]);    console.log(elec2);
    elec2=compareSE(m2.static,m1.groups[2]);    console.log(elec2);
    

}

function compareSE(stat,elec){// find and return all matchups

    var mutable=stat.concat();//shrinks if single used,less and less to search through each time
    var mutShorts=stat.concat();
    var final=elec.concat();
    var matches=[];
    
    for(var j=0;j<mutShorts.length;j++){
        var temp=mutShorts[j];
        if(temp.substring(temp.length-3,temp.length)!="ock"){// is a single
            mutShorts[j]=mutShorts[j].split(" ")[0];
        }
    }

    for(var i=final.length-1;i>=0;i--){// for each elec in final
        var ref=final[i];
        if(ref.indexOf(":")==-1){// ref is "Bchm 100a" or "Bchm"
            var ind=((ref.indexOf(" ")>=0)?mutable:mutShorts).indexOf(ref);// look through the proper array
            if(ind>=0){
                mutShorts.splice(ind,1);
                matches.push(mutable.splice(ind,1));
                matches.push(final.splice(i,1));
            }
        }else{// ref is "Bchm:100"
            var split=ref.split(":");
            var found=false;
            var k=0;// loop through mutShorts/mutable for valid limit
            while(!found){
                //console.log(ref);
                if(mutShorts[k]==split[0]){
                    var statShort=mutable[k].split(" ")[1];// "100a"
                    if(parseInt(statShort,10)>=parseInt(split[1],10)){
                        found=true;
                        mutShorts.splice(k,1);
                        matches.push(mutable.splice(k,1));
                        matches.push(final.splice(i,1));
                    }
                }
                found=(++k==mutable.length)?true:found;// stop looking if at end of array
            }// close while
        }// close if
    }// close loop
    return matches;
}


function compareEE(){}

//compile(M["biolba"],M["bchmbs"]);

//Notations:
//m1.static=[],easily subtract crosses,blocks or singles
//m1.elec(),shorts or limits or singles,may be more than one from an elec group


// biolba,bchmbs-->compile shared statics,compile
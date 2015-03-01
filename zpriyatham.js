var a="I am losing sleep over something, and it's not sig figs. I am having personal issues with my TAs. I know they have a grudge on me and they're taking it out on my grades which is irritating because I feel now my grade is not completely my hands. I ask reasonably why I lost points. I did this last semester. I questioned Ramyaa and Jessica, and they gave me fantastic feedback. By the end of the semester, I was confident that I was going to get a 100 on each component of the lab.";
var b="that was the most insincerest bullshit i have ever heard. Don't you realize that I like genuine responses. Clearly I was not good enough, or some one else was better. Can I know what qualities they possessed I didn't? Jesus Christ, I pitch more ideas, am genuinely passionate. I have tried to reach out to SASA on so many times this year and you guys do is dilly dally around. What could/should have I done? I'm still fuming. It stings every time. It really does. What events have you put on this semester? Desi fest where the food ran out. Some charity for the blind. That's cool. Why can't you guys actually put on more Indian events. Don't implement my ideas without consulting me and call them your own. Seriously. I'm going to single-handedly put on some Indian events, and it will not be SASA affiliated. It's complete BS I don't even know how disappointed I am. It's not even that big of a deal. Assistant to events-coordinator? That's just for namesake. I want a goddamn role. Clearly, you aren't wiling to dole them out because yall are power hogs but I'll find something to do. I'm out.";
var c="This December break, I helped build houses alongside Hondurans through Global Brigades. I specifically helped construct the floor which involved brushing cement in a 1 inch by 1 inch square and then repeating this process until I finished an 8 foot by 8 foot square. It was exhausting but could have been quite relaxing had I taken the simpler, albeit much longer approach or sitting and dabbing. Instead, squatted for hours on end and crouched in awkward positions in order to fill in tiny cracks or holes and to complete the job more efficiently I also had to help with the preparation of the mixture I was brushing across the floor. I could have just used a shovel to make the mixture but instead I used my hands and feet even though I knew very well that it would take a lot more than a shower to remove it. I did this for two reasons. Using hands and feet, you can tell if the mixture is the proper consistency because you literally have better feel plus the floor will be smoother for the natives who walk barefoot on it. I also did it because it made the Hondurans, who were using their hands and feet, happier. It was a bonding experience that also had some function. I do not mind getting dirty or uncomfortable for the sake of a positive outcome. I realize that the best outcomes come only when I'm willing to make myself as uncomfortable as possible.";
var d="Being a CA is very much in line with my lifestyle. I am very schedule-oriented, have early morning classes, and go to sleep fairly punctually. My lifestyle would hopefully set an example for my residents to follow without having to lecture them on what is right and wrong. That being said, I feel like because of my heavy schedule, I would spend a lot of time in the library or outside of my dorm, which would be a problem because my residents could not access me. I would prevent this from becoming an issue because I would make myself accessible as possible by giving my cell number, facebook, etc. for them to talk to me if they ever need me. I would schedule monthly appointments because I want to my residents to use me. I want everyone to have the smoothest transition possible.";
var e="I don't mind changing my habits for you...What I mind is you still not willing, after making those adjustments. We can discuss money later, but if it's between you leaving or you not paying and staying, I'd prefer the latter one 8 days in a week. We do a lot of activities together. It makes sense to live together because we can coordinate even smoother. Think about it. Some requirements: --can't have food laying around; I don't want to deal with unforeseen crumbs. --need closet and drawer space for clothes. --have to talk through me about roommate issues with others.";
var f="I am extremely grateful you were my TA last semester. I had done labs in highschool, but the truth is I came in not knowing many basic procedures which you were always there to help me with. I now peruse each lab manual so as to not forget chemicals or equipment. In the lab, I write down everything including the colors and times. I make sure to supply specific values in my abstracts and discuss why my experimental values deviated. I'll admit, I may not have been the easiest student to handle, but with your guidance in class, I have become a more conscious student.";
var all=[a,b,c,d,e,f];


/*
For each sentence of input, chance of translocating from common word to up to punctuation from one of six "pri"
*/

//push nonnegative indices
function getAll(str,whole){// 
	var indices=[];var rel=0;
	str=str.toLowerCase();whole=whole.toLowerCase();
	while(true){
		var ind=whole.indexOf(str);
		if(ind==-1){console.log(JSON.stringify(indices));return indices;}
		indices.push(rel+ind);
		rel+=ind+str.length;
		whole=whole.substring(ind+str.length);
	}
}

function getAllPunct(str){// return indices of all punctuation in text
    var indices=[];
    for(var loop1=0;loop1<=str.length-1;loop1++){
        if(str[loop1]=="." || str[loop1]=="?" || str[loop1]=="!"){indices.push(loop1)}
    }
    return indices;
}

function getSentences(str,array){//
    var sentences=[];
    var ind=0;
    for(var each in array){
        sentences.push(str.substring(ind,array[each]+1));
        ind=array[each]+2;
    }
    return sentences;
}



var textSent;// sentences for final product

function main(text){
    var pri=all[Math.floor(Math.random()*all.length)];
    
	var priPunct=getAllPunct(pri);
	var textPunct=getAllPunct(text);
	textSent=getSentences(text,textPunct);
	
	var ind=0;
	for(var i=0;i<=textSent.length-1;i++){//for each sentence in text
		console.log("Before (text): "+textSent[i]);
		
		var words=textSent[i].split(" ");
		var j=0;
		var keepGoing=true;
		var found=false;
		
		do{
			if(pri.indexOf(words[j])>-1){
				if(Math.random()*5<4){
					keepGoing=false;
					found=true;
				}
			}
			j++;
			if(j==words.length){keepGoing=false}
		}while(keepGoing);
		
		if(found){

			var matches=getAll(" "+words[j-1]+" ",pri);
			matches=matches.concat(getAll(words[j-1]+".",pri));
			matches=matches.concat(getAll(words[j-1]+"!",pri));
			matches=matches.concat(getAll(words[j-1]+"?",pri));			
            // words[j-1] is "am"
			// matches is [332,535,654,etc]
			var start=matches[Math.floor(Math.random()*matches.length)]+2+words[j-1].length;//having personal...
			var end=0;while(start>priPunct[end]){end++}//...!
			textSent[i]="";
			for(var k=0;k<j;k++){textSent[i]+=words[k]+" "}//I_am_
			textSent[i]+=pri.substring(start,priPunct[end]+1);//having personal...!
		}//close if
		ind=textPunct[i]+2;
	}//close for
    return compile(textSent);
}


function compile(arr){
    var str="";
    for(var each in arr){
        str+=arr[each]+" ";
    }
    return str;
}




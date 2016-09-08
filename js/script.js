$(document).ready(function(){
    //button click listeners     
    $(".start").click(function(){startTimer(false)});
    $(".stop").click(function(){stopTimer()});
    $(".reset").click(function(){resetTimer("session")});
    $(".break-minus").click(function(){breakChange($(this))});
    $(".break-plus").click(function(){breakChange($(this))});
    $(".session-minus").click(function(){sessionChange($(this))});
    $(".session-plus").click(function(){sessionChange($(this))});
    
});

var timeInterval,
    breakInterval,
    started = false,
    timerDisplay = document.querySelector(".timer"),
    sessionElement = document.querySelector(".session"),
    breakElement = document.querySelector(".break");

function startTimer(breakFlag){
    //grab time from DOM and convert into seconds
    var start = Date.now(),
        time = timerDisplay.textContent,
        min = parseInt(time.match(/^(\d+)/)),
        sec = parseInt(time.match(/(\d+)$/)),
        timeInSec = min * 60 + sec,
        diff, progress;
    
    renderProgress("reset");
    if(!started){
        started = true;
        timer(timeInSec, start, breakFlag);
        timeInterval = setInterval(timer, 1000, timeInSec, start, breakFlag);
    }
}

function timer(timeInSec, start, breakFlag) {
    // "| 0 truncates any fractional digits
    diff = timeInSec - (((Date.now() - start) / 1000) | 0);
    progress = 100 * ((Date.now() - start) / 1000)/timeInSec;
    min = diff / 60 | 0;
    sec = diff - min * 60; // faster than diff % 60 and elimates need for truncation.
    min = (min < 10) ? "0" + min : min;
    sec = (sec < 10) ? "0" + sec : sec;
    timerDisplay.textContent = min + ":" + sec;
    
    if(!breakFlag){
        renderProgress(progress);   
    } else {
        renderProgress(-progress);
    }
    
    if(diff<= 0){
        clearInterval(timeInterval);
        breakFlag = !breakFlag;
        started = false;
        
        if(breakFlag){
            console.log("break time!");
            resetTimer("break");
        } else {
            console.log("WORK time!");
            resetTimer("session");
        }
        
        startTimer(breakFlag);
    }
}


function stopTimer(){
    clearInterval(timeInterval);
    started = false;
}


function resetTimer(type){
    if(started){
        return;
    }
    if(type === "session"){
        renderProgress("reset");
        var sessionLength = sessionElement.textContent;
        timerDisplay.textContent = sessionLength +":00";
        return sessionLength*60;
    } else if (type === "break"){
        renderProgress("reset");
        var breakLength = breakElement.textContent;
        timerDisplay.textContent = breakLength +":00";
        return breakLength*60;
    }
    
}

function breakChange(that){
    var breakLength = breakElement.textContent;
    breakLength = parseInt(breakLength);
    if(that[0].className === "break-minus"){
        if(breakLength === 1){
            return;
        }
        breakLength = --breakLength;
    } else if (that[0].className === "break-plus"){
        breakLength = ++breakLength;
    }
    breakElement.textContent = breakLength;
}

function sessionChange(that){
    var sessionLength = sessionElement.textContent;
    sessionLength = parseInt(sessionLength);
    if(that[0].className === "session-minus"){
        if(sessionLength === 1){
            return;
        }
        sessionLength = --sessionLength;
    } else if (that[0].className === "session-plus"){
        sessionLength = ++sessionLength;
    }
    sessionElement.textContent = sessionLength;
    //change timer
    timerDisplay.textContent = sessionLength +":00";
}

//loader
function renderProgress(progress)
{
    if(progress === "reset"){
        $(".animate-0-25-b").css("transform","");
        $(".animate-25-50-b").css("transform","");
        $(".animate-50-75-b").css("transform","");
        $(".animate-75-100-b").css("transform","");
        return;
    }
    
    progress = Math.floor(progress);
    
    // ======================NEGATIVE ROTATION===========================
    if(progress >= -100 && progress<-75){
        var angle = -90 + (progress/100)*360;
        $(".animate-0-25-b").css("transform","rotate("+angle+"deg)");
    }
    else if(progress>=-75 && progress<-50){
        var angle = -90 + ((progress-25)/100)*360;
        $(".animate-0-25-b").css("transform","rotate(0deg)");
        $(".animate-25-50-b").css("transform","rotate("+angle+"deg)");
    }
    else if(progress>=-50 && progress<-25){
        var angle = -90 + ((progress-50)/100)*360;
        $(".animate-25-50-b, .animate-0-25-b").css("transform","rotate(0deg)");
        $(".animate-50-75-b").css("transform","rotate("+angle+"deg)");
    }
    else if(progress>=-25 && progress<0){
        var angle = -90 + ((progress-75)/100)*360;
        $(".animate-50-75-b, .animate-25-50-b, .animate-0-25-b")
                                              .css("transform","rotate(0deg)");
        $(".animate-75-100-b").css("transform","rotate("+angle+"deg)");
    }
    // ======================POSITIVE ROTATION===========================
    else if(progress >= 0 && progress<25){
        var angle = -90 + (progress/100)*360;
        $(".animate-0-25-b").css("transform","rotate("+angle+"deg)");
    }
    else if(progress>=25 && progress<50){
        var angle = -90 + ((progress-25)/100)*360;
        $(".animate-0-25-b").css("transform","rotate(0deg)");
        $(".animate-25-50-b").css("transform","rotate("+angle+"deg)");
    }
    else if(progress>=50 && progress<75){
        var angle = -90 + ((progress-50)/100)*360;
        $(".animate-25-50-b, .animate-0-25-b").css("transform","rotate(0deg)");
        $(".animate-50-75-b").css("transform","rotate("+angle+"deg)");
    }
    else if(progress>=75 && progress<=100){
        var angle = -90 + ((progress-75)/100)*360;
        $(".animate-50-75-b, .animate-25-50-b, .animate-0-25-b")
                                              .css("transform","rotate(0deg)");
        $(".animate-75-100-b").css("transform","rotate("+angle+"deg)");
    }
    $(".text").html(progress+"%");
}
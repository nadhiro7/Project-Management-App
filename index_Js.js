let sl = document.querySelectorAll('.eleslider');
let d = document.querySelectorAll('.dot');
function changeAct(k){
    for(let i = 0 ; i < sl.length ; i++)
        sl[i].classList.remove('active_2');
    for(j of d)
        j.classList.remove('active_3');
    sl[k].classList.add('active_2');
    d[k].classList.add('active_3');
}
function dotClick1(){
    changeAct(0);
}
function dotClick2(){
    changeAct(1);
}
function dotClick3(){
    changeAct(2);
}
function dotClick4(){
    changeAct(3);
}
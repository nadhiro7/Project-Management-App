
function dotClick1(){
    document.documentElement.style.setProperty('--prColor' , "#9c27b0");
    document.documentElement.style.setProperty('--btnBg', '#9b27b0a8');
    document.documentElement.style.setProperty('--brBtn', '#9b27b0e0');
}
function dotClick2(){
    document.documentElement.style.setProperty('--prColor' , "#1e2ba4");
    document.documentElement.style.setProperty('--btnBg', '#1e2ba4a8');
    document.documentElement.style.setProperty('--brBtn', '#1e2ba4e0');
}
function dotClick3(){
    document.documentElement.style.setProperty('--prColor' , "#e91e63");
    document.documentElement.style.setProperty('--btnBg', '#e91e63a8');
    document.documentElement.style.setProperty('--brBtn', '#e91e63e0');
}
function dotClick4(){
    document.documentElement.style.setProperty('--prColor' , "#ff5722");
    document.documentElement.style.setProperty('--btnBg', '#ff5722a8');
    document.documentElement.style.setProperty('--brBtn', '#ff5722e0');
}
let page1 = document.querySelector(".content");
let page2 = document.querySelector(".about");
let navbar = document.querySelectorAll("nav ul li a");
function pageAct(){
    page1.style.display = "none";
    page2.style.display = "none";
    for(let i = 0; i<navbar.length ; i++)
        navbar[i].classList.remove('active');
}
function navClick1(){
    pageAct();
    page1.style.display = "flex";
    navbar[0].classList.add('active');
}
function navClick2(){
    pageAct();
    page2.style.display = "flex";
    navbar[1].classList.add('active');
}
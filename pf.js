let bhtml = document.getElementsByClassName('btn')[0]
let bcss = document.getElementsByClassName('btn')[1]
let bjs = document.getElementsByClassName('btn')[2]
let bboot = document.getElementsByClassName('btn')[3]
let styhp = document.getElementsByClassName('card-body-js')[0]
let stycp = document.getElementsByClassName('card-body-js')[1]
let styjsp = document.getElementsByClassName('card-body-js')[2]
let stybp = document.getElementsByClassName('card-body-js')[3]
bhtml.addEventListener('click', function(){
    if(styhp.style.display === "inline-block"){
        styhp.style.display = "none"
    }
    else {
        styhp.style.display = "inline-block";
    }
});
bcss.addEventListener('click', function(){
     if(stycp.style.display === "inline-block"){
        stycp.style.display = "none"
    }
    else {
        stycp.style.display = "inline-block";
    }
})
bjs.addEventListener('click', function(){
    if(styjsp.style.display === "inline-block"){
        styjsp.style.display = "none"
    }
    else {
        styjsp.style.display = "inline-block";
    }
})
bboot.addEventListener('click', function(){
     if(stybp.style.display === "inline-block"){
        stybp.style.display = "none"
    }
    else {
        stybp.style.display = "inline-block";
    }
})

function revealSkillCards() {
    document.querySelectorAll('.skill-card').forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) {
            card.classList.add('visible');
        }
    });
}
// Toggle navbar glass effect on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Use IntersectionObserver for better performance
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // animate once
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-card').forEach(card => observer.observe(card));

window.addEventListener('load', revealSkillCards);

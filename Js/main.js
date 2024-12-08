const roundBox1 = document.querySelector('.information_one_section_round_box');
const nextButton1 = document.querySelector('.next');
const prevButton1 = document.querySelector('.prev');

let currentPosition1 = 0;
const moveAmount1 = 375;

function moveRightBox1() {
  if (currentPosition1 == 0) {
    currentPosition1 -= moveAmount1;
    roundBox1.style.transform = `translateX(${currentPosition1}px)`;
  }
}

function moveLeftBox1() {
  if (currentPosition1 == -375) {
    currentPosition1 += moveAmount1;
    roundBox1.style.transform = `translateX(${currentPosition1}px)`;
  }
}

nextButton1.addEventListener('click', moveRightBox1);
prevButton1.addEventListener('click', moveLeftBox1);

const counterElement = document.getElementById('counter');
const targetNumber = 30;
const startScrollPosition = 3200;
const duration = 1000;

let isAnimating = false;

window.addEventListener('scroll', () => {
  if (window.scrollY >= startScrollPosition && !isAnimating) {
    isAnimating = true;
    animateCounter();
  }
});

function animateCounter() {
  let currentNumber = 15;
  const increment = targetNumber / (duration / 16);

  const counterInterval = setInterval(() => {
    currentNumber += increment;

    if (currentNumber >= targetNumber) {
      currentNumber = targetNumber;
      clearInterval(counterInterval);
    }

    counterElement.textContent = Math.floor(currentNumber);
  }, 25);
}


const roundBox2 = document.querySelector('.information_three_section_round_box');
const nextButton2 = document.querySelector('.right');
const prevButton2 = document.querySelector('.left');

let currentPosition2 = 0;
const moveAmount2 = 375;

function moveRightBox2() {
  if (currentPosition2 == 0) {
    currentPosition2 -= moveAmount2;
    roundBox2.style.transform = `translateX(${currentPosition2}px)`;
  }
}

function moveLeftBox2() {
  if (currentPosition2 == -375) {
    currentPosition2 += moveAmount2;
    roundBox2.style.transform = `translateX(${currentPosition2}px)`;
  }
}

nextButton2.addEventListener('click', moveRightBox2);
prevButton2.addEventListener('click', moveLeftBox2);


function handleScroll() {
    let sections = [
        {selector: '.information_one_section_main_sub_title', offset: 0.05, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_one_section_main_title', offset: 0.05, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_one_section_round_one_box', offset: 0.15, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_one_section_round_two_box', offset: 0.15, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_one_section_round_three_box', offset: 0.15, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_one_section_one_title_image', offset: 0.27, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_one_section_one_title', offset: 0.27, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_one_section_one_sub_title', offset: 0.27, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_one_section_two_title_image', offset: 0.37, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_one_section_two_title', offset: 0.37, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_one_section_two_sub_title', offset: 0.37, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_two_section_main_sub_title', offset: 0.47, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_two_section_main_title', offset: 0.47, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_two_section_one_title_image', offset: 0.52, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_two_section_one_title', offset: 0.52, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_two_section_one_sub_title', offset: 0.52, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_two_section_two_title_image_parent', offset: 0.58, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_two_section_two_title', offset: 0.58, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_two_section_two_sub_title', offset: 0.58, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_three_section_main_sub_title', offset: 0.72, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_three_section_main_title', offset: 0.72, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_three_section_round_one_box', offset: 0.79, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_three_section_round_two_box', offset: 0.79, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_three_section_round_three_box', offset: 0.79, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_four_section_round_three_box_image', offset: 0.95, transform: 'translate(-50%, 0)', opacity: '100%'},
        {selector: '.information_four_section_main_title .line1', offset: 0.95, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_four_section_main_title .line2', offset: 0.95, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.lastbutton button', offset: 0.95, transform: 'translate(-50%, 0)', opacity: '100%'},





    ];

    let scrollTop = window.scrollY;
    let docHeight = document.documentElement.scrollHeight - window.innerHeight;
    let scrollFraction = scrollTop / docHeight;

    sections.forEach(section => {
        let el = document.querySelector(section.selector);
        if (scrollFraction > section.offset) {
            el.style.transform = section.transform;
            if (section.opacity !== undefined) {
                el.style.opacity = section.opacity;
            } else {
                el.style.opacity = 1;
            }
        }
    });
}

window.addEventListener('scroll', handleScroll);


var gradients = [
    ['#850cda', '#2c72ce'],
    ['#0cd7c1', '#2c4bce'],
    ['#5d0cd7', '#2c4bce']
  ];
  
  var gradientsRev = gradients.reverse();
  var gradientCover = document.querySelector('.main');
  
 
  for (var g = 0; g < gradientsRev.length; g++) {
    var gradEl = document.createElement('div');
    gradEl.className = 'gradient';
    gradEl.style.position = 'absolute';
    gradEl.style.top = 0;
    gradEl.style.left = 0;
    gradEl.style.width = '100%';
    gradEl.style.height = '100%';
    gradEl.style.background = `linear-gradient(to left top, ${gradientsRev[g][0]}, ${gradientsRev[g][1]})`;
    gradEl.style.opacity = 0;
    gradientCover.appendChild(gradEl);
  }
  
  var gradientEls = document.querySelectorAll('.main .gradient');
  
  function gradientCycler() {
    function gradeFade(i, opDest) {
      var fadeDur = 2000;
      $(gradientEls[i]).animate({
        'opacity': opDest
      }, {
        duration: fadeDur,
        complete: function() {
          if (parseInt(i) > 0) {
            if (parseInt(opDest) === 0) gradeFade(i - 1, 0);
            else gradFadeStart();
          } else {
            gradeFade(gradientEls.length - 1, 1);
          }
        }
      });
    }
  
    var gradFadeStart = function() {
      $('.gradient').css('opacity', 1);
      gradeFade(gradientEls.length - 1, 0);
    };
  
    gradFadeStart();
  }
  
gradientCycler();
  

window.addEventListener('scroll', function() {
    const header = document.getElementById('header');

    if (window.scrollY > 0) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});




function handleScroll() {
    let sections = [
        {selector: '.if1_1_title', offset: 0.08, transform: 'translate(-50%, 40%)'},
        {selector: '.imageOne', offset: 0.08, transform: 'translate(-50%, 10%)', opacity: '10%'},
        {selector: '.if1_2_title', offset: 0.18, transform: 'translate(-50%, 80%)'},
        {selector: '.if2_1_title', offset: 0.32, transform: 'translate(-50%, 40%)'},
        {selector: '.ift_Emoji', offset: 0.32, transform: 'translate(-50%, 10%)', opacity: '30%'},
        {selector: '.if3_1_title', offset: 0.45, transform: 'translate(-50%, 40%)'},
        {selector: '.imageThree', offset: 0.45, transform: 'translate(-50%, 15%)', opacity: '20%'},
        {selector: '.if3_2_title', offset: 0.5, transform: 'translate(-50%, 90%)'},
        {selector: '.if4_1_title', offset: 0.75, transform: 'translate(-50%, 40%)'},
        {selector: '.iff_Emoji', offset: 0.75, transform: 'translate(-50%, 20%)', opacity: '30%'},
        {selector: '.if4_3_all_container', offset: 0.8, transform: 'translate(-50%, 120%)'}
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


var copy = document.querySelector(".if2_logos-slide").cloneNode(true);
document.querySelector(".if2_logos").appendChild(copy);

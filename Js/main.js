
const clientId = '1193950006714040461';
const $login = document.querySelector("#loginDiscord")
const redirectUri = 'https://www.shmpyoshop.com/';
const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=identify`;

function login() {
  window.location.href = discordAuthUrl;
}
window.onload = function() {
  const urlParams = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = urlParams.get('access_token');
  if (accessToken) {
      fetch('https://discord.com/api/users/@me', {
          headers: {
              authorization: `Bearer ${accessToken}`
          }
      })
      .then(response => response.json())
      .then(data => {
          sessionStorage.setItem('userData', JSON.stringify(data));
          $login.textContent = data.username;
      })
      .catch(error => console.error('Error fetching user info:', error));
  } else {
      const userData = sessionStorage.getItem('userData');
      if (userData) {
          const data = JSON.parse(userData);
          $login.textContent = data.username;
      }
  }
};






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
        {selector: '.if1_1_title', offset: 0.15, transform: 'translate(-50%, 120%)', opacity: '100%'},
        {selector: '.if1_container', offset: 0.23, transform: 'translateY(10%)', opacity: '100%'},
        {selector: '.if2_container', offset: 0.23, transform: 'translateY(35%)', opacity: '100%'},

        {selector: '.if2_1_title', offset: 0.5, transform: 'translate(-50%, 120%)', opacity: '100%'},
        {selector: '.if2_3_container', offset: 0.6, transform: 'translate(-50%, 0)', opacity: '100%'},
        {selector: '.if2_4_container', offset: 0.6, transform: 'translate(-50%, 0)', opacity: '100%'},
        {selector: '.if2_5_container', offset: 0.6, transform: 'translate(-50%, 0)', opacity: '100%'},

        {selector: '.ifth_title_h1', offset: 0.9, transform: 'translateY(110%)', opacity: '100%'}

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


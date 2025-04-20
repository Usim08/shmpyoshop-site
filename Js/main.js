function handleScroll() {
    let sections = [
        {selector: '.information_two_sub_title', offset: 0.77, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_two_title', offset: 0.77, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.review_parent', offset: 0.77, transform: 'translateY(0)', opacity: '100%'}

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



const texts = [
    "손쉽게 완성하는",
    "손쉽게 다루는",
    "손쉽게 꾸미는",
    "손쉽게 연결하는",
    "손쉽게 시작하는",
    "손쉽게 경험하는"
];

let index = 0;
const rotatingEl = document.querySelector("#text");

setInterval(() => {
    rotatingEl.style.opacity = 0;
    rotatingEl.style.transform = "translateY(-10px)";

    setTimeout(() => {
        index = (index + 1) % texts.length;
        rotatingEl.textContent = texts[index];
        rotatingEl.style.opacity = 1;
        rotatingEl.style.transform = "translateY(0)";
    }, 600);
}, 3500);


window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const box1 = document.querySelector(".if_one_box.one");
    const box2 = document.querySelector(".if_one_box.two");
    const box3 = document.querySelector(".if_one_box.three");

    const vh = window.innerHeight;

    if (scrollY < vh * 1) {
      box1.classList.remove("visible");
      box2.classList.remove("visible");
      box3.classList.remove("visible");
    } else if (scrollY < vh * 1.7) {
      box1.classList.add("visible");
      box2.classList.remove("visible");
      box3.classList.remove("visible");
    } else if (scrollY < vh * 2.5) {
      box1.classList.add("visible");
      box2.classList.add("visible");
      box3.classList.remove("visible");
    } else {
        box1.classList.add("visible");
        box2.classList.add("visible");
        box3.classList.add("visible");
    }
  });
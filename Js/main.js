function handleScroll() {
    let sections = [
        {selector: '.information_one_section_sub_title', offset: 0.05, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_one_section_title', offset: 0.05, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.if_o_s_o_t', offset: 0.1, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.if_o_s_o_s_t', offset: 0.1, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.if_o_s_o_i', offset: 0.1, transform: 'translate(0, 20px)', opacity: '74%'},

        {selector: '.if_o_s_t_t', offset: 0.15, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.if_o_s_t_s_t', offset: 0.15, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.if_o_s_t_i', offset: 0.15, transform: 'translate(0, 30px)', opacity: '74%'},

        {selector: '.if_o_s_th_t', offset: 0.19, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.if_o_s_th_s_t', offset: 0.19, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.if_o_s_th_i', offset: 0.19, transform: 'translate(0, -20px)'},

        {selector: '.information_two_section_sub_title', offset: 0.23, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_two_section_title', offset: 0.23, transform: 'translateY(0)', opacity: '100%'},

        {selector: '#one', offset: 0.32, transform: 'translateY(0)', opacity: '100%'},
        {selector: '#two', offset: 0.32, transform: 'translateY(0)', opacity: '100%'},
        {selector: '#three', offset: 0.32, transform: 'translateY(0)', opacity: '100%'},

        {selector: '.if_t_s_o_t', offset: 0.43, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.if_t_s_o_s_t', offset: 0.43, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.if_t_s_o_i ', offset: 0.43, transform: 'translate(0, 20px)', opacity: '74%'},

        {selector: '.if_t_s_th_t', offset: 0.47, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.if_t_s_th_s_t', offset: 0.47, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.if_t_s_th_i ', offset: 0.47, transform: 'translate(0, 30px)', opacity: '74%'},

        {selector: '.information_three_section_sub_title', offset: 0.55, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_three_section_title', offset: 0.55, transform: 'translateY(0)', opacity: '100%'},


        {selector: '.if_th_s_o_t', offset: 0.59, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.if_th_s_o_s_t', offset: 0.59, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.if_th_s_o_i ', offset: 0.59, transform: 'translate(0, 20px)', opacity: '74%'},

        {selector: '.if_th_s_t_t', offset: 0.64, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.if_th_s_t_s_t', offset: 0.64, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.if_th_s_t_i ', offset: 0.64, transform: 'translate(0, 30px)', opacity: '74%'},

        {selector: '.information_four_section_sub_title', offset: 0.7, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_four_section_title', offset: 0.7, transform: 'translateY(0)', opacity: '100%'},

        {selector: '.if_f_s_o_i', offset: 0.74, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.if_f_s_o_t', offset: 0.74, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.if_f_s_o_s_t', offset: 0.74, transform: 'translateY(0)', opacity: '100%'},


        {selector: '#section_one', offset: 0.78, opacity: '100%'},
        {selector: '#section_two', offset: 0.78, opacity: '100%'},
        {selector: '#section_three', offset: 0.78, opacity: '100%'},
        {selector: '#section_four', offset: 0.78, opacity: '100%'},
        {selector: '#section_five', offset: 0.78, opacity: '100%'},
        {selector: '#section_six', offset: 0.78, opacity: '100%'},
        {selector: '#section_seven', offset: 0.78, opacity: '100%'},
        {selector: '#section_eight', offset: 0.78, opacity: '100%'},

        {selector: '.if_f_s_t_t', offset: 0.85, transform: 'translateY(-140px)', opacity: '100%'},

        {selector: '.if_f_section_one', offset: 0.85, transform: 'translateY(-95%)', opacity: '100%'},
        {selector: '.if_f_section_two', offset: 0.85, transform: 'translateY(-95%)', opacity: '100%'},
        {selector: '.if_f_section_three', offset: 0.85, transform: 'translateY(-95%)', opacity: '100%'},


        {selector: '.information_five_section_round_three_box_image', offset: 0.95, transform: 'translate(-50%, 0%)', opacity: '100%'},
        {selector: '.information_five_section_main_title .line1', offset: 0.95, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.information_five_section_main_title .line2', offset: 0.95, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.input_two_section button', offset: 0.95, transform: 'translateY(0)', opacity: '100%'},
        {selector: '.input_three_section button', offset: 0.95, transform: 'translateY(0)', opacity: '100%'},

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

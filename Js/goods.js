window.addEventListener('scroll', function() {
    const header = document.getElementById('header');

    if (window.scrollY > 0) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});


// document.getElementById('registerBtn').addEventListener('click', async () => {

//     const secretCode = document.getElementById('secretCode').value.trim();
//     const name = document.getElementById('name').value.trim();
//     const phone_number = document.getElementById('phone_number').value.trim();
//     const where = document.getElementById('roblox-link').value.trim();

//     if (!where) {
//         document.getElementById('error-message-game').textContent = '게임 링크를 첨부하세요';
//         return;
//     } else {
//         document.getElementById('error-message-game').textContent = '';
//     }

//     try {
//         document.getElementById('registerBtn').style.opacity = 0.5;
//         document.getElementById('registerBtn').disabled = true;
//         const response = await fetch('/all-done', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ secretCode, name, phone_number, where })
//         });

//         const result = await response.json();
//         if (result.success) {
//             alert('비밀 코드 활성화 완료! 자세한 내용은 카카오톡에서 확인해 주세요.\n쉼표샵을 이용해주셔서 감사합니다.');
//             window.location.href = 'https://www.shmpyoshop.com/home'
//         } else {
//             alert(result.message);
//         }
//     } catch (error) {
//         document.getElementById('registerBtn').style.opacity = 1;
//         document.getElementById('registerBtn').disabled = false;
//         alert('오류가 발생했어요. 쉼표샵 디스코드로 문의해 주세요. 이용에 불편을 끼쳐드려 죄송합니다.');
//     }
// });

document.getElementById('check_secret_code').addEventListener('click', async () => {
    const secretCode = document.getElementById('secretCode').value.trim();
    
    // 비밀 코드 입력 확인
    if (!secretCode) {
        document.getElementById('error-message').textContent = '비밀 코드를 입력하세요';
        return;
    } else {
        document.getElementById('error-message').textContent = '';
    }

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ secretCode })
        });

        const result = await response.json();
        
        if (result.success) {
            document.getElementById('check_secret_code').style.backgroundColor = '#c7cccf';
            document.getElementById('check_secret_code').style.cursor = 'not-allowed';
            document.getElementById('check_secret_code').disabled = true;
            document.getElementById('secretCode').disabled = true;


            const nameSection = document.getElementById('name_section');
            const number = document.getElementById('phone_section');
        
            nameSection.style.display = 'block';
            number.style.display = 'block';
        
            setTimeout(() => {
                requestAnimationFrame(() => {
                    number.style.transform = 'translateY(0)';
                    number.style.opacity = '1';
                });
            }, 150);
            requestAnimationFrame(() => {
                nameSection.style.transform = 'translateY(0)';
                nameSection.style.opacity = '1';
            });
        } else {
            document.getElementById('error-message').textContent = result.message;
        }
        
    } catch (error) {
        console.error('오류가 발생했습니다:', error);
        alert('오류가 발생했어요. 쉼표샵 디스코드로 문의해 주세요. 이용에 불편을 끼쳐드려 죄송합니다.');
    }
});



let timerInterval;

document.getElementById('phone_verify').addEventListener('click', async () => {
    const phoneNumber = document.getElementById('phone').value.trim();
    const name = document.getElementById('name').value.trim();
    const phoneVerifySub = document.getElementById('phone_verify_sub');
    if (!name) {
        document.getElementById('error-message-name').textContent = '이름을 입력하세요';
        return;
    } else {
        document.getElementById('error-message-name').textContent = '';
    }
    
    if (!phoneNumber) {
        document.getElementById('error-phone').textContent = '전화번호를 입력하세요';
        return;
    } else {
        document.getElementById('error-phone').textContent = '';
    }

    const phonePattern = /^\d{10,11}$/;
    if (!phonePattern.test(phoneNumber)) {
        document.getElementById('error-phone').textContent = '전화번호 형식을 다시 한번 확인해 주세요';
        return;
    } else {
        document.getElementById('error-phone').textContent = '';
    }

    try {
        document.getElementById('phone_verify').style.backgroundColor = '#c7cccf';
        document.getElementById('phone_verify').style.cursor = 'not-allowed';
        document.getElementById('phone_verify').disabled = true;


        const response = await fetch('/send-verify-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phoneNumber, name })
        });

        if (!response.ok) {
            throw new Error(`서버 응답 에러: ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
            document.getElementById('verify_section').style.display = 'block';
            
            requestAnimationFrame(() => {
                document.getElementById('verify_section').style.transform = 'translateY(0)';
                document.getElementById('verify_section').style.opacity = '1';
            });



            document.getElementById('phone').disabled = true;
            document.getElementById('name').disabled = true;
            document.getElementById('phone_verify').disabled = true;

            let timeLeft = 180;
            clearInterval(timerInterval);
            timerInterval = setInterval(updateTimer, 1000);

            function updateTimer() {
                if (timeLeft > 0) {
                    timeLeft -= 1;
                    const minutes = Math.floor(timeLeft / 60);
                    const seconds = timeLeft % 60;
                    phoneVerifySub.innerText = `인증 번호를 알려주세요 (${minutes}:${seconds.toString().padStart(2, '0')})`;
                } else {
                    clearInterval(timerInterval);
                    alert('인증시간이 초과되었어요. 다시 인증을 시도해 주세요.');
                    phoneVerifySub.innerText = '인증 번호를 알려주세요';
                    document.getElementById('verify').value = "";
                    document.getElementById('verify').disabled = false;

                    document.getElementById('number_verify').style.backgroundColor = '#c7cccf';
                    document.getElementById('number_verify').style.cursor = 'not-allowed';
                    document.getElementById('number_verify').disabled = true;


                    document.getElementById('phone_verify').style.backgroundColor = '#459CF3';
                    document.getElementById('phone_verify').style.cursor = 'pointer';
                    document.getElementById('phone_verify').disabled= false
                }
            }
        } else {
            alert(result.message);7
        }
    } catch (error) {

        document.getElementById('number_verify').style.backgroundColor = '#c7cccf';
        document.getElementById('number_verify').style.cursor = 'not-allowed';
        document.getElementById('number_verify').disabled = true;
        console.error('인증번호 발송 중 오류가 발생했습니다:', error);
        alert('인증번호 발송에 실패했어요. 다시 시도해 주세요.');
    }
});

document.getElementById('number_verify').addEventListener('click', async () => {
    const verifyCode = document.getElementById('verify').value.trim();
    const phoneNumber = document.getElementById('phone').value.trim();

    if (!verifyCode) {
        document.getElementById('error-verify').textContent = '인증 번호를 입력하세요';
        return;
    } else {
        document.getElementById('error-verify').textContent = '';
    }

    try {
        const response = await fetch('/verify-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phoneNumber, verifyCode })
        });

        if (!response.ok) {
            throw new Error(`서버 응답 에러: ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
            clearInterval(timerInterval);
            
            requestAnimationFrame(() => {
                document.getElementById('phone_verify_sub').style.transform = 'translateY(0)';
                document.getElementById('phone_verify_sub').style.opacity = '1';
            });

            document.getElementById('phone_verify_sub').innerText = "인증 번호를 알려주세요";

            document.getElementById('phone_verify').style.backgroundColor = '#c7cccf';
            document.getElementById('phone_verify').style.cursor = 'not-allowed';
            document.getElementById('phone_verify').disabled = true;

            document.getElementById('number_verify').style.backgroundColor = '#c7cccf';
            document.getElementById('number_verify').style.cursor = 'not-allowed';
            document.getElementById('number_verify').disabled = true;
            document.getElementById('verify').disabled = true;

            document.getElementById('game_section').style.display = 'block';
            document.getElementById('information_second_section').style.display = 'block';
            document.getElementById('lastbutton').style.display = 'block';
            document.getElementById('in_m_t_o_th').style.display = 'flex';
            
            setTimeout(() => {
                requestAnimationFrame(() => {
                    document.getElementById('lastbutton').style.transform = 'translateY(0)';
                    document.getElementById('lastbutton').style.opacity = '1';
                });
            }, 150);
            requestAnimationFrame(() => {
                document.getElementById('game_section').style.transform = 'translateY(0)';
                document.getElementById('game_section').style.opacity = '1';
            });

            requestAnimationFrame(() => {
                document.getElementById('in_m_t_o_th').style.transform = 'translateY(0)';
                document.getElementById('in_m_t_o_th').style.opacity = '1';
            });

        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('인증번호 확인 중 오류가 발생했습니다:', error);
        alert('인증번호 확인에 실패했어요. 다시 시도해 주세요.');
    }
});
const checkbox = document.getElementById('checkbox');

checkbox.addEventListener('change', function() {
    if (checkbox.checked) {
        document.getElementById('registerBtn').style.backgroundColor = '#459CF3';
        document.getElementById('registerBtn').style.cursor = 'pointer';
        document.getElementById('registerBtn').disabled= false
    } else {
        document.getElementById('registerBtn').style.backgroundColor = '#c7cccf';
        document.getElementById('registerBtn').style.cursor = 'not-allowed';
        document.getElementById('registerBtn').disabled = true;
    }
});
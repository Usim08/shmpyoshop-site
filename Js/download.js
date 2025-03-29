window.addEventListener('scroll', function() {
    const header = document.getElementById('header');

    if (window.scrollY > 0) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});


document.getElementById('registerBtn').addEventListener('click', async () => {
    const secretCode = document.getElementById('secretCode').value.trim();  // 입력받은 secretCode 가져오기

    try {
        document.getElementById('registerBtn').style.opacity = 0.5;
        document.getElementById('registerBtn').disabled = true;

        const response = await fetch('https://www.shmpyoshop.com/download-file', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ secretCode })
        });

        const result = await response.json();

        if (result.success) {
            window.location.href = result.message;
        } else {
            alert(result.message)
        }
    } catch (error) {
        document.getElementById('registerBtn').style.opacity = 1;
        document.getElementById('registerBtn').disabled = false;
        alert('오류가 발생했어요. 쉼표샵 디스코드로 문의해 주세요. 이용에 불편을 끼쳐드려 죄송합니다.');
    }
});



document.getElementById('check_secret_code').addEventListener('click', async () => {

    const secretCode = document.getElementById('secretCode').value.trim();
    
    if (!secretCode) {
        document.getElementById('error-message').textContent = '비밀 코드를 입력하세요';
        return;
    } else {
        document.getElementById('error-message').textContent = '';
    }

    try {
        const response = await fetch('/check_secret', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ secretCode })
        });

        if (response.status === 418) {
            const result = await response.json();
            alert(`[할인 쿠폰 당첨 🎉]\n와우! 축하드려요 👏\n0.001% 확률을 뚫고 30% 할인 쿠폰에 당첨되셨어요.\n창을 닫아버리면 쿠폰은 소멸됩니다.. 당장 메모지에 적어두세요!\n\n쿠폰 번호: ${result.message}`);
            return;
        }
        

        if (response.status === 429) {
            alert("설마 지금 오토 쓰고 계신 건 아니겠죠..? 아니라면 이건 손가락 장인 인증입니다. 브라보! 👏");
            return;
        }

        const result = await response.json();
        if (result.success) {
            document.getElementById('one_title').style.display = 'block';
            document.getElementById('name').style.display = 'block';
            document.getElementById('check_secret_code').style.opacity = 0.5;
            document.getElementById('secretCode').disabled = true;

            document.getElementById('two_title').style.display = 'block';
            document.getElementById('one_section').style.display = 'flex';
            document.getElementById('two_title').style.display = 'block';

        } else {
            document.getElementById('error-message').textContent = result.message;
        }
    } catch (error) {
        console.error('오류가 발생했습니다:', error);
        alert('오류가 발생했어요. 쉼표샵 디스코드로 문의해 주세요. 이용에 불편을 끼쳐드려 죄송합니다.');
    }
});


let timerInterval;

document.getElementById('verifyBtn').addEventListener('click', async () => {
    const phoneNumber = document.getElementById('phone_number').value.trim();
    const name = document.getElementById('name').value.trim();
    const phoneVerifySub = document.getElementById('phone_verify_sub');
    if (!name) {
        document.getElementById('error-message-name').textContent = '이름을 입력하세요';
        return;
    } else {
        document.getElementById('error-message-name').textContent = '';
    }
    
    if (!phoneNumber) {
        document.getElementById('error-message-phone').textContent = '전화번호를 입력하세요';
        return;
    } else {
        document.getElementById('error-message-phone').textContent = '';
    }

    const phonePattern = /^\d{10,11}$/;
    if (!phonePattern.test(phoneNumber)) {
        document.getElementById('error-message-phone').textContent = '전화번호 형식을 다시 한번 확인해 주세요';
        return;
    } else {
        document.getElementById('error-message-phone').textContent = '';
    }

    try {
        document.getElementById('verifyBtn').style.opacity = 0.5;
        document.getElementById('verifyBtn').disabled = true;

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
            alert('인증번호가 발송되었어요. 카카오톡을 확인해 주세요');
            document.getElementById('phone_number').disabled = true;
            document.getElementById('name').disabled = true;
            document.getElementById('verify_number').disabled = false;

            phoneVerifySub.style.display = 'block';
            document.getElementById('two_section').style.display = 'flex';

            let timeLeft = 180;
            clearInterval(timerInterval);
            timerInterval = setInterval(updateTimer, 1000);

            function updateTimer() {
                if (timeLeft > 0) {
                    timeLeft -= 1;
                    const minutes = Math.floor(timeLeft / 60);
                    const seconds = timeLeft % 60;
                    phoneVerifySub.innerText = `인증번호 (${minutes}:${seconds.toString().padStart(2, '0')})`;
                } else {
                    clearInterval(timerInterval);
                    alert('인증시간이 초과되었어요. 다시 인증을 시도해 주세요.');
                    phoneVerifySub.innerText = '인증번호';
                    document.getElementById('verify_number').value = "";
                    document.getElementById('verify_number').disabled = true;

                    document.getElementById('verifyBtn').style.opacity = 1;
                    document.getElementById('verifyBtn').disabled = false;
                }
            }
        } else {
            alert(result.message);
        }
    } catch (error) {
        document.getElementById('verifyBtn').style.opacity = 0.5;
        document.getElementById('verifyBtn').disabled = true;
        console.error('인증번호 발송 중 오류가 발생했습니다:', error);
        alert('인증번호 발송에 실패했어요. 다시 시도해 주세요.');
    }
});

document.getElementById('verify_number_btn').addEventListener('click', async () => {
    const verifyCode = document.getElementById('verify_number').value.trim();
    const phoneNumber = document.getElementById('phone_number').value.trim();
    const secretCode = document.getElementById('secretCode').value.trim();
    const name = document.getElementById('name').value.trim();


    if (!verifyCode) {
        document.getElementById('error-message-verify').textContent = '인증번호를 입력하세요';
        return;
    } else {
        document.getElementById('error-message-verify').textContent = '';
    }

    try {
        const response = await fetch('/verify-code-second', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phoneNumber, verifyCode, secretCode, name })
        });

        if (!response.ok) {
            throw new Error(`서버 응답 에러: ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
            clearInterval(timerInterval);
            document.getElementById('phone_verify_sub').innerText = "인증번호";
            document.getElementById('verifyBtn').style.opacity = 0.5;
            document.getElementById('verifyBtn').style.opacity = 0.5;
            document.getElementById('verifyBtn').disabled = true;
            document.getElementById('verify_number_btn').style.opacity = 0.5;
            document.getElementById('verify_number_btn').disabled = true;
            document.getElementById('verify_number').disabled = true;

            document.getElementById('info_last_list').style.display = 'block';
            document.getElementById('lastbutton').style.display = 'block';
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('인증번호 확인 중 오류가 발생했습니다:', error);
        alert('인증번호 확인에 실패했어요. 다시 시도해 주세요.');
    }
});

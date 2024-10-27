document.getElementById('registerBtn').addEventListener('click', async () => {

    const secretCode = document.getElementById('secretCode').value.trim();
    const name = document.getElementById('name').value.trim();
    const phone_number = document.getElementById('phone_number').value.trim();
    const verify_number = document.getElementById('verify_number').value.trim();
    const where = document.getElementById('where').value.trim();
    
    if (!secretCode) {
        alert('상품의 비밀 코드를 입력하지 않으셨어요');
        return;
    }
    if (!name) {
        alert('이름을 입력하지 않으셨어요');
        return;
    }
    if (!phone_number) {
        alert('전화번호를 입력하지 않으셨어요');
        return;
    }
    if (!verify_number) {
        alert('인증번호를 입력하지 않으셨어요');
        return;
    }
    if (!where) {
        alert('디스코드 서버 링크를 첨부하지 않으셨어요');
        return;
    }

    try {
        const response = await fetch('https://www.shmpyoshop.com/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ secretCode })
        });

        const result = await response.json();
        if (result.success) {
            console.log("완료!")
        } else {
            alert(result.message);
            window.location.href = '/project/add/goods-code-loading.html?redirectUrl=' + encodeURIComponent(result.redirectUrl);
        }
    } catch (error) {
        console.error('오류가 발생했습니다:', error);
        alert('오류가 발생했어요. 쉼표샵 디스코드로 문의해 주세요. 이용에 불편을 끼쳐드려 죄송합니다.');
    }
});

document.getElementById('check_secret_code').addEventListener('click', async () => {

    const secretCode = document.getElementById('secretCode').value.trim();
    
    if (!secretCode) {
        alert('상품의 비밀 코드를 입력해 주세요');
        return;
    }

    try {
        const response = await fetch('https://www.shmpyoshop.com/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ secretCode })
        });

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
            alert(result.message);
            window.location.href = '/project/add/goods-code-loading.html?redirectUrl=' + encodeURIComponent(result.redirectUrl);
        }
    } catch (error) {
        console.error('오류가 발생했습니다:', error);
        alert('오류가 발생했어요. 쉼표샵 디스코드로 문의해 주세요. 이용에 불편을 끼쳐드려 죄송합니다.');
    }
});


document.getElementById('verifyBtn').addEventListener('click', async () => {
    const phoneNumber = document.getElementById('phone_number').value.trim();
    const name = document.getElementById('name').value.trim();
    const phoneVerifySub = document.getElementById('phone_verify_sub');

    // 전화번호와 형식 확인
    if (!phoneNumber) {
        alert('전화번호를 입력하지 않으셨어요');
        return;
    }

    const phonePattern = /^\d{10,11}$/;
    if (!phonePattern.test(phoneNumber)) {
        alert('유효한 전화번호를 입력하세요.');
        return;
    }



    try {
        document.getElementById('verifyBtn').disabled = true

        const response = await fetch('https://www.shmpyoshop.com/send-verify-code', {
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
            alert('인증번호가 발송되었습니다! 메시지 앱을 확인해주세요');
            document.getElementById('verifyBtn').textContent = "재인증하기";
            document.getElementById('phone_number').disabled = true;
            document.getElementById('verify_number').disabled = false;

            phoneVerifySub.style.display = 'block';
            document.getElementById('two_section').style.display = 'flex';

            let timeLeft = 180;
            // 타이머 초기화 및 설정
            let timerInterval = setInterval(updateTimer, 1000);

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
                    document.getElementById('verify_number').disabled = true;
                }
            }

            // 3초 후 재인증 버튼 활성화
            setTimeout(() => {
                document.getElementById('verifyBtn').textContent = "재인증하기";
                document.getElementById('verifyBtn').disabled = false;
            }, 3000);

            // 재인증 버튼을 누르면 타이머 초기화
            document.getElementById('verifyBtn').addEventListener('click', () => {
                clearInterval(timerInterval); // 기존 타이머 초기화
                timeLeft = 180; // 타이머 초기화
                timerInterval = setInterval(updateTimer, 1000); // 새 타이머 시작
            }, { once: true });
        } else {
            alert(result.message);
        }
    } catch (error) {
        document.getElementById('verifyBtn').disabled = false
        console.error('인증번호 발송 중 오류가 발생했습니다:', error);
        alert('인증번호 발송에 실패했습니다. 다시 시도해 주세요.');
    }
});



document.getElementById('verify_number_btn').addEventListener('click', async () => {
    const verifyCode = document.getElementById('verify_number').value.trim(); // verify_number -> verifyCode로 변경
    const phoneNumber = document.getElementById('phone_number').value.trim();

    if (!verifyCode) {
        alert('인증번호를 입력해주세요');
        return;
    }

    try {
        const response = await fetch('https://www.shmpyoshop.com/verify-code', {
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
            document.getElementById('verifyBtn').style.opacity = 0.5;
            document.getElementById('verifyBtn').disabled = true
            document.getElementById('verify_number_btn').style.opacity = 0.5;
            document.getElementById('verify_number_btn').disabled = true
            document.getElementById('verify_number').disabled = true;

            document.getElementById('three_title').style.display = 'block';
            document.getElementById('where').style.display = 'block';
            document.getElementById('info_last_list').style.display = 'block';
            document.getElementById('lastbutton').style.display = 'block';
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('인증번호 확인 중 오류가 발생했습니다:', error);
        alert('인증번호 확인에 실패했습니다. 다시 시도해 주세요.');
    }
});

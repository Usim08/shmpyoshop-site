document.getElementById('registerBtn').addEventListener('click', async () => {
    const secretCode = document.getElementById('secretCode').value.trim();
    
    if (!secretCode) {
        alert('쉼표샵 시크릿 코드를 입력해주세요!');
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
            // 1번 페이지가 이미 보여지고 있다고 가정합니다
            alert('코드가 성공적으로 등록되었어요! 3초 후에 다운로드 페이지로 이동합니다.');

            // 3초 후에 서버에서 받은 redirectUrl로 이동
            setTimeout(() => {
                window.location.href = result.redirectUrl;
            }, 3000);
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('오류가 발생했습니다:', error);
        alert('오류가 발생했어요. 쉼표샵 디스코드로 문의해 주세요. 이용에 불편을 끼쳐드려 죄송합니다.');
    }
});

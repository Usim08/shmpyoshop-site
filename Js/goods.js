document.getElementById('registerBtn').addEventListener('click', async () => {
    const secretCode = document.getElementById('secretCode').value.trim();
    
    if (!secretCode) {
        alert('상품 비밀 코드를 입력해주세요!');
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
            // 1번 HTML 페이지를 표시
            window.location.href = '/project/add/goods-code-loading.html'; // 1번 HTML 페이지로 이동
            
            // 3초 후에 2번 HTML 페이지로 이동
            setTimeout(() => {
                console.log('2번 페이지로 이동합니다.');
                window.location.href = '/project/verified_access_for_download_shmpyo_exclusive_goods/',secretCode,'/shmpyo-goods-download'; // 2번 HTML 페이지로 이동
            }, 3000); // 3000ms = 3초
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('오류가 발생했습니다:', error);
        alert('오류가 발생했어요. 쉼표샵 디스코드로 문의해 주세요. 이용에 불편을 끼쳐드려 죄송합니다.');
    }
});

document.getElementById('registerBtn').addEventListener('click', async () => {
    const secretCode = document.getElementById('secretCode').value.trim();
    
    if (!secretCode) {
        alert('쉼표샵 상품 비밀 코드를 입력해주세요!');
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
            window.location.href = '/project/add/goods-code-loading.html?redirectUrl=' + encodeURIComponent(result.redirectUrl);
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('오류가 발생했습니다:', error);
        alert('오류가 발생했어요. 쉼표샵 디스코드로 문의해 주세요. 이용에 불편을 끼쳐드려 죄송합니다.');
    }
});

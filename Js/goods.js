document.getElementById('registerBtn').addEventListener('click', async () => {
    const secretCode = document.getElementById('secretCode').value.trim(); // 공백 제거
    
    if (!secretCode) {
        alert('시크릿 코드를 입력해주세요.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3019/register', { // URL 확인
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ secretCode })
        });

        const result = await response.json();
        if (result.success) {
            alert('코드가 성공적으로 등록되었습니다.');
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('오류가 발생했습니다:', error);
        alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
});

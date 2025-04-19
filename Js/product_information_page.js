
document.addEventListener("DOMContentLoaded", () => {
const pathSegments = window.location.pathname.split("/");
const productCode = pathSegments[pathSegments.length - 1].replace(".html", "");

if (!productCode) {
    console.error("상품 코드가 없습니다.");
    return;
}

fetch(`/get-product/${productCode}`)
        .then(response => response.json())
        .then(product => {
            if (!product || product.error) {
                console.log("상품 정보를 찾을 수 없습니다.");
                return;
            }

            if (product.vis === "F") {
                alert("현재는 판매되지 않는 상품이에요. 구매하시려는 상품을 다시 한번 확인해 주세요.")
                history.back();
                return;
            }

            if (product.pus === "F") {
                document.getElementById("cantbuy").style.display = "block";
                document.getElementById("cantbuy").innerText = "구매 불가 상품이에요";
                document.getElementById("canbuy").remove();
            } else {
                document.getElementById("cantbuy").remove();
                document.getElementById("canbuy").style.display = "block";
            }

            const discountPrice = product.price * (1 - (product.discount || 0) / 100);

            if (product.discount == "0") {
                document.getElementById("product_price").innerText = `${product.price.toLocaleString()}원`;
            } else {
                document.getElementById("product_price").innerText = `${discountPrice.toLocaleString()}원 (-${product.discount}%)`;
                document.getElementById("product_discount").src = `/IMG/할인상품.png`;
            }

            document.getElementById("st_price").innerText = `${product.price.toLocaleString()}원`;
            document.getElementById("st_name").innerText = product.name;
            document.getElementById("st_img").src = `/IMG/product_img/${product.code}.png`;
            document.getElementById("last_won").innerText = discountPrice.toLocaleString();

            if (product.res === 'T') {
                document.getElementById("product_res").src = `/IMG/사전예약.png`;
            }

            document.getElementById("product_title").innerText = product.name;


            const tagImg = document.getElementById("product_tag");
            if (!tagImg) {
                throw new Error("요소를 찾을 수 없습니다.");
            }

            tagImg.src = `/IMG/${product.tag}.png`;
        })
        .catch(error => {
            console.error("상품 데이터를 불러오는 중 오류 발생:", error);
        });
    });


document.addEventListener("DOMContentLoaded", () => {
    const stickyBuy = document.getElementById("stickyBuy");

    window.addEventListener("scroll", () => {
        const triggerHeight = 400;
        if (window.scrollY > triggerHeight) {
            stickyBuy.classList.add("show");
        } else {
            stickyBuy.classList.remove("show");
        }
    });

    document.querySelector(".sticky-btn").addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});

function redirectToPayment(productCode) {
    fetch(`/get-product-info/${productCode}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('상품 정보를 가져오는데 실패했습니다.');
            }
            return response.json();
        })
        .then((productInfo) => {
            const paymentURL = `/payment?code=${productInfo.code}&name=${encodeURIComponent(productInfo.name)}&price=${productInfo.price}`;
            
            window.location.href = paymentURL;
        })
        .catch((error) => {
            console.error('결제창 이동 중 오류:', error);
            alert('현재는 판매되지 않는 상품이에요. 구매하시려는 상품을 다시 한번 확인해 주세요.');
        });
}

fetch('/header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-container').innerHTML = data;
    });
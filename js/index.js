// ✅ Chạy khi trang đã tải xong
document.addEventListener("DOMContentLoaded", function () {
  preloadProductData(); // Tải dữ liệu sản phẩm từ JSON và lưu vào localStorage
});

// ✅ Hàm preload dữ liệu sản phẩm
function preloadProductData() {
  // Tải danh sách sản phẩm tổng quát
  fetch("./data/product-list.json")
    .then((response) => {
      if (!response.ok) throw new Error("Không thể tải product-list.json");
      return response.json();
    })
    .then((data) => {
      // Lưu dữ liệu vào localStorage
      localStorage.setItem("products", JSON.stringify(data));
    })
    .catch((error) => {
      console.error("Error preloading product-list:", error);
    });

  // Tải chi tiết sản phẩm
  fetch("./data/product.json")
    .then((response) => {
      if (!response.ok) throw new Error("Không thể tải product.json");
      return response.json();
    })
    .then((data) => {
      // Lưu dữ liệu vào localStorage
      localStorage.setItem("product-list", JSON.stringify(data));

      // Gọi các hàm xử lý sau khi tải dữ liệu xong
      onLoad();
      linkToProductInfo();
      loadQuantityInCart();
      saveTitleProduct();
    })
    .catch((error) => {
      console.error("Error preloading product:", error);
    });
}

// ✅ Lấy tham chiếu đến các thẻ để đẩy data
var products = document.querySelectorAll(".product-item");
console.log(products);

function onLoad() {
  // Lấy dữ liệu từ local storage
  var productObj = JSON.parse(localStorage.getItem("product-list"));

  // Ghi dữ liệu từ localStorage vào các phần tử trên trang
  for (var i = 0; i < products.length; i++) {
    products[i].querySelector(".product-item-tittle").innerHTML =
      productObj[i].title;
    products[i].querySelector("img").src = "./" + productObj[i].src;
    products[i].querySelector(".product-item-price").innerHTML = formatPrice(
      productObj[i].price
    );
  }
}

// ✅ Định dạng tiền tệ
function formatPrice(price) {
  let formattedPrice = Number(price).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return formattedPrice;
}

// ✅ Xử lý click chuyển đến trang chi tiết sản phẩm
function linkToProductInfo() {
  products.forEach((item) => {
    var productObj = JSON.parse(localStorage.getItem("product-list"));
    console.log(productObj);
    item.addEventListener("click", function () {
      var divId = item.getAttribute("id");
      var titleElement = item.querySelector(".product-item-tittle").textContent;
      var type = divId.split("-");

      switch (type[1]) {
        case "sale":
        case "new":
        case "restock": {
          for (var i = 0; i < productObj.length; i++) {
            if (productObj[i].title == titleElement) {
              localStorage.setItem(
                "currentProduct",
                JSON.stringify(productObj[i])
              );
              break;
            }
          }
          break;
        }
      }

      // Chuyển trang chi tiết
      window.location.href = "./html/product-detail.html";
    });
  });
}

// ✅ Hiển thị số lượng sản phẩm trong giỏ
var quantityInCart = 0;
function loadQuantityInCart() {
  var productInCart = JSON.parse(localStorage.getItem("productInCart"));
  if (!productInCart) {
    quantityInCart = 0;
  } else {
    quantityInCart = productInCart.length;
  }
  document.getElementById("quantity-in-cart").innerHTML = quantityInCart;
}

// ✅ Lưu id của từng danh mục sản phẩm được click
var linkToProduct = document.querySelectorAll(
  ".section1 .section1-product ul li a"
);
function saveTitleProduct() {
  for (var i = 0; i < linkToProduct.length; i++) {
    linkToProduct[i].addEventListener("click", function () {
      var id = this.id;
      console.log(id);
      localStorage.setItem("idPageProduct", JSON.stringify(id));
    });
  }
}

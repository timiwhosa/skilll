document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementsByClassName("search-div")[0]
    .addEventListener("mouseenter", () => opensearch());
  document
    .getElementsByClassName("width")[0]
    .addEventListener("mouseenter", () => closesearch());
});

function opensearch() {
  if (document.documentElement.clientWidth < 482) {
    var hy = document.getElementsByClassName("float")[0];
    hy.style.width = "100%";
  }
}
function closesearch() {
  if (document.documentElement.clientWidth < 482) {
    var hy = document.getElementsByClassName("float")[0];
    hy.style.width = "0";
  }
}

// SEARCH section
var allInputs = Object.entries(document.getElementsByTagName("input"));
allInputs.forEach((input) => {
  if (input[1].type === "search") {
    input[1].addEventListener("keyup", (e) => {
      if (e.keyCode === 13) {
        search(e.target.value);
        return false;
    }})
  }
})

if (
  (document.getElementsByClassName("search-btn")[0],
  document.getElementById("searchForm"))
) {
  document.getElementById("searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    return false;
  });
  document
    .getElementsByClassName("search-btn")[0]
    .addEventListener("pointerdown", (e) => {
      search(e.target.parentNode[0].value);
    });
}

function search(e) {
  // console.log(e)
  if(e.trim().length > 0 ){
    fetch(`/search?input=${e}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.status === 200) {
          savesearch(data.data);
          window.location.href = `/search/${e}`;
        } else {
          promptDiv(data.message);
        }
      });
  }
}

function savesearch(data){
  sessionStorage.setItem("searchResult", JSON.stringify(data, null,2))
};
function promptDiv(data){
  var suc = document.createElement("div");
  suc.setAttribute("class", "message-show bg-green1 white");
  suc.setAttribute("id", `searchResponse${Math.floor(Math.random())}`);
  suc.textContent = data;
  document.body.append(suc);
  setTimeout(() => {
    document.body.removeChild(suc);
  }, 2500);
};




var products = JSON.parse(localStorage.getItem("honeycareproduct"));
function addtocart(data) {
  // var products = JSON.parse(localStorage.getItem("honeycareproduct"));

  if (products) {
    if (products[data._id]) {
      // increase product number
      increaseProductincart(data._id);
    } else {
      // add product to cart
      data.incart = 1;
      data.totalPrice = data.price;
      products[data._id] = data;
      localStorage.setItem(
        "honeycareproduct",
        JSON.stringify(products, null, 2)
      );
      numberincart();
    }
  } else {
    products = {};
    data.incart = 1;
    data.totalPrice = parseInt(data.incart) * data.price;
    products[data._id] = data;
    localStorage.setItem("honeycareproduct", JSON.stringify(products, null, 2));
    numberincart();
  }
}

function increaseProductincart(id) {
  products[`${id}`].incart = parseInt(products[`${id}`].incart ) + 1;
  calculateProductprice(id);
  localStorage.setItem("honeycareproduct", JSON.stringify(products, null, 2));
  loadcart();
}
function decreaseProductincart(id) {
  if (products[`${id}`]) {
    products[`${id}`].incart = parseInt(products[`${id}`].incart ) - 1;
    calculateProductprice(`${id}`);
    localStorage.setItem("honeycareproduct", JSON.stringify(products, null, 2));
    zeroitem(id);
    loadcart();
  }
}

function deleteitem(id) {
  var ans = confirm("Do you want to remove this item");
  if (ans === true) {
    delete products[`${id}`];
    localStorage.setItem("honeycareproduct", JSON.stringify(products, null, 2));
    loadcart();   
  } else {
    loadcart();
  }
}
function zeroitem( id) {
  if (products[`${id}`].incart == 0) {
    var ans = confirm("Do you want to remove this item");
    if (ans === true) {
      delete products[`${id}`];
      localStorage.setItem("honeycareproduct", JSON.stringify(products, null, 2));
      loadcart();
    } else {
      increaseProductincart(id);
      loadcart();
    }
  }
}


function calculateProductprice(id) {
  if (products[`${id}`] && products[`${id}`].incart != 0) {
    products[`${id}`].totalPrice = parseInt(products[`${id}`].incart) * products[`${id}`].price;
  }
}
function calculatetotalprice() {
  var sumtotalprice = 0;
  Object.values(products).forEach(product => {
    sumtotalprice += parseInt(product.totalPrice)
  })
  document.getElementById("total").innerText = "N" +sumtotalprice.toLocaleString();
}
var testt;
function loadcart() {
  if (window.location.pathname == "/cart") {
    numberincart();
    if (products && Object.keys(products).length > 0) {
      var cartItems = document.getElementById("cart-items");
      cartItems.innerHTML = "";
      Object.values(products).forEach((product) => {
        testt = product._id;
        calculateProductprice(product._id);
        cartItems.innerHTML += `
        <div class="cart-item">
          <div class="cart-product">
            <img src="${product.image}" alt="honeycare pharmacy ${product.name
          }" />

            <div class="">${product.name}</div>
          </div>
            <div class="cart-quantity">
              <div class="qnty">
                <span class="minus" onclick="decreaseProductincart('${product._id
          }')">
                  -
                </span>
                <input type="number" value="${product.incart}" id="cart${product._id
          }" oninput= "inputcartnumber('${product._id}', this.value)"/>
                <span class="add" onclick="increaseProductincart('${product._id}')">
                  +
                </span>
              </div>
            </div>
            <div class="cart-price">${product.price.toLocaleString()}</div>
            <div class="cart-total-price" id="carttotal${product._id
          }" >${product.totalPrice.toLocaleString()}</div>
            <div class="cart-delete">
              <span class="" onclick="deleteitem('${product._id}')">x</span>
            </div>
        </div>`;
      });
    }
    else {
      document.getElementById(
        "cart-items"
      ).innerHTML = `<img src="/img/advise/advise1-small.png" alt="">`;
    }
    calculatetotalprice();
  }
}

loadcart();


function numberincart() {
  if (products && Object.keys(products).length > 0) {
    document.getElementsByClassName("nav-extra")[0].children[0].innerText = Object.keys(products).length;
  } else {
    document.getElementsByClassName("nav-extra")[0].children[0].innerText = 0;
  }
}
numberincart();

function inputcartnumber(id, value) {
  if (value) {
    if (parseInt(value) != 0) {
      products[`${id}`].incart = parseInt(value);
      localStorage.setItem(
        "honeycareproduct",
        JSON.stringify(products, null, 2)
      );
      loadcart();
    } else {
      if (parseInt(value) === 0) {
        deleteitem(id);
        numberincart();
      }
    }
  }
}

// singleproduct add to cart
function itemQuantity(method) {
  var input = document.getElementById("singlenumber");
  if (method === "increase") {
    input.value = parseInt(input.value)+ 1;
  } else {
    if (input.value > 0) {
      input.value = parseInt(input.value) - 1;
    }
  }
}
function addsingletocart(data) {
  var input = document.getElementById("singlenumber");
  if (input.value > 0) {
    data.incart = parseInt(input.value);
    addtocart(data);
  } else {
    input.value = 1;
    addsingletocart(data);
  }
  
}


// ============================================
// FILE: script.js
// DESCRIPTION: Core functionality for FAKHAMAH
// ============================================
// ========== GLOBAL STATE ==========
const products = [
  {
    id: 1,
    name: "Jswr",
    inspired: "Summer Hammer",
    price: 350,
    oldPrice: 400,
    rating: 5,
    discount: "25%",
    image: "https://i.postimg.cc/ZR3N2kHZ/Jswr.jpg",
    description: "Tropical fruity notes with warm amber.",
    prices: { "30ml": 315, "50ml": 320, "100ml": 660 },
    stock: { "30ml": 0, "50ml": 10, "100ml": 0 },
  },
  {
    id: 2,
    name: "Ghsq",
    inspired: "Y Eau De Perfume",
    price: 320,
    oldPrice: 680,
    rating: 5,
    discount: "23%",
    image: "https://i.postimg.cc/XqfwGMBg/Ghsq.jpg",
    description: "Fresh aromatic with deep woody base.",
    prices: { "30ml": 315, "50ml": 320, "100ml": 585 },
    stock: { "30ml": 0, "50ml": 10, "100ml": 0 },
  },
  {
    id: 3,
    name: "Nsym",
    inspired: "Apple Brandy",
    price: 330,
    oldPrice: 750,
    rating: 4,
    discount: "22%",
    image: "https://i.postimg.cc/KjDMcnd2/Nsym.jpg",
    description: "Spicy apple with boozy vanilla.",
    prices: { "30ml": 315, "50ml": 320, "100ml": 585 },
    stock: { "30ml": 0, "50ml": 10, "100ml": 0 },
  },
];

// Cart stored in localStorage
let cart = JSON.parse(localStorage.getItem("FAKHAMAHCart")) || [];

// ========== NAVBAR & MOBILE MENU ==========
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const mobileOverlay = document.getElementById("mobileOverlay");

if (hamburger) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    if (mobileMenu) mobileMenu.classList.toggle("active");
    if (mobileOverlay) mobileOverlay.classList.toggle("active");
    document.body.style.overflow =
      mobileMenu && mobileMenu.classList.contains("active") ? "hidden" : "";
  });

  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", () => {
      hamburger.classList.remove("active");
      if (mobileMenu) mobileMenu.classList.remove("active");
      mobileOverlay.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  if (mobileMenu) {
    mobileMenu.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        mobileMenu.classList.remove("active");
        if (mobileOverlay) mobileOverlay.classList.remove("active");
        document.body.style.overflow = "";
      }),
    );
  }
}

// Navbar scroll effect
window.addEventListener("scroll", () => {
  if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 50);
});

// ========== CART FUNCTIONS ==========
function saveCart() {
  localStorage.setItem("FAKHAMAHCart", JSON.stringify(cart));
}

function updateCartCount() {
  const countEl = document.getElementById("cartCount");
  if (countEl) {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    countEl.textContent = total;
  }
}

function addToCart(productId, quantity = 1) {
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    const product = products.find((p) => p.id === productId);
    if (product) {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
      });
    }
  }
  saveCart();
  updateCartCount();

  // Trigger cart icon bump animation
  const countEl = document.getElementById("cartCount");
  if (countEl) {
    countEl.classList.remove("bump");
    void countEl.offsetWidth;
    countEl.classList.add("bump");
  }
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  updateCartCount();
}

// ========== PRODUCT CARD RENDERING ==========
function createProductCard(product, showAddToCart = true) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = `
    <div class="product-img"
    style="
        background-image:url('${product.image}');
        background-size:cover;
        background-position:center;
        background-repeat:no-repeat;
    ">
    </div>
    <h3>${product.name}</h3>
    <p class="inspired-by">Inspired by ${product.inspired}</p>
    <span class="price-current">${product.price} EGP</span>
    ${
      showAddToCart
        ? `<button class="btn-add-cart" data-id="${product.id}">Add To Cart</button>`
        : ""
    }
  `;

  if (showAddToCart) {
    card.querySelector(".btn-add-cart").addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(product.id);
    });
  }

  card.addEventListener("click", () => {
    window.location.href = `product.html?id=${product.id}`;
  });
  return card;
}

// ========== HOMEPAGE PRODUCT SLIDER ==========
const sliderTrack = document.getElementById("sliderTrack");
if (sliderTrack) {
  const allProducts = [...products, ...products, ...products];
  allProducts.forEach((p) => sliderTrack.appendChild(createProductCard(p)));

  let index = products.length;
  let autoSlideTimer;

  function updateSlider(animate = true) {
    const cardWidth =
      sliderTrack.querySelector(".product-card")?.offsetWidth || 300;
    sliderTrack.style.transition = animate ? "transform 0.5s ease" : "none";
    sliderTrack.style.transform = `translateX(-${index * (cardWidth + 24)}px)`;

    const dots = document.querySelectorAll("#sliderDots .dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index % products.length);
    });
  }

  // Create dot indicators
  const dotsContainer = document.getElementById("sliderDots");
  if (dotsContainer) {
    for (let i = 0; i < products.length; i++) {
      const dot = document.createElement("button");
      dot.classList.add("dot");
      dot.addEventListener("click", () => {
        index = products.length + i;
        updateSlider();
        resetAutoSlide();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideTimer = setInterval(() => {
      index++;
      updateSlider();
      // Loop seamlessly when reaching cloned end
      if (index >= products.length * 2) {
        setTimeout(() => {
          index = products.length;
          updateSlider(false);
        }, 500);
      }
    }, 3000);
  }

  function stopAutoSlide() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  // Arrow navigation
  document.getElementById("sliderPrev")?.addEventListener("click", () => {
    index--;
    updateSlider();
    if (index < 0) {
      setTimeout(() => {
        index = products.length * 2 - 1;
        updateSlider(false);
      }, 500);
    }
    resetAutoSlide();
  });

  document.getElementById("sliderNext")?.addEventListener("click", () => {
    index++;
    updateSlider();
    if (index >= products.length * 2) {
      setTimeout(() => {
        index = products.length;
        updateSlider(false);
      }, 500);
    }
    resetAutoSlide();
  });

  // Initialize
  updateSlider(false);
  startAutoSlide();

  // Pause auto-slide on hover
  const sliderContainer = document.querySelector(".slider-container");
  if (sliderContainer) {
    sliderContainer.addEventListener("mouseenter", stopAutoSlide);
    sliderContainer.addEventListener("mouseleave", startAutoSlide);
  }
}

// ========== FAQ SECTION ==========
const faqContainer = document.getElementById("faqContainer");
if (faqContainer) {
  const faqs = [
    {
      q: "Refund Policy",
      a: "14-day refund on unopened products.",
    },
    {
      q: "How Guarantee Works",
      a: "Performance guarantee: contact us if issues.",
    },
    {
      q: "Fragrance Performance Guide",
      a: "Apply to pulse points, lasts 8-12h.",
    },
    {
      q: "Shipping Cost",
      a: "Free shipping over 600 EGP",
    },
  ];

  faqs.forEach((f) => {
    const item = document.createElement("div");
    item.className = "faq-item";
    item.innerHTML = `
      <button class="faq-question">
        ${f.q}
        <span class="faq-icon"><i class="fa-solid fa-plus"></i></span>
      </button>
      <div class="faq-answer"><p>${f.a}</p></div>
    `;

    item.querySelector("button").addEventListener("click", () => {
      item.classList.toggle("active");
    });

    faqContainer.appendChild(item);
  });

  // Open first FAQ by default
  faqContainer.querySelector(".faq-item")?.classList.add("active");
}

// ========== SHOP PAGE: ALL PRODUCTS ==========
const productsGrid = document.getElementById("productsGrid");
if (productsGrid) {
  products.forEach((p) => productsGrid.appendChild(createProductCard(p)));
}

// ========== PRODUCT DETAIL PAGE ==========
const productDetail = document.getElementById("productDetail");
if (productDetail) {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const product = products.find((p) => p.id === id) || products[0];

  const sizePrices = product.prices || {
    "30ml": Math.round(product.price * 0.7),
    "50ml": product.price,
    "100ml": Math.round(product.price * 1.3),
  };
  const stock = product.stock || { "30ml": 5, "50ml": 5, "100ml": 5 };

  const availableSizes = Object.keys(stock).filter((s) => stock[s] > 0);
  let selectedSize = availableSizes.includes("30ml")
    ? "30ml"
    : availableSizes[0] || "50ml";
  let selectedPrice = sizePrices[selectedSize];

  // Build size buttons
  const sizeButtonsHTML = Object.keys(sizePrices)
    .map((size) => {
      const isOutOfStock = stock[size] === 0;
      const disabledAttr = isOutOfStock ? "disabled" : "";
      const activeClass =
        size === selectedSize && !isOutOfStock ? "active" : "";
      return `
        <button
          class="size-btn ${activeClass} ${disabledAttr ? "disabled" : ""}"
          data-size="${size}"
          ${disabledAttr}
        >
          ${size} ${isOutOfStock ? "(Out)" : ""}
        </button>`;
    })
    .join("");

  productDetail.innerHTML = `
    <div class="product-detail-flex">
      <div class="product-detail-img">
        <img
          src="${product.image}"
          alt="${product.name}"
          style="width:100%; height:100%; object-fit:cover; border-radius: var(--radius-lg);"
        />
      </div>
      <div class="product-detail-info">
        <h1>${product.name}</h1>
        <p class="inspired-by">Inspired by ${product.inspired}</p>
        <p style="color:var(--text-secondary); margin:1rem 0;">
          ${product.description}
        </p>

        <div class="size-selector" style="margin:1.5rem 0;">
          <label style="color:var(--text-secondary); display:block; margin-bottom:0.8rem;">
            Size:
          </label>
          <div style="display:flex; gap:1rem;">
            ${sizeButtonsHTML}
          </div>
        </div>

        <p
          style="font-size:2rem; color:var(--gold); font-family: var(--font-heading);"
          id="dynamicPrice"
        >
          ${selectedPrice} EGP
        </p>

        <div class="quantity-selector" style="margin:1.5rem 0;">
          <button class="quantity-btn" id="qtyMinus">-</button>
          <span id="quantityDisplay" style="color:#fff; font-size:1.2rem;">1</span>
          <button class="quantity-btn" id="qtyPlus">+</button>
        </div>

        <button class="btn btn-gold" id="addToCartDetail" style="width:100%;">
          Add to Cart
        </button>
        <p id="cartMessage" style="color:#27ae60; margin-top:0.5rem; display:none;">
          Added to cart!
        </p>
      </div>
    </div>`;

  let qty = 1;

  // Size selection
  document.querySelectorAll(".size-btn:not(.disabled)").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".size-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedSize = btn.dataset.size;
      selectedPrice = sizePrices[selectedSize];
      document.getElementById("dynamicPrice").textContent =
        selectedPrice + " EGP";
    });
  });

  // Quantity controls
  document.getElementById("qtyPlus").addEventListener("click", () => {
    qty++;
    document.getElementById("quantityDisplay").textContent = qty;
  });

  document.getElementById("qtyMinus").addEventListener("click", () => {
    if (qty > 1) qty--;
    document.getElementById("quantityDisplay").textContent = qty;
  });

  // Add to cart from detail page
  document.getElementById("addToCartDetail").addEventListener("click", () => {
    if (stock[selectedSize] === 0) {
      alert("This size is out of stock.");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("FAKHAMAHCart")) || [];
    const existing = cart.find(
      (item) => item.id === product.id && item.size === selectedSize,
    );

    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        size: selectedSize,
        price: selectedPrice,
        quantity: qty,
      });
    }

    localStorage.setItem("FAKHAMAHCart", JSON.stringify(cart));

    const countEl = document.getElementById("cartCount");
    if (countEl) {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      countEl.textContent = totalItems;
      countEl.classList.remove("bump");
      void countEl.offsetWidth;
      countEl.classList.add("bump");
    }

    if (typeof updateCartCount === "function") {
      updateCartCount();
    }

    const msg = document.getElementById("cartMessage");
    msg.style.display = "block";
    setTimeout(() => (msg.style.display = "none"), 1500);
  });
}

// ========== INITIAL CART COUNT ==========
updateCartCount();

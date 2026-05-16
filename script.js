// ========== GLOBAL STATE ==========
const products = [
  {
    id: 1,
    name: "Bali",
    inspired: "Summer Hammer",
    price: 450,
    oldPrice: 600,
    rating: 5,
    discount: "25%",
    image: "https://i.postimg.cc/jqLpw7HW/Per1.jpg",
    description: "Tropical fruity notes with warm amber.",
  },
  {
    id: 2,
    name: "Blue Night",
    inspired: "Y Eau De Perfume",
    price: 520,
    oldPrice: 680,
    rating: 5,
    discount: "23%",
    image: "https://i.postimg.cc/FHg85g4g/Per2.jpg",
    description: "Fresh aromatic with deep woody base.",
  },
  {
    id: 3,
    name: "Tuxedo",
    inspired: "Apple Brandy",
    price: 580,
    oldPrice: 750,
    rating: 4,
    discount: "22%",
    image: "https://i.postimg.cc/vm0KDYDg/Per3.jpg",
    description: "Spicy apple with boozy vanilla.",
  },
  {
    id: 4,
    name: "Maldives",
    inspired: "Le Beau Paradise Garden",
    price: 490,
    oldPrice: 640,
    rating: 5,
    discount: "23%",
    image: "https://i.postimg.cc/G2NSJXFv/Per4.jpg",
    description: "Citrus marine with coconut water.",
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
    mobileMenu.classList.toggle("active");
    mobileOverlay.classList.toggle("active");
    document.body.style.overflow = mobileMenu.classList.contains("active")
      ? "hidden"
      : "";
  });
  mobileOverlay?.addEventListener("click", () => {
    hamburger.classList.remove("active");
    mobileMenu.classList.remove("active");
    mobileOverlay.classList.remove("active");
    document.body.style.overflow = "";
  });
  mobileMenu?.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      mobileMenu.classList.remove("active");
      mobileOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }),
  );
}

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
  if (existing) existing.quantity += quantity;
  else {
    const product = products.find((p) => p.id === productId);
    if (product)
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
      });
  }
  saveCart();
  updateCartCount();
  // bump animation
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

// ========== RENDER PRODUCT CARD (reusable) ==========
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
        <span class="discount-badge">-${product.discount}</span>
    </div>

    <h3>${product.name}</h3>
    <p class="inspired-by">
        Inspired by ${product.inspired}
    </p>

    <span class="price-current">${product.price} EGP</span>
    <span class="price-old">${product.oldPrice} EGP</span>

    <div class="stars">
        ${"★".repeat(product.rating)}
        ${"☆".repeat(5 - product.rating)}
    </div>

    ${
      showAddToCart
        ? `<button class="btn-add-cart" data-id="${product.id}">
            Add To Cart
         </button>`
        : ""
    }
`;
  if (showAddToCart) {
    card.querySelector(".btn-add-cart").addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(product.id);
      const btn = e.target;
      btn.textContent = "✓ Added!";
      btn.style.background = "#27ae60";
      btn.style.borderColor = "#27ae60";
      btn.style.color = "#fff";
      setTimeout(() => {
        btn.textContent = "Add to Cart";
        btn.style.background = "";
        btn.style.borderColor = "";
        btn.style.color = "";
      }, 1500);
    });
  }
  card.addEventListener("click", () => {
    window.location.href = `product.html?id=${product.id}`;
  });
  return card;
}

// ========== HOME PAGE: SLIDER ==========
const sliderTrack = document.getElementById("sliderTrack");
if (sliderTrack) {
  const allProducts = [...products, ...products, ...products];
  allProducts.forEach((p) => sliderTrack.appendChild(createProductCard(p)));
  let index = products.length;
  const updateSlider = (animate = true) => {
    const cardWidth =
      sliderTrack.querySelector(".product-card")?.offsetWidth || 300;
    sliderTrack.style.transition = animate ? "transform 0.5s ease" : "none";
    sliderTrack.style.transform = `translateX(-${index * (cardWidth + 24)}px)`;
  };
  updateSlider(false);
  document.getElementById("sliderPrev")?.addEventListener("click", () => {
    index--;
    updateSlider();
    if (index < 0) {
      setTimeout(() => {
        index = products.length * 2 - 1;
        updateSlider(false);
      }, 500);
    }
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
  });
}

// ========== HOME PAGE: TESTIMONIALS ==========
const testimonialsTrack = document.getElementById("testimonialsTrack");
if (testimonialsTrack) {
  const reviews = [
    {
      name: "Ahmed K.",
      comment: '"Stunning fragrances! Longevity is incredible."',
      stars: 5,
      avatar: "👨",
    },
    {
      name: "Sarah M.",
      comment: '"أفضل عطور جربتها! الجودة ممتازة والسعر مناسب."',
      stars: 5,
      avatar: "👩",
    },
    {
      name: "Karim K.",
      comment: '"Packaging is next-level. Perfect for gifting."',
      stars: 5,
      avatar: "👨",
    },
  ];
  reviews.forEach((r) => {
    const div = document.createElement("div");
    div.className = "testimonial-card";
    div.innerHTML = `<div style="font-size:3rem;">${r.avatar}</div><div class="stars">${"★".repeat(r.stars)}</div><p class="comment">${r.comment}</p><p style="color:var(--gold);">— ${r.name}</p>`;
    testimonialsTrack.appendChild(div);
  });
}

// ========== FAQ ==========
const faqContainer = document.getElementById("faqContainer");
if (faqContainer) {
  const faqs = [
    { q: "Refund Policy", a: "14-day refund on unopened products." },
    {
      q: "How Guarantee Works",
      a: "Performance guarantee: contact us if issues.",
    },
    {
      q: "Fragrance Performance Guide",
      a: "Apply to pulse points, lasts 8-12h.",
    },
    { q: "Shipping Cost", a: "Free shipping over 600 EGP" },
    {
      q: "Return Policy",
      a: "Returns accepted within 7 days for damaged items.",
    },
  ];
  faqs.forEach((f) => {
    const item = document.createElement("div");
    item.className = "faq-item";
    item.innerHTML = `<button class="faq-question">${f.q}<span class="faq-icon"><i class="fa-solid fa-plus"></i></span></button><div class="faq-answer"><p>${f.a}</p></div>`;
    item.querySelector("button").addEventListener("click", () => {
      item.classList.toggle("active");
    });
    faqContainer.appendChild(item);
  });
  faqContainer.querySelector(".faq-item")?.classList.add("active");
}

// ========== COMPARISON SLIDER ==========
const comparisonHandle = document.getElementById("comparisonHandle");
const comparisonAfter = document.getElementById("comparisonAfter");
if (comparisonHandle && comparisonAfter) {
  let dragging = false;
  const move = (clientX) => {
    const rect = comparisonHandle.parentElement.getBoundingClientRect();
    let percent = ((clientX - rect.left) / rect.width) * 100;
    percent = Math.min(95, Math.max(5, percent));
    comparisonAfter.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    comparisonHandle.style.left = percent + "%";
  };
  comparisonHandle.addEventListener("mousedown", (e) => {
    dragging = true;
    e.preventDefault();
  });
  window.addEventListener("mousemove", (e) => {
    if (dragging) move(e.clientX);
  });
  window.addEventListener("mouseup", () => {
    dragging = false;
  });
  comparisonHandle.addEventListener("touchstart", (e) => {
    dragging = true;
  });
  window.addEventListener("touchmove", (e) => {
    if (dragging) move(e.touches[0].clientX);
  });
  window.addEventListener("touchend", () => {
    dragging = false;
  });
}

// ========== COUNTER ANIMATION ==========
const stats = document.querySelectorAll(".stat-number");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        let start = 0;
        const duration = 1500;
        const startTime = performance.now();
        const animate = (ts) => {
          const progress = Math.min((ts - startTime) / duration, 1);
          el.textContent =
            Math.floor(progress * target) + (target >= 1000 ? "+" : " ★");
          if (progress < 1) requestAnimationFrame(animate);
          else el.textContent = target + (target >= 1000 ? "+" : " ★");
        };
        requestAnimationFrame(animate);
        observer.unobserve(el);
      }
    });
  },
  { threshold: 0.5 },
);
stats.forEach((s) => observer.observe(s));

// ========== NEWSLETTER ==========
document
  .getElementById("newsletterForm")
  ?.addEventListener("submit", function (e) {
    e.preventDefault();
    const input = this.querySelector("input");
    if (input.value.includes("@")) {
      document.getElementById("newsletterSuccess")?.classList.add("show");
      input.value = "";
      setTimeout(
        () =>
          document
            .getElementById("newsletterSuccess")
            ?.classList.remove("show"),
        3000,
      );
    }
  });

// ========== SHOP PAGE: ALL PRODUCTS GRID ==========
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
  productDetail.innerHTML = `
        <div class="product-detail-flex">
            <div class="product-detail-img"><img src="${product.image}" alt="${product.name}"></div>
            <div class="product-detail-info">
                <h1>${product.name}</h1>
                <p style="color:var(--text-secondary);">${product.description}</p>
                <div class="product-specs">
                    <div class="spec-item"><span>Top Notes</span><span>Citrus, Bergamot</span></div>
                    <div class="spec-item"><span>Heart Notes</span><span>Jasmine, Spices</span></div>
                    <div class="spec-item"><span>Base Notes</span><span>Amber, Musk</span></div>
                    <div class="spec-item"><span>Longevity</span><span>8-12 hours</span></div>
                    <div class="spec-item"><span>Projection</span><span>Strong</span></div>
                </div>
                <p style="font-size:2rem;color:var(--gold);">${product.price} EGP</p>
                <div class="quantity-selector">
                    <button class="quantity-btn" id="qtyMinus">-</button>
                    <span id="quantityDisplay">1</span>
                    <button class="quantity-btn" id="qtyPlus">+</button>
                </div>
                <button class="btn btn-gold" id="addToCartDetail" style="width:100%;">Add to Cart</button>
            </div>
        </div>
    `;
  let qty = 1;
  document.getElementById("qtyPlus").addEventListener("click", () => {
    qty++;
    document.getElementById("quantityDisplay").textContent = qty;
  });
  document.getElementById("qtyMinus").addEventListener("click", () => {
    if (qty > 1) qty--;
    document.getElementById("quantityDisplay").textContent = qty;
  });
  document.getElementById("addToCartDetail").addEventListener("click", () => {
    addToCart(product.id, qty);
    alert("Added to cart!");
  });
}

// ========== CHECKOUT PAGE ==========
const checkoutContainer = document.getElementById("checkoutContainer");
if (checkoutContainer) {
  const renderCheckout = () => {
    if (cart.length === 0) {
      checkoutContainer.innerHTML =
        '<p style="text-align:center;color:var(--text-muted);">Your cart is empty.</p>';
      return;
    }
    let total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    let itemsHTML = cart
      .map(
        (item) => `
            <div class="cart-item">
                <span>${item.name} x${item.quantity}</span>
                <span>${item.price * item.quantity} EGP</span>
                <button class="remove-item" data-id="${item.id}" style="color:#c0392b;background:none;border:none;cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
            </div>
        `,
      )
      .join("");
    checkoutContainer.innerHTML = `
            <div class="cart-summary">
                <h3 style="color:var(--gold);">Order Summary</h3>
                ${itemsHTML}
                <div style="display:flex;justify-content:space-between;margin-top:1rem;font-weight:bold;"><span>Total</span><span>${total} EGP</span></div>
            </div>
            <form class="checkout-form" id="checkoutForm">
                <input type="text" placeholder="Full Name" required>
                <input type="tel" placeholder="Phone Number" required>
                <input type="text" placeholder="Address" required>
                <textarea placeholder="Order notes (optional)"></textarea>
                <button type="submit" class="btn btn-gold">Place Order</button>
            </form>
        `;
    document.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        removeFromCart(parseInt(btn.dataset.id));
        renderCheckout();
      });
    });
    document
      .getElementById("checkoutForm")
      .addEventListener("submit", function (e) {
        e.preventDefault();
        alert("Order placed! Thank you. (demo)");
        cart = [];
        saveCart();
        updateCartCount();
        renderCheckout();
      });
  };
  renderCheckout();
}

// ========== INIT ==========
updateCartCount();
// ========== || ==========

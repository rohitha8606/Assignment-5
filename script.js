document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('box');
  fetch('https://dummyjson.com/products')
    .then(res => res.json())
    .then(({ products }) => {
      if (!products || products.length === 0) {
        grid.innerHTML = '<p>No products found.</p>';
        return;
      }
      grid.innerHTML = products.map(p => {
        const cover = p.images?.[0] || p.thumbnail || '';
        const payload = JSON.stringify(p).replace(/'/g, '&#39;').replace(/"/g, '&quot;');
        return `
          <div class="card" data-product="${payload}">
            <img src="${cover}" alt="${p.title}">
            <div class="card-body">
              <h2>${p.title}</h2>
              <p class="price">₹${p.price} ${p.discountPercentage ? `<small>(-${p.discountPercentage}%)</small>` : ''}</p>
              <p><strong>Brand:</strong> ${p.brand}</p>
              <p><strong>Category:</strong> ${p.category}</p>
              ${p.tags ? `<p><strong>Tags:</strong> ${p.tags.join(', ')}</p>` : ''}
              <p><strong>Stock:</strong> ${p.stock}</p>
            </div>
          </div>`;
      }).join('');
    })
    .catch(err => {
      grid.innerHTML = `<p style="color:red;">Error loading products.</p>`;
      console.error(err);
    });
  grid.addEventListener('click', e => {
    const card = e.target.closest('.card');
    if (!card) return;
    const decodeHtml = (html) => {
      const txt = document.createElement('textarea');
      txt.innerHTML = html;
      return txt.value;
    };
    const productData = decodeHtml(card.dataset.product);
    localStorage.setItem('selectedProduct', productData);
    window.location.href = 'details.html';
  });
});

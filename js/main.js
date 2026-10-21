const orderButtons = document.querySelectorAll('[data-product]');
let orderDialog = document.getElementById('order-dialog');

// На страницах товаров форма создаётся из общего шаблона.
if (!orderDialog && orderButtons.length) {
  orderDialog = document.createElement('dialog');
  orderDialog.className = 'order-dialog';
  orderDialog.id = 'order-dialog';
  orderDialog.setAttribute('aria-labelledby', 'order-dialog-title');
  orderDialog.innerHTML = `
    <h2 class="order-dialog__title" id="order-dialog-title">Оформление заявки</h2>
    <p class="order-dialog__product">Товар: <strong id="order-dialog-product"></strong></p>
    <form class="order-form" id="order-form" action="#" method="post" novalidate>
      <input id="selected-product" name="selected-product" type="hidden">
      <div class="order-form__field">
        <label class="order-form__label" for="order-name">Имя</label>
        <input class="order-form__input" id="order-name" name="name" type="text" minlength="2" autocomplete="given-name" required>
      </div>
      <div class="order-form__field">
        <label class="order-form__label" for="order-email">E-mail</label>
        <input class="order-form__input" id="order-email" name="email" type="email" autocomplete="email" required>
      </div>
      <div class="order-form__field">
        <label class="order-form__label" for="order-phone">Телефон</label>
        <input class="order-form__input" id="order-phone" name="phone" type="tel" autocomplete="tel" required>
      </div>
      <div class="order-form__field">
        <label class="order-form__label" for="order-comment">Комментарий</label>
        <textarea class="order-form__textarea" id="order-comment" name="comment" rows="3"></textarea>
      </div>
      <div class="order-form__field">
        <label class="order-form__label">
          <input class="order-form__checkbox" name="agreement" type="checkbox" required>
          Я согласен на обработку данных
        </label>
      </div>
      <div class="order-form__actions">
        <button class="button button--secondary" type="button" id="close-order-dialog">Закрыть</button>
        <button class="button button--primary" type="submit">Отправить заявку</button>
      </div>
    </form>`;
  document.body.append(orderDialog);

  const successMessage = document.createElement('p');
  successMessage.className = 'success-message';
  successMessage.id = 'success-message';
  successMessage.setAttribute('role', 'status');
  successMessage.textContent = 'Заявка заполнена.';
  successMessage.hidden = true;
  document.querySelector('.product-detail').after(successMessage);
}

if (orderDialog) {
  const orderForm = document.getElementById('order-form');
  const selectedProductInput = document.getElementById('selected-product');
  const selectedProductName = document.getElementById('order-dialog-product');
  const successMessage = document.getElementById('success-message');

  orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const productName = button.dataset.product;
      selectedProductInput.value = productName;
      if (selectedProductName) selectedProductName.textContent = productName;
      successMessage.hidden = true;
      orderDialog.showModal();
    });
  });

  document.getElementById('close-order-dialog').addEventListener('click', () => {
    orderDialog.close();
  });

  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formElements = Array.from(orderForm.elements);

    formElements.forEach((element) => {
      if (element.willValidate) element.removeAttribute('aria-invalid');
    });

    if (!orderForm.checkValidity()) {
      formElements.forEach((element) => {
        if (element.willValidate && !element.checkValidity()) {
          element.setAttribute('aria-invalid', 'true');
        }
      });
      orderForm.reportValidity();
      return;
    }

    orderForm.reset();
    orderDialog.close();
    successMessage.hidden = false;
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

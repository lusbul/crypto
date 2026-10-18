(() => {
  const choices = Array.from(document.querySelectorAll('[data-artifact]'));
  const feedback = document.getElementById('puzzle-feedback');
  const count = document.getElementById('selection-count');
  const correct = [1, 3, 5, 7];
  const selected = () => choices.filter(button => button.getAttribute('aria-pressed') === 'true').map(button => Number(button.dataset.artifact));
  const updateCount = () => { count.textContent = `Обрано предметів: ${selected().length}`; };
  choices.forEach(button => {
    button.addEventListener('click', () => {
      button.setAttribute('aria-pressed', button.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      feedback.textContent = '';
      feedback.className = 'puzzle-feedback';
      updateCount();
    });
  });
  document.getElementById('check-artifacts').addEventListener('click', () => {
    const answer = selected();
    if (!answer.length) {
      feedback.textContent = 'Спочатку оберіть предмети на зображенні.';
      feedback.className = 'puzzle-feedback try-again';
      return;
    }
    const solved = answer.length === correct.length && correct.every(number => answer.includes(number));
    feedback.className = `puzzle-feedback ${solved ? 'solved' : 'try-again'}`;
    feedback.textContent = solved
      ? 'Загадку розкрито! 1 — голуб доставляє лист; 3 — телеграф передає повідомлення сигналами; 5 — семафорні прапорці передають повідомлення своїм положенням; 7 — смартфон надсилає повідомлення через мережу. Картотека зберігає записи, сейф захищає вміст, ключ відчиняє замок, а годинник вимірює час. Передавання повідомлення саме по собі ще не означає його шифрування.'
      : 'Ще не всі предмети обрано правильно. Поміркуйте: чи допомагає цей предмет передати повідомлення іншій людині на відстані? Змініть вибір і спробуйте ще раз.';
  });
  document.getElementById('reset-artifacts').addEventListener('click', () => {
    choices.forEach(button => button.setAttribute('aria-pressed', 'false'));
    feedback.textContent = '';
    feedback.className = 'puzzle-feedback';
    updateCount();
  });
})();

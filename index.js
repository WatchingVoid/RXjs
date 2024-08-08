const { fromEvent, merge } = rxjs;
const { map, scan, startWith, delay } = rxjs.operators;

// Получаем ссылки на элементы DOM
const incrementButton = document.getElementById('increment');
const decrementButton = document.getElementById('decrement');
const resetButton = document.getElementById('reset');
const counterDisplay = document.getElementById('counter');

// Создаем Observable для каждого события нажатия кнопки
const increment$ = fromEvent(incrementButton, 'click');
const decrement$ = fromEvent(decrementButton, 'click');
const reset$ = fromEvent(resetButton, 'click');

// Создаем потоки данных для изменения счетчика
const incrementAction$ = increment$.pipe(map(() => 1));
const decrementAction$ = decrement$.pipe(map(() => -1));
const resetAction$ = reset$.pipe(map(() => 0));

// Обработка сброса с задержкой
const delayedResetAction$ = resetAction$.pipe(
  delay(500), // Задержка в 500мс
  map(() => 'reset')
);

// Объединяем все действия в один поток
const counter$ = merge(
  incrementAction$,
  decrementAction$,
  delayedResetAction$
).pipe(
  startWith(0), // Начальное значение
  scan((acc, curr) => {
    if (curr === 'reset') {
      return 0;
    } else {
      return acc + curr;
    }
  })
);

// Подписываемся на изменения и обновляем DOM
counter$.subscribe(value => {
  counterDisplay.textContent = value;
});

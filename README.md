# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Компоненты
Паттерн проектирования MVC (Model-View-Controller)

# Model

### ApiProductsService
Получение продуктов по API

### Класс Cart
`Cart` управляет продуктами в корзине с помощью `StateEmitter`.

## Атрибуты

- **_stateEmitter**: `StateEmitter`
  - Отвечает за управление состоянием корзины.

## Методы

### constructor(stateEmitter: StateEmitter)
Инициализирует `_stateEmitter`.

### addToCart(product: Product): void
Добавляет продукт в корзину.

- `product`: Продукт для добавления.

### deleteFromCart(product: Product): void
Удаляет продукт из корзины.

- `product`: Продукт для удаления.

### deleteAllFromCart(): void
Удаляет все продукты из корзины.

### getProducts(): Product[]
Возвращает все продукты в корзине.

### calcSumCart(): number
Вычисляет общую стоимость продуктов в корзине.

### subscribeChangeCartId(product: Product, listener: (state: T) => void)
Подписывает слушателя на изменения конкретного продукта.

- `product`: Продукт для подписки.
- `listener`: Функция-слушатель.

### subscribeCart(listener: (state: T) => void): void
Подписывает слушателя на изменения корзины.

- `listener`: Функция-слушатель.

### unsubscribeChangeCartId(product: Product, listener: (state: T) => void)
Отписывает слушателя от изменений конкретного продукта.

- `product`: Продукт для отписки.
- `listener`: Функция-слушатель.

### unsubscribeCart(listener: (state: T) => void)
Отписывает слушателя от изменений корзины.

- `listener`: Функция-слушатель.

### _getArrCart(): Product[]
Возвращает массив продуктов в корзине.


# View

### Класс ShoppingCart
Рендеринг карзины, отображение списка товаров в корзине.

### Класс ProductComponent
Рендеринг одного продукта предпосмотра.

### Класс ProductList
Рендеринг полного списка продукутов каталога.

### Класс ProductFullCard
Рендеринг подробной карточки продукта.

### Класс Modal
Отвечает за модалку, открытие и зарытие.

### Класс OrderPaymentAndAddress
Первый шаг оформления заказа, тип оплаты и адрес.

### Класс OrderContactInformation
Второй шаг оформления заказа, почта и телефон.

### Класс CartStepFinal
Финаальный шаг заказа очищение корзины.

# Controller

### AppController
Запуск приложения и управление состояниями.

### Класс StateEmitter
`StateEmitter` управляет состояниями событий и уведомляет подписчиков об их изменениях.

## Атрибуты

- **_eventStateMap**: `Map<EventName, EventInfo<T>>`
  - Хранит состояния событий и подписчиков.

## Методы

### constructor()
Инициализирует `_eventStateMap`.

### updateState(eventName: EventName, newChangedState: Partial<T>): void
Обновляет состояние события, объединяя текущее состояние с новым.

- `eventName`: Имя события.
- `newChangedState`: Частичное новое состояние.

### getState(eventName: EventName): T
Возвращает текущее состояние события.

- `eventName`: Имя события.

### setState(eventName: EventName, newState: T): void
Устанавливает новое состояние события и уведомляет подписчиков.

- `eventName`: Имя события.
- `newState`: Новое состояние.

### getAllState(): Map<EventName, EventInfo<T>>
Возвращает все состояния событий.

### subscribe<T>(eventName: EventName, listener: Subscriber<T>, options: { onlyFutureEvents: boolean } = { onlyFutureEvents: false }): void
Подписывает слушателя на событие. Если `onlyFutureEvents` = `false`, уведомляет о текущем состоянии.

- `eventName`: Имя события.
- `listener`: Функция-слушатель.
- `options`: Опции подписки, по умолчанию `{ onlyFutureEvents: false }`.

### subscribeNewEvents(eventName: EventName, listener: Subscriber<T>): void
Подписывает слушателя на новые события без уведомления о текущем состоянии.

- `eventName`: Имя события.
- `listener`: Функция-слушатель.

### unsubscribe(eventName: EventName, listener: (state: T) => void, isFullDelete: boolean = false): void
Отписывает слушателя. Если `isFullDelete` = `true`, удаляет событие.

- `eventName`: Имя события.
- `listener`: Функция-слушатель.
- `isFullDelete`: Полное удаление, по умолчанию `false`.

### unsubscribeAll(eventName: EventName): void
Отписывает всех слушателей от события.

- `eventName`: Имя события.



## Типы данных
### Продукт
```
export interface Product {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}
```

### Данные по заказу
```
export interface OrderContactInformationData {
	paymentMethod: 'cash'	| 'card';
	address: string;
	email: string;
	phone: string;
	products: Product[];
}
```

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

### Класс StateEmitter
Слушатель событий, подписка и отписска на события, оюновление статуса события.


### Класс Cart
Управление состоянием корзины, добавление в корзину, удаление из корзины.

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


### Класс CartStep1
Первый шаг оформления заказа, тип оплаты и адрес.

### Класс CartStep2
Второй шаг оформления заказа, почта и телефон.

### Класс CartStepFinal
Финаальный шаг заказа очищение корзины.


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
export interface SecondStepOrderData {
	paymentMethod: 'cash'	| 'card';
	address: string;
	email: string;
	phone: string;
	cart: Product[];
}
```
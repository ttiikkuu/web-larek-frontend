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

### Класс ApiProductsService
`ApiProductsService` отвечает за взаимодействие с API для получения данных о продуктах.

## Методы

### constructor()
Инициализирует базовый URL для API.

### getAll(): Promise<Product[]>
Асинхронно получает список всех продуктов.

- Возвращает: Промис с массивом продуктов.




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
`ShoppingCartComponent` управляет отображением корзины покупок и взаимодействием с ней.

## Атрибуты

- **_stateEmitter**: `StateEmitter`
  - Управляет состоянием.
- **_nodes**: Объект с DOM-элементами корзины.
- **_cart**: `Cart`
  - Управляет содержимым корзины.
- **_modalCart**: `Modal` | `null`
  - Модальное окно корзины.

## Методы

### constructor(stateEmitter: StateEmitter, cart: Cart)
Инициализирует компонент корзины.

### _createCartModalContentNode(): HTMLElement
Создает DOM-элемент содержимого модального окна корзины.

### _createCartModalContentItemNode(product: Product, index: number): HTMLElement
Создает DOM-элемент для отдельного товара в корзине.

### _initEventListeners(): void
Инициализирует обработчики событий.

### _clickHeaderBasketListener(): void
Обработчик клика по корзине в шапке страницы.

### _clickCartItemDeleteBtnListener(product: Product): void
Обработчик клика по кнопке удаления товара из корзины.

### _clickCheckoutCartListener(cart: Cart): void
Обработчик оформления заказа.

### _renderCartInfo(): void
Обновляет информацию о корзине на странице.




### Класс ProductComponent
`ProductComponent` отвечает за отображение отдельного продукта.

## Атрибуты

- **product**: `Product`
  - Информация о продукте.
- **eventEmitter**: `StateEmitter`
  - Отправляет события при взаимодействии с продуктом.

## Методы

### constructor(product: Product, eventEmitter: StateEmitter)
Инициализирует компонент продукта.

### createNode(): HTMLElement
Создает DOM-элемент продукта.

### createCardNode(): HTMLElement
Создает DOM-элемент карточки продукта.

### updateCardContent(cardNode: HTMLElement): void
Обновляет содержимое карточки продукта.

### attachEventListeners(cardNode: HTMLElement): void
Присоединяет обработчики событий к карточке продукта.




### Класс ProductList
`ProductListComponent` отображает список продуктов.

## Атрибуты

- **galleryNode**: HTMLElement | null
  - DOM-элемент галереи продуктов.
- **stateEmitter**: `StateEmitter`
  - Отправляет события при взаимодействии с продуктами.

## Методы

### constructor(stateEmitter: StateEmitter)
Инициализирует компонент списка продуктов.

### render(products: Product[]): void
Отображает список продуктов.




### Класс ProductFullCard
`ProductFullCard` отображает полную карточку продукта.

## Атрибуты

- **product**: `Product`
  - Информация о продукте.
- **_stateEmitter**: `StateEmitter`
  - Отправляет события при взаимодействии с продуктами.
- **_existInBacket**: boolean
  - Флаг наличия продукта в корзине.
- **_fullCardBtnNode**: HTMLButtonElement
  - Кнопка добавления в корзину.
- **_cart**: `Cart`
  - Управляет содержимым корзины.

## Методы

### constructor(stateEmitter: StateEmitter, cart: Cart)
Инициализирует компонент полной карточки продукта.

### createNode(product: Product): HTMLElement
Создает DOM-элемент полной карточки продукта.

### _initializeCardContent(cardNode: HTMLElement, product: Product): void
Инициализирует содержимое карточки продукта.

### _attachEventListeners(cardNode: HTMLElement, product: Product): void
Присоединяет обработчики событий к карточке продукта.




### Класс Modal
`Modal` отображает модальное окно с контентом.

## Атрибуты

- **_pageWrapperNode**: HTMLElement | null
  - Обертка страницы.
- **_modalContainerNode**: HTMLElement | null
  - Контейнер модального окна.
- **_modalContentNode**: HTMLElement | null
  - Контент модального окна.
- **_modalCloseNode**: HTMLElement | null
  - Кнопка закрытия модального окна.
- **_closeFn**: FunctionVoid
  - Функция закрытия модального окна.
- **_nameModal**: string
  - Имя модального окна.
- **_stateEmitter**: StateEmitter
  - Генерирует события при взаимодействии с модальным окном.

## Методы

### constructor(content: HTMLElement, stateEmitter: StateEmitter, nameModal: string)
Инициализирует модальное окно.

### open({ closeFn }: { closeFn: FunctionVoid }): void
Открывает модальное окно.

### close(): void
Закрывает модальное окно.

### _addEventListeners(): void
Добавляет обработчики событий.

### _removeEventListeners(): void
Удаляет обработчики событий.

### _closeEscListener(event: KeyboardEvent): void
Обработчик нажатия клавиши Esc.

### _closeBtnClickListener(event: PointerEvent): void
Обработчик клика по кнопке закрытия.

### _closeOverlayClickListener(event: PointerEvent): void
Обработчик клика по области вне модального окна.




### Класс OrderPaymentAndAddress
Управляет процессом оформления заказа, включая выбор способа оплаты и ввод адреса доставки.

## Атрибуты

- **_stateEmitter**: StateEmitter
  - Генерирует события при взаимодействии с заказом.
- **_nodes**: OrderPaymentAndAddressNodes
  - DOM-элементы формы оформления заказа.
- **_cart**: Cart
  - Управляет содержимым корзины.
- **_formState**: OrderPaymentAndAddressFormState
  - Состояние формы оформления заказа.

## Методы

### constructor(stateEmitter: StateEmitter, cart: Cart)
Инициализирует компонент оформления заказа.

### createModalContentNode(): HTMLFormElement
Создает DOM-элемент формы оформления заказа.

### _clickBtnListener(event: PointerEvent): void
Обработчик клика по кнопкам выбора способа оплаты.

### _inputAddressListener(): void
Обработчик изменения в поле ввода адреса.

### _clickNextBtnListener(event: PointerEvent): void
Обработчик клика по кнопке перехода к следующему шагу оформления заказа.

### _renderFormErrors(): void
Обновляет сообщения об ошибках в форме оформления заказа.

### _goToStepTwo(): void
Переходит ко второму шагу оформления заказа.




### Класс OrderContactInformation
Управляет вводом контактной информации при оформлении заказа.

## Атрибуты

- **_stateEmitter**: StateEmitter
  - Генерирует события при взаимодействии с заказом.
- **_cart**: Cart
  - Управляет содержимым корзины.
- **_paymentMethod**: 'cash' | 'card'
  - Способ оплаты заказа.
- **_address**: string
  - Адрес доставки.
- **_nodes**: OrderContactInformationNodes
  - DOM-элементы формы ввода контактной информации.
- **_formState**: OrderContactInformationFormState
  - Состояние формы ввода контактной информации.

## Методы

### constructor(stateEmitter: StateEmitter, cart: Cart, { address, paymentMethod }: OrderPaymentAndAddressData)
Инициализирует компонент ввода контактной информации.

### createModalContentNode(): HTMLFormElement
Создает DOM-элемент формы ввода контактной информации.

### _inputInputEmailPhoneListener(): void
Обработчик изменения в полях ввода эл. почты и телефона.

### _clickPayBtnListener(event: PointerEvent): void
Обработчик клика по кнопке оплаты.

### _renderFormErrors(): void
Обновляет сообщения об ошибках в форме ввода контактной информации.

### _goToStepFinal(): void
Переходит к окончательному шагу оформления заказа.




### Класс OrderSuccessfullyPlaced
Отображает информацию об успешно оформленном заказе.

## Атрибуты

- **_stateEmitter**: StateEmitter
  - Генерирует события при взаимодействии с заказом.
- **_cart**: Cart
  - Управляет содержимым корзины.
- **_email**: string
  - Email пользователя.
- **_phone**: string
  - Номер телефона пользователя.
- **_paymentMethod**: 'cash' | 'card'
  - Способ оплаты заказа.
- **_address**: string
  - Адрес доставки.

## Методы

### constructor(stateEmitter: StateEmitter, cart: Cart, { email, phone, address, paymentMethod }: OrderContactInformationData)
Инициализирует компонент отображения успешно оформленного заказа.

### createModalContentNode(): HTMLElement
Создает DOM-элемент с информацией об успешно оформленном заказе.




# Controller

### AppController
Управляет основной логикой приложения.

## Атрибуты

- **stateEmitter**: StateEmitter
  - Генерирует события для обновления состояния приложения.
- **cart**: Cart
  - Управляет содержимым корзины.
- **apiProductsService**: ApiProductsService
  - Взаимодействует с сервером для получения списка продуктов.
- **productListComponent**: ProductListComponent
  - Отображает список продуктов.
- **shoppingCartComponent**: ShoppingCartComponent
  - Отображает содержимое корзины.

## Методы

### constructor()
Инициализирует контроллер и все необходимые компоненты.

### init(): void
Инициализирует приложение: обновляет состояние корзины, загружает список продуктов и настраивает слушателей событий.

### loadProducts(): void
Загружает список продуктов с сервера и отображает их на странице.

### setupEventListeners(): void
Устанавливает слушателей событий для открытия полного описания продукта.

### showProductFullCard(product: Product): void
Отображает полное описание продукта в модальном окне.




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

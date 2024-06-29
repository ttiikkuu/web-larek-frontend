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
Предоставляет методы для взаимодействия с API продуктов.

## Атрибуты

- **API_URL**: string
  - Базовый URL API.

## Методы

### constructor()
Инициализирует базовый URL для API, вызывая конструктор родительского класса `Api`.

### async getAll(): Promise<Product[]>
Получает список всех продуктов с сервера.

- **Возвращает**: Promise<Product[]>
  - Массив объектов `Product`.

- **Исключения**:
  - В случае ошибки сетевого запроса выводит сообщение в консоль и выбрасывает исключение.

Пример использования:
```
typescript
const apiService = new ApiProductsService();
apiService.getAll().then(products => {
  console.log(products);
}).catch(error => {
  console.error(error);
});
```


### Класс OrderStepTrackerService
Обеспечивает отслеживание и управление шагами процесса оформления заказа, а также отправку заказа на сервер.

## Атрибуты

- **_order**: Partial\<OrderData\>
  - Частично заполненный объект заказа.

- **_step**: number
  - Текущий шаг процесса оформления заказа (0 - начальный, 1 - шаг оплаты и адреса, 2 - шаг контактной информации).

- **_cart**: Cart
  - Объект корзины покупок, содержащий информацию о товарах.

## Методы

### constructor(cart: Cart)
Создает экземпляр `OrderStepTrackerService` и инициализирует корзину и базовый URL для API.

### saveStepOne({ paymentMethod, address }: OrderPaymentAndAddressData): void
Сохраняет данные первого шага (способ оплаты и адрес) и текущие продукты корзины.

- **Параметры**:
  - **paymentMethod**: 'cash' | 'card'
    - Способ оплаты.
  - **address**: string
    - Адрес доставки.

### saveStepTwo({ email, phone }: OrderContactData): void
Сохраняет данные второго шага (электронная почта и телефон). Может быть вызван только после завершения первого шага.

- **Параметры**:
  - **email**: string
    - Электронная почта.
  - **phone**: string
    - Номер телефона.

- **Исключения**:
  - Выбрасывает ошибку, если метод вызван до завершения первого шага.

### async sendOrderToServer(): Promise\<OrderResponse\>
Отправляет заказ на сервер. Может быть вызван только после завершения второго шага.

- **Возвращает**: Promise\<OrderResponse\>
  - Ответ от сервера с информацией о заказе.

- **Исключения**:
  - Выбрасывает ошибку, если метод вызван до завершения второго шага.
  - В случае ошибки запроса, возвращает заказ к первому шагу и выбрасывает ошибку.

Пример использования:
```
typescript
const cart = new Cart(stateEmitter);
const orderService = new OrderStepTrackerService(cart);

// Сохранение данных первого шага
orderService.saveStepOne({ paymentMethod: 'card', address: '123 Main St' });

// Сохранение данных второго шага
orderService.saveStepTwo({ email: 'test@example.com', phone: '123-456-7890' });

// Отправка заказа на сервер
orderService.sendOrderToServer().then(response => {
  console.log('Заказ успешно отправлен:', response);
}).catch(error => {
  console.error('Ошибка при отправке заказа:', error);
});
```




### Класс Cart
Обеспечивает управление корзиной покупок и подписку на изменения состояния с использованием объекта `StateEmitter`.

## Атрибуты

- **_stateEmitter**: StateEmitter
  - Объект для управления состоянием и подписки на изменения.

## Методы

### constructor(stateEmitter: StateEmitter)
Создает экземпляр `Cart` с указанным `stateEmitter` для управления состоянием.

- **Параметры**:
  - **stateEmitter**: StateEmitter
    - Объект для управления состоянием и подписки.

### addToCart(product: Product): void
Добавляет указанный продукт в корзину и обновляет состояние.

- **Параметры**:
  - **product**: Product
    - Продукт для добавления в корзину.

### deleteFromCart(product: Product): void
Удаляет указанный продукт из корзины и обновляет состояние.

- **Параметры**:
  - **product**: Product
    - Продукт для удаления из корзины.

### deleteAllFromCart(): void
Удаляет все продукты из корзины и обновляет состояние.

### getProducts(): Product[]
Возвращает массив всех продуктов в корзине.

### getIdProducts(): string[]
Возвращает массив идентификаторов всех продуктов в корзине.

### size(): number
Возвращает количество продуктов в корзине.

### totalPrice(): number
Возвращает общую стоимость всех продуктов в корзине.

### subscribeChangeCartId(product: Product, listener: (state: T) => void)
Подписывается на изменения состояния конкретного продукта в корзине.

- **Параметры**:
  - **product**: Product
    - Продукт, состояние которого требуется отслеживать.
  - **listener**: (state: T) => void
    - Функция-обработчик изменений состояния.

### subscribeCart(listener: (state: T) => void): void
Подписывается на изменения всей корзины.

- **Параметры**:
  - **listener**: (state: T) => void
    - Функция-обработчик изменений корзины.

### unsubscribeChangeCartId(product: Product, listener: (state: T) => void)
Отменяет подписку на изменения состояния конкретного продукта в корзине.

- **Параметры**:
  - **product**: Product
    - Продукт, состояние которого больше не требуется отслеживать.
  - **listener**: (state: T) => void
    - Функция-обработчик, подписка на изменения которой отменяется.

### unsubscribeCart(listener: (state: T) => void)
Отменяет подписку на изменения всей корзины.

- **Параметры**:
  - **listener**: (state: T) => void
    - Функция-обработчик, подписка на изменения которой отменяется.

### ifInCart(product: Product): boolean
Проверяет, содержится ли указанный продукт в корзине.

- **Параметры**:
  - **product**: Product
    - Продукт для проверки.

Пример использования:

```
typescript
const stateEmitter = new StateEmitter();
const cart = new Cart(stateEmitter);

// Добавление продукта в корзину
const product = new Product(1, 'Ноутбук', 1500, 'Мощный ноутбук для профессиональных задач');
cart.addToCart(product);

// Получение информации о корзине
console.log(cart.getProducts());
console.log(cart.totalPrice());
```

### Класс ProductComponentFactory
Создает экземпляры `ProductComponent` для заданных продуктов с использованием указанного объекта `StateEmitter`.

## Атрибуты

- **stateEmitter**: StateEmitter
  - Объект для управления состоянием и передачи событий.

## Методы

### constructor(stateEmitter: StateEmitter)
Создает экземпляр `ProductComponentFactory` с указанным `stateEmitter` для создания компонентов `ProductComponent`.

### create(product: Product): ProductComponent
Создает и возвращает экземпляр `ProductComponent` для заданного продукта с текущим `stateEmitter`.



# View

### Класс ModalCartComponent
Этот класс представляет модальное окно корзины, отображающее список добавленных товаров с возможностью удаления и оформления заказа.

## Атрибуты

- **_nodes**: объект, содержащий узлы DOM для управления содержимым модального окна.
- **_cart**: Cart
  - Корзина товаров, связанная с текущим заказом.
- **_modalOrderPaymentAndAddressComponent**: ModalOrderPaymentAndAddressComponent
  - Модальное окно для оформления платежа и адреса.

## Методы

- **open()**
  - Открывает модальное окно корзины и отрисовывает его содержимое.

## Приватные методы

- **_createModalContentNode()**
  - Создаёт узел содержимого модального окна корзины на основе HTML-шаблона.

- **_renderModalContent()**
  - Отрисовывает содержимое модального окна корзины.

- **_createCartModalContentItemNode(product, index)**
  - Создаёт узел для отдельного товара в корзине.

- **_initEventListeners()**
  - Инициализирует обработчики событий для элементов управления корзиной.

- **_renderCartCounterInfo()**
  - Обновляет счётчик товаров в корзине.

- **_cartStateCounterRenderListener()**
  - Обновляет счётчик товаров в корзине при изменении состояния корзины.

- **_cartStateAllRenderListener(cartObj)**
  - Обновляет содержимое корзины при изменении её состояния.

- **_clickHeaderBasketListener()**
  - Обработчик клика на корзину в заголовке страницы.

- **_clickCartItemDeleteBtnListener(product)**
  - Обработчик удаления товара из корзины.

- **_clickCheckoutCartListener(cart)**
  - Обработчик оформления заказа, открывает модальное окно для ввода платежных данных.

- **_renderCartInfo()**
  - Обновляет содержимое модального окна корзины и его элементы.




### Класс ProductComponent
Отвечает за создание HTML-элемента для отображения информации о продукте и управление его событиями с использованием `StateEmitter`.

## Атрибуты

- **product**: Product
  - Продукт, данные которого отображаются в компоненте.
  
- **stateEmitter**: StateEmitter
  - Объект для управления состоянием и передачи событий.

## Методы

### constructor(product: Product, eventEmitter: StateEmitter)
Создает экземпляр `ProductComponent` с указанным продуктом и объектом `StateEmitter` для управления состоянием.

### createNode(): HTMLElement
Создает HTML-элемент для отображения карточки продукта.

### updateCardContent(cardNode: HTMLElement): void
Обновляет содержимое HTML-элемента карточки продукта данными из объекта `product`.

### attachEventListeners(cardNode: HTMLElement): void
Присоединяет слушатели событий к HTML-элементу карточки продукта для взаимодействия с `StateEmitter`.




### Класс ProductListComponent
Отображает список продуктов в галерее на веб-странице с использованием `ProductComponentFactory`.

## Атрибуты

- **_galleryNode**: HTMLElement | null
  - Узел HTML для отображения галереи продуктов.

- **_productComponentFactory**: ProductComponentFactory
  - Фабрика компонентов продуктов для создания экземпляров `ProductComponent`.

## Методы

### constructor(productComponentFactory: ProductComponentFactory)
Создает экземпляр `ProductListComponent` с указанной фабрикой компонентов продуктов.

### render(products: Product[]): void
Отображает список продуктов, создавая для каждого продукта экземпляр `ProductComponent` и добавляя его в галерею.




### Класс ModalProductFullCardComponent
Расширяет базовый класс `Modal` для отображения полной карточки продукта в модальном окне с возможностью добавления в корзину.

## Атрибуты

- **_nodes**: { fullCardBtnNode: any, fullCardNode: any }
  - Узлы элементов модального окна.

- **_product**: Product
  - Текущий продукт, отображаемый в модальном окне.

- **_existInBacket**: boolean
  - Флаг, указывающий на наличие продукта в корзине.

- **_cart**: Cart
  - Объект корзины, для добавления и удаления продуктов.

## Методы

### constructor(cart: Cart, content?: HTMLElement, nameModal: string)
Создает экземпляр `ModalProductFullCardComponent` с указанной корзиной, опциональным содержимым и уникальным именем модального окна.

### openWithProduct(product: Product): void
Открывает модальное окно с полной карточкой заданного продукта и проверяет его наличие в корзине.

### _renderModalContent(): void
Отображает содержимое модального окна, создавая или используя уже существующие узлы.

### _initializeCardContent(cardNode: HTMLElement, product: Product): void
Инициализирует содержимое карточки продукта в модальном окне.

### _attachEventListeners(): void
Присоединяет обработчики событий, такие как клик по кнопке добавления в корзину.

### _clickCardBtnListener(): void
Обработчик события клика по кнопке добавления в корзину, который добавляет или удаляет продукт из корзины и обновляет текст кнопки.

### _checkIfInCart(): void
Проверяет, находится ли текущий продукт в корзине, и обновляет текст кнопки соответственно.

### open(): void
Переопределяет метод открытия модального окна, выводя сообщение об ошибке, так как открытие производится через метод `openWithProduct`.






### Класс Modal
Управляет модальным окном на веб-странице для отображения контента и обработки событий закрытия.

## Атрибуты

- **_pageWrapperNode**: HTMLElement | null
  - Узел страницы, блокирующий фон при открытом модальном окне.

- **_modalContainerNode**: HTMLElement | null
  - Контейнер модального окна.

- **_modalContentNode**: HTMLElement | null
  - Узел для отображения содержимого модального окна.

- **_modalCloseNode**: HTMLElement | null
  - Кнопка закрытия модального окна.

- **_nameModal**: string
  - Уникальное имя модального окна.

- **_isOpen**: boolean
  - Флаг состояния модального окна (открыто/закрыто).

- **_stateEmitter**: StateEmitter
  - Объект для управления состоянием и передачи событий.

## Методы

### constructor(content?: HTMLElement, nameModal: string)
Создает экземпляр `Modal` с опциональным содержимым и уникальным именем модального окна.

### open(): void
Открывает модальное окно, блокирует фон страницы.

### close(): void
Закрывает модальное окно, разблокирует фон страницы.

### onOpen(callback: VoidFunction): void
Устанавливает колбэк функцию, вызываемую при открытии модального окна.

### onClose(callback: VoidFunction): void
Устанавливает колбэк функцию, вызываемую при закрытии модального окна.




### Класс ModalOrderPaymentAndAddressComponent
Модальное окно для выбора способа оплаты и ввода адреса доставки заказа.

## Атрибуты

- **_nodes**: OrderPaymentAndAddressNodes
  - Объект с узлами DOM для управления содержимым модального окна.

- **_formState**: OrderPaymentAndAddressFormState
  - Состояние формы с выбранным способом оплаты и введённым адресом.

- **_orderStepTrackerService**: OrderStepTrackerService
  - Сервис отслеживания шагов оформления заказа.

- **_modalOrderContactInformationComponent**: ModalOrderContactInformationComponent
  - Модальное окно для ввода контактной информации.

## Методы

- **open()**
  - Открывает модальное окно и отрисовывает его содержимое.

## Приватные методы

- **_renderModalContent()**
  - Отрисовывает содержимое модального окна, используя шаблон из HTML.

- **_createModalContentNode()**
  - Создаёт узел формы модального окна с кнопками выбора способа оплаты и полем ввода адреса.

- **_initEventListeners()**
  - Инициализирует обработчики событий для кнопок выбора способа оплаты, ввода адреса и кнопки дальнейшего действия.

- **_clickBtnListener()**
  - Обработчик клика на кнопки выбора способа оплаты (карта или наличные).

- **_inputAddressListener()**
  - Обработчик ввода адреса доставки.

- **_clickNextBtnListener()**
  - Обработчик клика на кнопку дальнейшего действия, сохраняет данные первого шага и открывает следующее модальное окно.

- **_renderFormErrors()**
  - Отображает ошибки валидации формы в зависимости от состояния введённых данных.

- **_goToStepTwo()**
  - Переходит ко второму шагу оформления заказа, сохраняя данные первого шага и открывая модальное окно для ввода контактной информации.




### Класс ModalOrderContactInformationComponent
Модальное окно для ввода контактной информации при оформлении заказа.

## Атрибуты

- **_cart**: Cart
  - Корзина товаров, связанная с текущим заказом.

- **_nodes**: OrderContactInformationNodes
  - Объект с узлами DOM для управления содержимым модального окна.

- **_formState**: OrderContactInformationFormState
  - Состояние формы с введённой электронной почтой и телефоном.

- **_orderStepTrackerService**: OrderStepTrackerService
  - Сервис отслеживания шагов оформления заказа.

- **_modalOrderSuccessfullyPlacedComponent**: ModalOrderSuccessfullyPlacedComponent
  - Модальное окно для отображения информации о успешном размещении заказа.

## Методы

- **open()**
  - Открывает модальное окно и отрисовывает его содержимое.

## Приватные методы

- **_createModalContentNode()**
  - Создаёт узел формы модального окна для ввода контактной информации.

- **_renderModalContent()**
  - Отрисовывает содержимое модального окна, используя шаблон из HTML.

- **_renderResetInputs()**
  - Сбрасывает состояние формы, очищая поля ввода.

- **_inputInputEmailPhoneListener()**
  - Обработчик ввода электронной почты и телефона, обновляет состояние формы и валидирует данные.

- **_clickPayBtnListener()**
  - Обработчик нажатия на кнопку оплаты, сохраняет данные и переходит к следующему шагу оформления заказа.

- **_renderFormErrors()**
  - Отображает ошибки валидации формы в зависимости от состояния введённых данных.

- **_goToStepFinal()**
  - Переходит к финальному шагу оформления заказа, сохраняет данные второго шага и отправляет заказ на сервер.

- **_openNextStepModal()**
  - Открывает модальное окно с сообщением о успешном размещении заказа после его отправки на сервер.




### Класс ModalOrderSuccessfullyPlacedComponent
Расширяет базовый класс `Modal` для отображения модального окна с сообщением об успешном размещении заказа и информацией о списании средств.

## Атрибуты

- **_cart**: Cart
  - Объект корзины, используемый для удаления всех продуктов после успешного размещения заказа.

- **_nodes**: { orderSuccessNode: any, orderSuccessDescriptionNode: any }
  - Узлы элементов модального окна.

## Методы

### constructor(cart: Cart, content?: HTMLElement, nameModal: string)
Создает экземпляр `ModalOrderSuccessfullyPlacedComponent` с указанной корзиной, опциональным содержимым и уникальным именем модального окна.

### open(): void
Открывает модальное окно с сообщением об успешном размещении заказа, отображает информацию о списании средств, инициирует закрытие корзины и вызывает метод открытия родительского модального окна.

### _createModalContentNode(): HTMLElement
Создает узел содержимого модального окна, используя шаблон успеха. Включает элементы узлов и привязывает обработчик закрытия окна.

### _renderSuccessDescriptionInfo(): void
Отображает информацию о списании средств в модальном окне на основе текущего состояния корзины.

### _renderModalContent(): void
Отображает содержимое модального окна, создавая или используя уже существующие узлы.




# Controller

### AppController
Контролирует и координирует работу приложения, инициализирует основные компоненты и сервисы, управляет состоянием и взаимодействием пользовательского интерфейса.

## Атрибуты

- **stateEmitter**: StateEmitter
  - Эмиттер состояний для управления состоянием приложения.

- **cart**: Cart
  - Объект корзины покупок.

- **apiProductsService**: ApiProductsService
  - Сервис для работы с продуктами через API.

- **productListComponent**: ProductListComponent
  - Компонент для отображения списка продуктов.

- **orderStepTrackerService**: OrderStepTrackerService
  - Сервис для отслеживания шагов оформления заказа.

- **modalCartComponent, modalOrderPaymentAndAddressComponent, modalOrderContactInformationComponent, modalOrderSuccessfullyPlacedComponent, modalProductFullCardComponent**: ModalCartComponent, ModalOrderPaymentAndAddressComponent, ModalOrderContactInformationComponent, ModalOrderSuccessfullyPlacedComponent, ModalProductFullCardComponent
  - Компоненты модальных окон для различных частей оформления заказа и работы с корзиной.

- **productComponent, productComponentFactory**: ProductComponent, ProductComponentFactory
  - Компоненты и фабрика для работы с отдельными продуктами и создания их компонентов.

## Методы

### constructor()
Инициализирует все необходимые сервисы и компоненты, связывает их между собой для корректной работы приложения.

### init(): void
Инициализирует состояние приложения, загружает продукты и настраивает обработчики событий.

### loadProducts(): void
Загружает список продуктов с использованием сервиса `apiProductsService` и передает их в компонент `productListComponent` для отображения.

### setupEventListeners(): void
Настроивает обработчики событий, включая подписку на событие открытия полной карточки продукта (`openFullCard`).

### showProductFullCard(product: Product): void
Отображает модальное окно с полной карточкой продукта, используя компонент `modalProductFullCardComponent`.




### Класс StateEmitter
Управляет состоянием корзины покупок с помощью объекта `StateEmitter`, обеспечивая добавление и удаление продуктов, расчет общей стоимости, а также подписку на изменения состояния корзины.

## Атрибуты

- **_stateEmitter**: StateEmitter
  - Объект для управления и подписки на изменения состояния корзины.

## Методы

### addToCart(product: Product): void
Добавляет указанный продукт в корзину и обновляет состояние.

### deleteFromCart(product: Product): void
Удаляет указанный продукт из корзины и обновляет состояние.

### deleteAllFromCart(): void
Удаляет все продукты из корзины и обновляет состояние.

### getProducts(): Product[]
Возвращает массив всех продуктов в корзине.

### getIdProducts(): string[]
Возвращает массив идентификаторов всех продуктов в корзине.

### size(): number
Возвращает количество продуктов в корзине.

### totalPrice(): number
Возвращает общую стоимость всех продуктов в корзине.

### subscribeChangeCartId(product: Product, listener: (state: T) => void)
Подписывается на изменения состояния конкретного продукта в корзине.

### subscribeCart(listener: (state: T) => void): void
Подписывается на изменения всей корзины.

### unsubscribeChangeCartId(product: Product, listener: (state: T) => void)
Отменяет подписку на изменения состояния конкретного продукта в корзине.

### unsubscribeCart(listener: (state: T) => void)
Отменяет подписку на изменения всей корзины.

### ifInCart(product: Product): boolean
Проверяет, содержится ли указанный продукт в корзине.




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
export interface OrderData {
	paymentMethod: 'cash'	| 'card';
	email: string;
	address: string;
	phone: string;
	products: Product[];
}
```

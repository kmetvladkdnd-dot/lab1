# Лабораторна робота №2: Розробка REST API без використання БД

Проєкт складається з клієнтської частини (Frontend) та серверної частини (Backend), реалізованої на Node.js з використанням TypeScript та архітектурного підходу "Data-Service-Controller".

## Структура проєкту

* `/frontend` — статичні файли клієнта (HTML, CSS, JS).
* `/backend` — вихідний код сервера на TypeScript.
  * `src/controllers` — обробка HTTP-запитів.
  * `src/services` — бізнес-логіка програми.
  * `src/repositories` — збереження даних в пам'яті (In-memory storage).
  * `src/routes` — маршрутизація API.
  * `src/dtos` — об'єкти передачі даних.

## Технологічний стек

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express
- **Development tools:** tsx (для hot-reload), prettier, eslint

## Як запустити

### 1. Запуск бекенду
Перейдіть у папку `backend` та виконайте команди:
```bash
npm install
npm run dev

Сервер буде доступний за адресою: http://localhost:3000

2. Запуск фронтенду
Просто відкрийте файл index.html з папки /frontend у будь-якому браузері.

Приклади API запитів
Для перевірки працездатності можна використовувати cURL:

Отримати всіх користувачів:
curl -i http://localhost:3000/api/users

Створити нового користувача:
curl -i -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d "{\"name\":\"Vladyslav\",\"email\":\"vlad@student.com\"}"

Валідація (400 Bad Request):
curl -i -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d "{\"name\":\"A\",\"email\":\"wrong-email\"}"
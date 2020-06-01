# Install
1) npm i / npm ci
2) create new MySQL database (without tables)
3) create `config.${ENV}.json (by default: config.dev.json)
Minimal example:
```
{
  "connections": {
    "db": {
      "host": "localhost",
      "database": "test",
      "username": "root",
      "password": "password"
    }
  }
}
```
4) run app: ENV=prod node app.js / node app.js
5) open ./messageGenerator.js and check cfg block
6) run messageGenerator: node messageGenerator.js
7) Open browser (by default: http://localhost:3000)


# TODO
1) Добавить тесты (фронт и бек).
2) На фронте перейти от удаления и добаления строк таблицы к обновлению уже имеющейся строки.
2.1) Заменить вставку html на jquery.
2.2) Структурировать код.
2.3) Наиболее правильным вариантом был бы переход на react + redux, что позволило бы полностью работать с данными через состояние.
3) Если оставлять фронт частью приложения и не выносить его отдельно на react, то в роутинге для страницы можно добатиь получение данных из БД. Текущий вариант больше подходит для фронта, запущенного отдельным приложением.
4) Для записей в тиблице нет возможности сортировки.
5) Если messageGenerator будет запускаться только из данной папки, то сделать получение cfg части из config файла основного приложения.
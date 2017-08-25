# Lost my phone

This is my entry for the js13kgames competition 2017.

## Installation

```sh
git clone https://github.com/Ryuno-Ki/js13kgames-2017.git
cd js13kgames-2017/
```

## Local development

`npm start` and then visiting [localhost:3000](http://localhost:3000) in a
web browser.
Create new bundles with `npm run build:dev`.

## Bundling and shipping

```sh
npm run build:prod
git commit -a
git push
```

## TODO

* [] Improve collision detection
* [] Add scores
* [] Replace circle with sprite
* [] Generally increase difficulty
* [] Looks like most circle mazes have walls between concentric circles
* [] Write test cases
* [] Add npm script for only serving dist directory on gh-pages branch
* [] Add watch task for development
* [] Add a "fork me on GitHub" and js13kgames link
* [] Add some story elements (translateable?)
* [] Refactor code to central state

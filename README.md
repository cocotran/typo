# Need a name ????

## Description

Typing practicing website with generated texts as short facts (or piece of infomation) or news so that users can improve their typing while reading news, learning new stuffs.<br/>

## Stacks

Front end: Vanilla Javascript (to keep it simple)<br/>
Back end: Golang (~~becoz of that fancy concurrency thing and I want to look cool~~ because Golang is fast, easy to read, supports concurrency out of the box and it's a good idea to keep up with new technology :) )<br/>

## Usage

- Install node dependencies

```bash
npm install
```

- Install gorilla/mux for http routing

```bash
go get -u github.com/gorilla/mux
```

_[Detail](https://github.com/gorilla/mux)_

- Install google firestore for databse

```bash
go get cloud.google.com/go/firestore
```

_[Detail](https://pkg.go.dev/cloud.google.com/go/firestore)_


## Core Components

1. Front end<br/>
   Typing game<br/>
   Stats<br/>
   Music<br/>

2. Back end<br/>
   Web scraper to generate contents<br/>
   Database to store content (news and facts)<br/>

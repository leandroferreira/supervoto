Super Voto
=========

||| colocar descrição |||

Front-end
---------

O projeto utiliza as seguintes tecnologias:

* Gulp: responsável por tarefas de build, como minificar imagens e copiar arquivos
* Sass/Compass: framework CSS
* Susy: grid system que roda em cima do Compass

Todos os fontes do projeto se encontram na pasta src, e são compilados para a pasta dev ou build. Ou seja, edite os arquivos **sempre** na pasta /src e publique **apenas** os arquivos da pasta build. Para desenvolvimento, aponte o browser para a pasta /dev.

### Instalação

1. Instalar Ruby e suas dependências (Compass e Susy)
  1. Instalar Ruby e rvm: http://rvm.io/rvm/install
  2. ``` $ rvm gemset create supervoto && rvm gemset use supervoto ```
  3. ``` $ bundle install ```

2. Instalar NodeJS e suas dependências (Gulp)
  1. Instalar NodeJS: http://nodejs.org
  2. ``` $ npm install ```

3. Instalar dependências javascript pelo Gulp
  1. ``` $ gulp install ```

### Desenvolvimento

Para desenvolver, deixe o Gulp rodando em modo watch: ``` $ gulp ```

### Produção

Para gerar uma build de produção, rode a rotina: ``` $ gulp build ```
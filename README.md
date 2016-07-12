# node-add-common-sh

init your working directory with common useful .sh files


```bash

$ npm install shm -g

$ shm <command> [args...]

```

## add **a** command 

```bash

$ shm add <command_name> -[t|f] [text|path]

```

### example

```bash

# add file content
$ shm add commit --file ./my-commit.sh
# or
$ shm add commit -f ./my-commit.sh

# add text content
$ shm add pull --text "git pull"
# or
$ shm add pull -t "git pull"

```

## combine current commands into **one**

```bash

$ shm co <command_name> [command|text] [command|text] [command|text] [...]

```

### example

```bash

$ shm co git commit pull "git status"

```

## remove existing command(s)

```bash

$ shm rm <command_name> <command_name> <...> 

```


### example

```bash

$ shm rm commit pull git

```

## remove all existing commands

```bash

$ shm clean

```

## list all existing commands

```bash

# view all names
$ shm ls

# view all details
$ shm ls -a

```




## Demo-1

```bash

$ shm add add -t "git add -A"
$ shm add commit -t "git commit -m 'push'"
$ shm add pull -t "git push"


$ shm co git add commit pull

# init my directory
# then we'll get `add.sh` `commit.sh` `pull.sh`
$ shm git 

```

## Demo-2

```bash

# browserSync cli 
# here we use `${}` as placeholders
# for necessary params
$ shm add bs -t "browser-sync start --server --files \"${files}\" --index \"${index}\" --open \"external\" --reload-debounce --no-notify"

# init my directory and get the `bs.sh`
$ shm bs --file '**' --index 'index.html'

```

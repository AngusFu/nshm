# nshm ( Node.js .sh Scripts Manager )

init your working directory with common useful .sh files

<a href="https://segmentfault.com/a/1190000005947697#articleHeader0" target="_blank">[中文版]</a>

```bash

$ npm install nshm -g

$ nshm <command> [args...]

```

## add **a** command 

```bash

$ nshm add <command_name> -[t|f] [text|path]

```

### example

```bash

# add file content
$ nshm add commit --file ./my-commit.sh
# or
$ nshm add commit -f ./my-commit.sh

# add text content
$ nshm add pull --text "git pull"
# or
$ nshm add pull -t "git pull"

```

## combine current commands into **one**

```bash

$ nshm co <command_name> [command|text] [command|text] [command|text] [...]

```

### example

```bash

$ nshm co git commit pull "git status"

```

## remove existing command(s)

```bash

$ nshm rm <command_name> <command_name> <...> 

```


### example

```bash

$ nshm rm commit pull git

```

## remove all existing commands

```bash

$ nshm clean

```

## list all existing commands

```bash

# view all names
$ nshm ls

# view all details
$ nshm ls -a

```

## get version number

```bash

$ nshm -v
$ nshm --version

```


## Demo-1

```bash

$ nshm add add -t "git add -A"
$ nshm add commit -t "git commit -m 'push'"
$ nshm add pull -t "git push"


$ nshm co git add commit pull

# init my directory
# then we'll get `add.sh` `commit.sh` `pull.sh`
$ nshm git 

```

## Demo-2

```bash

# browserSync cli 
# here we use `${}` as placeholders
# for necessary params
$ nshm add bs -t "browser-sync start --server --files \"${files}\" --index \"${index}\" --open \"external\" --reload-debounce --no-notify"

# init my directory and get the `bs.sh`
$ nshm bs --file '**' --index 'index.html'

```

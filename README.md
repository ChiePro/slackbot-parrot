# README

## What's this ?
- Slackbot for parrot

## Requirements
- Node.js v8.11.2
- npm v5.6.0

## Installation
### Windows
  0. install the emoji of parrot

  1. clone this repository<br>
    `git clone https://github.com/Chiebukuro-developers/slackbot-parrot.git`

  1. install modules<br>
    `npm install`

  1. run parrot.js<br>
    `npm run start`

### Mac or Linux
- Same as Windows

## Functional Description
- TBC

## Develop Guideline
### Develop Flow
- please develop follow the under work procedure

  1. Create a issue or Select a issue
  1. Create branch follow this guideline
  1. Resolve issue in local environment
  1. Create Merge Request
  1. If pointed out by Master, fix codes
  1. Master gonna Merge
  1. Loop from first

### Commit Guideline
- please follow the commit format when you commit

#### Commit Format
When you merged other branch
```
[#[Issue No] merge] origin/[Branch name]
```

Others
```
[#[Issue No] [Commit type]] [Commit title]
```

#### Issue No
- please write issue no

#### Branch name
- please write branch name to be merge

#### Commit types
- `feat`: when you add new handler and so on
- `fix`: when you fix bug
- `doc`: when you edit document or add new document
- `comment`: when you make changes comments in code
- `refactor`: when you make changes existing code other than `comment`
- `perf`: when you make changes codes for increased performance
- `merge`: when you merged other branch
- `chore`: others

#### Commit title
- please write the brief of commit

#### example
When you merged other branch
```
[#1 merge] origin/master
```

Others
```
[#1 style] changed logo img source
```


### Create Branch Guideline
- please follow the branch name format when you create new branch

#### Banch name Format
```
#[Issue No]-[Branch name]
```

#### Issue No
- please write issue no

#### Branch name
- please write appropriate branch name

#### example
```
#1-set-ip-when-check-in
```

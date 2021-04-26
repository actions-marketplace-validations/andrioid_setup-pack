# setup-pack

Installs and caches the `pack` tool from [CNCF Buildpacks](https://buildpacks.io).

## Usage

```yaml
# in your job:
name: MY GREAT JOB
on:
  push:
    branches:
      - '*'
jobs:
  yq-example:
    name: YQ example!
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v1
    - uses: andrioid/setup-pack@latest
    - name: Show folks how to run Pack:
      run: |
        pack --help
```

## Local Development

Change the `index.ts` and remember to run `npm run build` afterwards. I use [esbuild](https://esbuild.github.io/) to bundle the source-code.

## Credits

- [setup-yq](https://github.com/chrisdickinson/setup-yq) inspired me to write this. It's very lean and mean.

# get-now-json

An endpoint that returns a now.json file based on passed query params.

## Motivation

I wanted to setup some tooling for myself that makes it easy for me to scaffold out projects deployable to [zeit](https://zeit.co).
This lambda powers a set in that tooling.

## Usage

Any [supported now.json config property](https://zeit.co/docs/v2/deployments/configuration/) can be passed as a query param with a value.

The `version` property is always set to `2` by default and can be overriden by a `version` query parameter.

### Important note

This project does **NO** validation of the json it outputs. That is delegated to the `now` CLI and occurs when it tries to consume the generated json config in the context of _your_ project.

### Examples

```curl
curl "https://now-json.zdx.cat" # returns { "version": 2, "public": false }
curl "https://now-json.zdx.cat?name=my-project" # returns { "version": 2, "public": false, "name": "my-project"}

# returns the builds object wrapped in an array as expected by `now` cli
curl 'https://now-json.zdx.cat?name=my-project&builds=\{"src": "a.js", "use": "@now/node"\}'

# these two return the same object with a builds array
curl 'https://now-json.zdx.cat?name=my-project&builds=\{"src": "a.js", "use": "@now/node"\}&builds=\{"src": "index.html", "use": "@now/static"\}'
curl 'https://now-json.zdx.cat?name=my-project&builds=\[\{"src": "a.js", "use": "@now/node"\},\{"src": "index.html", "use": "@now/static"\}\]'
```

or if you want to try it in the browser, [click me!](https://now-json.zdx.cat/?name=my-project&builds={%22src%22:%20%22a.js%22,%20%22use%22:%20%22@now/node%22}&builds={%22src%22:%20%22index.html%22,%20%22use%22:%20%22@now/static%22})

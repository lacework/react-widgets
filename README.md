Lacework fork of react-widgets@3.4.5
=============

# Releasing
This could be a single script in package.json, but I figured being explicit is better to catch issues. And we will 
probably never release another version.

Build for production
```
npm run build
```

Bump the version number. This uses the preid format so we have an obvious link to the source docs and code if neede
```
npm version prerelease --preid fork.<next version here> --no-git-tag-version
```

Publish 
```
npm publish --access public --tag latest
```

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]
[![#react-widgets channel on reactiflux discord](https://img.shields.io/badge/discord-%23react--widgets-blue.svg?style=flat-square)](https://discord.gg/0ZcbPKXt5bY4znh9)

An à la carte set of polished, extensible, and accessible form inputs built for React, based on the excellent Kendo UI Core and jQuery UI.

Pick and choose one, or more of the following Components
- DropdownList
- ComboBox
- Multiselect
- SelectList (checkbox and radio group)
- DateTimePicker
- Calendar
- NumberPicker

__Demos and Documentation [here](http://jquense.github.io/react-widgets/docs/)__

### Install

`npm install react-widgets`

### Building local docs

The docs are a simple React app hosted on gh-pages, you build and run locally with the command `npm run docs` and open up `http://localhost:8080/docs/index.htm#/`

### Contributing

Patches welcome! Please try to match the style of the repo (comma first, 2 spaces, etc), squash large pull requests (a few commits is fine), and provide tests if relevant. It is also a good idea to open an issue and start a conversation before implementing new features or widgets.

### Old Browser Support

The goal is to support IE8+, but currently it is difficult for me to test a wide variety of browsers so there is no guarantee it will work (patches welcome!).

[npm-image]: https://img.shields.io/npm/v/react-widgets.svg?style=flat-square
[npm-url]: https://npmjs.org/package/react-widgets
[downloads-image]: http://img.shields.io/npm/dm/react-widgets.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/react-widgets

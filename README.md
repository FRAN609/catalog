<!-- https://raw.githubusercontent.com/electron/electron-apps/master/readme.md --->

# Catalog
Web app database, used by [WebCatalog](https://webcatalogapp.com) & [Singlebox](https://singleboxapp.com).

If you have an web application you'd like to see added, follow the instructions.

## How it Works

This package is a joint effort between humans and robots.

First, a human adds an app:

```
apps
└── gmail
    ├── gmail-icon.png
    └── gmail.yml
```

The yml file requires just a few fields:

```yml
name: Gmail
url: 'https://gmail.com'
category: Productivity
```

The human then opens a PR. Tests pass, the PR gets merged. Yay!

Later, a bot comes along and generate additional files. Lastly, the bot publishes a new release to our server.

## Submit New App
If you have an web application you'd like to see added, please [create a new issue](https://github.com/atomery/catalog/issues) or
[open a pull request](https://help.github.com/articles/creating-a-pull-request/).

### Adding New App By Hand 💪
An easy way to add a new app is to copy an existing app and edit its metadata.

To do so, create a new directory in the `apps` directory and include a `.yml`
file and `.png` icon file. The directory can only contain numbers,
lowercase letters, and dashes, and the yml and icon files should be named
like so:

```
apps
└── my-cool-app
    ├── my-cool-app-icon.png
    └── my-cool-app.yml
```

### YML File Rules
- `name` is required.
- `url` is required, and must be a fully-qualified URL.
- `category` is required, and must be one of the following values:
  - Business
  - Developer Tools
  - Education
  - Entertainment
  - Finance
  - Games
  - Graphics & Design
  - Health & Fitness
  - Lifestyle
  - Medical
  - Music
  - News
  - Photography
  - Productivity
  - Reference
  - Social Networking
  - Sports
  - Travel
  - Utilities
  - Video
  - Weather

### Icons
- Must be a `.png`
- Must be a square
- Must be at least 256px by 256px. Should be at 1024px by 1024px.

# My kindle contents list

Get your kindle contents list.

## install

First, install Kindle for PC. Because use the app's cache xml.

```bash
brew install --cask kindle
```

Next, setting up nodejs.

```bash
yarn install
```

## run

```bash
node index.js "$HOME/Library/Application Support/Kindle/Cache/KindleSyncMetadataCache.xml"
```

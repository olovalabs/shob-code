<p align="center">
  <a href="https://shob.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="shob logo">
    </picture>
  </a>
</p>
<p align="center">The open source AI coding agent.</p>
<p align="center">
  <a href="https://shob.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://www.npmjs.com/package/shob-ai"><img alt="npm" src="https://img.shields.io/npm/v/shob-ai?style=flat-square" /></a>
  <a href="https://github.com/anomalyco/shob/actions/workflows/publish.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/anomalyco/shob/publish.yml?style=flat-square&branch=dev" /></a>
</p>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.gr.md">Ελληνικά</a> |
  <a href="README.vi.md">Tiếng Việt</a>
</p>

[![shob Terminal UI](packages/web/src/assets/lander/screenshot.png)](https://shob.ai)

---

### Installation

```bash
# YOLO
curl -fsSL https://shob.ai/install | bash

# Package managers
npm i -g shob-ai@latest        # or bun/pnpm/yarn
scoop install shob             # Windows
choco install shob             # Windows
brew install anomalyco/tap/shob # macOS and Linux (recommended, always up to date)
brew install shob              # macOS and Linux (official brew formula, updated less)
sudo pacman -S shob            # Arch Linux (Stable)
paru -S shob-bin               # Arch Linux (Latest from AUR)
mise use -g shob               # Any OS
nix run nixpkgs#shob           # or github:anomalyco/shob for latest dev branch
```

> [!TIP]
> Remove versions older than 0.1.x before installing.

### Desktop App (BETA)

shob is also available as a desktop application. Download directly from the [releases page](https://github.com/anomalyco/shob/releases) or [shob.ai/download](https://shob.ai/download).

| Platform              | Download                              |
| --------------------- | ------------------------------------- |
| macOS (Apple Silicon) | `shob-desktop-darwin-aarch64.dmg` |
| macOS (Intel)         | `shob-desktop-darwin-x64.dmg`     |
| Windows               | `shob-desktop-windows-x64.exe`    |
| Linux                 | `.deb`, `.rpm`, or AppImage           |

```bash
# macOS (Homebrew)
brew install --cask shob-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/shob-desktop
```

#### Installation Directory

The install script respects the following priority order for the installation path:

1. `$shob_INSTALL_DIR` - Custom installation directory
2. `$XDG_BIN_DIR` - XDG Base Directory Specification compliant path
3. `$HOME/bin` - Standard user binary directory (if it exists or can be created)
4. `$HOME/.shob/bin` - Default fallback

```bash
# Examples
shob_INSTALL_DIR=/usr/local/bin curl -fsSL https://shob.ai/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://shob.ai/install | bash
```

### Agents

shob includes two built-in agents you can switch between with the `Tab` key.

- **build** - Default, full-access agent for development work
- **plan** - Read-only agent for analysis and code exploration
  - Denies file edits by default
  - Asks permission before running bash commands
  - Ideal for exploring unfamiliar codebases or planning changes

Also included is a **general** subagent for complex searches and multistep tasks.
This is used internally and can be invoked using `@general` in messages.

Learn more about [agents](https://shob.ai/docs/agents).

### Documentation

For more info on how to configure shob, [**head over to our docs**](https://shob.ai/docs).

### Contributing

If you're interested in contributing to shob, please read our [contributing docs](./CONTRIBUTING.md) before submitting a pull request.

### Building on shob

If you are working on a project that's related to shob and is using "shob" as part of its name, for example "shob-dashboard" or "shob-mobile", please add a note to your README to clarify that it is not built by the shob team and is not affiliated with us in any way.

### FAQ

#### How is this different from Claude Code?

It's very similar to Claude Code in terms of capability. Here are the key differences:

- 100% open source
- Not coupled to any provider. Although we recommend the models we provide through [shob Zen](https://shob.ai/zen), shob can be used with Claude, OpenAI, Google, or even local models. As models evolve, the gaps between them will close and pricing will drop, so being provider-agnostic is important.
- Out-of-the-box LSP support
- A focus on TUI. shob is built by neovim users and the creators of [terminal.shop](https://terminal.shop); we are going to push the limits of what's possible in the terminal.
- A client/server architecture. This, for example, can allow shob to run on your computer while you drive it remotely from a mobile app, meaning that the TUI frontend is just one of the possible clients.

---

**Join our community** [Discord](https://discord.gg/shob) | [X.com](https://x.com/shob)

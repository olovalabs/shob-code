<p align="center">
  <a href="https://shob.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="شعار shob">
    </picture>
  </a>
</p>
<p align="center">وكيل برمجة بالذكاء الاصطناعي مفتوح المصدر.</p>
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

### التثبيت

```bash
# YOLO
curl -fsSL https://shob.ai/install | bash

# مديري الحزم
npm i -g shob-ai@latest        # او bun/pnpm/yarn
scoop install shob             # Windows
choco install shob             # Windows
brew install anomalyco/tap/shob # macOS و Linux (موصى به، دائما محدث)
brew install shob              # macOS و Linux (صيغة brew الرسمية، تحديث اقل)
sudo pacman -S shob            # Arch Linux (Stable)
paru -S shob-bin               # Arch Linux (Latest from AUR)
mise use -g shob               # اي نظام
nix run nixpkgs#shob           # او github:anomalyco/shob لاحدث فرع dev
```

> [!TIP]
> احذف الاصدارات الاقدم من 0.1.x قبل التثبيت.

### تطبيق سطح المكتب (BETA)

يتوفر shob ايضا كتطبيق سطح مكتب. قم بالتنزيل مباشرة من [صفحة الاصدارات](https://github.com/anomalyco/shob/releases) او من [shob.ai/download](https://shob.ai/download).

| المنصة                | التنزيل                               |
| --------------------- | ------------------------------------- |
| macOS (Apple Silicon) | `shob-desktop-darwin-aarch64.dmg` |
| macOS (Intel)         | `shob-desktop-darwin-x64.dmg`     |
| Windows               | `shob-desktop-windows-x64.exe`    |
| Linux                 | `.deb` او `.rpm` او AppImage          |

```bash
# macOS (Homebrew)
brew install --cask shob-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/shob-desktop
```

#### مجلد التثبيت

يحترم سكربت التثبيت ترتيب الاولوية التالي لمسار التثبيت:

1. `$shob_INSTALL_DIR` - مجلد تثبيت مخصص
2. `$XDG_BIN_DIR` - مسار متوافق مع مواصفات XDG Base Directory
3. `$HOME/bin` - مجلد الثنائيات القياسي للمستخدم (ان وجد او امكن انشاؤه)
4. `$HOME/.shob/bin` - المسار الافتراضي الاحتياطي

```bash
# امثلة
shob_INSTALL_DIR=/usr/local/bin curl -fsSL https://shob.ai/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://shob.ai/install | bash
```

### Agents

يتضمن shob وكيليْن (Agents) مدمجين يمكنك التبديل بينهما باستخدام زر `Tab`.

- **build** - الافتراضي، وكيل بصلاحيات كاملة لاعمال التطوير
- **plan** - وكيل للقراءة فقط للتحليل واستكشاف الكود
  - يرفض تعديل الملفات افتراضيا
  - يطلب الاذن قبل تشغيل اوامر bash
  - مثالي لاستكشاف قواعد كود غير مألوفة او لتخطيط التغييرات

بالاضافة الى ذلك يوجد وكيل فرعي **general** للبحث المعقد والمهام متعددة الخطوات.
يستخدم داخليا ويمكن استدعاؤه بكتابة `@general` في الرسائل.

تعرف على المزيد حول [agents](https://shob.ai/docs/agents).

### التوثيق

لمزيد من المعلومات حول كيفية ضبط shob، [**راجع التوثيق**](https://shob.ai/docs).

### المساهمة

اذا كنت مهتما بالمساهمة في shob، يرجى قراءة [contributing docs](./CONTRIBUTING.md) قبل ارسال pull request.

### البناء فوق shob

اذا كنت تعمل على مشروع مرتبط بـ shob ويستخدم "shob" كجزء من اسمه (مثل "shob-dashboard" او "shob-mobile")، يرجى اضافة ملاحظة في README توضح انه ليس مبنيا بواسطة فريق shob ولا يرتبط بنا بأي شكل.

### FAQ

#### ما الفرق عن Claude Code؟

هو مشابه جدا لـ Claude Code من حيث القدرات. هذه هي الفروقات الاساسية:

- 100% مفتوح المصدر
- غير مقترن بمزود معين. نوصي بالنماذج التي نوفرها عبر [shob Zen](https://shob.ai/zen)؛ لكن يمكن استخدام shob مع Claude او OpenAI او Google او حتى نماذج محلية. مع تطور النماذج ستتقلص الفجوات وستنخفض الاسعار، لذا من المهم ان يكون مستقلا عن المزود.
- دعم LSP جاهز للاستخدام
- تركيز على TUI. تم بناء shob بواسطة مستخدمي neovim ومنشئي [terminal.shop](https://terminal.shop)؛ وسندفع حدود ما هو ممكن داخل الطرفية.
- معمارية عميل/خادم. على سبيل المثال، يمكن تشغيل shob على جهازك بينما تقوده عن بعد من تطبيق جوال. هذا يعني ان واجهة TUI هي واحدة فقط من العملاء الممكنين.

---

**انضم الى مجتمعنا** [Discord](https://discord.gg/shob) | [X.com](https://x.com/shob)

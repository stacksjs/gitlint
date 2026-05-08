[Compare changes](https://github.com/stacksjs/gitlint/compare/v0.1.5...HEAD)

### 🐛 Bug Fixes

- use scoped logsmith for releases ([072b45d](https://github.com/stacksjs/gitlint/commit/072b45d)) _(by Chris <chrisbreuer93@gmail.com>)_
- stabilize generated declarations ([5461f5b](https://github.com/stacksjs/gitlint/commit/5461f5b)) _(by Chris <chrisbreuer93@gmail.com>)_
- add setup-bun to publish-commit job ([e4ef837](https://github.com/stacksjs/gitlint/commit/e4ef837)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- resolve typecheck errors ([c3876a6](https://github.com/stacksjs/gitlint/commit/c3876a6)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- resolve typecheck errors ([4b7e064](https://github.com/stacksjs/gitlint/commit/4b7e064)) _(by glennmichael123 <gtorregosa@gmail.com>)_

### ♻️ Code Refactoring

- **cli**: swap cac for @stacksjs/clapp ([f9e5a5e](https://github.com/stacksjs/gitlint/commit/f9e5a5e)) _(by glennmichael123 <gtorregosa@gmail.com>)_

### 🤖 Continuous Integration

- drop redundant setup-bun (pantry installs bun via deps.yaml) ([f36c0f0](https://github.com/stacksjs/gitlint/commit/f36c0f0)) _(by glennmichael123 <gtorregosa@gmail.com>)_

### 🧹 Chores

- add patch release script ([7487199](https://github.com/stacksjs/gitlint/commit/7487199)) _(by Chris <chrisbreuer93@gmail.com>)_
- **ci**: bump actions/checkout to v6, actions/cache to v5 ([9a1c86b](https://github.com/stacksjs/gitlint/commit/9a1c86b)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- refresh bun.lock to pick up bun-plugin-dtsx@0.9.18 ([d979e37](https://github.com/stacksjs/gitlint/commit/d979e37)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- refresh bun.lock and apply pickier --fix ([3a7ab13](https://github.com/stacksjs/gitlint/commit/3a7ab13)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- refresh bun.lock ([3ef4e18](https://github.com/stacksjs/gitlint/commit/3ef4e18)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- lint:fix ([36d8e6d](https://github.com/stacksjs/gitlint/commit/36d8e6d)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- refresh bun.lock to pick up latest pickier ([17b321a](https://github.com/stacksjs/gitlint/commit/17b321a)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- fresh install to pick up dtsx 0.9.14 and bunfig 0.15.9 ([d273600](https://github.com/stacksjs/gitlint/commit/d273600)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- fresh install to pick up pickier 0.1.21 ([b77a9d7](https://github.com/stacksjs/gitlint/commit/b77a9d7)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- auto-fix lint errors ([ddd1b7a](https://github.com/stacksjs/gitlint/commit/ddd1b7a)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- include md in pickier lint extensions ([9283116](https://github.com/stacksjs/gitlint/commit/9283116)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- update dependencies ([7adadbd](https://github.com/stacksjs/gitlint/commit/7adadbd)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- repo cleanup and modernization ([e6d2d40](https://github.com/stacksjs/gitlint/commit/e6d2d40)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- remove @stacksjs/docs ([5c4786d](https://github.com/stacksjs/gitlint/commit/5c4786d)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- remove .zed and .cursor folders ([3fb7664](https://github.com/stacksjs/gitlint/commit/3fb7664)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- remove redundant docs/.vitepress ([86daf6c](https://github.com/stacksjs/gitlint/commit/86daf6c)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- use Pantry action for publish-commit and add job dependencies ([2b6476f](https://github.com/stacksjs/gitlint/commit/2b6476f)) _(by Chris <chrisbreuer93@gmail.com>)_
- wip ([bca649e](https://github.com/stacksjs/gitlint/commit/bca649e)) _(by Chris <chrisbreuer93@gmail.com>)_
- remove file ignores from pickier config ([6bf5b78](https://github.com/stacksjs/gitlint/commit/6bf5b78)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- add CLAUDE.md and CHANGELOG.md to pickier ignores ([b87da63](https://github.com/stacksjs/gitlint/commit/b87da63)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- remove .pickierignore ([47f6d07](https://github.com/stacksjs/gitlint/commit/47f6d07)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- update better-dx to ^0.2.7 ([243d48f](https://github.com/stacksjs/gitlint/commit/243d48f)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- enrich CLAUDE.md with detailed project context from README ([f02d9d8](https://github.com/stacksjs/gitlint/commit/f02d9d8)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- update CLAUDE.md with project context and crosswind details ([7b942a0](https://github.com/stacksjs/gitlint/commit/7b942a0)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- add proper claude code guidelines ([b877538](https://github.com/stacksjs/gitlint/commit/b877538)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- use pantry monorepo action instead of pantry-setup ([e362d9c](https://github.com/stacksjs/gitlint/commit/e362d9c)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- ignore claude config in linter ([50cd4ec](https://github.com/stacksjs/gitlint/commit/50cd4ec)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- add claude code guidelines ([9e99251](https://github.com/stacksjs/gitlint/commit/9e99251)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([ecb2388](https://github.com/stacksjs/gitlint/commit/ecb2388)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([8ae55a0](https://github.com/stacksjs/gitlint/commit/8ae55a0)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([2b7a604](https://github.com/stacksjs/gitlint/commit/2b7a604)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([fed03c8](https://github.com/stacksjs/gitlint/commit/fed03c8)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([fe92043](https://github.com/stacksjs/gitlint/commit/fe92043)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([e1a8360](https://github.com/stacksjs/gitlint/commit/e1a8360)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([aff9e71](https://github.com/stacksjs/gitlint/commit/aff9e71)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([e29c4bc](https://github.com/stacksjs/gitlint/commit/e29c4bc)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([055eca2](https://github.com/stacksjs/gitlint/commit/055eca2)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([8018359](https://github.com/stacksjs/gitlint/commit/8018359)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([6b20cfa](https://github.com/stacksjs/gitlint/commit/6b20cfa)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- wip ([1bf46e2](https://github.com/stacksjs/gitlint/commit/1bf46e2)) _(by glennmichael123 <gtorregosa@gmail.com>)_
- update og-image and cover ([6fc493d](https://github.com/stacksjs/gitlint/commit/6fc493d)) _(by cab-mikee <mike.cabz32@gmail.com>)_
- **deps**: update all non-major dependencies (#15) ([852ab1c](https://github.com/stacksjs/gitlint/commit/852ab1c)) _(by [renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>](https://github.com/renovate[bot]))_ ([#15](https://github.com/stacksjs/gitlint/issues/15), [#15](https://github.com/stacksjs/gitlint/issues/15))
- add clarity and docs ([c3c65a5](https://github.com/stacksjs/gitlint/commit/c3c65a5)) _(by cab-mikee <mike.cabz32@gmail.com>)_
- **deps**: update dependency actions/checkout to v5.0.0 (#8) ([d7f4d37](https://github.com/stacksjs/gitlint/commit/d7f4d37)) _(by Chris <chrisbreuer93@gmail.com>)_ ([#8](https://github.com/stacksjs/gitlint/issues/8), [#8](https://github.com/stacksjs/gitlint/issues/8))
- **deps**: update dependency @stacksjs/eslint-config to 4.14.0-beta.3 (#7) ([c68e4d9](https://github.com/stacksjs/gitlint/commit/c68e4d9)) _(by Chris <chrisbreuer93@gmail.com>)_ ([#7](https://github.com/stacksjs/gitlint/issues/7), [#7](https://github.com/stacksjs/gitlint/issues/7))
- **deps**: update actions/checkout action to v5 (#6) ([9af668f](https://github.com/stacksjs/gitlint/commit/9af668f)) _(by [renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>](https://github.com/renovate[bot]))_ ([#6](https://github.com/stacksjs/gitlint/issues/6), [#6](https://github.com/stacksjs/gitlint/issues/6))
- **deps**: update all non-major dependencies (#5) ([ea2f336](https://github.com/stacksjs/gitlint/commit/ea2f336)) _(by [renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>](https://github.com/renovate[bot]))_ ([#5](https://github.com/stacksjs/gitlint/issues/5), [#5](https://github.com/stacksjs/gitlint/issues/5))
- update tooling ([72a2b5f](https://github.com/stacksjs/gitlint/commit/72a2b5f)) _(by Adelino Ngomacha <adelinob335@gmail.com>)_
- action releaser changes ([0983628](https://github.com/stacksjs/gitlint/commit/0983628)) _(by cab-mikee <mike.cabz32@gmail.com>)_
- **deps**: update dependency bun-git-hooks to ^0.2.15 (#4) ([f53f12a](https://github.com/stacksjs/gitlint/commit/f53f12a)) _(by [renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>](https://github.com/renovate[bot]))_ ([#4](https://github.com/stacksjs/gitlint/issues/4), [#4](https://github.com/stacksjs/gitlint/issues/4))

### 📄 Miscellaneous

- Merge pull request #14 from stacksjs/renovate/all-minor-patch ([0276656](https://github.com/stacksjs/gitlint/commit/0276656)) _(by [renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>](https://github.com/renovate[bot]))_ ([#14](https://github.com/stacksjs/gitlint/issues/14), [#14](https://github.com/stacksjs/gitlint/issues/14))

### Contributors

- _Adelino Ngomacha <adelinob335@gmail.com>_
- _Chris <chrisbreuer93@gmail.com>_
- _[renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>](https://github.com/renovate[bot])_
- _cab-mikee <mike.cabz32@gmail.com>_
- _glennmichael123 <gtorregosa@gmail.com>_

## v0.1.4...main

[compare changes](https://github.com/stacksjs/gitlint/compare/v0.1.4...main)

### 🏡 Chore

- Add shebang to cli.ts ([097cd41](https://github.com/stacksjs/gitlint/commit/097cd41))

### ❤️ Contributors

- Chrisbbreuer ([@chrisbbreuer](https://github.com/chrisbbreuer))

## v0.1.3...main

[compare changes](https://github.com/stacksjs/gitlint/compare/v0.1.3...main)

### 📖 Documentation

- Add initial documentation ([e989693](https://github.com/stacksjs/gitlint/commit/e989693))
- Improve documentation ([1c7b321](https://github.com/stacksjs/gitlint/commit/1c7b321))
- Adjust Custom Rules position ([ce3f40e](https://github.com/stacksjs/gitlint/commit/ce3f40e))
- Update usage page ([6815f84](https://github.com/stacksjs/gitlint/commit/6815f84))

### 🏡 Chore

- Remove old changelog ([6aabea6](https://github.com/stacksjs/gitlint/commit/6aabea6))
- Adjust fathom id ([07288cd](https://github.com/stacksjs/gitlint/commit/07288cd))
- Lint ([7a14944](https://github.com/stacksjs/gitlint/commit/7a14944))
- Adjust url ([562c767](https://github.com/stacksjs/gitlint/commit/562c767))
- Update docs ([c9ca5aa](https://github.com/stacksjs/gitlint/commit/c9ca5aa))
- Adjust some meta info ([a02cbe7](https://github.com/stacksjs/gitlint/commit/a02cbe7))
- Add postinstall script ([a29e698](https://github.com/stacksjs/gitlint/commit/a29e698))

### ❤️ Contributors

- Chrisbbreuer ([@chrisbbreuer](https://github.com/chrisbbreuer))
- Chris ([@chrisbbreuer](https://github.com/chrisbbreuer))

## v0.1.2...main

[compare changes](https://github.com/stacksjs/gitlint/compare/v0.1.2...main)

### 🏡 Chore

- Wip ([6879367](https://github.com/stacksjs/gitlint/commit/6879367))

### ❤️ Contributors

- Chris ([@chrisbbreuer](https://github.com/chrisbbreuer))

## v0.1.1...main

[compare changes](https://github.com/stacksjs/gitlint/compare/v0.1.1...main)

### 🏡 Chore

- Wip ([7dd4e22](https://github.com/stacksjs/gitlint/commit/7dd4e22))
- Wip ([6c24ede](https://github.com/stacksjs/gitlint/commit/6c24ede))

### ❤️ Contributors

- Chris ([@chrisbbreuer](https://github.com/chrisbbreuer))

## v0.1.0...main

[compare changes](https://github.com/stacksjs/gitlint/compare/v0.1.0...main)

### 🏡 Chore

- Wip ([192fa43](https://github.com/stacksjs/gitlint/commit/192fa43))

### ❤️ Contributors

- Chris ([@chrisbbreuer](https://github.com/chrisbbreuer))

## ...main

### 🏡 Chore

- Initial commit ([bd861c4](https://github.com/stacksjs/gitlint/commit/bd861c4))
- Wip ([022d986](https://github.com/stacksjs/gitlint/commit/022d986))
- Wip ([b834650](https://github.com/stacksjs/gitlint/commit/b834650))
- Wip ([c2032df](https://github.com/stacksjs/gitlint/commit/c2032df))
- Wip ([5c5fc32](https://github.com/stacksjs/gitlint/commit/5c5fc32))
- Wip ([8531d7b](https://github.com/stacksjs/gitlint/commit/8531d7b))
- Wip ([3766ad9](https://github.com/stacksjs/gitlint/commit/3766ad9))
- Wip ([8f89b98](https://github.com/stacksjs/gitlint/commit/8f89b98))
- Wip ([82900f6](https://github.com/stacksjs/gitlint/commit/82900f6))
- Wip ([ee1b5e6](https://github.com/stacksjs/gitlint/commit/ee1b5e6))
- Wip ([cd661ef](https://github.com/stacksjs/gitlint/commit/cd661ef))
- Wip ([173cf75](https://github.com/stacksjs/gitlint/commit/173cf75))
- Wip ([0c60b40](https://github.com/stacksjs/gitlint/commit/0c60b40))
- Wip ([af0d598](https://github.com/stacksjs/gitlint/commit/af0d598))
- Wip ([b7b723e](https://github.com/stacksjs/gitlint/commit/b7b723e))
- Wip ([7efd695](https://github.com/stacksjs/gitlint/commit/7efd695))

### ❤️ Contributors

- Chris ([@chrisbbreuer](https://github.com/chrisbbreuer))

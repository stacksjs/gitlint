---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "GitLint"
  text: "Enforce consistent git commit messages."
  tagline: "Lightweight, customizable commit linting for better git workflows."
  image: /images/logo-white.png
  actions:
    - theme: brand
      text: Get Started
      link: /intro
    - theme: alt
      text: View on GitHub
      link: https://github.com/stacksjs/gitlint

features:
  - title: "Conventional Commits"
    icon: "✅"
    details: "Enforce semantic commit messages based on the Conventional Commits standard."
  - title: "Customizable Rules"
    icon: "⚙️"
    details: "Configure validation rules to match your team's commit message standards."
  - title: "Git Hooks Integration"
    icon: "🔄"
    details: "Seamlessly integrates with Git hooks to validate commits before they're created."
  - title: "Command-Line Interface"
    icon: "💻"
    details: "Simple CLI for validating commit messages with helpful, descriptive errors."
---

<Home />

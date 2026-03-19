import type { BunpressConfig } from 'bunpress'

const config: BunpressConfig = {
  name: 'gitlint',
  description: 'Efficient Git Commit Message Linting and Formatting',
  theme: '@bunpress/theme-docs',
  srcDir: './docs',
  outDir: './dist/docs',
  sidebar: [
    {
      text: 'Getting Started',
      items: [
        { text: 'Introduction', link: '/intro' },
        { text: 'Installation', link: '/install' },
        { text: 'Usage', link: '/usage' },
        { text: 'Configuration', link: '/config' },
      ],
    },
    {
      text: 'Features',
      items: [
        { text: 'Commit Linting', link: '/features/commit-linting' },
        { text: 'Conventional Commits', link: '/features/conventional-commits' },
        { text: 'Custom Rules', link: '/features/custom-rules' },
        { text: 'Git Hooks', link: '/features/git-hooks' },
      ],
    },
    {
      text: 'Advanced',
      items: [
        { text: 'Configuration', link: '/advanced/configuration' },
        { text: 'Custom Validators', link: '/advanced/custom-validators' },
        { text: 'Performance', link: '/advanced/performance' },
        { text: 'CI/CD Integration', link: '/advanced/ci-cd-integration' },
      ],
    },
  ],
}

export default config

import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "tfhy",
  description: "tf hell yeah",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: "Beginner's Guide", link: '/start' }
    ],

    sidebar: [
      {
        items: [
          { text: "Beginner's Guide", link: '/start' },
          { text: "Using This Site", link: '/help' },
        ]
      },
      {
        text: 'Base Game',
        items: [
          { text: 'Game Guides', link: '/guides' },
          { text: 'Unlockable Guides', link: '/weapons' },
          { text: 'Config and HUDs', link: '/config' },
          { text: 'The Economy/Trading', link: '/trading' },
          { text: 'Competitive TF2', link: '/comp' },
          { text: 'Passtime', link: '/passtime' }
        ]
      },
      {
        text: 'External Software and Tools',
        items: [
          { text: 'Hammer/Mapmaking', link: '/maps' },
          { text: 'Using SFM', link: '/sfm' },
          { text: 'SFM Films', link: '/films' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
    /*
    search: {
      provider: 'local', // Default search provider
    },
    */
  }
})

import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "tfhy",
  description: "tf hell yeah",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: "Beginner's Guide", link: '/start' },
      { text: "Using This Site", link: '/help' }
    ],

    sidebar: [
      {
        items: [
          { text: "Beginner's Guide", link: '/start' },
          { text: "Using This Site", link: '/help' },
          { text: "Posts", link: '/posts' },
        ]
      },
      {
        text: 'Basic Wiki',
        items: [
          { text: 'Game Guides', link: '/guides' },
          { text: 'Weapon Guides', link: '/weapons' },
          { text: 'Community Servers + Groups', link: '/servers' },
          { text: 'Config and HUDs', link: '/config' },
        ]
      },
      {
        text: 'Expanded Wiki',
        items: [
          { text: 'The Economy/Trading', link: '/trading' },
          { text: 'Competitive TF2', link: '/comp' },
          { text: 'Mann versus Machine', link: '/mvm' },
          { text: 'Rocket Jumping', link: '/jumping' },
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

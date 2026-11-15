// Club app settings for the GitHub version. Edit the parts in quotes, then save.
self.CLUB_CONFIG = {
  // 1. The Web app URL from Apps Script (Deploy > Manage deployments). It ends in /exec
  api: 'PASTE the /exec link here',

  // 2. From Firebase: Project settings > General > Your apps > SDK setup and configuration > Config
  firebase: {
    apiKey: 'PASTE apiKey here',
    authDomain: 'PASTE authDomain here',
    projectId: 'PASTE projectId here',
    messagingSenderId: 'PASTE messagingSenderId here',
    appId: 'PASTE appId here'
  },

  // 3. From Firebase: Project settings > Cloud Messaging > Web Push certificates > Key pair
  vapidKey: 'PASTE the key pair here'
};

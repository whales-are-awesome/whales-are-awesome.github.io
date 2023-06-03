import { createApp, h } from 'vue'
import { svgSpritePlugin } from 'vue-svg-sprite'
import App from './App.vue'
import router from './router'
import { store, key } from './store'
import scrollAt from './directives/scrollAt';
import './assets/styles/global.css';

const app = createApp({
    setup () {
    },
    render: () => h(App)
})
.directive('scroll-at', scrollAt)
.use(store, key)
.use(svgSpritePlugin, {
    url: require('./assets/sprite/gen/sprite.svg'),
    class: 'base-icon',
})
.use(router);

app.mount('#app');

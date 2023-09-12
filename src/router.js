import { createRouter, createWebHistory } from 'vue-router';

import confiteria from '@/components/confiteria.vue';
import cart from '@/components/cart.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: confiteria,
    },
    {
        path: '/cart',
        name: 'cart',
        component: cart, 
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;

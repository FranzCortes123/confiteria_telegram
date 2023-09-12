import { ref } from 'vue';

export const cart = ref([]);

export function addToCart(item) {
    const existingItem = cart.value.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
        existingItem.count += 1;
    } else {
        cart.value.push({ ...item, count: 1 });
    }
}

export function removeFromCart(item) {
    const index = cart.value.findIndex(cartItem => cartItem.id === item.id);
    if (index !== -1) {
        if (cart.value[index].count > 1) {
        cart.value[index].count -= 1;
        } else {
        cart.value.splice(index, 1);
        }
    }
}


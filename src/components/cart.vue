<template>
    <div>
      <p class="title">Confiteria</p>
      <ul class="cart-list">
        <li v-for="item in carrito" :key="item.id" class="cart-item">
          <div class="cart-image">
            <img :src="item.image_link" alt="Imagen del producto" />
          </div>
          <div class="cart-details">
            <h3 class="cart-title">{{ item.title }}</h3>
            <div class="price-container">
            <div class="price-details">
                    <p class="cart-price">Precio unitario:</p>
                    <p class="cart-price-value">{{ formatPrice(item.price) }}</p>
                </div>
                <div class="price-details">
                    <p class="cart-price-total-unitario">Precio total:</p>
                    <p class="cart-price-value">{{ formatPrice(item.price * item.count) }}</p>
                </div>
            </div>
          </div>
          <div class="count">
            <div class="count-accountants">
              <button class="button-minus" @click="decrementCount(item)" :disabled="item.count <= 0">
                <i class="fa fa-minus"></i>
              </button>
              <p class="count-value">{{ item.count }}</p>
              <button class="button-plus" @click="incrementCount(item)">
                <i class="fa fa-plus"></i>
              </button>
            </div>
          </div>
        </li>
      </ul>
      <hr>
      <p class="total-price">Precio Total: {{ formatPrice(totalPrice) }}</p>
      <button class="buttom-exit" @click="navigateConfectionery">Ir atras</button>
      <button class="buttom-cart" @click="enviarCompra">Enviar compra</button>
    </div>
  </template>


<script>
import { cart } from '../cartService';
import axios from 'axios';

const tg = window.Telegram.WebApp;

export default {
    computed: {
        carrito() {
        return cart.value;
        },
        totalPrice() {
        return cart.value.reduce((total, item) => total + item.price * item.count, 0);
        },
    },
    methods: {
        formatPrice(price) {
        // Formatea el precio
            return parseFloat(price).toLocaleString('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
            });
        },
        incrementCount(item) {
            item.count += 1;
        },
        decrementCount(item) {
            if (item.count >= 1) {
                item.count -= 1;
                this.removeItem(item);
            }
        },
        resetCounter(item) {
            item.count = 0;
            this.removeItem(item);
        },
        removeItem(item) {
            if (item.count === 0) {
                const index = this.carrito.findIndex((cartItem) => cartItem.id === item.id);
                if (index !== -1) {
                    this.carrito.splice(index, 1);
                }
            }
        },
        navigateConfectionery() {
            // Elimina todos los productos seleccionados al volver atrás
            const itemsToRemove = this.carrito.filter((item) => item.count > 0);
            itemsToRemove.forEach((item) => {
                this.resetCounter(item);
            });
            this.$router.push({ name: 'Home' });
        },
        enviarCompra() {
          // Obtén los datos del carrito que deseas enviar
          const data = this.carrito.map((item) => {
              return {
                  id: item.id,
                  title: item.title,
                  price: item.price,
                  count: item.count,
              };
          });

          // Realiza una solicitud POST al backend para enviar los datos
          axios
              .post('http://localhost:4000/api/enviar_compra', data)
              .then((response) => {
                  // Maneja la respuesta del servidor si es necesario
                  console.log('Respuesta del servidor:', response.data);

                  // Elimina la compra después de enviarla
                  this.carrito.forEach((item) => {
                      if (item.count > 0) {
                          this.resetCounter(item);
                      }
                  });

                  // Puedes mostrar un mensaje de éxito al usuario si lo deseas
                  alert('Orden confirmada, muchas gracias 😁');

                  // Cierra la pestaña después de mostrar la alerta y realizar las operaciones necesarias
                  tg.close();
              })
              .catch((error) => {
                  // Maneja los errores si ocurren
                  console.error('Error al enviar la compra:', error);
              });
          }
    },
};
</script>


<style scoped>

.title{
    text-transform: uppercase;
    display: flex;
    margin: 0;
    font-size: 1.2rem; 
    font-weight: 600;
    width: 100%;
}
.cart-list {
  list-style: none;
  padding: 0;
}

.cart-item {
  display: flex;
  margin-top: 25px;
  align-items: center;
}

.cart-image img {
  width: 50px;
  height: 50px;
  border-radius: 5px;
  object-fit: cover;
  margin-right: 10px;
  padding-top: 0px;
}

.cart-details {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.cart-title {
  width: 80%;
  display: block;
  font-size: .75rem;
  padding: 0.25rem 0;
  line-height: .85rem;
  font-family: "Roboto Condensed", sans-serif;
  margin-bottom: 5px;
  color: black;
  font-weight: bold;
}

.price-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 160px;
  color: black;
}


.cart-price {
  font-size: .75rem;
  font-family: "Roboto Condensed", sans-serif;
  font-weight: bold;
  margin-right: 10px;
  line-height: 1.2;
}

.cart-price-total-unitario {
  font-size: .75rem;
  font-family: "Roboto Condensed", sans-serif;
  font-weight: bold;
  line-height: 1.2;
}

.count {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}

.count-accountants {
    text-align: center;
  display: flex;
  align-items: center;
  background-color: #f6f6f6;
  border-radius: 30px;
  padding: 2px 4px;
}

.count-accountants button {
  width: 25px;
  height: 25px;
  padding: 4px;
  border-radius: 50%;
  background-color: #cdcdcd;
  border: 1px solid #f6f6f6;
  color: #b5121b;
  cursor: pointer;
  margin: 0px 5px;
  flex-grow: 1;
}

.count-accountants button:disabled {
  background-color: #e7e7e7;
  cursor: default;
  border: none;
}

.count-value {
  font-size: 20px;
  color: #232323;
  font-family: "Roboto Condensed", sans-serif;
}


.buttom-cart{
  position:fixed;
  right: 20px;
  bottom: 10px;
  width: 40%;
  height: 45px;
  background-color: #b5121b;
  color: #ffffff;
  border: 0px;
  cursor: pointer;
  animation: fadeIn 0.5s ease;
  border-radius: 50px;
  z-index: 2;
}

.buttom-cart:hover{
  background: #7d0000;
  cursor: pointer;
  color: #ffffff;
  border: 0px;
}

.buttom-exit{
    position:fixed;
  left: 20px;
  bottom: 10px;
  width: 40%;
  height: 45px;
  background-color: #b5121b;
  color: #ffffff;
  border: 0px;
  cursor: pointer;
  animation: fadeIn 0.5s ease;
  border-radius: 50px;
  z-index: 2;
}

.buttom-exit:hover{
  background: #7d0000;
  cursor: pointer;
  color: #ffffff;
  border: 0px;
}

.total-price {
  font-size: 1.2rem;
  font-weight: 600;
  margin-top:10px;
  margin-bottom: 40px;
}

@media (max-width: 768px) {

    .total {
        font-size: 1.2rem; /* Mantener el tamaño de fuente para el precio total en pantallas pequeñas */
    }
  .cart-item {
    flex-direction: row; /* Volver al diseño de fila en pantallas pequeñas */
  }

  .cart-image {
    flex: 0 0 50px; /* Mantener el ancho fijo para la imagen */
    margin-right: 10px; /* Restaurar el margen derecho */
  }

  .cart-details {
    flex-grow: 1;
    margin-top: 0; /* Eliminar el espacio superior */
  }

  .cart-title {
    width: 100%; /* Hacer que el título ocupe todo el ancho disponible */
  }

  .price-container {
    flex-direction: row; /* Volver al diseño de fila en pantallas pequeñas */
    margin-top: 5px; /* Restaurar el espacio superior */
  }

  .cart-price {
    margin-right: 10px; /* Restaurar el margen derecho */
  }

  .total-price {
    font-size: 1.2rem; /* Mantener el tamaño de fuente para el precio total en pantallas pequeñas */
  }
}
</style>




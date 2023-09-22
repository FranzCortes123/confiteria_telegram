<template>
  <div>
    <div class="card-container">
      <div v-for="(item, index) in csvData" :key="index" class="card">
        <img :src="item.image_link" alt="Image" class="card-image" />
        <div class="card-content">
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-description">{{ item.description }}</p>
            <p class="card-price">{{ formatPrice(item.price) }}</p>
          <div class="count">
            <div class="count_reset">
              <button class="button-reset" @click="resetCounter(item)" :disabled="item.count <= 0">
                <i class="fa fa-trash"></i>
              </button>
            </div>
            <div class="count-accountants">
              <button class="buttom-minus" @click="decreaseCounter(item)" :disabled="item.count <= 0">
                <i class="fa fa-minus"></i>
              </button> 
              <p class="count-value">{{ item.count }}</p>
              <button class="buttom-plus" @click="incrementCounter(item)">
                <i class="fa fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button v-if="atLeastOneItemInCart" class="buttom-cart" 
    :disabled="!atLeastOneItemInCart" @click="navigateToCart">( {{ totalItemCount }} ) Ir al carrito</button>
  </div>
</template>

<script>
import axios from 'axios';
import 'font-awesome/css/font-awesome.css';
import { ref } from 'vue';
import { addToCart, removeFromCart, cart  } from '../cartService';



export default {
  data() {
    return {
      csvData: [],
    };
  },
  created() {
    // Cargar automáticamente los datos del servidor Flask al crear el componente
    this.loadCSVData();
  },
  computed: {
    atLeastOneItemInCart() {
      return this.csvData.some(item => item.count > 0);
    },
    totalItemCount() {
    return this.csvData.reduce((total, item) => total + item.count, 0);
    },
  },
  methods: {
    loadCSVData() {
      // Ruta a la API Flask que proporciona los datos del archivo CSV
      const apiUrl = 'http://127.0.0.1:5500/api/cinemark_data';

      axios.get(apiUrl)
        .then((response) => {
          // Agregar la propiedad 'count' a cada objeto en csvData
          this.csvData = response.data.map(item => ({ ...item, count: 0 }));
        })
        .catch((error) => {
          console.error('Error al cargar los datos desde la API:', error);
        });
    },
    incrementCounter(item) {
      item.count += 1;
      addToCart(item);
    },
    decreaseCounter(item) {
      if (item.count >= 1) {
        item.count -= 1;
        removeFromCart(item);
      }
    },
    resetCounter(item) {
      item.count = 0;
    },
    formatPrice(price) {
      // Formatea el precio
      return parseFloat(price).toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
      });
    },
    navigateToCart() {
      // Usar Vue Router para navegar al componente 'cart'
      this.$router.push({ name: 'cart' });
    },
    
  },
};
</script>

<style scoped>
.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
}

.card {
  border: 1px solid #ccc;
  border-radius: 5px;
  width: calc(50% - 10px); 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  margin-bottom: 20px; 
  display: flex; 
  flex-direction: column;
}

.card-title {
  color: black;
  font-weight: 400;
  font-size: .85rem;
  padding-bottom: 5px;
  font-family: "Roboto Condensed", sans-serif;
  text-align: center;
}

.card-description {
  flex-grow: 1;
  font-size: .65rem;
  margin-top: 0;
  margin-bottom: 1em;
  font-family: "Roboto Condensed", sans-serif;
  color: #797979;
  text-align: center;
  overflow: hidden;
}

.card-price {
  color: #b5121b;
  font-weight: 600;
  font-size: 1.25rem;
  text-align: center;
  padding-bottom: 5px;
}

.card-image {
  width: 100%;
  height: auto;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.card-content {
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.count {
  display: flex;
  justify-content: space-between;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
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

.count-value {
  font-size: 20px;
  color: #232323;
  font-family: "Roboto Condensed", sans-serif;
}

/* Estilos para botones deshabilitados */
.count-accountants button:disabled {
  background-color: #e7e7e7;
  cursor: default;
  border: none;
}

.button-reset {
  margin: 0 5px;
  border-radius: 5px;
  width: 38px;
  height: 38px;
  font-size: 1rem;
  border: 1px solid #f6f6f6;
  background-color: #cdcdcd;
  color: #232323;
  cursor: pointer;
  flex-grow: 1;
}

.button-reset:disabled {
  background-color: #e7e7e7;
  cursor: default;
  border: none;
}

.buttom-cart{
  position:fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 45px;
  background-color: #b5121b;
  color: #ffffff;
  border: 0px;
  cursor: pointer;
  animation: fadeIn 0.5s ease;
}

.buttom-cart:hover{
  background: #7d0000;
  cursor: pointer;
  color: #ffffff;
  border: 0px;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}



/* Ajustar el tamaño de los botones en pantallas más pequeñas */
@media (max-width: 768px) {
  .count-accountants button {
    width: 20px;
    height: 20px;
    padding: 2px;
  }

  .reset {
    width: 30px;
    height: 30px;
    font-size: 0.9rem;
  }
}

/* Estilos para botones deshabilitados en pantallas más pequeñas */
@media (max-width: 768px) {
  .count-accountants button:disabled {
    background-color: #e7e7e7;
    cursor: default;
    border: none;
  }

  .reset:disabled {
    background-color: #e7e7e7;
    color: #999;
    border: none;
    cursor: default;
  }
}
</style>
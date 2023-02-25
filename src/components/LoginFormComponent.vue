<template>
  <div v-if="register_success === false" class="singUp_form fade-in-image">
    <form @submit.prevent="singUp">
      <div v-if="loaderActive === true" style="color: whitesmoke;font-size: 20px">Реєструємо Вас... зачекайте :)</div>
      <div v-if="message" class="text-danger" style="padding-bottom: 10px">{{ message }}</div>
      <div class="sing_input">
        <input required type="text" id="name" v-model="name">
        <label for="name">Ім'я</label>
      </div>
      <div class="sing_input">
        <input required type="text" id="lastname" v-model="lastname">
        <label for="lastname">Фамілія</label>
      </div>
      <div class="sing_input">
        <input required type="email" id="email" autocomplete="new-email" v-model="email">
        <label for="email">Email</label>
      </div>
      <div class="sing_input">
        <input required type="password" id="password" autocomplete="new-password" v-model="password">
        <label for="password">Пароль</label>
      </div>
      <div style="padding-bottom: 10px" v-if="this.password && this.password.length < 8"
           class="text-danger">Пароль має бути не менше 8 символів
      </div>
      <div class="sing_input">
        <input required type="password" id="password_confirm" v-model="password_confirmation">
        <label for="password_confirm">Підтвердження паролю</label>
      </div>
      <div v-if="this.password_confirmation && this.password !== this.password_confirmation" class="text-danger">
        Паролі не співпадають
      </div>
      <button type="submit" class="sing_button">Зареєструватися</button>
    </form>
    <div v-if="loaderActiveLog === true" style="color: royalblue;font-size: 20px;">Завантажуємо дані...</div>
    <div v-if="logNull === true" style="color: darkred;font-size: 20px;">Наразі логів немає, спробуйте пізніше ;)</div>
    <div class="button_log">
      <button type="button" @click.prevent="getLogs">Переглянути логи</button>
      <button v-if="logs" type="button" @click.prevent="logs = null" style="margin-left: 10px">Закрити логи</button>
    </div>
  </div>
  <div v-if="register_success === true" class="singUp_form fade-in-image">
    <div style="color: #8dcf8a;font-size: 20px">Ви успішно зареєструвались! Вітаємо Вас на нашому сайті!</div>
    <a @click.prevent="register_success = false" style="color: #8dcf8a;font-size: 20px;cursor: pointer">Повернутися</a>
  </div>
  <div v-if="logs" style="display: flex;flex-wrap: wrap;justify-content: center">
    <div v-for="log in logs" class="log_card">
      <div class="logs">
        <p><strong>Ім'я:</strong> {{ log.name }}</p>
        <p><strong>Помилка:</strong> {{ log.error }}</p>
        <p><strong>Час:</strong> {{ log.time }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import router from "@/router";

export default {
  name: "LoginFormComponent",
  data() {
    return {
      name: null,
      lastname: null,
      email: null,
      password: null,
      password_confirmation: null,
      message: null,
      loaderActive: false,
      loaderActiveLog: false,
      register_success: false,
      logs: null,
      logNull: false,
    }
  },
  methods: {
    router() {
      return router
    },

    async singUp() {
      if (this.password && this.password.length >= 8 && this.password === this.password_confirmation) {
        try {
          this.loaderActive = true
          await axios.post('/api/auth/reg', {
            name: this.name,
            lastname: this.lastname,
            email: this.email,
            password: this.password,
            password_confirmation: this.password_confirmation,
          })
              .then(res => {
                res.status === 201 ? this.clearInputs() : ''
                this.logs = null
                this.logNull = false
              })

        } catch (e) {
          this.message = e.response.data.message
          this.message = e.response.data.message
        } finally {
          this.loaderActive = false
        }
      }
    },

    async getLogs() {
      try {
        this.loaderActiveLog = true
        await axios.get('/api/service/log')
            .then(res => {
              res.data.length > 0
                  ? this.logs = res.data
                  : this.logNull = true
            })
      } catch (e) {

      } finally {
        this.loaderActiveLog = false
      }
    },

    clearInputs() {
      this.register_success = true
      this.name = null
      this.lastname = null
      this.email = null
      this.password = null
      this.password_confirmation = null
    },

  },
}
</script>

<style scoped>

</style>
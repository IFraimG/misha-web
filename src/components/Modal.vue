<template>
    <div class="modal__wrapper">
      <div class="modal" @click.stop>
        <div class="modal__content">
          <div class="modal__header">
            <slot name="title"></slot>
          </div>
          <div class="modal__content">
            <slot name="content"></slot>
          </div>
          <div class="modal__footer">
            <button class="modal__button-cancel" @click="closeModal">
                Отмена
            </button>
            <button class="modal__button-confirm" @click="sendSuccess">
                <slot name="acceptButton"></slot>
            </button>
          </div>
        </div>
      </div>
    </div>
</template>
  
<script setup>
import { nextTick, onBeforeUnmount, onMounted, defineEmits } from "vue"
import { useRouter } from "vue-router"
    // import "./scss/ModalWords.scss"
  
const emit = defineEmits(["onsuccess"])

const router = useRouter()
  
onMounted(() => {
    nextTick(() => {
        window.scrollTo({ top: 0 })
    })
})
  
onBeforeUnmount(() => document.documentElement.style.overflow = "auto")
          // document.addEventListener("keydown", event => {
          //   if (event.key == "Escape") closeModal()
          // })
  
const sendSuccess = isTrue => emit("onsuccess", isTrue)
  
const closeModal = () => {
    document.documentElement.style.overflow = "auto"
    sendSuccess(false)
    // router.go(-1)
}

  </script>
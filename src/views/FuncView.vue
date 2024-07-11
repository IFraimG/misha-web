<template>
    <div class="func" ref="funcRoot">
		<div class="left_block">
			<p class="left_block__title">Папки</p>
			<form class="left_block__search">
				<input type="text" class="left_block__input" placeholder="Поиск" required>
				<button type="submit" class="left_block__icon"></button>
			</form>
			<div class="left_block__text-container">
                <p class="left_block__text">У вас пока нет папок</p>
            </div>
			<button class="left_block__button" type="button">Добавить папку</button>
		</div>
		<div class="right_block">
			<Modal @onsuccess="null">
                <template #title></template>
                <template #content></template>
            </Modal>
		</div>
	</div>
</template>

<script setup>
import "@/styles/func.css"
import Modal from "@/components/Modal.vue"

</script>
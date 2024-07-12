<template>
	<div>
		<div class="func" ref="funcRoot">
			<div class="left_block">
				<p class="left_block__title">Папки</p>
				<form class="left_block__search">
					<input type="text" class="left_block__input" placeholder="Поиск" v-model="searchText.value" @input="findFolder" required>
					<button type="submit" class="left_block__icon"></button>
				</form>
				<div v-if="foldersList.value != null && foldersList.value?.length > 0" class="left_block__text-container">
					<div class="folder" v-for="item in foldersList.value" :key="item.folderID" @click="openLinks(item)">
						<img v-if="item.preview.length > 0" :src="'http://95.163.221.125:8080/image/' + item.preview" alt="" class="folder__back">
						<img v-else src="@/assets/img/grey_back.svg" alt="" class="folder__back">
						<div class="folder__bar">
							<div class="folder__barsik">
								<p class="folder__title">{{ item.title }}</p>
								<div class="folder__bottom">
									<p class="folder__count">{{ item?.countOfLinks != null ? item?.countOfLinks : '0' }} сохранённых</p>
									<p class="folder__date">{{ item.dateOfCreated }}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div v-else class="left_block__text-container">
					<p class="left_block__text">У вас пока нет папок</p>
				</div>
				<!-- <div class="folder">
						<img src="@/assets/img/grey_back.svg" alt="" class="folder__back">
						<div class="folder__bar">
							<div class="folder__barsik">
								<p class="folder__title">Food</p>
								<div class="folder__bottom">
									<p class="folder__count">0 сохранённых</p>
									<p class="folder__date">02/07/2024</p>
								</div>
							</div>
						</div>
					</div> -->
				<button class="left_block__button" type="button" @click="openModal(true)">Добавить папку</button>
			</div>
			<div class="right_block">
				<div class="folder_element" v-for="(item, index) in linksList.value" :key="item.linkID" @click="openCurrentLink(item.link)">
					<img v-if="item.image.length > 0" :src="'http://95.163.221.125:8080/image/' + item.image" alt="" class="folder_element__back">
					<img v-else src="@/assets/img/grey_back.svg" alt="" class="folder_element__back">
					<div class="folder_element__bar">
						<img src="@/assets/img/cancel.svg" alt="" class="folder_element__delete" @click.stop="removeLink(item.linkID)" />
						<p class="folder_element__title">{{ item.title }}</p>
					</div>
				</div>
				<!-- <div class="folder_element">
					<img src="@/assets/img/blin.png" alt="" class="folder_element__back">
					<div class="folder_element__bar">
						<p class="folder_element__title">Fuuuuuck</p>
					</div>
				</div> -->
			</div>
		</div>
		<Modal v-if="isModal.value" @onsuccess="createFolder">
            <template #title>
				<h2 class="modal__title">Введите название</h2>
			</template>
            <template #content>
				<input class="modal__input" v-model="folderTitle" />
			</template>
			<template #acceptButton>Сохранить</template>
        </Modal>
	</div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import "@/styles/func.css"
import "@/styles/folder.css"
import "@/styles/link.css"
import "@/styles/modal.css"
import "@/styles/funcMedia.css"
import Modal from "@/components/Modal.vue"

const folderTitle = ref("")
const isModal = reactive({ isTrue: false })
const searchText = reactive({ value: "" })

const foldersList = reactive({ folders: [] })
const linksList = reactive({ links: [] })

const createFolder = async (isSuccess) => {
	if (isSuccess && folderTitle.value.length > 0) {
		try {
			let json = await fetch("http://95.163.221.125:8080/folders/create", {
				method: "POST",
				mode: 'cors',
				headers: {
					"Content-Type": "application/json",
					"Authorization": localStorage.getItem("token"),
					'Access-Control-Allow-Origin':'*'
				},
				body: JSON.stringify({ title: folderTitle.value, userID: localStorage.getItem("userID") })
			})

			let res = await json.json()

			folderTitle.value = ""
			foldersList.value = [...foldersList.value, res]
			console.log(foldersList.value);
		} catch (error) {
			console.log(error);
		}
	}

	openModal(false)
}

const openModal = isTrue => isModal.value = isTrue

onMounted(async () => {
	try {
		let json = await fetch(`http://95.163.221.125:8080/folders/getFoldersByUserID?userID=${localStorage.getItem("userID")}`, {
			method: "GET", headers: { "Content-Type": "application/json", "Authorization": localStorage.getItem("token") },
		})

		let res = await json.json()
		foldersList.value = [...res.folders]
		console.log(foldersList.value);
		} catch (error) {
			console.log(error);
		} 
})

const findFolder = async () => {
	try {
		let json = await fetch(`http://95.163.221.125:8080/folders/findFoldersByTitle?userID=${localStorage.getItem("userID")}&title=${searchText.value}`, {
			method: "GET", headers: { "Content-Type": "application/json", "Authorization": localStorage.getItem("token") },
		})

		let res = await json.json()
		foldersList.value = [...res.folders]
		console.log(foldersList.value);
	} catch (error) {
		console.log(error);
	} 
}

const openLinks = async (folder) => {
	try {
		let json = await fetch(`http://95.163.221.125:8080/links/getLinksByFolderID?folderID=${folder.folderID}`, {
			method: "GET", headers: { "Content-Type": "application/json", "Authorization": localStorage.getItem("token") },
		})

		let res = await json.json()
		linksList.value = [...res.links]
		console.log(linksList.value);
	} catch (error) {
		console.log(error);
	} 
}

const openCurrentLink = (link) => window.location.assign(link)

const removeFolder = async (folderID) => {
	try {
		await fetch(`http://95.163.221.125:8080/folders/deleteFolderByFolderID?folderID=${folderID}`, {
			method: "DELETE", headers: { "Content-Type": "application/json", "Authorization": localStorage.getItem("token") },
		})
		
		foldersList.value = [...foldersList.value].filter(item => item.folderID != folderID)
		console.log(foldersList.value);
	} catch (error) {
		console.log(error);
	}
}

const removeLink = async (linkID) => {
	try {
		await fetch(`http://95.163.221.125:8080/links/deleteLinkByLinkID?linkID=${linkID}`, {
			method: "DELETE", headers: { "Content-Type": "application/json", "Authorization": localStorage.getItem("token") },
		})
		
		linksList.value = [...linksList.value].filter(item => item.linkID != linkID)
		console.log(linksList.value);
	} catch (error) {
		console.log(error);
	}
}
</script>
<template>
	<div>
		<div class="func" ref="funcRoot" @click="setOpenPanel(false)">
			<div class="left_block">
				<p class="left_block__title">Папки</p>
				<form class="left_block__search">
					<input type="text" class="left_block__input" placeholder="Поиск" v-model="searchText.value" @input="findFolder" required>
					<button type="submit" class="left_block__icon"></button>
				</form>
				<div v-if="foldersList.value != null && foldersList.value?.length > 0" class="left_block__text-container">
					<div v-for="item in foldersList.value" :key="item.folderID" @click="openLinks(item)" :class="activeFolder.value.folderID == item.folderID ? 'folder folder__active' : 'folder'">
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
				<button class="left_block__button" type="button" @click="openModal(true)">Добавить папку</button>
			</div>
			<div class="right_block">
				<div class="right_block__head">
					<p class="right_block__title">{{ activeFolder.value.title }}</p>
					<span class="right_block__menu" @click.stop="setOpenPanel(true)">Действия</span>
					<div class="panel" v-if="isOpenPanel">
							<div class="panel__edit" @click="setOpenPanel(false)">
								<p class="panel__edit_text">Закрыть</p>
							</div>
							<div class="panel__edit" @click="openModalCreateLink(true)">
								<p class="panel__edit_text">Добавить ссылку</p>
							</div>
							<div class="panel__edit" @click="openModalFolderDelete(true)">
								<p class="panel__delete_text">Удалить папку</p>
							</div>
					</div>
				</div>
				<div v-if="linksList.value?.length == 0" class="right_block__body">
					<p class="right_block__empty">В этой папке пока нет материалов</p>
				</div>
				<div class="folders__list">
					<div class="folder_element" v-for="(item, index) in linksList.value" :key="item.linkID" @click="openCurrentLink(item.link)">
						<img v-if="item.image.length > 0" :src="'http://95.163.221.125:8080/image/' + item.image" alt="" class="folder_element__back">
						<img v-else src="@/assets/img/grey_back.svg" alt="" class="folder_element__back">
						<div class="folder_element__bar">
							<img src="@/assets/img/cancel.svg" alt="" class="folder_element__delete" @click.stop="setRemoveLink(item.linkID)" />
							<p class="folder_element__title">{{ item.title }}</p>
						</div>
					</div>
				</div>
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

		<Modal v-if="isModalDelete.value" @onsuccess="removeLink">
            <template #title>
				<h2 class="modal__title">Удалить ссылку?</h2>
			</template>
            <template #content>
				<p class="modal__warning">После удаления ссылку не получится восстановить</p>
			</template>
			<template #acceptButton>
				<span class="modal__delete__button">Удалить</span>
			</template>
        </Modal>

		<Modal v-if="isModalFolderDelete.value" @onsuccess="removeFolder">
            <template #title>
				<h2 class="modal__title">Удалить папку?</h2>
			</template>
            <template #content>
				<p class="modal__warning">После удаления папку не получится восстановить</p>
			</template>
			<template #acceptButton>
				<span class="modal__delete__button">Удалить</span>
			</template>
        </Modal>

		<Modal v-if="isModalLinkCreate.value" @onsuccess="createLink">
            <template #title>
				<h2 class="modal__title">Добавление ссылки</h2>
			</template>
            <template #content>
				<div class="content modal__link-content">
					<input type="text" placeholder="Ссылка..." v-model="newLink.value" required>
					<input type="text" placeholder="Укажите название..." v-model="newLinkTitle.value" required>
					<input type="text" placeholder="Укажите описание..." v-model="newLinkDescription.value" required>
					<button>Отправить</button>
				</div>
			</template>
			<template #acceptButton>Сохранить</template>
        </Modal>
	</div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import { useRouter } from "vue-router"
import "@/styles/func.css"
import "@/styles/folder.css"
import "@/styles/link.css"
import "@/styles/modal.css"
import "@/styles/funcMedia.css"
import Modal from "@/components/Modal.vue"

const folderTitle = ref("")
const isModal = reactive({ isTrue: false })
const isModalDelete = reactive({ isTrue: false })
const isModalFolderDelete = reactive({ isTrue: false })
const isModalLinkCreate = reactive({ isTrue: false })
const removeLinkID = reactive({ value: "" })

const searchText = reactive({ value: "" })

const foldersList = reactive({ folders: [] })
const linksList = reactive({ links: [] })

const activeFolder = reactive({ value: "" })

const isOpenPanel = ref("")

const newLink = reactive({ value: "" })
const newLinkTitle = reactive({ value: "" })
const newLinkDescription = reactive({ value: "" })


const createFolder = async (isSuccess) => {
	if (isSuccess && folderTitle.value.length > 0) {
		try {
			let json = await fetch(`${import.meta.env.VITE_SERVER}/folders/create`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": localStorage.getItem("token")
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
const openModalDelete = isTrue => isModalDelete.value = isTrue
const openModalFolderDelete = isTrue => isModalFolderDelete.value = isTrue
const openModalCreateLink = isTrue => isModalLinkCreate.value = isTrue

onMounted(async () => {
	try {
		let json = await fetch(`${import.meta.env.VITE_SERVER}/folders/getFoldersByUserID?userID=${localStorage.getItem("userID")}`, {
			method: "GET", headers: { "Content-Type": "application/json", "Authorization": localStorage.getItem("token") },
		})

		let res = await json.json()
		foldersList.value = [...res.folders]
		if (res.folders.length > 0) {
			openLinks(res.folders[0])
		}
		console.log(foldersList.value);
		} catch (error) {
			console.log(error);
		} 
})

const findFolder = async () => {
	try {
		let json = await fetch(`${import.meta.env.VITE_SERVER}/folders/findFoldersByTitle?userID=${localStorage.getItem("userID")}&title=${searchText.value}`, {
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
		let json = await fetch(`${import.meta.env.VITE_SERVER}/links/getLinksByFolderID?folderID=${folder.folderID}`, {
			method: "GET", headers: { "Content-Type": "application/json", "Authorization": localStorage.getItem("token") },
		})

		let res = await json.json()
		linksList.value = [...res.links]
		activeFolder.value = folder
		console.log(linksList.value);
	} catch (error) {
		console.log(error);
	} 
}

const openCurrentLink = (link) => window.open(link, '_blank')

const removeFolder = async isConfirm => {
	if (isConfirm) {
		try {
			await fetch(`${import.meta.env.VITE_SERVER}/folders/deleteFolderByFolderID?folderID=${activeFolder.value.folderID}`, {
				method: "DELETE", headers: { "Content-Type": "application/json", "Authorization": localStorage.getItem("token") },
			})
			
			foldersList.value = [...foldersList.value].filter(item => item.folderID != activeFolder.value.folderID)
			activeFolder.value = foldersList.value[0]
			openLinks(foldersList.value[0])
			setOpenPanel(false)
			console.log(foldersList.value);
		} catch (error) {
			console.log(error);
		}
	} 

	openModalFolderDelete(false)
}

const setRemoveLink = linkID => {
	removeLinkID.value = linkID
	openModalDelete(true)
}

const removeLink = async (isTrue) => {
	if (isTrue) {
		try {
			await fetch(`${import.meta.env.VITE_SERVER}/links/deleteLinkByLinkID?linkID=${removeLinkID.value}`, {
				method: "DELETE", headers: { "Content-Type": "application/json", "Authorization": localStorage.getItem("token") },
			})
			
			linksList.value = [...linksList.value].filter(item => item.linkID != removeLinkID.value)
			removeLinkID.value = ""
			console.log(linksList.value);
		} catch (error) {
			console.log(error);
		}
	}
	openModalDelete(false)
}

const createLink = async isTrue => {
	if (isTrue) {
		// try {
		// 	await fetch(`http://95.163.221.125:8080/links/deleteLinkByLinkID?linkID=${removeLinkID.value}`, {
		// 		method: "DELETE", headers: { "Content-Type": "application/json", "Authorization": localStorage.getItem("token") },
		// 	})
			
		// 	linksList.value = [...linksList.value].filter(item => item.linkID != removeLinkID.value)
		// 	removeLinkID.value = ""
		// 	console.log(linksList.value);
		// } catch (error) {
		// 	console.log(error);
		// }
	}
	openModalCreateLink(false)
}

const setOpenPanel = isOpen => isOpenPanel.value = isOpen
</script>
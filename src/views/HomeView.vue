<template>
	<div class="main" ref="homeRoot">
		<div class="main__body">
			<div class="main__header">
				<div class="main__left_flex">
					<div class="main__icon_div">
						<img src="@/assets/icon.svg" class="main__icon">
					</div>
					<div id="link_one" class="main__misha" :foo="mishaLink.moveID" @click="scrollToSection(mishaLink.refInfo)">{{ mishaLink.text }}</div>
				</div>
				<div class="main__right_flex">
					<ul class="main__ul_right_flex">
						<li v-for="item in linksList" :key="item" @click="scrollToSection(item.refInfo)"> 
            <a class="main__a_right_flex" :ref="item.refLink" :foo="item.moveID">{{ item.text }}</a>
            </li>
					</ul>
				</div>
			</div>
			<div class="main__block" id="main_block" ref="mainBlock">
				<div class="main__title">Misha -</div>
				<div class="main__subtitle">система хранения ваших <br>материалов</div>
			</div>
			<div class="why__block" id="why_block" ref="whyBlock">
				<div class="why__title">Почему Misha?</div>
				<div class="foo__blocks">
					<div class="why__block_1 foo__first">
						<div class="why__block_1_title">Экономия времени</div>
						<div class="why__block_1_2">
							<div class="why__block_1_text">экономьте время при поиске и сохранении различных материалов с помощью оптимальной системы хранения</div>
						</div>
					</div>
					<div class="why__block_2 foo__second">
						<div class="why__block_2_title">Удобный поиск</div>
						<div class="why__block_2_2">
							<div class="why__block_2_text">используйте поиск при работе с папками и с сохраненными  материалами</div>
						</div>
					</div>
					<div class="why__block_3 foo__third">
						<div class="why__block_3_title">Персонализация</div>
						<div class="why__block_3_2">
							<div class="why__block_3_text">настраивайте порядок папок так, как вам нужно, и устанавливайте к ним собственные обложки</div>
						</div>
					</div>
					<div class="why__block_4 foo__four">
						<div class="why__block_4_title">Синхронизация</div>
						<div class="why__block_4_2">
							<div class="why__block_4_text">получайте доступ к материалам с любого устройства</div>
						</div>
					</div>
				</div>
			</div>
			<div class="opportunities" id="opportunities_block" ref="opportunitiesBlock">
				<div class="opportunities__main_title">Возможности</div>
				<div class="opportunities__main_block">
					<div class="opportunities__block_1">
						<img src="@/assets/img/block_1.svg" class="opportunities__img_1">
						<div class="opportunities__title_1">Сохраняй все <br> самое нужное</div>
						
					</div>
					<div class="opportunities__block_2">
						<img src="@/assets/img/block_2.svg" class="opportunities__img_2">
						<div class="opportunities__title_2">Создавай папки <br> по интересам</div>
					</div>
					<div class="opportunities__block_3">
						<img src="@/assets/img/block_3.svg" class="opportunities__img_3">
						<div class="opportunities__title_3">Сортируй, как хочешь - <br> перетаскивай!</div>
					</div>
				</div>
			</div>
			<div class="mobile" id="mobile_block" ref="mobileBlock"> 
				<img src="@/assets/img/mobile.svg" class="mobile__img">
				<p class="mobile__title">Мобильное приложение</p>
				<div class="mobile__subtitle">самое любимое и нужное всегда под рукой</div>
			</div>
			<div class="login" id="login_block" ref="loginBlock">
				<div class="login__block">
					<div class="login__options">
						<div class="block__registration" ref="signup" @click="setStatusIsSignup(true)">Регистрация</div>
						<div class="block__login" ref="login" @click="setStatusIsSignup(false)">Вход</div>
					</div>
					<input type="tel" class="login__telephone" placeholder="Номер телефона" v-model="phoneInput" required>
					<input type="password" class="login__password" placeholder="Пароль" v-model="passwordInput" required>
					<button class="login__next" type="button" @click="sendAuth">Далее</button>
				</div>
			</div>
			<div class="bottom_bar" id="bottom_block" ref="bottomBlock">
				<div class="bottom_bar__flex">
					<img src="@/assets/icon.svg" class="bottom_bar__icon">
					<div class="bottom_bar__name">Misha</div>
				</div>
				<div class="bottom_bar__info">По всем вопросам обращайтесь на shabalinairina979@yandex.ru</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue"
import { useRouter } from "vue-router"
import "@/styles/style.css"

let homeRoot = ref(null)
let mainBlock = ref(null)
let whyBlock = ref(null)
let opportunitiesBlock = ref(null)
let mobileBlock = ref(null)
let loginBlock = ref(null)
let bottomBlock = ref(null)

const linkOne = ref(null)
const linkTwo = ref(null)
const linkThird = ref(null)
const linkFour = ref(null)
const linkFive = ref(null)
const linkSix = ref(null)

const mishaLink = {moveID: "main_block", text: "Misha", refInfo: mainBlock, refLink: linkOne }
const linksList = [ 
{ moveID: "why_block", text: " Почему Misha?", refInfo: whyBlock, refLink: linkTwo }, 
{ moveID: "opportunities_block", text: " Возможности", refInfo: opportunitiesBlock, refLink: linkThird }, 
{ moveID: "mobile_block", text: " Мобильное приложение", refInfo: mobileBlock, refLink: linkFour }, 
{ moveID: "login_block", text: " Вход/Регистрация", refInfo: loginBlock, refLink: linkFive }, 
{ moveID: "bottom_block", text: " Контакты", refInfo: bottomBlock, refLink: linkSix }]

const scrollToSection = (refInfo) => refInfo.value.scrollIntoView({ behavior: "smooth", block: "start" })

const signup = ref(null)
const login = ref(null)

const phoneInput = ref("")
const passwordInput = ref("")

let isSignupStatus = reactive({value: true}) 

const router = useRouter()

const setStatusIsSignup = isSignup => {
	isSignupStatus.value = isSignup
	if (isSignup) {
		signup.value.classList.add("block__registration")
		signup.value.classList.remove("block__login")	
		
		login.value.classList.add("block__login")
		login.value.classList.remove("block__registration")
	} else {
		login.value.classList.add("block__registration")
		login.value.classList.remove("block__login")

		signup.value.classList.add("block__login")
		signup.value.classList.remove("block__registration")	
	}
}

const sendAuth = async () => {
	console.log(phoneInput.value, passwordInput.value);
	if (phoneInput.value.length > 0 && passwordInput.value.length > 0) {
		try {
			let json = await fetch(`http://95.163.221.125:8080/auth/users/${isSignupStatus.value ? "signup" : "login"}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ phone: phoneInput.value, password: passwordInput.value })
		})

		let res = await json.json()
		localStorage.setItem("token", res.token)
		localStorage.setItem("userID", res.user.id)

		phoneInput.value = ""
		passwordInput.value = ""

		router.push({ name: "func" })
		} catch (error) {
			console.log(error);
		}
	}
}

onMounted(() => {
    const sections = linksList.map(item => item.refInfo)
	const menuLinks = homeRoot.value.querySelectorAll('[foo]')

    const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.8
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                menuLinks.forEach(linkRef => {
					if (linkRef) {
						const element = document.getElementById(entry.target.id)
						if (entry.target.id == linkRef.getAttribute("foo")) {
							linkRef.classList.add("active");
						} else linkRef.classList.remove("active")
					}
                });
            }
        });
    }, options);

 
    sections.forEach(section => {
      if (section.value) {
        observer.observe(section.value)
      }
    })

});
</script>

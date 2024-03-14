class StickyNavigation {

	constructor() {
		this.currentId = null;
		this.currentTab = null;
		this.tabContainerHeight = 70;
		let self = this;
		$('.et-hero-tab').click(function () {
			self.onTabClick(event, $(this));
		});
		$(window).scroll(() => { this.onScroll(); });
		$(window).resize(() => { this.onResize(); });
	}

	onTabClick(event, element) {
		event.preventDefault();
		let scrollTop = $(element.attr('href')).offset().top - this.tabContainerHeight + 1;
		$('html, body').animate({ scrollTop: scrollTop }, 600);
	}

	onScroll() {
		this.checkTabContainerPosition();
		this.findCurrentTabSelector();
	}

	onResize() {
		if (this.currentId) {
			this.setSliderCss();
		}
	}

	checkTabContainerPosition() {
		let offset = $('.et-hero-tabs').offset().top + $('.et-hero-tabs').height() - this.tabContainerHeight;
		if ($(window).scrollTop() > offset) {
			$('.et-hero-tabs-container').addClass('et-hero-tabs-container--top');
		}
		else {
			$('.et-hero-tabs-container').removeClass('et-hero-tabs-container--top');
		}
	}

	findCurrentTabSelector(element) {
		let newCurrentId;
		let newCurrentTab;
		let self = this;
		$('.et-hero-tab').each(function () {
			let id = $(this).attr('href');
			let offsetTop = $(id).offset().top - self.tabContainerHeight;
			let offsetBottom = $(id).offset().top + $(id).height() - self.tabContainerHeight;
			if ($(window).scrollTop() > offsetTop && $(window).scrollTop() < offsetBottom) {
				newCurrentId = id;
				newCurrentTab = $(this);
			}
		});
		if (this.currentId != newCurrentId || this.currentId === null) {
			this.currentId = newCurrentId;
			this.currentTab = newCurrentTab;
			this.setSliderCss();
		}
	}

	setSliderCss() {
		let width = 0;
		let left = 0;
		if (this.currentTab) {
			width = this.currentTab.css('width');
			left = this.currentTab.offset().left;
		}
		$('.et-hero-tab-slider').css('width', width);
		$('.et-hero-tab-slider').css('left', left);
	}

}

new StickyNavigation();

const slider = document.querySelector('.slider');

function activate(e) {
	const items = document.querySelectorAll('.item');
	e.target.matches('.next') && slider.append(items[0])
	e.target.matches('.prev') && slider.prepend(items[items.length - 1]);
}

document.addEventListener('click', activate, false);

const gallery = document.querySelector('.gallery');
const track = document.querySelector('.gallery-track');
const cards = document.querySelectorAll('.card');
const easing = 0.05;
let startY = 0;
let endY = 0;
let raf;

const lerp = (start, end, t) => start * (1 - t) + end * t;

function updateScroll() {
	startY = lerp(startY, endY, easing);
	gallery.style.height = `${track.clientHeight}px`;
	track.style.transform = `translateY(-${startY}px)`;
	activateParallax();
	raf = requestAnimationFrame(updateScroll);
	if (startY.toFixed(1) === window.scrollY.toFixed(1)) cancelAnimationFrame(raf);
}

function startScroll() {
	endY = window.scrollY;
	cancelAnimationFrame(raf);
	raf = requestAnimationFrame(updateScroll);
}

function parallax(card) {
	const wrapper = card.querySelector('.card2-image-wrapper');
	const diff = card.offsetHeight - wrapper.offsetHeight;
	const { top } = card.getBoundingClientRect();
	const progress = top / window.innerHeight;
	const yPos = diff * progress;
	wrapper.style.transform = `translateY(${yPos}px)`;
}

const activateParallax = () => cards.forEach(parallax);

function init() {
	activateParallax();
	startScroll();
}

window.addEventListener('load', updateScroll, false);
window.addEventListener('scroll', init, false);
window.addEventListener('resize', updateScroll, false);
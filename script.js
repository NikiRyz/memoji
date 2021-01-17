(function init() {
    const cards = Array.from(document.querySelectorAll('.card'))
    cards.forEach((card) => { card.addEventListener('click', clickEvent) })
}())

function clickEvent() {
    const opened = this.classList.contains('open')
    if (!opened) {
        this.classList.remove('close')
        this.classList.add('open')
    } else {
        this.classList.remove('open');
        this.classList.add('close');
    }
}
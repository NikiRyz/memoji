function coupleArr(arr) {
    return [].concat(arr, arr);
  }
  function shuffleArr (arr){
      return arr.sort(()=>Math.random()-0.5)
  }  
(function init() {
    const emoji = '🤓 😍 😂 😊 😆 😏'.split(' ');
    const shuffleEmoji  = shuffleArr(coupleArr(emoji))
    const cards = Array.from(document.querySelectorAll('.card'))
    fillCards(cards,shuffleEmoji)
    cards.forEach((card) => { card.addEventListener('click', clickEvent) })
}())
function fillCards(cards,emoji){
    cards.forEach((card,index)=>{card.textContent=emoji[index]})
}
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
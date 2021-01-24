
(function init() {
    const emojiList = '🐞 🦀 🐟 🐊 🐓 🦃'.split(' ');
    const cardsField = document.querySelector('.cards');
    const cardElems = Array.from(cardsField.querySelectorAll('.card'));
    new GameProcess({ emojiList, cardsField, cardElems });
  }());
  
  
  class GameProcess {
    constructor({ emojiList, cardsField, cardElems }) {
          //создаем массив парных изображений
      this.emojiList = this.coupleEmoji(emojiList);
      this.cardsField = cardsField;
      this.cardElems = cardElems;
      this.cardsList = [];
    }
      coupleEmoji(emojiList) {
      const arr = emojiList.map((emoji, id) => ({
        emoji:emoji, id:id,
      }));
      return arr.concat(arr);
    }
    initCards(){
        this.shuffleEmoji();
    }  
    shuffleEmoji(){
        this.emojiList = this.emojiList.sort(() => Math.random() - 0.5);
    } 
  }
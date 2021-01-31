const enumStatus = {
  CLOSE: 'close',
  OPEN: 'open',
  SUCCESS: 'success',
  WRONG: 'wrong',
};

class Card {
  constructor(node, { id, emoji }) {
    this.node = node;
    this.id = id;
    this.status = enumStatus.CLOSE;
    this.node.textContent = emoji;
  }
  getStatus() {
    return this.status;
  }
  getId() {
    return this.id;
  }
  addClass(name) {
    this.node.classList.add(name);
  }
  removeClass(name) {
    this.node.classList.remove(name);
  }
  clearContext() {
    ['open', 'wrong', 'success', 'open-success', 'open-wrong'].forEach((n) => this.removeClass(n));
  }

  open() {
    this.removeClass('close');
    this.addClass('open');
    this.status = enumStatus.OPEN;
  }

  close() {
    this.clearContext();
    this.addClass('close');
    this.status = enumStatus.CLOSE;
  }

  success(flip) {
    this.removeClass('close');
    this.addClass(flip ? 'open-success' : 'success');
    this.status = enumStatus.SUCCESS;
  }

  wrong(flip) {
    this.removeClass('close');
    this.addClass(flip ? 'open-wrong' : 'wrong');
    this.status = enumStatus.WRONG;
  }


}


class GameProcess {
  constructor({ emojiList, cardsField, cardElems,timerNode }) {
    this.emojiList = this.coupleEmoji(emojiList);
    this.cardsField = cardsField;
    this.cardElems = cardElems;
    this.cardsList = [];
    this.timerNode=timerNode;
    this.timerOpts={seconds: 60,};
   this.init();
  }

  init(){
    this.initCards();
    this.initEvents();
    this.setTime(this.timerOpts.seconds);
  }
  initCards() {
    this.shuffleEmoji();
    this.cardsList = this.cardElems
      .map((card, index) => new Card(card, this.emojiList[index]));
  }
  setTime(seconds) {
    this.timerNode.textContent = secondsToTime(seconds);
}
  initEvents() {
    //обрабатываем клик в cards
    this.cardsField.addEventListener('click', ({ target }) => {
      //если клик сделали по карточке
      if (target.classList.contains('card')) {
        const cardIdx = this.cardElems.indexOf(target);
        const card = this.cardsList[cardIdx];
        if (card.getStatus() === enumStatus.CLOSE) {
          this.closeWrong();
          this.checkCards(card);
        }
      }
    });
  }
 
 
  coupleEmoji(emojiList) {
    const arr = emojiList.map((emoji, id) => ({
      emoji, id,
    }));
    return arr.concat(arr);
  }

  shuffleEmoji() {
    this.emojiList = this.emojiList.sort(() => Math.random() - 0.5);
  }


  checkCards(card) {
    //ищем открытые карточки
    const findOpenCard = this.cardsList.find((x) => x.getStatus() === enumStatus.OPEN);
    //если нашли
    if (findOpenCard) {
      //проверяем одинаковые ли id у карточек
      const isCouple = card.getId() === findOpenCard.getId();
      //если одинаковые - устанавливаем статус success
      if (isCouple) {
        findOpenCard.success();
        card.success(true);
      }
      //если разные - устанавливаем статус wrong
      else {
        findOpenCard.wrong();
        card.wrong(true);
      }
    }
    //если не нашли открытую карточку - открываем
    else {
      card.open();
    }
  }


  closeWrong() {
    this.cardsList
      .filter((x) => x.getStatus() === enumStatus.WRONG)
      .forEach((x) => x.close());
  }
}

(function init() {
  const emojiList = '🐞 🦀 🐟 🐊 🐓 🦃'.split(' ');
  const cardsField = document.querySelector('.cards');
  const cardElems = Array.from(cardsField.querySelectorAll('.card'));
  const timerNode = document.querySelector('.timer');
  new GameProcess({ emojiList, cardsField, cardElems, timerNode });
}());

function secondsToTime(s) {
  const minutes = Math.floor(s / 60);
  const _seconds = s % 60;
  const secondsFormat = _seconds < 10 ? `0${_seconds}` : _seconds.toString();
  return `${minutes}:${secondsFormat}`;
}
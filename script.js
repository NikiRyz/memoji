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
    ['open',  'wrong', 'success', 'open-success', 'open-wrong'].forEach((n) => this.removeClass(n));
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
  constructor({
      emojiList,
      cardsField,
      cardElems,
      timerNode,
      alertNode,
  }) {
      this.emojiList = this.coupleEmoji(emojiList);
      this.timerNode = timerNode;
      this.cardsField = cardsField;
      this.cardElems = cardElems;
      this.alertNode = alertNode;
      this.cardsList = [];
      this.timerOpts = {
          seconds: 60,
      };
      this.init();
  }

  init() {
      this.initCards();
      this.initEvents();
      this.setTime(this.timerOpts.seconds);
      this.clearContext();
  }

  initCards() {
      this.shuffleEmoji();
      this.cardsList = this.cardElems
          .map((card, index) => new Card(card, this.emojiList[index]));
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

      this.alertNode.querySelector('.alert__button')
          .addEventListener('click', () => this.restartGame());
  }

  setTime(seconds) {
      this.timerNode.textContent = secondsToTime(seconds);
  }

  initTimer() {
      let { seconds } = this.timerOpts;
      this.timerId = setInterval(() => {
          seconds--;
          this.setTime(seconds);
          if (!seconds) {
              this.endGame(false);
          }
      }, 1000);
  }

  restartGame() {
      this.cardsList.forEach((x) => x.close());
      this.initCards();
      this.setTime(this.timerOpts.seconds);
      this.clearContext();
  }

  endGame(win) {
      clearInterval(this.timerId);
      const status = win ? 'win' : 'lose';
      const btnText = win ? 'Играть снова' : 'Попробовать снова';
      this.alertNode.querySelector('.alert__button').textContent = btnText;
      this.alertNode.querySelector(`.${status}`).classList.remove('invisible');
      this.alertNode.classList.remove('invisible');
  }

  coupleEmoji(emojiList) {
      const arr = emojiList.map((emoji, id) => ({
          emoji,
          id,
      }));
      return [].concat(arr, arr);
  }

  shuffleEmoji() {
      this.emojiList = this.emojiList.sort(() => Math.random() - 0.5);
  }

  closeWrong() {
      this.cardsList
          .filter((x) => x.getStatus() === enumStatus.WRONG)
          .forEach((x) => x.close());
  }

  checkCards(card) {
      if (!this.gameStarted) {
          this.gameStarted = true;
          this.initTimer();
      }
      const findOpenCard = this.cardsList.find((x) => x.getStatus() === enumStatus.OPEN);
      if (findOpenCard) {
          const isCouple = card.getId() === findOpenCard.getId();
          if (isCouple) {
              findOpenCard.success();
              card.success(true);
          } else {
              findOpenCard.wrong();
              card.wrong(true);
          }
      } else {
          card.open();
      }
      if (this.cardsList.every((x) => x.getStatus() === enumStatus.SUCCESS)) {
          this.endGame(true);
      }
  }

  clearContext() {
      this.gameStarted = false;
      ['win', 'lose'].forEach((i) => {
          console.log(this.alertNode)
          console.log(this.alertNode.querySelector(`.${i}`))
          this.alertNode.querySelector(`.${i}`).classList.add('invisible');
      });
      this.alertNode.classList.add('invisible');
  }
}

function secondsToTime(s) {
  const minutes = Math.floor(s / 60);
  const _seconds = s % 60;
  const secondsFormat = _seconds < 10 ? `0${_seconds}` : _seconds.toString();
  return `${minutes}:${secondsFormat}`;
}

(function init() {
  const emojiList = '🐞 🦀 🐟 🐊 🐓 🦃'.split(' ');
  const cardsField = document.querySelector('.cards');
  const cardElems = Array.from(cardsField.querySelectorAll('.card'));
  const timerNode = document.querySelector('.timer');
  const alertNode = document.querySelector('.alert');
  new GameProcess({
      emojiList,
      cardsField,
      cardElems,
      timerNode,
      alertNode,
  });
}());
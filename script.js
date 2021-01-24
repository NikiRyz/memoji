const enumStatus = {
    CLOSE: 'close',
    OPEN: 'open',
    SUCCESS: 'success',
    WRONG: 'wrong',
  };

class GameProcess {
    constructor({ emojiList, cardsField, cardElems }) {
          //создаем массив парных изображений
      this.emojiList = this.coupleEmoji(emojiList);
      this.cardsField = cardsField;
      this.cardElems = cardElems;
      this.cardsList = [];
      this.initCards();
      this.initEvents();
    }
      coupleEmoji(emojiList) {
      const arr = emojiList.map((emoji, id) => ({
        emoji, id,
              }));
      return arr.concat(arr);
    }
  
      initCards() {
          //перемешиваем массив
          this.shuffleEmoji();
          //создаем карточки на основе узлов .card, которые мы нашли
          this.cardsList = this.cardElems
            .map((card, index) => new Card(card, this.emojiList[index]));
        }	
          // на каждом шаге возвращается положительное или отрицательное число
          shuffleEmoji() {
              this.emojiList = this.emojiList.sort(() => Math.random() - 0.5);
           }

           initEvents() {
            //обрабатываем клик в cards
            this.cardsField.addEventListener('click', ({ target }) => {
              //если клик сделали по карточке
              if (target.classList.contains('card')) {
                        //получаем индекс элемента в массиве карточек
                const cardIdx = this.cardElems.indexOf(target);
                        //получаем саму карточку
                const card = this.cardsList[cardIdx];
                if (card.getStatus() === enumStatus.CLOSE) {
                  this.closeWrong();
                  this.checkCards(card);
                }
              }
            })
          } 
  } 
  class Card {
    constructor(node, { id, emoji }) {
      this.node = node;
      this.id = id;
      this.status = enumStatus.CLOSE;
      this.node.textContent = emoji;
    }
    getStatus(){
        return this.status
    }
    getId(){
        return this.id
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
      addClass(name){
          this.node.classList.add(name)
      }
      removeClass(name){
          this.node.classList.remove(name)
      }
  }
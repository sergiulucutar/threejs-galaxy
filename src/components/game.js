class GameState {
  constructor(uiEl) {
    this.state = {
      troops: 0,
      cash: 0,
      science: 0,
      biomass: 0
    };

    this.uiEl = uiEl;
  }

  update(values = []) {
    for(let value of values) {
      switch(value) {
        case '1':
          this.state.troops += Math.floor(Math.random() * 20);
          break;
        case '2':
          this.state.cash += Math.floor(Math.random() * 400);
          break;
        case '3':
          this.state.science += Math.floor(Math.random() * 50);
          break;
        case '4':
          this.state.biomass += Math.floor(Math.random() * 100);
          break;
      }
    }

    this.updateUI();
  }

  updateUI() {
    this.uiEl.children[0].querySelector('span').innerText = this.state.troops;
    this.uiEl.children[1].querySelector('span').innerText = this.state.cash;
    this.uiEl.children[2].querySelector('span').innerText = this.state.science;
    this.uiEl.children[3].querySelector('span').innerText = this.state.biomass;
  }
}

const el = document.querySelector('.game_state');
export const gameState = new GameState(el);
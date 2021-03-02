
class InterestPointTypeSelector {

  constructor(optionsEl) {
    this.selectedInterestPoint = null;
    this.optionsEl = optionsEl;
    this.formEL = optionsEl.querySelector('form');

    this.optionsEl.querySelector('button').addEventListener('click', this.close.bind(this));
    [...this.formEL.pointtype].forEach(radioButton => {
      radioButton.addEventListener('change', () => this.updateValue(radioButton.value))
    });
  }

  updateValue(newValue) {
    this.selectedInterestPoint.dataset.type = newValue;
  }

  resetSelectedPoint() {
    this.selectedInterestPoint.classList.remove('point-selected');
    this.selectedInterestPoint = null;
  }

  open(point) {
    this.optionsEl.classList.add('point_options-opened');
    
    if(this.selectedInterestPoint) {
      this.resetSelectedPoint();
    }
    
    this.selectedInterestPoint = point;
    this.selectedInterestPoint.classList.add('point-selected');
    this.formEL.pointtype.value = +point.dataset.type;
  }

  close() {
    this.optionsEl.classList.remove('point_options-opened');
    this.resetSelectedPoint();
  }
}

const optionsEl = document.querySelector('.point_options');
export const interestPointTypeSelector = new InterestPointTypeSelector(optionsEl);

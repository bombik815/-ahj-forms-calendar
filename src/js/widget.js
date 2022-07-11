import moment from 'moment';

export default class Widget {
  constructor() {
    this.checkbox = document.querySelector('.date-check');
    this.dateBack = document.querySelector('.date-input-back');
    this.dateThere = document.querySelector('.date-input-there');
    this.inputBack = document.querySelector('.input-back');
    this.inputThere = document.querySelector('.input-there');
    this.datePrev = document.querySelector('.date-prev');
    this.dateNext = document.querySelector('.date-next');
    this.inputThereValue = {};
    this.currentInput = null;
    this.count = 0;
  }

  events() {
    this.clickCheckbox();
    this.dateBackInput();
    this.dateThereInput();
    this.clickNextMonth();
    this.clickPrevMonth();
  }

  clickCheckbox() {
    this.checkbox.addEventListener('click', () => {
      const textThereDate = document.querySelector('.date-input-there > p');
      if (document.querySelector('.date-choice').style.display === 'flex') {
        document.querySelector('.date-choice').style.display = 'none';
        this.count = 0;
      }
      if (this.checkbox.checked) {
        this.dateBack.style = 'display: block';
        this.dateThere.style = 'width: auto';
        textThereDate.textContent = 'Туда:';
        document.querySelector('.input-back').value = '';
      } else {
        this.dateBack.style = 'display: none';
        this.dateThere.style = 'width: 99%';
        textThereDate.textContent = 'Дата:';
      }
    });
  }

  dateBackInput() {
    this.inputBack.addEventListener('focus', () => {
      this.popUpDate(this.inputBack);
    });
  }

  dateThereInput() {
    this.inputThere.addEventListener('focus', () => {
      this.count = 0;
      this.popUpDate(this.inputThere);
    });
  }

  static otherClick(element) {
    for (const i of element) {
      i.addEventListener('click', () => {
        if (document.querySelector('.date-choice').style.display === 'flex' && !i.classList.contains('calendar-days')) {
          document.querySelector('.date-choice').style.display = 'none';
          this.count = 0;
        }
      });
    }
  }

  dateMoment(m = 0) {
    const countMonth = m;
    const titleMonth = document.querySelector('.date-month');
    const titleYear = document.querySelector('.date-year');
    const tableBody = document.querySelector('.calendar > tbody');
    let day = moment().format('D');
    let month = moment().format('M');
    let year = +moment().format('YYYY');

    if (this.inputThereValue.thereYear) {
      day = +this.inputThereValue.thereDay;
      month = +this.inputThereValue.thereMonth;
    }

    const curMonth = moment().add(countMonth, 'month').format('M');
    const daysInMonth = moment().add(countMonth, 'month').daysInMonth();
    let firstDayMonth = 6;

    if (moment().add(countMonth, 'month').startOf('month').day() !== 0) {
      firstDayMonth = (moment().add(countMonth, 'month').startOf('month').day() - 1);
    }

    if (countMonth > 1) {
      year += 1;
    }

    if (this.count !== 0 && +curMonth !== +month) {
      document.querySelector('.date-prev').classList.remove('date-prev-z');
    } else if (+curMonth === +month) {
      document.querySelector('.date-prev').classList.add('date-prev-z');
    } else {
      document.querySelector('.date-prev').classList.add('date-prev-z');
    }

    titleMonth.textContent = moment().add(countMonth, 'month').format('MMMM');
    titleYear.textContent = year;

    if (!document.querySelector('.calendar > tbody > tr')) {
      for (let i = 0; i < 6; i += 1) {
        const cloneTr = document.querySelector('.calendar > thead > tr').cloneNode(true);
        tableBody.appendChild(cloneTr);
      }
    }

    const monthDays = Array.from(document.querySelectorAll('.calendar > tbody > tr > th'));

    for (let i = 0; i < monthDays.length; i += 1) {
      monthDays[i].textContent = '';
      monthDays[i].classList.add('bold-date');
      monthDays[i].classList.remove('current-date');
    }

    for (let j = 0; j < monthDays.length; j += 1) {
      if (j === firstDayMonth) {
        for (let i = 0; i < daysInMonth; i += 1) {
          monthDays[j + i].textContent = i + 1;
          if ((i + 1) < +day && +curMonth === +month) {
            monthDays[j + i].classList.remove('bold-date');
            monthDays[j + i].classList.add('calendar-days');
          } else {
            monthDays[j + i].classList.remove('calendar-days');
          }
        }
      }
      if (monthDays[j].textContent === '') {
        monthDays[j].classList.remove('bold-date');
        monthDays[j].classList.add('calendar-days');
      }
    }

    if (+moment().format('M') === +curMonth) {
      monthDays[(day - 1) - firstDayMonth].classList.add('current-date');
    }

    this.dateChoiceBack();
    this.dateChoiceThere(curMonth);
    Widget.otherClick(monthDays);
  }

  clickPrevMonth() {
    this.datePrev.addEventListener('click', () => {
      this.count -= 1;
      this.dateMoment(this.count);
    });
  }

  clickNextMonth() {
    this.dateNext.addEventListener('click', () => {
      this.count += 1;
      this.dateMoment(this.count);
    });
  }

  dateChoiceBack() {
    const arrDays = document.querySelectorAll('.calendar > tbody > tr > th');
    for (const i of arrDays) {
      i.addEventListener('click', (ev) => {
        const year = document.querySelector('.date-year').textContent;
        const month = document.querySelector('.date-month').textContent;
        if (document.querySelector('.input-back') === this.currentInput && !i.classList.contains('calendar-days')) {
          document.querySelector('.input-back').value = `${ev.target.textContent} ${month} ${year}`;
        }
      });
    }
  }

  dateChoiceThere(numberMonth) {
    const arrDays = document.querySelectorAll('.calendar > tbody > tr > th');
    const year = document.querySelector('.date-year').textContent;
    const month = document.querySelector('.date-month').textContent;

    for (const i of arrDays) {
      i.addEventListener('click', (ev) => {
        if (document.querySelector('.input-there') === this.currentInput && !i.classList.contains('calendar-days')) {
          document.querySelector('.input-there').value = `${ev.target.textContent} ${month} ${year}`;
          this.inputThereValue = {
            thereYear: +year,
            thereMonth: +numberMonth,
            thereDay: +ev.target.textContent,
            count: this.count,
          };
        }
      });
    }
  }

  popUpDate(element) {
    element.focus();
    this.currentInput = element;
    const calendar = document.querySelector('.date-choice');
    if (calendar.style === 'display: flex') {
      calendar.style = 'display: none';
    }
    calendar.style = 'display: flex';
    this.dateMoment(this.count);
    element.offsetParent.appendChild(calendar);
    calendar.style.top = `${element.offsetTop + element.offsetHeight}px`;
    calendar.style.left = `${element.offsetLeft}px`;
  }
}

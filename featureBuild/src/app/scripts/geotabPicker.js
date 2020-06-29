let GeotabPicker = (function() {
    'use strict'

    let hasEventListener = window.addEventListener;
    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    function GeotabPicker() {
        let _self = this;
        let _id;

        let defaults = {
            className: 'geotabpicker',
            dateFormat: 'dd/MM/yyyy',
            date: new Date(new Date().setHours(0,0,0,0))
        };

        console.log(arguments);

        // check if the datepicker is called with specific arguments
        if (arguments[0] && typeof(arguments[0]) === 'object') {
            _self.options = extend(defaults, arguments[0]);
            _id = _self.options.id;
        };

        _self.showPicker = function() {
            _self.buildPicker();
            let pickerField = document.getElementById(_id);
            let pickerDiv = document.getElementById('geotabpicker-' + _id);
            if (pickerField) {
                let datepicker = pickerField.getBoundingClientRect();
                let left = datepicker.left;
                let top = datepicker.bottom - 7;
                if (pickerDiv) {
                    pickerDiv.style.position = 'fixed';
                    pickerDiv.style.top = top + 'px';
                    pickerDiv.style.left = left + 'px';
                    pickerDiv.style.zIndex = '99999';
                }
            }
        };

        _self.hidePicker = function() {
            setTimeout(function() {
                let pickerDiv, pickerField;
                if (!_self.monthChange && !_self.isPickerClicked) {
                    _self.removeListeners(_id);
                    pickerDiv = document.getElementById('geotabpicker-' + _id);
                    pickerDiv.removeEventListener('click', self.handlePickerClick, false);
                    if (pickerDiv) {
                        pickerDiv.innerHTML = '';
                    }
                    _self.isDateClicked = false;
                } else if (!_self.isPickerClicked) {
                    pickerField = document.getElementById(_self.options.id);
                    if (pickerField) {
                        pickerField.focus();
                    }
                    _self.monthChange = false;
                } else if (_self.isDoneButtonClicked) {
                    _self.removeListeners(_id);
                    pickerDiv = document.getElementById('geotabpicker-' + _id);
                    pickerDiv.removeEventListener('click', self.handlePickerClick, false);
                    if (pickerDiv) {
                        pickerDiv.innerHTML = '';
                    }
                    _self.isDateClicked = false;
                    _self.isDoneButtonClicked = false;
                }
            }, 60);
        };

        // Date selection callback when a day on the calendar is picked
        _self.selectDate = function(event) {
            _self.monthChange = false;
            let el = document.getElementById(event.target.id);
            let pickerField = document.getElementById(_id);
            let hourDrop = document.getElementsByClassName('geotabpicker__time--hour');
            let minuteDrop = document.getElementsByClassName('geotabpicker__time--minute');

            // remove the selected class from the previous day
            let prevSelection = document.getElementsByClassName('geotabpicker__day--selected');
            if (prevSelection.length > 0) {
                prevSelection[0].classList.remove('geotabpicker__day--selected');
            }
            if (el) {
                el.classList.add('geotabpicker__day--selected');
                let prevMonth = _self.selectedMonth;
                let date = format(_self, el.dataset.day, el.dataset.month, el.dataset.year);
                _self.selectedDate = date;
                _self.selectedDay = parseInt(el.dataset.day);
                _self.selectedMonth = parseInt(el.dataset.month);
                _self.selectedYear = parseInt(el.dataset.year);

                if (parseInt(el.dataset.month) !== prevMonth || parseInt(el.dataset.month) !== _self.currentMonth + 1) {
                    _self.updateCalendar(el.dataset.month - 1,  el.dataset.year);
                }
                if (pickerField) {
                    let hour = timeHourFormat(hourDrop[0].value);
                    let hourArr = hour.hourText.split(' ');
                    let hourInput = hourArr[0] === '00' ? '12' : hourArr[0];
                    pickerField.value = date + ' ' + hourInput + ':' + minuteDrop[0].value + ' ' + hourArr[1].toLowerCase();
                    _self.options.date = new Date(el.dataset.year, el.dataset.month -1 , el.dataset.day, hourDrop[0].value, minuteDrop[0].value, 0, 0);
                    pickerField.focus();
                }

                if (parseInt(el.dataset.month) !== _self.selectedMonth) {
                    _self.updateCalendar(el.dataset.month - 1);
                }
            }
            _self.isPickerClicked = false;
            _self.isDateClicked = true;
        };
        
        _self.removeListeners = function(id) {
            let picker = document.getElementById(id);
            if (picker) {
              let el = picker.getElementsByClassName('geotabpicker__day');
              if (el && el.length) {
                for (let count = 0; count < el.length; count++) {
                  if (typeof el[count].onclick === 'function') {
                    let elem = document.getElementById(id + '-geotabpicker__day--' + el[count].dataset.month + '-' + el[count].dataset.day);
                    removeEvent(elem, 'click', _self.selectDate, false);
                  }
                }
              }
            }
            document.removeEventListener('keydown', keyDownListener, false);
      
            let htmlRoot = document.getElementsByTagName('html')[0];
            htmlRoot.removeEventListener('click', _self.handleDocumentClick, false);
        };
      
        _self.changeMonth = function(event) {
            let className = event.target.className, positive = false;
            if (className.indexOf('geotabpicker__arrow--next') !== -1) {
              positive = true;
            }
            let month = positive ? _self.currentMonth + 1 : _self.currentMonth - 1;
            _self.updateCalendar(month);
        };
      
        _self.updateCalendar = function(newMonth, newYear) {
            _self.monthChange = true;
            let day = _self.currentDate;
            let year = newYear || _self.currentYear;
            _self.currentMonth = newMonth;
            _self.currentYear = year;
            Calendar.date = new Date(year, newMonth , day);
            let pickerDiv = document.getElementById('geotabpicker-' + _id);
            if (pickerDiv) {
                let datepicker = pickerDiv.querySelector('.geotabpicker');
                datepicker.innerHTML = Calendar.buildHeader() + Calendar.buildCalendar(Calendar.date) + Calendar.buildTime(_self);
                _self.isPickerClicked = false;
                Calendar.removeListeners(_self);
                Calendar.addListeners(_self);
            }
        };

        _self.buildPicker = function() {
            let pickerDiv = document.getElementById('geotabpicker-' + _id);
            let pickerField = document.getElementById(_id);
            if (pickerDiv && !hasPicker(pickerDiv)) {
                let fragment;
                let datepicker;
                fragment = document.createDocumentFragment();
                datepicker = document.createElement('div');

                datepicker.className = _self.options.className;
                let date;
                if (pickerField && pickerField.value && pickerField.value.length >= 18) {
                    date = parseDate(_self, pickerField.value);
                    _self.selectedDay = date.getDate();
                    _self.selectedMonth = date.getMonth() + 1;
                    _self.selectedYear = date.getFullYear();
                    _self.selectedDate = format(_self, date.getDate(), date.getMonth() + 1, date.getFullYear());
                } else {
                    date = new Date();
                }
                Calendar.date = date;
                // Add calendar to datepicker
                datepicker.innerHTML = Calendar.buildHeader() + Calendar.buildCalendar(date) + Calendar.buildTime(_self);
                // Append picker to fragment and add fragment to DOM
                fragment.appendChild(datepicker);
                pickerDiv.appendChild(fragment);
                Calendar.addListeners(_self);
                // add event listener to handle clicks anywhere on date picker
                addEvent(pickerDiv, 'click', _self.handlePickerClick, false);
            }
            document.addEventListener('keydown', keyDownListener, false);
      
            // Close the date picker if clicked anywhere outside the picker element
            let htmlRoot = document.getElementsByTagName('html')[0];
            addEvent(htmlRoot, 'click', _self.handleDocumentClick, false);
        };

        _self.handlePickerClick = function(event) {
            event.stopPropagation();
            
            if (!_self.isDateClicked) {
                _self.isPickerClicked = true;
            }
        };
      
        _self.handleDocumentClick = function(event) {
            let pickerField = document.getElementById(_self.options.id);
            let pickerDiv = document.getElementById('geotabpicker-' + _self.options.id);
            _self.isPickerClicked = false;
            _self.monthChange = false;
            if (event.target !== pickerField && event.target !== pickerDiv) {
              _self.hidePicker();
            }
        };

        _self.handleDoneClick = function(event) {
            _self.isDoneButtonClicked = true;
            _self.hidePicker();
        };

        _self.handleNowClick = function(event) {
            let date = new Date();
            let monthSelect = document.getElementsByClassName('geotabpicker__date--month');
            let yearSelect = document.getElementsByClassName('geotabpicker__date--year');
            let hourDrop = document.getElementsByClassName('geotabpicker__time--hour');
            let minuteDrop = document.getElementsByClassName('geotabpicker__time--minute');
            let pickerField = document.getElementById(_self.options.id);
            let timeField = document.getElementsByClassName('geotab__time_cont_text');

            let hour = timeHourFormat(date.getHours());
            let hourArr = hour.hourText.split(' ');
            let hourInput = hourArr[0] === '00' ? '12' : hourArr[0];
            let newDate = format(_self, date.getDate(), date.getMonth() + 1, date.getFullYear());

            monthSelect[0].value = date.getMonth();
            yearSelect[0].value = date.getFullYear();
            hourDrop[0].value = hour.hourValue;
            minuteDrop[0].value = timeMinuteFormat(date.getMinutes()).minuteValue;
            timeField[0].innerText = hourInput + ':' + minuteDrop[0].value + ' ' + hourArr[1].toLowerCase();
            
            _self.selectedDate = newDate;
            _self.selectedDay = parseInt(date.getDate());
            _self.selectedMonth = parseInt(date.getMonth() + 1);
            _self.selectedYear = parseInt(date.getFullYear());
            _self.options.date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hourDrop[0].value, minuteDrop[0].value, 0, 0);
            pickerField.value = newDate + ' ' + hourInput + ':' + minuteDrop[0].value + ' ' + hourArr[1].toLowerCase();

            _self.updateCalendar(date.getMonth(), date.getFullYear());
        };

        _self.buildTemplate = function() {
            let pickerDiv = document.createElement('div');
            pickerDiv.id = 'geotabpicker-' + _id;
            document.body.appendChild(pickerDiv);
            let pickerField = document.getElementById(_id);
            console.log(_self);
            let tempDate = _self.options.date;
            _self.selectedDay = tempDate.getDate();
            _self.selectedMonth = tempDate.getMonth() + 1;
            _self.selectedYear = tempDate.getFullYear();
            _self.selectedDate = format(_self, tempDate.getDate(), tempDate.getMonth() + 1, tempDate.getFullYear());
            pickerField.value = _self.selectedDate + ' ' + '12:00 am';
            addListeners(_self);
        };

        _self.destroy = function() {
            let pickerDiv = document.getElementById('geotabpicker-' + _id);
            if (pickerDiv) {
              document.body.removeChild(pickerDiv);
            }
        };
      
        let keyDownListener = function() {
            _self.monthChange = false;
            _self.hidePicker();
          }

        _self.buildTemplate();
    }

    // date formatter
    let format = function(instance, day, month, year) {
        day = day < 10 ? '0' + day : day;
        month = month < 10 ? '0' + month : month;
        switch (instance.options.dateFormat) {
            case 'dd-MM-yyyy':
                return day + '-' + month + '-' + year;
            case 'dd-MMM-yyyy':
                return day + '-' + getShortMonth(parseInt(month)) + '-' + year;
            case 'dd.MM.yyyy':
                return day + '.' + month + '.' + year;
            case 'dd.MMM.yyyy':
                return day + '.' + getShortMonth(parseInt(month)) + '.' + year;
            case 'dd/MM/yyyy':
                return day + '/' + month + '/' + year;
            case 'dd/MMM/yyyy':
                return day + '/' + getShortMonth(parseInt(month)) + '/' + year;
            case 'MM-dd-yyyy':
                return month + '-' + day + '-' + year;
            case 'MM.dd.yyyy':
                return month + '.' + day + '.' + year;
            case 'MM/dd/yyyy':
                return month + '/' + day + '/' + year;
            case 'yyyy-MM-dd':
                return year + '-' + month + '-' + day;
            case 'yyyy-MMM-dd':
                return year + '-' + getShortMonth(parseInt(month)) + '-' + day;
            case 'yyyy.MM.dd':
                return year + '.' + month + '.' + day;
            case 'yyyy.MMM.dd':
                return year + '.' + getShortMonth(parseInt(month)) + '.' + day;
            case 'yyyy/MM/dd':
                return year + '/' + month + '/' + day;
            case 'yyyy/MMM/dd':
                return year + '/' + getShortMonth(parseInt(month)) + '/' + day;
            default:
                return day + '-' + getShortMonth(parseInt(month)) + '-' + year;
        }
    }

    // date parser
    let parseDate = function(instance, value) {
        let date;
        let dateArray;
        switch (instance.options.dateFormat) {
            case 'dd-MM-yyyy':
                dateArray = value.split('-');
                date = new Date(parseInt(dateArray[2]), parseInt(dateArray[1]) - 1, parseInt(dateArray[0]));
                return date;
            case 'dd-MMM-yyyy':
                dateArray = value.split('-');
                date = new Date(parseInt(dateArray[2]), getMonthNumber(dateArray[1]), parseInt(dateArray[0]));
                return date;
            case 'dd.MM.yyyy':
                dateArray = value.split('.');
                date = new Date(parseInt(dateArray[2]), parseInt(dateArray[1]) - 1, parseInt(dateArray[0]));
                return date;
            case 'dd.MMM.yyyy':
                dateArray = value.split('.');
                date = new Date(parseInt(dateArray[2]), getMonthNumber(dateArray[1]), parseInt(dateArray[0]));
                return date;
            case 'dd/MM/yyyy':
                dateArray = value.split('/');
                date = new Date(parseInt(dateArray[2]), parseInt(dateArray[1]) - 1, parseInt(dateArray[0]));
                return date;
            case 'dd/MMM/yyyy':
                dateArray = value.split('/');
                date = new Date(parseInt(dateArray[2]), getMonthNumber(dateArray[1]), parseInt(dateArray[0]));
                return date;
            case 'MM-dd-yyyy':
                dateArray = value.split('-');
                date = new Date(parseInt(dateArray[2]), parseInt(dateArray[0]) - 1, parseInt(dateArray[1]));
                return date;
            case 'MM.dd.yyyy':
                dateArray = value.split('.');
                date = new Date(parseInt(dateArray[2]), parseInt(dateArray[0]) - 1, parseInt(dateArray[1]));
                return date;
            case 'MM/dd/yyyy':
                dateArray = value.split('/');
                date = new Date(parseInt(dateArray[2]), parseInt(dateArray[0]) - 1, parseInt(dateArray[1]));
                return date;
            case 'yyyy-MM-dd':
                dateArray = value.split('-');
                date = new Date(parseInt(dateArray[0]), parseInt(dateArray[1]) - 1, parseInt(dateArray[2]));
                return date;
            case 'yyyy-MMM-dd':
                dateArray = value.split('-');
                date = new Date(parseInt(dateArray[0]), getMonthNumber(dateArray[1]), parseInt(dateArray[2]));
                return date;
            case 'yyyy.MM.dd':
                dateArray = value.split('.');
                date = new Date(parseInt(dateArray[0]), parseInt(dateArray[1]) - 1, parseInt(dateArray[2]));
                return date;
            case 'yyyy.MMM.dd':
                dateArray = value.split('.');
                date = new Date(parseInt(dateArray[0]), getMonthNumber(dateArray[1]), parseInt(dateArray[2]));
                return date;
            case 'yyyy/MM/dd':
                dateArray = value.split('/');
                date = new Date(parseInt(dateArray[0]), parseInt(dateArray[1]) - 1, parseInt(dateArray[2]));
                return date;
            case 'yyyy/MMM/dd':
                dateArray = value.split('/');
                date = new Date(parseInt(dateArray[0]), getMonthNumber(dateArray[1]), parseInt(dateArray[2]));
                return date;
            default:
                dateArray = value.split('-');
                date = new Date(parseInt(dateArray[2]), getMonthNumber(dateArray[1]), parseInt(dateArray[0]));
                return date;
        }
    }

    // helper function to return the strings for the hour dropdown
    let timeHourFormat = function(hour) {
        let hourText;
        let hourValue;
        if (hour.toString().length < 2) {
            hourText = hour === 0 ? '00 AM (12 AM)' : '0' + hour.toString() + ' AM';
            hourValue = '0' + hour.toString();
        } else if (hour < 12) {
            hourText = hour.toString() + ' AM';
            hourValue = hour.toString();
        } else if (hour >= 12) {
            hourText = hour - 12 === 0 ? '12 PM' : (hour - 12).toString() + ' PM';
            hourValue = hour.toString();
        }
        return {
            hourText: hourText,
            hourValue: hourValue
        }
    }

    // helper function to return strings for the minute dropdown
    let timeMinuteFormat = function(minute) {
        let minuteValue;
        let minuteText;
        if (minute.toString().length < 2) {
            minuteText = '0' + minute.toString();
            minuteValue = '0' + minute.toString();
        } else {
            minuteText = minute.toString();
            minuteValue = minute.toString();
        }
        return {
            minuteText: minuteText,
            minuteValue: minuteValue
        }
    }

    // adjust datepicker with any additional options
    let extend = function(defaults, options) {
        for (let property in options) {
            defaults[property] = options[property];
        }
        return defaults;
    }

    let Calendar = {
        // Get current date
        date: new Date(),

        // Get day of the week
        day: function() {
            return this.date.getDay();
        },

        // Get today's day
        today: function() {
            return (new Date().getDate());
        },

        // Get current month
        month: function() {
            return this.date.getMonth();
        },

        // Get current year
        year: function() {
            return this.date.getFullYear();
        },

        getCurrentYear: function() {
            return new Date().getFullYear();
        },

        rowPadding: function() {
            let startWeekDay = getWeekDay(1, this.month(), this.year());
            return [0, 1, 2, 3, 4, 5, 6][startWeekDay];
        },

        // Build calendar header
        buildHeader: function() {
            return '<div class="geotabpicker__header">' + '<div class="geotabpicker__date">' + this.buildMonths() + '&nbsp;&nbsp;' + this.buildYears() + '</div>' + '</div>';
        },

        // Build months select
        buildMonths: function() {
            let elem = '<button class="geotabpicker__arrow geotabpicker__arrow--prev"><</button>' + '<select class="geotabpicker__date--month">';
            let month = this.month();
            for (let i = 0; i < months.length; i++) {
                elem += '<option value="' + i + '"';
                if (i === month) {
                    elem += ' selected';
                }
                elem += '>' + months[i] + '</option>';
            }
            elem += '</select>';
            return elem;
        },

        // Build years select
        buildYears: function() {
            let elem = '<select class="geotabpicker__date--year">';
            let year = this.year();
            for (let i = 1990; i <= 2050; i++) {
                elem += '<option value="' + i + '"';
                if (i === year) {
                    elem += ' selected';
                }
                elem += '>' + i + '</option>';
            }
            elem += '</select>' + '<button class="geotabpicker__arrow geotabpicker__arrow--next">></button>';
            return elem;
        },

        // Build calendar body
        buildCalendar: function(date) {
            let index;
            let daysInMonth = getDaysInMonth(this.year(), this.month());
            let template = '<div class="geotabpicker__calendar"><table><tr>';
            for (index = 0; index < days.length; index++) {
                template += '<td><div class="geotabpicker__week">' + days[index] + '</div></td>';
            }
            template += '</tr><tr>';
            let columnIndex = 0;
            let dayClass = '';
            let day = 0 - this.rowPadding();
            let calMax = 42 + day;
            let calDate = new Date(date);
            let firstOfMonth = new Date(calDate.setDate(1));
            let calFirstDay = new Date(calDate.setDate(day + 1));
            for (; day < calMax; day++) {
                if (day < 0) {
                    let copy = new Date(firstOfMonth.getTime());
                    let monthData = this.month();
                    let yearData = this.year();
                    if (monthData === 0) {
                        monthData = 12;
                        yearData = yearData - 1;
                    }
                    let prevDay = new Date(copy.setDate(copy.getDate() + day));
                    template += '<td><div class="geotabpicker__day geotabpicker__outside "';
                    template += 'data-day="' + (prevDay.getDate()) + '" data-month="' + monthData;
                    template += '" data-year="' + yearData + '" ';
                    template += '>' + (prevDay.getDate()) + '</div></td>'

                    calFirstDay = addDays(calFirstDay, 1);
                } else if (day >= 0 && day < daysInMonth) {
                    // day is psuedo 0-indexed
                    template += '<td><div class="geotabpicker__day ' + dayClass + '" ';
                    template += 'data-day="' + (day + 1) + '" data-month="' + (this.month() + 1);
                    template += '" data-year="' + this.year() + '" ';
                    template += '>' + (day + 1) + '</div></td>';

                    calFirstDay = addDays(calFirstDay, 1);
                } else {
                    template += '<td><div class="geotabpicker__day geotabpicker__outside ' + dayClass + '" ';
                    template += 'data-day="' + calFirstDay.getDate() + '" data-month="' + (calFirstDay.getMonth() + 1);
                    template += '" data-year="' + calFirstDay.getFullYear() + '" ';
                    template += '>' + calFirstDay.getDate() + '</div></td>'

                    calFirstDay = addDays(calFirstDay, 1);
                }
                columnIndex++;
                if (columnIndex % 7 === 0) {
                    columnIndex = 0;
                    template += '</tr><tr>';
                }
            }
            template += '</tr></table></div>';
            return template;
        },

        buildTime: function(instance) {
            let curHour = instance.options.date.getHours();
            let curMinute = instance.options.date.getMinutes();
            let curHourObj = timeHourFormat(curHour);
            let curMinuteObj = timeMinuteFormat(curMinute);

            let template = '<div class="geotab__time">';
            template += '<div class="geotab__time__sub">';
            template += '<table class="geotab__time_cont_table">';
            template += '<tr class="geotab__time_cont_row geotab_time_row">';
            template += '<td class="geotab__time_descr">Time</td>';
            template += '<td class="geotab__time_controls"><span class="geotab__time_cont_text">' + curHourObj.hourText.split(' ')[0] + ':' + curMinuteObj.minuteValue + ' ' + curHourObj.hourText.split(' ')[1].toLowerCase() + ' </span></td></tr>';
            template += '<tr class="geotab__time_cont_row geotab_hour_row">'
            template += '<td class="geotab__time_descr">Hour</td>'
            template += '<td class="geotab__time_controls">'

            // build hour dropdown
            let hourSelect = '<select class="geotabpicker__time--hour">';
            for (let hour = 0; hour < 24; hour++) {
                let hourObj = timeHourFormat(hour);
                hourSelect += '<option value="' + hourObj.hourValue + '"';
                if (hour === curHour) {
                    hourSelect += ' selected';
                }
                hourSelect += '>' + hourObj.hourText + '</option>';
            }
            hourSelect += '</select>'
            template += hourSelect;

            template += '<tr class="geotab__time_cont_row geotab_minute_row">';
            template += '<td class="geotab__time_descr">Minute</td>'
            template += '<td class="geotab__time_controls">'

            let minuteSelect = '<select class="geotabpicker__time--minute">';
            for (let minute = 0; minute < 60; minute++) {
                let minuteObj = timeMinuteFormat(minute);
                minuteSelect += '<option value="' + minuteObj.minuteValue + '"'
                if (minute === curMinute) {
                    minuteSelect += ' selected';
                }
                minuteSelect += '>' + minuteObj.minuteText + '</option>';
            }
            minuteSelect += '</select>';
            template += minuteSelect;

            template += '</table></div>';
            template += '</div>';
            template += '<div class="geotab__button_panel">';
            template += '<button class="geotab_button geotab_button_now">Now</button>';
            template += '<button class="geotab_button geotab_button_done">Done</button>';
            template += '</div>';
            return template;
        },

        // Header click listeners
        addListeners: function(instance) {
            let id = instance.options.id;
            let pickerDiv = document.getElementById('geotabpicker-' + id);
            if (pickerDiv) {
                let prevBtn = pickerDiv.getElementsByClassName('geotabpicker__arrow--prev')[0];
                let nextBtn = pickerDiv.getElementsByClassName('geotabpicker__arrow--next')[0];
                addEvent(prevBtn, 'click', instance.changeMonth, false);
                addEvent(nextBtn, 'click', instance.changeMonth, false);
                let monthSelect = pickerDiv.getElementsByClassName('geotabpicker__date--month')[0];
                let yearSelect = pickerDiv.getElementsByClassName('geotabpicker__date--year')[0];
                let hourSelect = pickerDiv.getElementsByClassName('geotabpicker__time--hour')[0];
                let minuteSelect = pickerDiv.getElementsByClassName('geotabpicker__time--minute')[0];
                // add event listener for month change
                addEvent(monthSelect, 'change', this.handleMonthChange.bind(null, instance), false);
                // add event listener for year change
                addEvent(yearSelect, 'change', this.handleYearChange.bind(null, instance), false);
                // add event listener for hour change
                addEvent(hourSelect, 'change', this.handleTimeChange.bind(null, instance), false);
                // add event listener for minute change
                addEvent(minuteSelect, 'change', this.handleTimeChange.bind(null, instance), false);
                
            }

            this.changeInstanceDate(instance);
            this.modifyDateClass(instance);
            let el = pickerDiv.getElementsByClassName('geotabpicker__day');
            if (el && el.length) {
                for (let count = 0; count < el.length; count++) {
                    if (typeof el[count].onclick !== 'function') {
                        if (el[count].className && el[count].className.indexOf('geotabpicker__day--disabled') === -1) {
                            let elem = document.getElementById(id + '-geotabpicker__day--' + el[count].dataset.month + '-' + el[count].dataset.day);
                            addEvent(elem, 'click', instance.selectDate, false);
                        }
                    }
                }
            }
            let btns = pickerDiv.getElementsByClassName('geotab_button');
            if (btns && btns.length) {
                for (let count = 0; count < btns.length; count++) {
                    if (typeof btns[count].onclick !== 'function') {
                        if (btns[count].className && btns[count].className.indexOf('geotab_button_now') !== -1) {
                            addEvent(btns[count], 'click', instance.handleNowClick, false);
                        } else if (btns[count].className && btns[count].className.indexOf('geotab_button_done') !== -1) {
                            addEvent(btns[count], 'click', instance.handleDoneClick, false);
                        }
                    }
                }
            }
        },

        handleMonthChange: function(instance, event) {
            instance.updateCalendar(event.target.value);
        },

        handleYearChange: function(instance, event) {
            instance.updateCalendar(instance.currentMonth, event.target.value);
        },

        handleTimeChange: function(instance, event) {
            let hourDrop = document.getElementsByClassName('geotabpicker__time--hour');
            let minuteDrop = document.getElementsByClassName('geotabpicker__time--minute');

            let hour = timeHourFormat(hourDrop[0].value);
            let hourArr = hour.hourText.split(' ');
            let hourInput = hourArr[0] === '00' ? '12' : hourArr[0];

            let pickerField = document.getElementById(instance.options.id);
            let timeField = document.getElementsByClassName('geotab__time_cont_text');
            let date = instance.options.date;
            let dateString = format(instance, date.getDate(), date.getMonth() + 1, date.getFullYear());
            pickerField.value = dateString + ' ' + hourInput + ':' + minuteDrop[0].value + ' ' + hourArr[1].toLowerCase(); 
            timeField[0].innerText = hourInput + ':' + minuteDrop[0].value + ' ' + hourArr[1].toLowerCase();

            instance.options.date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hourDrop[0].value, minuteDrop[0].value, 0, 0);
            pickerField.focus();
        },

        removeListeners: function(instance) {
            let id = instance.options.id;
            let pickerDiv = document.getElementById('geotabpicker-' + id);
            if (pickerDiv) {
                let monthSelect = pickerDiv.getElementsByClassName('geotabpicker__date--month')[0];
                let yearSelect = pickerDiv.getElementsByClassName('geotabpicker__date--year')[0];
                monthSelect.removeEventListener('change', this.handleMonthChange, false);
                yearSelect.removeEventListener('change', this.handleYearChange, false);
            }
        },

        modifyDateClass: function(instance) {
            let id = instance.options.id;
            let day = instance.selectedDay;
            let disabled;
            let date = new Date();
            let month = date.getMonth();
            let year = date.getFullYear();
            let dayClass;
            let pickerDiv = document.getElementById('geotabpicker-' + id);

            if (pickerDiv) {
                let el = pickerDiv.getElementsByClassName('geotabpicker__day');
                if (el && el.length) {
                    for (let count = 0; count < el.length; count++) {

                        disabled = '';

                        // marking today should check 
                        // if the current instance month is the same month as the month of the current date
                        // if the current day is one of the days in the calendar in the instance (not including the prev and next months)
                        // if the current month is the same as the instance month 
                        // if the current year is the same year as the instance year

                        // as we iterate check to see if the current day in the loop is the selected day by checking the selected day, month and year based on the instance
                        if (parseInt(el[count].dataset.day) === day && parseInt(el[count].dataset.month) === instance.selectedMonth && parseInt(el[count].dataset.year) === instance.selectedYear)  {
                            el[count].className += ' geotabpicker__day--selected' + ' ' + disabled;
                        } else {
                            if (parseInt(el[count].dataset.day) === this.today() && month === this.month() && year === this.year()) {
                                dayClass = ' geotabpicker__day--today';
                            } else {
                                dayClass = '';
                            }
                            el[count].className += dayClass + ' ' + disabled;
                        }
                        
                        // check to see if the current item is the current day
                        if (parseInt(el[count].dataset.day) === date.getDate() && parseInt(el[count].dataset.month) === month + 1 && parseInt(el[count].dataset.year) === year) {
                            el[count].classList.add('geotabpicker__day--today');
                        }
                        el[count].id = id + '-geotabpicker__day--' + el[count].dataset.month + '-' + el[count].dataset.day;
                    }
                }
            }
        },
        // Change date in instance
        changeInstanceDate: function(instance) {
            instance.currentDay = this.day();
            instance.currentDate = this.today();
            instance.currentMonth = this.month();
            instance.currentYear = this.year();
        }
    };

    let addListeners = function(picker) {
        let el = document.getElementById(picker.options.id);
        if (el) {
          addEvent(el, 'click', picker.showPicker, false);
        }
    }
    
    let getMonths = function(month) {
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
          'August', 'September', 'October', 'November', 'December'];
        return month >= 0 ? months[month] : months;
    }
    
    let getShortMonth = function(month) {
        return months[parseInt(month) - 1];
    }
    
    //
    let getMonthNumber = function(month) {
        let formatted = month.charAt(0).toUpperCase() + month.substr(1, month.length - 1).toLowerCase();
        return months.indexOf(formatted);
    }

    // find number of days in each month of specified year
    let getDaysInMonth =  function(year, month) {
        return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    }

    // retrieve day of the week from current date
    let getWeekDay = function(date, month, year) {
        return new Date(year, month, date).getDay();
    }

    // check if this is a leap year
    let isLeapYear = function(year) {
        return year % 100 === 0 ? year % 400 === 0 ? true : false : year % 4 === 0;
    }

    // check if the dom already has the picker added
    let hasPicker = function(el) {
        return el && el.querySelector('.geotabpicker') ? true : false;
    }

    // grab sunday of the current week as a reference point when building the calendar
    let getSunday = function(d) {
        d = new Date(d);

        let day = d.getDay();
        let diff = d.getDate() - day;

        return new Date(d.setDate(diff));
    }

    let addDays = function(date, days) {
        return new Date(date.setDate(date.getDate() + days));
    }

    let addEvent = function(el, type, callback, capture) {
        if (hasEventListener) {
            if (el) {
                el.addEventListener(type, callback, capture);
            }
        } else {
            if (el) {
                el.attachEvent('on' + type, callback);
            }
        }
    }

    let removeEvent = function(el, type, callback, capture) {
        if (hasEventListener) {
            if (el) {
                el.removeEventListener(type, callback, capture);
            }
        } else {
            if (el) {
                el.detachEvent('on' + type, callback);
            }
        }
    }

    return GeotabPicker;
})();


module.exports = GeotabPicker;
import {Injectable} from '@angular/core';
import {isDate} from 'util';
import {ActivatedRoute} from '@angular/router';

@Injectable()
export  class DateService {
    constructor() {
    }

    public getDayMonth(date) {
        if (date) {
            date = new Date(date);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            return this.getTwoNumber(day) + this.getTwoNumber(month) + date.getFullYear();
        }else {
            return '';
        }
    }

    public getTwoNumber(number) {
        if (number < 10) {
            number = '0' + number;
        }
        return number;
    }

    public convertDate(inputFormat) {
        function pad(s) {
            return (s < 10) ? '0' + s : s;
        }
        if (inputFormat) {
            const d = new Date(inputFormat);
            return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('/');
        }else{
            return null;
        }
    }

    public  addDaysToDate(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    public getDaysInMonth(year, month) {
       return (new Date(year, month + 1 , 0)).getDate();
    }

    public isBetween(from, to, d) {
        return  (this.isSmallerOrEqual(from,d) && this.isSmallerOrEqual(d,to))
    }

    public isBetweenNotEqual(from,to,d){
        return  (this.isSmaller(from,d) && this.isSmaller(d,to))
    }

    public  getTimeDiffInHour(from, to){
        const time1 = from.split(':');
        const time2 = to.split(':');
        let result = 0;
        if (time1.length > 1 && time2.length > 1){
            if (parseInt(time2[0],10) >= parseInt(time1[0],10)){
                result = parseInt(time2[0],10) - parseInt(time1[0],10);
                if (parseInt(time2[1],10) > parseInt(time1[1],10)){
                    result++;
                }
            }
        }
        console.log(result);
        return result;
    }

    public getTimeDiffInHourBetweenTwoDate(from_date,from_time,to_date,to_time){
        const time1 = from_time.split(':');
        const time2 = to_time.split(':');
        const from = this.getDateFromString(from_date);
        from.setHours(time1[0]);
        from.setMinutes(time1[1]);
        const to = this.getDateFromString(to_date);
        to.setHours(time2[0]);
        to.setMinutes(time2[1]);
        return Math.floor(Math.abs(to - from) / 36e5);
    }

    populateDateString(date){
        if (date){
            date = this.getDateFromString(date);
        }
        return date;
    }

    public  getTimeDiffInMinute(from, to){
        const time1 = from.split(':');
        const time2 = to.split(':');
        let result = 0;
        if (time1.length > 1 && time2.length > 1){
            result = (time2[0] - time1[0]) * 60 + time2[1] - time1[1];
        }
        return result;
    }


    public  isSmallerOrEqual(from,to){
        if (from.getFullYear() > to.getFullYear()) {
            return false;
        }
        if (from.getFullYear() === to.getFullYear()) {
            if (from.getMonth() > to.getMonth()) {
                return false;
            } else if (from.getMonth() === to.getMonth()) {
                if (from.getDate() > to.getDate()) {
                    return false;
                }
            }
        }
        return true;
    }

    public now(){
        const now = new Date();
        const nowUTC = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
        const nowHotel = new Date(nowUTC.getTime() + parseFloat(JSON.parse(localStorage.getItem('accessToken')).time_zone_offset)*3600000);
        return nowHotel;
    }

    public convertUTCDateToLocalDate(dateString) {
        return new Date(dateString + ' UTC');
    }

    public  isEqual(from, to) {
        return from.getFullYear() === to.getFullYear() && from.getMonth() === to.getMonth() && from.getDate()=== to.getDate();
    }

    public  getDateFromString(strDate) {
        if (isDate(strDate)) {
            return strDate;
        }

        //format yyyy-mm-dd 2017-09-20
        const dateParts = strDate.split('-');
        const result = new Date(dateParts[0], (dateParts[1] - 1), dateParts[2]);
        return result;
    }

    public  isSmaller(from, to) {
        if (from.getFullYear() > to.getFullYear()) {
            return false;
        }
        if (from.getFullYear() === to.getFullYear()){
            if (from.getMonth() > to.getMonth()) {
                return false;
            } else if (from.getMonth() === to.getMonth() ){
                if (from.getDate() >= to.getDate()) {
                    return false;
                }
            }
        }
        return true;
    }

    public  getTimeString(date){
        let hour = date.getHours();
        let minute = date.getMinutes();
        hour = hour >= 10 ? hour : '0' + hour;
        minute = minute >=10 ? minute: '0' + minute;
        return hour + ':' + minute;
    }

    public getDatesDiffInDays(from, to) {
        const _MS_PER_DAY = 1000 * 60 * 60 * 24;
        // Discard the time and time-zone information.
        const utc1 = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
        const utc2 = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
        if (utc2 < utc1) {
            return 0;
        } else {
            return Math.floor((utc2 - utc1) / _MS_PER_DAY);
        }
    }

    public  getDateString(date) {
        let result = '';
        date = this.getDateFromString(date);
        let resultMonth = date.getMonth() + 1>9?date.getMonth() + 1:'0'+(date.getMonth() + 1);
        let resultDate = date.getDate()>9?date.getDate():'0'+date.getDate();
        result = date.getFullYear() + '-' + resultMonth + '-' + resultDate;
        return result;
    }

    public  getDayAndMonthString(date) {
        let result = '';
        date = this.getDateFromString(date);
        result = date.getDate() + '-' + (date.getMonth() + 1);
        return result;
    }

    public getDayName(dateString) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const d = new Date(dateString);
        return days[d.getDay()];
    }
}

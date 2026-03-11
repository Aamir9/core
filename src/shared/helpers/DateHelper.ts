import * as moment from 'moment';

export class DateHelper {
    static getDate(dateString: string): Date {
        if (dateString) {
            return new Date(dateString);
        }
        return null;
    }
    static toLocalDate(isoDateString: Date): Date {
        var _isoDateString = isoDateString;


        if (_isoDateString.toString().indexOf('Z') == -1)
            return new Date(_isoDateString + 'Z');



        return new Date(_isoDateString);
    }

    public static convertDateTimeToString(value: any, format: string) {
        let dateTimeString: string;
        let dateTime = new Date(value);
        let isDateValid = (new Date(dateTime)).getTime();
        if (isDateValid) {
          let year: any = dateTime.getFullYear();
          let month: any = dateTime.getMonth() + 1;
          month = (month < 10) ? '0' + month : month;
          let date: any = dateTime.getDate();
          date = (date < 10) ? '0' + date : date;
          let hours: any = dateTime.getHours();
          hours = (hours < 10) ? '0' + hours : hours;
          let minutes: any = dateTime.getMinutes();
          minutes = (minutes < 10) ? '0' + minutes : minutes;
          let secondes: any = dateTime.getSeconds();
          secondes = (secondes < 10) ? '0' + secondes : secondes;
    
          if (format == 'yyyy-MM-dd HH:mm:ss')
            dateTimeString = `${year}-${month}-${date} ${hours}:${minutes}:${secondes}`;
          else if (format == 'yyyy/MM/dd HH:mm:ss')
            dateTimeString = `${year}/${month}/${date} ${hours}:${minutes}:${secondes}`;
          else if (format == 'dd/MM/yyyy HH:mm:ss')
            dateTimeString = `${date}/${month}/${year} ${hours}:${minutes}:${secondes}`;
          else if (format == 'yyyy/MM/dd HH:mm')
            dateTimeString = `${year}/${month}/${date} ${hours}:${minutes}`;
          else if (format == 'dd/MM/yyyy HH:mm')
            dateTimeString = `${date}/${month}/${year} ${hours}:${minutes}`;
          else if (format == 'yyyy-MM-dd')
            dateTimeString = `${year}-${month}-${date}`;
          else if (format == 'dd/MM/yyyy')
            dateTimeString = `${date}/${month}/${year}`;
          else if (format == 'HH:mm:ss')
            dateTimeString = `${hours}:${minutes}:${secondes}`;
          else if (format == 'HH:mm')
            dateTimeString = `${hours}:${minutes}`;
          else
            dateTimeString = `${date}/${month}/${year} ${hours}:${minutes}`;
        }
        return dateTimeString;
      }
    public static convertStringToDate(value:string){
        let dateTime = new Date(value);
        return dateTime;
    }
  
}    
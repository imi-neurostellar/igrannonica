import { Injectable } from "@angular/core";
@Injectable({ providedIn: 'root' })
export class CsvParseService {

  csvToArray(strData: string, strDelimiter: string): string[][] {
    strDelimiter = (strDelimiter || ",");

    let objPattern = new RegExp(
      (
        // Delimiters.
        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

        // Quoted fields.
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

        // Standard fields.
        "([^\"\\" + strDelimiter + "\\r\\n]*))"
      ),
      "gi"
    );

    let arrData: string[][] = [[]];

    let arrMatches = null;

    while (arrMatches = objPattern.exec(strData)) {

      let strMatchedDelimiter = arrMatches[1];

      if (
        strMatchedDelimiter.length &&
        strMatchedDelimiter !== strDelimiter
      ) {
        arrData.push([]);
      }

      let strMatchedValue;

      if (arrMatches[2]) {
        strMatchedValue = arrMatches[2].replace(
          new RegExp("\"\"", "g"),
          "\""
        );
      } else {
        strMatchedValue = arrMatches[3];
      }

      arrData[arrData.length - 1].push(strMatchedValue);
    }

    return (arrData);
  }
}
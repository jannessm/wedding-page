import { Injectable } from '@angular/core';
import { AGE_CATEGORY_LABELS, DIET_LABELS, User } from 'src/models/user';

import * as ExcelJS from 'exceljs';
import { GuestTable } from 'src/models/guest-table';
import { ALLERGIES, ALLERGIES_LABELS } from 'src/models/allergies';

interface Column {
  header: string;
  key: string;
  width: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  async createGuestFile(guests: GuestTable[]): Promise<ExcelJS.Buffer> {
    const columns: Column[] = [
      { header: 'Vorname', key: 'name', width: 20 },
      { header: 'Nachname', key: 'lastname', width: 20 },
      { header: 'Alter', key: 'age', width: 20 },
      { header: 'Essen', key: 'diet', width: 20 },
      { header: 'Allergien', key: 'allergies', width: 20 },
      { header: 'Zu/Absage', key: 'isComing', width: 20 }
    ];
    
    const workbook = this.setupWorkbook();

    const sheet = this.createWorksheet(workbook, "Benutzerliste", columns);

    guests.forEach(g => {
      let allergies = g.allergies.map((a: ALLERGIES) => ALLERGIES_LABELS[a]).join(', ');
      if (!!allergies) {
        allergies += ', '
      }
      allergies += g.otherAllergies;
      
      sheet.addRow({
        'name': g.name, 
        'lastname': g.lastname,
        'age': AGE_CATEGORY_LABELS[g.age],
        'diet': DIET_LABELS[g.diet],
        'allergies':  allergies,
        'isComing': g.isComing
      });
    });


    return await workbook.xlsx.writeBuffer();
  }

  async createUserFile(user: User[]): Promise<ExcelJS.Buffer> {
    const columns: Column[] = [
      { header: 'Benutzername', key: 'user', width: 20 },
      { header: 'Gäste', key: 'guests', width: 60 },
      { header: 'Passwort', key: 'password', width: 20 }
    ];
    
    const workbook = this.setupWorkbook();

    const sheet = this.createWorksheet(workbook, "Benutzerliste", columns);

    user.forEach(u => {
      sheet.addRow({
        'user': u.name, 
        'guests': u.guests,
        'password': u.firstPassword
      });
    });


    return await workbook.xlsx.writeBuffer();
  }

  setupWorkbook(): ExcelJS.Workbook {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Wedding Page - J. Magnusson';

    return workbook;
  }

  createWorksheet(workbook: ExcelJS.Workbook, title: string, columns: Column[]): ExcelJS.Worksheet {
    const sheet = workbook.addWorksheet('Benutzer', {
      headerFooter:{firstHeader: title, firstFooter: "Wedding Page - J. Magnusson"}
    });

    sheet.columns = columns;

    return sheet;
  }
}

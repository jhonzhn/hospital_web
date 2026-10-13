/**
 * Script para registrar solicitudes de cita del portal.
 * Este archivo se pega en Extensiones > Apps Script de la hoja de Google.
 */
const SHEET_NAME = 'Citas';

function setupSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Fecha de registro',
      'Código de solicitud',
      'Paciente',
      'DNI',
      'Especialidad',
      'Profesional',
      'Fecha solicitada',
      'Hora solicitada',
      'Estado'
    ]);
    sheet.getRange(1, 1, 1, 9).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

function doPost(event) {
  try {
    const data = JSON.parse(event.postData.contents || '{}');
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      setupSheet();
      sheet = spreadsheet.getSheetByName(SHEET_NAME);
    }

    const action = String(data.action || 'crear');
    const appointmentCode = String(data.codigo || '');

    // El código aleatorio de la reserva funciona como comprobante de que
    // quien actualiza la cita es quien la creó desde el portal.
    if (action === 'cancelar' || action === 'reprogramar') {
      if (!appointmentCode) throw new Error('Falta el código de la cita.');
      const codes = sheet.getRange(2, 2, Math.max(sheet.getLastRow() - 1, 1), 1).getValues();
      const index = codes.findIndex(row => String(row[0]) === appointmentCode);
      if (index === -1) throw new Error('No se encontró la cita.');
      const rowNumber = index + 2;

      if (action === 'cancelar') {
        sheet.getRange(rowNumber, 9).setValue('Cancelada');
      } else {
        sheet.getRange(rowNumber, 5, 1, 5).setValues([[
          String(data.especialidad || ''),
          String(data.profesional || ''),
          String(data.fecha || ''),
          String(data.hora || ''),
          'Reprogramada'
        ]]);
      }

      return ContentService
        .createTextOutput(JSON.stringify({ ok: true, action: action }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    sheet.appendRow([
      new Date(),
      String(data.codigo || ''),
      String(data.paciente || ''),
      String(data.dni || ''),
      String(data.especialidad || ''),
      String(data.profesional || ''),
      String(data.fecha || ''),
      String(data.hora || ''),
      String(data.estado || 'Solicitud registrada')
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

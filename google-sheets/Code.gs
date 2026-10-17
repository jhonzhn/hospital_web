/**
 * Script para registrar solicitudes de cita del portal.
 * Este archivo se pega en Extensiones > Apps Script de la hoja de Google.
 */
const SHEET_NAME = 'Citas';
const SURVEY_SHEET_NAME = 'Encuestas';

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

  setupSurveySheet();
}

function setupSurveySheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SURVEY_SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SURVEY_SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Fecha de respuesta',
      'Código de respuesta',
      'Calificación',
      'Atención recibida',
      'Información clara',
      'Comentario'
    ]);
    sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
    sheet.setFrozenRows(1);
  } else {
    sheet.getRange(1, 2).setValue('Código de respuesta');
  }
}

function findAppointmentRow(sheet, appointmentCode) {
  if (!appointmentCode || sheet.getLastRow() < 2) return -1;
  const codes = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues();
  const index = codes.findIndex(row => String(row[0]) === String(appointmentCode));
  return index === -1 ? -1 : index + 2;
}

function hasSurvey(surveySheet, appointmentCode) {
  if (surveySheet.getLastRow() < 2) return false;
  const codes = surveySheet.getRange(2, 2, surveySheet.getLastRow() - 1, 1).getValues();
  return codes.some(row => String(row[0]) === String(appointmentCode));
}

function jsonOutput(payload, callback) {
  const json = JSON.stringify(payload);
  const safeCallback = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(String(callback || '')) ? callback : '';
  return ContentService
    .createTextOutput(safeCallback ? `${safeCallback}(${json});` : json)
    .setMimeType(safeCallback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
}

function doGet(event) {
  try {
    const data = event.parameter || {};
    setupSheet();
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    if (data.action === 'estado_opinion') {
      const surveySheet = spreadsheet.getSheetByName(SURVEY_SHEET_NAME);
      return jsonOutput({ ok: true, registrada: hasSurvey(surveySheet, data.codigo) }, data.callback);
    }

    if (data.action !== 'estado_encuesta') return jsonOutput({ ok: false, error: 'Acción no válida.' }, data.callback);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    const surveySheet = spreadsheet.getSheetByName(SURVEY_SHEET_NAME);
    const rowNumber = findAppointmentRow(sheet, data.codigo);
    if (rowNumber === -1) return jsonOutput({ ok: false, error: 'No se encontró la cita.' }, data.callback);

    return jsonOutput({
      ok: true,
      estado: String(sheet.getRange(rowNumber, 9).getValue()),
      respondida: hasSurvey(surveySheet, data.codigo)
    }, data.callback);
  } catch (error) {
    return jsonOutput({ ok: false, error: error.message }, event.parameter && event.parameter.callback);
  }
}

function doPost(event) {
  try {
    const data = JSON.parse(event.postData.contents || '{}');
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    setupSheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);

    const action = String(data.action || 'crear');
    const appointmentCode = String(data.codigo || '');
    const surveySheet = spreadsheet.getSheetByName(SURVEY_SHEET_NAME);

    if (action === 'encuesta') {
      if (!appointmentCode) throw new Error('Falta el código de respuesta.');
      if (hasSurvey(surveySheet, appointmentCode)) throw new Error('Esta opinión ya fue registrada.');

      surveySheet.appendRow([
        new Date(),
        appointmentCode,
        Number(data.calificacion || 0),
        String(data.atencion || ''),
        String(data.informacion || ''),
        String(data.comentario || '')
      ]);

      return ContentService
        .createTextOutput(JSON.stringify({ ok: true, action: action }))
        .setMimeType(ContentService.MimeType.JSON);
    }

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

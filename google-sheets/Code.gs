/**
 * Script para registrar solicitudes de cita del portal.
 * Este archivo se pega en Extensiones > Apps Script de la hoja de Google.
 */
const SHEET_NAME = 'Citas';
const SURVEY_SHEET_NAME = 'Encuestas';
const TURN_SHEET_NAME = 'Turnos';

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
  setupTurnSheet();
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

function setupTurnSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(TURN_SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(TURN_SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Fecha de registro',
      'Código de cita',
      'Código de turno',
      'Especialidad',
      'Fecha de atención',
      'Hora de cita',
      'Estado del turno',
      'Consultorio'
    ]);
    sheet.getRange(1, 1, 1, 8).setFontWeight('bold');
    sheet.setFrozenRows(1);
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

function findTurnRow(turnSheet, appointmentCode) {
  if (!appointmentCode || turnSheet.getLastRow() < 2) return -1;
  const codes = turnSheet.getRange(2, 2, turnSheet.getLastRow() - 1, 1).getValues();
  const index = codes.findIndex(row => String(row[0]) === String(appointmentCode));
  return index === -1 ? -1 : index + 2;
}

function turnPrefix(specialty) {
  const prefixes = {
    'Medicina General': 'MG',
    'Cardiología': 'CAR',
    'Odontología': 'OD',
    'Pediatría': 'PED',
    'Psicología': 'PSI',
    'Nutrición': 'NUT'
  };
  return prefixes[String(specialty || '')] || 'TUR';
}

function nextTurnCode(turnSheet, specialty, appointmentDate) {
  const prefix = turnPrefix(specialty);
  if (turnSheet.getLastRow() < 2) return `${prefix}-001`;
  const rows = turnSheet.getRange(2, 3, turnSheet.getLastRow() - 1, 3).getValues();
  let max = 0;
  rows.forEach(row => {
    const code = String(row[0]);
    const rowSpecialty = String(row[1]);
    const rowDate = String(row[2]);
    if (rowSpecialty === String(specialty) && rowDate === String(appointmentDate) && code.startsWith(`${prefix}-`)) {
      max = Math.max(max, Number(code.split('-')[1]) || 0);
    }
  });
  return `${prefix}-${String(max + 1).padStart(3, '0')}`;
}

function getTurn(turnSheet, appointmentCode) {
  const row = findTurnRow(turnSheet, appointmentCode);
  if (row === -1) return null;
  const values = turnSheet.getRange(row, 1, 1, 8).getValues()[0];
  return { codigo: String(values[2]), especialidad: String(values[3]), fecha: String(values[4]), hora: String(values[5]), estado: String(values[6]), consultorio: String(values[7] || 'Por confirmar') };
}

function publicTurn(values) {
  return { codigo: String(values[2]), especialidad: String(values[3]), hora: String(values[5]), consultorio: String(values[7] || 'Por confirmar') };
}

function appointmentMinutes(value) {
  const match = String(value || '').match(/(\d{1,2}):(\d{2})\s*([ap])\.\s*m\./i);
  if (!match) return 9999;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3].toLowerCase();
  if (period === 'p' && hour !== 12) hour += 12;
  if (period === 'a' && hour === 12) hour = 0;
  return hour * 60 + minute;
}

function validDni(value) {
  return /^\d{8}$/.test(String(value || '').trim());
}

function validAppointmentDate(value) {
  return /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(String(value || '').trim());
}

function validateAppointment(data) {
  if (!String(data.codigo || '').trim()) throw new Error('Falta el código de la cita.');
  if (!validDni(data.dni)) throw new Error('El DNI debe tener 8 dígitos.');
  if (!String(data.especialidad || '').trim()) throw new Error('Selecciona una especialidad.');
  if (!String(data.profesional || '').trim()) throw new Error('Selecciona un profesional.');
  if (!validAppointmentDate(data.fecha)) throw new Error('La fecha de la cita no es válida.');
  if (!String(data.hora || '').trim()) throw new Error('Selecciona un horario.');
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

    if (data.action === 'pantalla_turnos') {
      const turnSheet = spreadsheet.getSheetByName(TURN_SHEET_NAME);
      const requestedDate = String(data.fecha || '');
      const rows = turnSheet.getLastRow() < 2 ? [] : turnSheet.getRange(2, 1, turnSheet.getLastRow() - 1, 8).getValues();
      const activeTurns = rows.filter(row => String(row[4]) === requestedDate && !['Atendido', 'Cancelada'].includes(String(row[6])));
      const current = activeTurns.find(row => String(row[6]) === 'Llamando');
      const next = activeTurns.filter(row => String(row[6]) === 'En espera').sort((a, b) => appointmentMinutes(a[5]) - appointmentMinutes(b[5]))[0];
      return jsonOutput({ ok: true, actual: current ? publicTurn(current) : null, siguiente: next ? publicTurn(next) : null }, data.callback);
    }

    if (data.action !== 'estado_encuesta') return jsonOutput({ ok: false, error: 'Acción no válida.' }, data.callback);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    const surveySheet = spreadsheet.getSheetByName(SURVEY_SHEET_NAME);
    const turnSheet = spreadsheet.getSheetByName(TURN_SHEET_NAME);
    const rowNumber = findAppointmentRow(sheet, data.codigo);
    if (rowNumber === -1) return jsonOutput({ ok: false, error: 'No se encontró la cita.' }, data.callback);

    return jsonOutput({
      ok: true,
      estado: String(sheet.getRange(rowNumber, 9).getValue()),
      respondida: hasSurvey(surveySheet, data.codigo),
      turno: getTurn(turnSheet, data.codigo)
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
    const turnSheet = spreadsheet.getSheetByName(TURN_SHEET_NAME);

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
        const turnRow = findTurnRow(turnSheet, appointmentCode);
        if (turnRow !== -1) turnSheet.getRange(turnRow, 7).setValue('Cancelada');
      } else {
        sheet.getRange(rowNumber, 5, 1, 5).setValues([[
          String(data.especialidad || ''),
          String(data.profesional || ''),
          String(data.fecha || ''),
          String(data.hora || ''),
          'Reprogramada'
        ]]);
        const turnRow = findTurnRow(turnSheet, appointmentCode);
        if (turnRow !== -1) {
          const newTurnCode = nextTurnCode(turnSheet, data.especialidad, data.fecha);
          turnSheet.getRange(turnRow, 3, 1, 5).setValues([[
            newTurnCode,
            String(data.especialidad || ''),
            String(data.fecha || ''),
            String(data.hora || ''),
            'En espera'
          ]]);
        }
      }

      return ContentService
        .createTextOutput(JSON.stringify({ ok: true, action: action }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    validateAppointment(data);
    const existingRow = findAppointmentRow(sheet, appointmentCode);
    // Si se reintenta una reserva por una conexión lenta, no se duplica la fila.
    if (existingRow !== -1) {
      if (findTurnRow(turnSheet, appointmentCode) === -1) {
        turnSheet.appendRow([
          new Date(), appointmentCode, nextTurnCode(turnSheet, data.especialidad, data.fecha),
          String(data.especialidad || ''), String(data.fecha || ''), String(data.hora || ''),
          'En espera', 'Por confirmar'
        ]);
      }
      return ContentService
        .createTextOutput(JSON.stringify({ ok: true, action: 'crear', alreadyRegistered: true }))
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

    const turnCode = nextTurnCode(turnSheet, data.especialidad, data.fecha);
    turnSheet.appendRow([
      new Date(),
      appointmentCode,
      turnCode,
      String(data.especialidad || ''),
      String(data.fecha || ''),
      String(data.hora || ''),
      'En espera',
      'Por confirmar'
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

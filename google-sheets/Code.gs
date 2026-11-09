/**
 * Script para registrar solicitudes de cita del portal.
 * Este archivo se pega en Extensiones > Apps Script de la hoja de Google.
 */
const SHEET_NAME = 'Citas';
const SURVEY_SHEET_NAME = 'Encuestas';
const TURN_SHEET_NAME = 'Turnos';
const PATIENT_SHEET_NAME = 'Pacientes';
const EMERGENCY_SHEET_NAME = 'Emergencias';
const ADMIN_PASSWORD_PROPERTY = 'SJD_ADMIN_PASSWORD';
const ADMIN_SESSION_PREFIX = 'sjdd_admin_session_';

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
    sheet.setFrozenRows(1);
  }

  ensureAppointmentColumns(sheet);
  applyAppointmentFormatting(sheet);

  setupSurveySheet();
  setupTurnSheet();
  setupPatientSheet();
  setupEmergencySheet();
}

function setupPatientSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(PATIENT_SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(PATIENT_SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Fecha de registro', 'Nombres', 'Apellidos', 'DNI', 'Seguro', 'Fecha de nacimiento', 'Teléfono', 'Registrado por']);
    sheet.setFrozenRows(1);
  }
  sheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#0284c7').setFontColor('#ffffff');
}

function setupEmergencySheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(EMERGENCY_SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(EMERGENCY_SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Fecha de registro', 'Código', 'Paciente', 'DNI', 'Motivo',
      'Prioridad', 'Hora de llegada', 'Estado', 'Observaciones',
      'Registrado por', 'Fecha de actualización'
    ]);
    sheet.setFrozenRows(1);
  }
  sheet.getRange(1, 1, 1, 11).setFontWeight('bold').setBackground('#dc2626').setFontColor('#ffffff');
  const stateRange = sheet.getRange(2, 8, Math.max(sheet.getMaxRows() - 1, 1), 1);
  stateRange.setDataValidation(SpreadsheetApp.newDataValidation()
    .requireValueInList(['En espera', 'En atención', 'Atendida'], true)
    .setAllowInvalid(false)
    .build());
}

function ensureAppointmentColumns(sheet) {
  const extraHeaders = ['Comentario de recepción', 'Fecha de actualización', 'Actualizado por'];
  const currentHeaders = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 9)).getValues()[0];
  extraHeaders.forEach((header, index) => {
    const column = 10 + index;
    if (!currentHeaders[column - 1]) sheet.getRange(1, column).setValue(header);
  });
}

function applyAppointmentFormatting(sheet) {
  sheet.getRange(1, 1, 1, 12).setFontWeight('bold').setBackground('#078b9a').setFontColor('#ffffff');
  const stateRange = sheet.getRange(2, 9, Math.max(sheet.getMaxRows() - 1, 1), 1);
  const rules = [
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Solicitud registrada').setBackground('#e5f5f8').setFontColor('#096d8b').setRanges([stateRange]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Reprogramada').setBackground('#fff3d8').setFontColor('#93600b').setRanges([stateRange]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Atendida').setBackground('#e7f7ef').setFontColor('#147457').setRanges([stateRange]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Cancelada').setBackground('#fff0ee').setFontColor('#a23a31').setRanges([stateRange]).build()
  ];
  stateRange.setDataValidation(SpreadsheetApp.newDataValidation()
    .requireValueInList(['Solicitud registrada', 'Reprogramada', 'Atendida', 'Cancelada'], true)
    .setAllowInvalid(false)
    .build());
  sheet.setConditionalFormatRules(rules);
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
    sheet.setFrozenRows(1);
  }
  sheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#078b9a').setFontColor('#ffffff');
  const turnStateRange = sheet.getRange(2, 7, Math.max(sheet.getMaxRows() - 1, 1), 1);
  turnStateRange.setDataValidation(SpreadsheetApp.newDataValidation()
    .requireValueInList(['En espera', 'Llamando', 'Atendido', 'Cancelada'], true)
    .setAllowInvalid(false)
    .build());
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

function normalizedAppointmentDate(value) {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone(), 'd/M/yyyy');
  }
  const text = String(value || '').trim();
  const match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  return match ? `${Number(match[1])}/${Number(match[2])}/${match[3]}` : text;
}

function nextTurnCode(turnSheet, specialty, appointmentDate) {
  const prefix = turnPrefix(specialty);
  if (turnSheet.getLastRow() < 2) return `${prefix}-001`;
  const rows = turnSheet.getRange(2, 3, turnSheet.getLastRow() - 1, 3).getValues();
  let max = 0;
  rows.forEach(row => {
    const code = String(row[0]);
    const rowSpecialty = String(row[1]);
    const rowDate = normalizedAppointmentDate(row[2]);
    if (rowSpecialty === String(specialty) && rowDate === normalizedAppointmentDate(appointmentDate) && code.startsWith(`${prefix}-`)) {
      max = Math.max(max, Number(code.split('-')[1]) || 0);
    }
  });
  return `${prefix}-${String(max + 1).padStart(3, '0')}`;
}

function getTurn(turnSheet, appointmentCode) {
  const row = findTurnRow(turnSheet, appointmentCode);
  if (row === -1) return null;
  const values = turnSheet.getRange(row, 1, 1, 8).getValues()[0];
  return { codigo: String(values[2]), especialidad: String(values[3]), fecha: normalizedAppointmentDate(values[4]), hora: String(values[5]), estado: String(values[6]), consultorio: String(values[7] || 'Por confirmar') };
}

function createTurnIfMissing(turnSheet, appointment) {
  const existing = findTurnRow(turnSheet, appointment.codigo);
  if (existing !== -1) return getTurn(turnSheet, appointment.codigo);
  turnSheet.appendRow([
    new Date(),
    String(appointment.codigo || ''),
    nextTurnCode(turnSheet, appointment.especialidad, appointment.fecha),
    String(appointment.especialidad || ''),
    String(appointment.fecha || ''),
    String(appointment.hora || ''),
    'En espera',
    'Por confirmar'
  ]);
  return getTurn(turnSheet, appointment.codigo);
}

function rescheduleTurn(turnSheet, appointment) {
  const row = findTurnRow(turnSheet, appointment.codigo);
  if (row === -1) return createTurnIfMissing(turnSheet, appointment);
  turnSheet.getRange(row, 3, 1, 6).setValues([[
    nextTurnCode(turnSheet, appointment.especialidad, appointment.fecha),
    String(appointment.especialidad || ''),
    String(appointment.fecha || ''),
    String(appointment.hora || ''),
    'En espera',
    'Por confirmar'
  ]]);
  return getTurn(turnSheet, appointment.codigo);
}

function publicTurn(values) {
  return { codigo: String(values[2]), especialidad: String(values[3]), fecha: normalizedAppointmentDate(values[4]), hora: String(values[5]), consultorio: String(values[7] || 'Por confirmar') };
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

function hasActiveDuplicate(sheet, dni, date, specialty, exceptCode) {
  if (sheet.getLastRow() < 2) return false;
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 9).getValues();
  return rows.some(row => {
    const samePatient = String(row[3]).trim() === String(dni).trim();
    const sameDate = normalizedAppointmentDate(row[6]) === normalizedAppointmentDate(date);
    const sameSpecialty = String(row[4]).trim() === String(specialty).trim();
    const isOtherAppointment = String(row[1]) !== String(exceptCode || '');
    const isActive = !['Atendida', 'Cancelada'].includes(String(row[8]).trim());
    return samePatient && sameDate && sameSpecialty && isOtherAppointment && isActive;
  });
}

function jsonOutput(payload, callback) {
  const json = JSON.stringify(payload);
  const safeCallback = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(String(callback || '')) ? callback : '';
  return ContentService
    .createTextOutput(safeCallback ? `${safeCallback}(${json});` : json)
    .setMimeType(safeCallback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
}

// Funciones internas para el panel de personal. Solo se invocan desde la
// página servida por Apps Script después de iniciar sesión.
function renderAdminPanel() {
  return HtmlService.createHtmlOutputFromFile('Admin')
    .setTitle('Panel de personal | San Juan de Dios');
}

function adminLogin(name, password) {
  const configuredPassword = PropertiesService.getScriptProperties().getProperty(ADMIN_PASSWORD_PROPERTY);
  if (!configuredPassword) throw new Error('Primero configura la contraseña del personal en las propiedades del proyecto.');
  if (String(password || '') !== configuredPassword) throw new Error('La contraseña no es correcta.');

  const token = Utilities.getUuid();
  const staff = { name: String(name || 'Personal de recepción').trim().slice(0, 80) };
  CacheService.getScriptCache().put(ADMIN_SESSION_PREFIX + token, JSON.stringify(staff), 21600);
  return { token: token, staff: staff };
}

function requireAdminSession(token) {
  const saved = CacheService.getScriptCache().get(ADMIN_SESSION_PREFIX + String(token || ''));
  if (!saved) throw new Error('Tu sesión venció. Ingresa nuevamente.');
  return JSON.parse(saved);
}

function adminLogout(token) {
  CacheService.getScriptCache().remove(ADMIN_SESSION_PREFIX + String(token || ''));
  return { ok: true };
}

function adminListAppointments(token, date) {
  requireAdminSession(token);
  setupSheet();
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  const turnSheet = spreadsheet.getSheetByName(TURN_SHEET_NAME);
  const targetDate = String(date || '');
  if (sheet.getLastRow() < 2) return [];

  return sheet.getRange(2, 1, sheet.getLastRow() - 1, 12).getValues()
    .filter(row => !targetDate || normalizedAppointmentDate(row[6]) === normalizedAppointmentDate(targetDate))
    .map(row => ({
      registro: row[0] instanceof Date ? Utilities.formatDate(row[0], spreadsheet.getSpreadsheetTimeZone(), 'd/M/yyyy HH:mm') : String(row[0] || ''),
      codigo: String(row[1]),
      paciente: String(row[2] || 'Paciente'),
      dni: String(row[3] || ''),
      especialidad: String(row[4] || ''),
      profesional: String(row[5] || ''),
      fecha: normalizedAppointmentDate(row[6]),
      hora: String(row[7] || ''),
      estado: String(row[8] || 'Solicitud registrada'),
      comentario: String(row[9] || ''),
      actualizado: row[10] instanceof Date ? Utilities.formatDate(row[10], spreadsheet.getSpreadsheetTimeZone(), 'd/M/yyyy HH:mm') : String(row[10] || ''),
      actualizadoPor: String(row[11] || ''),
      turno: getTurn(turnSheet, row[1])
    }))
    .sort((a, b) => appointmentMinutes(a.hora) - appointmentMinutes(b.hora));
}

function adminListPatients(token) {
  requireAdminSession(token);
  setupSheet();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PATIENT_SHEET_NAME);
  if (sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, 8).getValues().map(row => ({
    fecha: row[0] instanceof Date ? Utilities.formatDate(row[0], SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone(), 'd/M/yyyy') : String(row[0] || ''),
    nombres: String(row[1] || ''),
    apellidos: String(row[2] || ''),
    dni: String(row[3] || ''),
    seguro: String(row[4] || ''),
    nacimiento: row[5] instanceof Date ? Utilities.formatDate(row[5], SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone(), 'd/M/yyyy') : String(row[5] || ''),
    telefono: String(row[6] || '')
  })).reverse();
}

function adminRegisterPatient(token, data) {
  const staff = requireAdminSession(token);
  const dni = String(data.dni || '').trim();
  const phone = String(data.telefono || '').trim();
  if (!String(data.nombres || '').trim() || !String(data.apellidos || '').trim()) throw new Error('Completa los nombres y apellidos.');
  if (!validDni(dni)) throw new Error('El DNI debe tener 8 dígitos.');
  if (!/^9\d{8}$/.test(phone)) throw new Error('El teléfono debe tener 9 dígitos y empezar con 9.');
  if (!String(data.nacimiento || '').trim()) throw new Error('Selecciona la fecha de nacimiento.');

  setupSheet();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PATIENT_SHEET_NAME);
  const existingDnis = sheet.getLastRow() < 2 ? [] : sheet.getRange(2, 4, sheet.getLastRow() - 1, 1).getValues();
  if (existingDnis.some(row => String(row[0]) === dni)) throw new Error('Ya existe un paciente registrado con este DNI.');

  sheet.appendRow([
    new Date(), String(data.nombres).trim(), String(data.apellidos).trim(), dni,
    String(data.seguro || 'SIS'), String(data.nacimiento || ''), phone, staff.name
  ]);
  return { ok: true };
}

function emergencyPriorityRank(priority) {
  return { 'Crítica': 1, 'Urgente': 2, 'Prioritaria': 3, 'No urgente': 4 }[String(priority || '')] || 5;
}

function nextEmergencyCode(sheet) {
  if (sheet.getLastRow() < 2) return 'EMG-001';
  const codes = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues();
  const max = codes.reduce((highest, row) => {
    const match = String(row[0] || '').match(/^EMG-(\d+)$/);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
  return `EMG-${String(max + 1).padStart(3, '0')}`;
}

function adminListEmergencies(token) {
  requireAdminSession(token);
  setupSheet();
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(EMERGENCY_SHEET_NAME);
  if (sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, 11).getValues().map(row => ({
    fecha: row[0] instanceof Date ? Utilities.formatDate(row[0], spreadsheet.getSpreadsheetTimeZone(), 'd/M/yyyy') : String(row[0] || ''),
    codigo: String(row[1] || ''),
    paciente: String(row[2] || ''),
    dni: String(row[3] || ''),
    motivo: String(row[4] || ''),
    prioridad: String(row[5] || ''),
    hora: String(row[6] || ''),
    estado: String(row[7] || 'En espera'),
    observaciones: String(row[8] || ''),
    registradoPor: String(row[9] || ''),
    actualizado: row[10] instanceof Date ? Utilities.formatDate(row[10], spreadsheet.getSpreadsheetTimeZone(), 'd/M/yyyy HH:mm') : String(row[10] || '')
  })).sort((a, b) => emergencyPriorityRank(a.prioridad) - emergencyPriorityRank(b.prioridad));
}

function adminCreateEmergency(token, data) {
  const staff = requireAdminSession(token);
  const patient = String(data.paciente || '').trim().slice(0, 120);
  const dni = String(data.dni || '').trim();
  const motive = String(data.motivo || '').trim().slice(0, 500);
  const priority = String(data.prioridad || 'No urgente');
  const note = String(data.observaciones || '').trim().slice(0, 500);
  if (!patient) throw new Error('Escribe el nombre del paciente.');
  if (!validDni(dni)) throw new Error('El DNI debe tener 8 dígitos.');
  if (!motive) throw new Error('Describe brevemente el motivo de atención.');
  if (!['Crítica', 'Urgente', 'Prioritaria', 'No urgente'].includes(priority)) throw new Error('Selecciona una prioridad válida.');

  setupSheet();
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(EMERGENCY_SHEET_NAME);
  const now = new Date();
  const hour = Utilities.formatDate(now, spreadsheet.getSpreadsheetTimeZone(), 'HH:mm');
  sheet.appendRow([now, nextEmergencyCode(sheet), patient, dni, motive, priority, hour, 'En espera', note, staff.name, now]);
  return { ok: true };
}

function adminUpdateEmergency(token, payload) {
  const staff = requireAdminSession(token);
  setupSheet();
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(EMERGENCY_SHEET_NAME);
  const code = String(payload.codigo || '');
  if (!code || sheet.getLastRow() < 2) throw new Error('No se encontró la atención de emergencia.');
  const codes = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues();
  const index = codes.findIndex(row => String(row[0]) === code);
  if (index === -1) throw new Error('No se encontró la atención de emergencia.');
  const row = index + 2;
  const action = String(payload.accion || '');
  const status = action === 'iniciar' ? 'En atención' : action === 'finalizar' ? 'Atendida' : '';
  if (!status) throw new Error('Acción de emergencia no válida.');
  sheet.getRange(row, 8).setValue(status);
  const note = String(payload.observaciones || '').trim().slice(0, 500);
  if (note) sheet.getRange(row, 9).setValue(note);
  sheet.getRange(row, 10, 1, 2).setValues([[staff.name, new Date()]]);
  return { ok: true };
}

function adminUpdateAppointment(token, payload) {
  const staff = requireAdminSession(token);
  setupSheet();
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  const turnSheet = spreadsheet.getSheetByName(TURN_SHEET_NAME);
  const code = String(payload.codigo || '');
  const rowNumber = findAppointmentRow(sheet, code);
  if (rowNumber === -1) throw new Error('No se encontró la cita seleccionada.');

  const current = sheet.getRange(rowNumber, 1, 1, 12).getValues()[0];
  const action = String(payload.accion || '');
  const comment = String(payload.comentario || '').trim().slice(0, 500);
  let turnRow = findTurnRow(turnSheet, code);

  if (action === 'cancelar') {
    if (!comment) throw new Error('Escribe el motivo de la cancelación.');
    sheet.getRange(rowNumber, 9).setValue('Cancelada');
    if (turnRow !== -1) turnSheet.getRange(turnRow, 7).setValue('Cancelada');
  } else if (action === 'atender') {
    sheet.getRange(rowNumber, 9).setValue('Atendida');
    if (turnRow !== -1) turnSheet.getRange(turnRow, 7).setValue('Atendido');
  } else if (action === 'llamar') {
    const consultorio = String(payload.consultorio || '').trim().slice(0, 80);
    if (turnRow === -1) {
      createTurnIfMissing(turnSheet, {
        codigo: code,
        especialidad: String(current[4] || ''),
        fecha: String(current[6] || ''),
        hora: String(current[7] || '')
      });
      turnRow = findTurnRow(turnSheet, code);
    }
    turnSheet.getRange(turnRow, 7).setValue('Llamando');
    if (consultorio) turnSheet.getRange(turnRow, 8).setValue(consultorio);
  } else if (action === 'reprogramar') {
    const newData = {
      codigo: code,
      dni: String(current[3]),
      especialidad: String(payload.especialidad || ''),
      profesional: String(payload.profesional || ''),
      fecha: String(payload.fecha || ''),
      hora: String(payload.hora || '')
    };
    validateAppointment(newData);
    if (!comment) throw new Error('Explica brevemente el motivo de la reprogramación.');
    if (hasActiveDuplicate(sheet, newData.dni, newData.fecha, newData.especialidad, code)) {
      throw new Error('El paciente ya tiene una cita activa para esa fecha y especialidad.');
    }
    sheet.getRange(rowNumber, 5, 1, 5).setValues([[
      newData.especialidad,
      newData.profesional,
      newData.fecha,
      newData.hora,
      'Reprogramada'
    ]]);
    rescheduleTurn(turnSheet, newData);
  } else {
    throw new Error('Acción de administración no válida.');
  }

  if (action !== 'llamar' || comment) sheet.getRange(rowNumber, 10).setValue(comment);
  sheet.getRange(rowNumber, 11, 1, 2).setValues([[new Date(), staff.name]]);
  return { ok: true };
}

function doGet(event) {
  if (event && event.parameter && event.parameter.view === 'personal') return renderAdminPanel();
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
      const activeTurns = rows.filter(row => normalizedAppointmentDate(row[4]) === normalizedAppointmentDate(requestedDate) && !['Atendido', 'Cancelada'].includes(String(row[6])));
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
        validateAppointment(data);
        if (hasActiveDuplicate(sheet, data.dni, data.fecha, data.especialidad, appointmentCode)) {
          throw new Error('Ya existe una cita activa para este DNI, fecha y especialidad.');
        }
        sheet.getRange(rowNumber, 5, 1, 5).setValues([[
          String(data.especialidad || ''),
          String(data.profesional || ''),
          String(data.fecha || ''),
          String(data.hora || ''),
          'Reprogramada'
        ]]);
        rescheduleTurn(turnSheet, {
          codigo: appointmentCode,
          especialidad: String(data.especialidad || ''),
          fecha: String(data.fecha || ''),
          hora: String(data.hora || '')
        });
      }

      return ContentService
        .createTextOutput(JSON.stringify({ ok: true, action: action }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    validateAppointment(data);
    const existingRow = findAppointmentRow(sheet, appointmentCode);
    // Si se reintenta una reserva por una conexión lenta, no se duplica la fila.
    if (existingRow !== -1) {
      createTurnIfMissing(turnSheet, {
        codigo: appointmentCode,
        especialidad: String(data.especialidad || ''),
        fecha: String(data.fecha || ''),
        hora: String(data.hora || '')
      });
      return ContentService
        .createTextOutput(JSON.stringify({ ok: true, action: 'crear', alreadyRegistered: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (hasActiveDuplicate(sheet, data.dni, data.fecha, data.especialidad, appointmentCode)) {
      throw new Error('Ya existe una cita activa para este DNI, fecha y especialidad.');
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

    createTurnIfMissing(turnSheet, {
      codigo: appointmentCode,
      especialidad: String(data.especialidad || ''),
      fecha: String(data.fecha || ''),
      hora: String(data.hora || '')
    });

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

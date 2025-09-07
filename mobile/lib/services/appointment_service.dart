import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/appointment.dart';
import '../config/api_config.dart';

class AppointmentService {
  Future<List<Appointment>> getAppointments(String token) async {
    final res = await http.get(
      Uri.parse("${ApiConfig.baseUrl}/user/appointment"),
      headers: {"Authorization": "Bearer $token"},
    );
    if (res.statusCode == 200) {
      final List data = jsonDecode(res.body);
      return data.map((e) => Appointment.fromJson(e)).toList();
    }
    throw Exception("Impossible de charger les rendez-vous");
  }

  Future<void> bookAppointment(
      String token, String professionalId, String date, String slot) async {
    final res = await http.post(
      Uri.parse("${ApiConfig.baseUrl}/user/appointment"),
      headers: {"Authorization": "Bearer $token", "Content-Type": "application/json"},
      body: jsonEncode({"professionalId": professionalId, "date": date, "slot": slot}),
    );
    if (res.statusCode != 201) throw Exception("Impossible de réserver le rendez-vous");
  }

  Future<void> cancelAppointment(String token, String appointmentId) async {
    final res = await http.put(
      Uri.parse("${ApiConfig.baseUrl}/user/cancel/$appointmentId"),
      headers: {"Authorization": "Bearer $token"},
    );
    if (res.statusCode != 200) throw Exception("Impossible d'annuler le rendez-vous");
  }
  Future<void> updateAppointment(String token, String appointmentId, String newDate, String newSlot) async {
  final res = await http.put(
    Uri.parse("${ApiConfig.baseUrl}/user/update/$appointmentId"),
    headers: {"Authorization": "Bearer $token", "Content-Type": "application/json"},
    body: jsonEncode({"date": newDate, "slot": newSlot}),
  );
  if (res.statusCode != 200) throw Exception("Impossible de mettre à jour le rendez-vous");
}

}
